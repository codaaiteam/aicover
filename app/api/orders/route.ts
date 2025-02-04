// app/api/orders/route.ts
import { auth, currentUser } from "@clerk/nextjs";
import { respData, respErr } from "@/lib/resp";
import Stripe from "stripe";
import { CreateOrderParams, PlanDetails } from "@/types/order";
import { supabase } from "@/lib/supabase";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// 验证环境变量
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error("Missing NEXT_PUBLIC_APP_URL");
}

// 初始化 Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16"
});

// 定义套餐
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
    price: 5000, // $50.00
    credits: 55,
    duration: 0,
    currency: "usd"
  }
};

// 创建 Stripe Session 的函数
async function createStripeSession(
  planDetails: PlanDetails, 
  orderNo: string, 
  userEmail: string, 
  userId: string
): Promise<Stripe.Checkout.Session> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Stripe session creation timeout'));
    }, 10000); // 10 秒超时

    stripe.checkout.sessions.create({
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
        user_id: userId,
        credits: planDetails.credits.toString()
      },
    }).then(session => {
      clearTimeout(timeoutId);
      resolve(session);
    }).catch(error => {
      clearTimeout(timeoutId);
      reject(error);
    });
  });
}

export async function POST(req: Request) {
  try {
    console.log("Starting order creation process...");

    // 1. 验证用户
    const user = await currentUser();
    if (!user?.emailAddresses?.[0]) {
      return respErr("no auth");
    }
    const userEmail = user.emailAddresses[0].emailAddress;
    console.log("User authenticated:", userEmail);

    // 2. 获取请求数据
    const body = await req.json();
    console.log("Request body:", body);
    
    const { plan, isYearly } = body as CreateOrderParams;
    
    // 3. 获取套餐详情
    const planKey = plan === 'pay-as-you-go' ? plan : `${plan}-${isYearly ? 'yearly' : 'monthly'}`;
    const planDetails = PLANS[planKey];
    
    if (!planDetails) {
      console.log("Invalid plan selected:", planKey);
      return respErr("Invalid plan selected");
    }

    console.log("Selected plan:", planDetails);

    // 4. 生成订单号和过期时间
    const orderNo = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date();
    const expiredAt = planDetails.duration === 0 
      ? new Date(now.getFullYear() + 100, now.getMonth(), now.getDate())
      : new Date(now.setMonth(now.getMonth() + planDetails.duration));

    // 5. 创建订单记录
    console.log("Creating order record...");
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
      console.error('Database error:', insertError);
      return respErr("Failed to create order");
    }

    console.log("Order record created:", orderNo);

    // 6. 创建 Stripe checkout session
    try {
      console.log("Creating Stripe session...");
      const session = await createStripeSession(
        planDetails,
        orderNo,
        userEmail,
        user.id
      );

      console.log("Stripe session created:", session.id);

      // 7. 更新订单记录添加 session ID
      if (session.id) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({ stripe_session_id: session.id })
          .eq('order_no', orderNo);

        if (updateError) {
          console.error('Failed to update session ID:', updateError);
          // 非致命错误，继续执行
        }
      }

      // 8. 返回成功响应
      return respData({ url: session.url });

    } catch (stripeError: any) {
      console.error('Stripe error:', {
        message: stripeError.message,
        type: stripeError.type,
        code: stripeError.code
      });
      
      // 删除订单记录
      await supabase
        .from('orders')
        .delete()
        .eq('order_no', orderNo);

      // 返回具体错误信息
      if (stripeError.message === 'Stripe session creation timeout') {
        return respErr("Payment session creation timed out");
      }
      return respErr(stripeError.message || "Failed to create payment session");
    }

  } catch (error) {
    console.error("General error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      error
    });
    return respErr(error instanceof Error ? error.message : "Failed to process order");
  }
}