import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CreateOrderParams, PlanDetails } from "@/types/order";
import { insertOrder, updateOrderSession } from "@/models/order";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
}) : null;

const PLANS: { [key: string]: PlanDetails } = {
  "basic-monthly": {
    name: "Basic Monthly",
    price: 1990, // $19.90
    credits: 50,
    duration: 1,
    currency: "usd"
  },
  "basic-yearly": {
    name: "Basic Yearly",
    price: 19900, // $199.00
    credits: 50,
    duration: 12,
    currency: "usd"
  },
  "pro-monthly": {
    name: "Pro Monthly",
    price: 4990, // $49.90
    credits: 150,
    duration: 1,
    currency: "usd"
  },
  "pro-yearly": {
    name: "Pro Yearly",
    price: 49900, // $499.00
    credits: 150,
    duration: 12,
    currency: "usd"
  },
  "pay-as-you-go": {
    name: "Pay As You Go",
    price: 5000, // $50.00 minimum
    credits: 55, // $0.9/credit
    duration: 0, // never expires
    currency: "usd"
  }
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const user = await currentUser();
    
    console.log('API auth state:', { 
      userId, 
      userEmail: user?.emailAddresses[0]?.emailAddress,
      headers: Object.fromEntries(req.headers.entries())
    });

    if (!stripe) {
      console.error("Stripe is not initialized - missing STRIPE_SECRET_KEY");
      return new NextResponse(
        JSON.stringify({ error: "Payment service not available" }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!NEXT_PUBLIC_APP_URL) {
      console.error("NEXT_PUBLIC_APP_URL is not set");
      return new NextResponse(
        JSON.stringify({ error: "Configuration error" }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!userId || !user) {
      console.error("Unauthorized access attempt");
      return new NextResponse(
        JSON.stringify({ error: "Please sign in to continue" }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { plan, isYearly } = body as CreateOrderParams;

    // Determine plan details
    const planKey = plan === 'pay-as-you-go' ? plan : `${plan}-${isYearly ? 'yearly' : 'monthly'}`;
    const planDetails = PLANS[planKey];
    
    if (!planDetails) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid plan selected" }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating order for plan:', planKey, 'user:', user.emailAddresses[0].emailAddress);

    // Create order number (timestamp + random)
    const orderNo = Date.now().toString() + Math.floor(Math.random() * 1000).toString();

    // Calculate expiration date
    const now = new Date();
    const expiredAt = planDetails.duration === 0 
      ? new Date(now.getFullYear() + 100, now.getMonth(), now.getDate()) // 100 years for pay-as-you-go
      : new Date(now.setMonth(now.getMonth() + planDetails.duration));

    // Create order in database
    await insertOrder({
      order_no: orderNo,
      created_at: new Date().toISOString(),
      user_email: user.emailAddresses[0].emailAddress,
      amount: planDetails.price,
      plan: planDetails.name,
      expired_at: expiredAt.toISOString(),
      order_status: 1, // pending
      credits: planDetails.credits,
      currency: planDetails.currency
    });

    console.log('Order created:', orderNo);

    // Create Stripe checkout session
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
      success_url: `${NEXT_PUBLIC_APP_URL}/en/dashboard?success=true&order=${orderNo}`,
      cancel_url: `${NEXT_PUBLIC_APP_URL}/en/price?canceled=true`,
      customer_email: user.emailAddresses[0].emailAddress,
      metadata: {
        order_no: orderNo,
        user_id: userId,
      },
    });

    console.log('Stripe session created:', session.id);

    // Update order with Stripe session ID
    await updateOrderSession(orderNo, session.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating order:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create order" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
