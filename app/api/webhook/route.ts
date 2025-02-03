// app/api/webhook/route.ts
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderStatus } from "@/models/order";
import { updateUserCredits } from "@/lib/supabase";

// 使用新的路由段配置
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature");

    // 验证签名是否存在
    if (!signature) {
      console.error("No Stripe signature found");
      return new NextResponse("No Stripe signature", { status: 400 });
    }

    console.log("Received webhook", {
      hasBody: !!body,
      bodyLength: body.length,
      hasSignature: true
    });

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      const error = err as Error;
      console.error("Webhook signature verification failed:", {
        message: error.message,
        stack: error.stack
      });
      return new NextResponse(`Webhook signature verification failed: ${error.message}`, { 
        status: 400 
      });
    }

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (!session.metadata?.order_no) {
          console.error("No order number in session metadata");
          return new NextResponse("Missing order number", { status: 400 });
        }

        try {
          // 更新订单状态
          await updateOrderStatus(
            session.metadata.order_no,
            2, // paid
            new Date().toISOString()
          );
          
          // 如果有积分信息，更新用户积分
          if (session.metadata.credits && session.customer_email) {
            await updateUserCredits(
              session.customer_email,
              parseInt(session.metadata.credits)
            );
          }

          console.log("Successfully processed order:", {
            orderNo: session.metadata.order_no,
            customerEmail: session.customer_email
          });
        } catch (error) {
          console.error("Failed to update order/credits:", error);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    const err = error as Error;
    console.error("Webhook error:", {
      message: err.message,
      stack: err.stack,
      type: err.name
    });

    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}