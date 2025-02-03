// app/api/orders/route.ts
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CreateOrderParams, PlanDetails } from "@/types/order";
import { insertOrder, updateOrderSession } from "@/models/order";

// 使用新的路由段配置
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Validate environment variables first
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("Missing STRIPE_SECRET_KEY environment variable");
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
  console.error("Missing NEXT_PUBLIC_APP_URL environment variable");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

const PLANS: { [key: string]: PlanDetails } = {
  "basic-monthly": {
    name: "Basic Monthly",
    price: 1990,
    credits: 50,
    duration: 1,
    currency: "usd"
  },
  "basic-yearly": {
    name: "Basic Yearly",
    price: 19900,
    credits: 50,
    duration: 12,
    currency: "usd"
  },
  "pro-monthly": {
    name: "Pro Monthly",
    price: 4990,
    credits: 150,
    duration: 1,
    currency: "usd"
  },
  "pro-yearly": {
    name: "Pro Yearly",
    price: 49900,
    credits: 150,
    duration: 12,
    currency: "usd"
  },
  "pay-as-you-go": {
    name: "Pay As You Go",
    price: 5000,
    credits: 55,
    duration: 0,
    currency: "usd"
  }
};

export async function POST(req: Request) {
  try {
    // Debug log for request
    console.log('Received order request:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries())
    });

    // Auth validation
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      console.log('Authorization failed:', { userId, userEmail: user?.emailAddresses[0]?.emailAddress });
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    console.log('Request body:', body);
    
    const { plan, isYearly } = body as CreateOrderParams;

    // Validate plan
    const planKey = plan === 'pay-as-you-go' ? plan : `${plan}-${isYearly ? 'yearly' : 'monthly'}`;
    const planDetails = PLANS[planKey];
    
    if (!planDetails) {
      console.log('Invalid plan selected:', planKey);
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNo = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const userEmail = user.emailAddresses[0].emailAddress;

    console.log('Creating order:', {
      orderNo,
      userEmail,
      plan: planDetails.name,
      amount: planDetails.price
    });

    // Calculate expiration
    const now = new Date();
    const expiredAt = planDetails.duration === 0 
      ? new Date(now.getFullYear() + 100, now.getMonth(), now.getDate())
      : new Date(now.setMonth(now.getMonth() + planDetails.duration));

    // Insert order record
    try {
      await insertOrder({
        order_no: orderNo,
        created_at: new Date().toISOString(),
        user_email: userEmail,
        amount: planDetails.price,
        plan: planDetails.name,
        expired_at: expiredAt.toISOString(),
        order_status: 1, // pending
        credits: planDetails.credits,
        currency: planDetails.currency
      });
      console.log('Order inserted successfully');
    } catch (dbError) {
      console.error('Database error:', dbError);
      const errorMessage = dbError instanceof Error 
        ? dbError.message 
        : 'Unknown database error';
      throw new Error(`Database operation failed: ${errorMessage}`);
    }

    // Create Stripe session
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: planDetails.currency,
              product_data: {
                name: planDetails.name,
                description: `${planDetails.credits} videos ${planDetails.duration ? `per month for ${planDetails.duration} months` : ''}`
              },
              unit_amount: planDetails.price,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/dashboard?success=true&order=${orderNo}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/price?canceled=true`,
        customer_email: userEmail,
        metadata: {
          order_no: orderNo,
          user_id: userId,
          credits: planDetails.credits.toString()
        },
      });

      console.log('Stripe session created:', {
        sessionId: session.id,
        orderNo
      });

      // Update order with session ID
      try {
        await updateOrderSession(orderNo, session.id);
      } catch (updateError) {
        console.error('Failed to update order session:', updateError);
        // 继续执行，因为这不是致命错误
      }

      return NextResponse.json({ url: session.url });

    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      const errorMessage = stripeError instanceof Error 
        ? stripeError.message 
        : 'Unknown Stripe error';
      throw new Error(`Stripe operation failed: ${errorMessage}`);
    }

  } catch (error: any) {
    // Enhanced error logging
    console.error('Order creation error:', {
      message: error.message,
      stack: error.stack,
      type: error.constructor.name,
      code: error.code,
      raw: error
    });

    // Return appropriate error response
    return NextResponse.json(
      { 
        error: "Failed to create order",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { 
        status: error.status || 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}