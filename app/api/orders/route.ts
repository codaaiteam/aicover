// app/api/orders/route.ts
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CreateOrderParams, PlanDetails } from "@/types/order";
import { insertOrder, updateOrderSession } from "@/models/order";
import { headers } from "next/headers";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 增加超时时间到 5 分钟

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

async function validateRequest() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is missing");
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error("App URL is missing");
  }
}

async function validateUser() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  return {
    userId,
    user,
    email: user.emailAddresses[0].emailAddress
  };
}

export async function POST(req: Request) {
  const headersList = headers();
  console.log('Request headers:', Object.fromEntries(headersList.entries()));

  try {
    // 1. 验证必要的环境变量
    await validateRequest();

    // 2. 验证用户
    const { userId, user, email } = await validateUser();

    // 3. 解析请求体
    const body = await req.json();
    console.log('Request body:', body);

    // 4. 验证和获取计划详情
    const { plan, isYearly } = body as CreateOrderParams;
    const planKey = plan === 'pay-as-you-go' ? plan : `${plan}-${isYearly ? 'yearly' : 'monthly'}`;
    const planDetails = PLANS[planKey];
    
    if (!planDetails) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    // 5. 生成订单号
    const orderNo = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 6. 计算过期时间
    const now = new Date();
    const expiredAt = planDetails.duration === 0 
      ? new Date(now.getFullYear() + 100, now.getMonth(), now.getDate())
      : new Date(now.setMonth(now.getMonth() + planDetails.duration));

    // 7. 创建订单记录
    await insertOrder({
      order_no: orderNo,
      created_at: new Date().toISOString(),
      user_email: email,
      amount: planDetails.price,
      plan: planDetails.name,
      expired_at: expiredAt.toISOString(),
      order_status: 1,
      credits: planDetails.credits,
      currency: planDetails.currency
    });

    // 8. 初始化 Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
      typescript: true,
    });

    // 9. 创建 Stripe Session
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
      customer_email: email,
      metadata: {
        order_no: orderNo,
        user_id: userId,
        credits: planDetails.credits.toString()
      },
    });

    // 10. 更新订单 session ID
    if (session.id) {
      await updateOrderSession(orderNo, session.id);
    }

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Order creation error:', {
      message: error.message,
      stack: error.stack,
      type: error.constructor.name
    });

    // 根据错误类型返回适当的状态码
    const statusCode = error.message === 'Unauthorized' ? 401 : 500;
    
    return NextResponse.json(
      { 
        error: error.message || "Failed to create order",
        ...(process.env.NODE_ENV === 'development' && { details: error.stack })
      },
      { 
        status: statusCode,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}