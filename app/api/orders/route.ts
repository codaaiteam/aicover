// app/api/orders/route.ts
import { auth, currentUser } from "@clerk/nextjs";
import { respData, respErr } from "@/lib/resp";
import Stripe from "stripe";
import { CreateOrderParams, PlanDetails } from "@/types/order";
import { supabase } from "@/lib/supabase";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// Validate required environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error("Missing NEXT_PUBLIC_APP_URL");
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16"
});

// Plan definitions
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

// app/api/orders/route.ts
export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const user = await currentUser();
    if (!user?.emailAddresses?.[0]) {
      return respErr("no auth");
    }
    const userEmail = user.emailAddresses[0].emailAddress;
    console.log("Creating order for user:", userEmail);

    // 2. Parse and validate request
    const body = await req.json();
    console.log("Request body:", body);
    
    const { plan, isYearly } = body as CreateOrderParams;
    
    // 3. Get plan details
    const planKey = plan === 'pay-as-you-go' ? plan : `${plan}-${isYearly ? 'yearly' : 'monthly'}`;
    const planDetails = PLANS[planKey];
    
    if (!planDetails) {
      console.log("Invalid plan selected:", planKey);
      return respErr("Invalid plan selected");
    }

    console.log("Plan details:", planDetails);

    // 4. Generate order number and expiration date
    const orderNo = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date();
    const expiredAt = planDetails.duration === 0 
      ? new Date(now.getFullYear() + 100, now.getMonth(), now.getDate())
      : new Date(now.setMonth(now.getMonth() + planDetails.duration));

    // 5. Create order record
    console.log("Creating order record in database...");
    const { error: insertError } = await supabase
      .from('orders')
      .insert([{
        order_no: orderNo,
        created_at: new Date().toISOString(),
        user_email: userEmail,
        amount: planDetails.price,
        plan: planDetails.name,
        expired_at: expiredAt.toISOString(),
        order_status: 1, // pending
        credits: planDetails.credits,
        currency: planDetails.currency
      }]);

    if (insertError) {
      console.error('Failed to create order record:', insertError);
      return respErr("Failed to create order");
    }

    console.log("Order record created:", orderNo);

    // 6. Create Stripe checkout session
    try {
      console.log("Creating Stripe session with config:", {
        currency: planDetails.currency,
        amount: planDetails.price,
        name: planDetails.name,
        credits: planDetails.credits,
        duration: planDetails.duration,
      });

      // Check Stripe key
      console.log("Using Stripe key:", process.env.STRIPE_SECRET_KEY?.substring(0, 8) + "...");

      const session = await stripe.checkout.sessions.create({
        line_items: [{
          price_data: {
            currency: planDetails.currency,
            product_data: {
              name: planDetails.name,
              description: `${planDetails.credits} videos ${planDetails.duration ? `for ${planDetails.duration} months` : ''}`
            },
            unit_amount: planDetails.price,
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/dashboard?success=true&order=${orderNo}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/price?canceled=true`,
        customer_email: userEmail,
        metadata: {
          order_no: orderNo,
          user_id: user.id,
          credits: planDetails.credits.toString()
        },
      });

      console.log("Stripe session created:", {
        sessionId: session.id,
        url: session.url
      });

      // 7. Update order with session ID
      if (session.id) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({ stripe_session_id: session.id })
          .eq('order_no', orderNo);

        if (updateError) {
          console.error('Failed to update session ID:', updateError);
        }
      }

      console.log("Returning successful response with URL");
      return respData({ url: session.url });

    } catch (stripeError: any) {
      console.error('Stripe session creation failed:', {
        error: stripeError.message,
        type: stripeError.type,
        code: stripeError.code,
        stack: stripeError.stack
      });
      
      // Rollback - delete the order record
      await supabase
        .from('orders')
        .delete()
        .eq('order_no', orderNo);

      return respErr("Failed to create payment session");
    }

  } catch (error) {
    console.error("Order creation error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error
    });
    return respErr(error instanceof Error ? error.message : "Failed to process order");
  }
}