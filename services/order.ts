import { getUserOrders, updateOrderStatus } from "@/models/order";
import { Order } from "@/types/order";
import Stripe from "stripe";
import { UserCredits } from "@/types/user";
import { getUserVideosCount } from "@/models/cover"; // 更改为 videos
import { supabase } from "@/lib/supabase";

// Stripe session 处理保持不变
export async function handleOrderSession(session_id: string) {
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("order session: ", session);
    if (!session?.metadata?.order_no) {
      console.log("invalid session", session_id);
      throw new Error("invalid session");
    }

    const order_no = session.metadata.order_no;
    const paied_at = new Date().toISOString();
    updateOrderStatus(order_no, 2, paied_at);
    console.log("update success order status: ", order_no, paied_at);
  } catch (e) {
    console.log("handle order session failed: ", e);
    throw e;
  }
}

export async function getUserCredits(user_email: string): Promise<UserCredits> {
  // 默认积分
  let user_credits: UserCredits = {
    one_time_credits: 1, // 保留默认赠送的1个积分
    monthly_credits: 0,
    total_credits: 1,
    used_credits: 0,
    left_credits: 1,
  };

  try {
    // 1. 获取用户基础积分
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('email', user_email)
      .single();

    if (userError) {
      console.error('Error fetching user credits:', userError);
      throw userError;
    }

    // 2. 获取已使用的积分（通过视频数量）
    const used_credits = await getUserVideosCount(user_email);
    user_credits.used_credits = Number(used_credits);

    // 3. 获取订单积分
    const orders = await getUserOrders(user_email);
    if (orders) {
      orders.forEach((order: Order) => {
        if (order.plan === "monthly") {
          user_credits.monthly_credits += order.credits;
        } else {
          user_credits.one_time_credits += order.credits;
        }
      });
    }

    // 4. 计算总积分和剩余积分
    // 使用用户表中的积分作为基准
    user_credits.total_credits = (userData?.credits || 0);
    user_credits.left_credits = user_credits.total_credits - used_credits;

    // 确保积分不为负数
    if (user_credits.left_credits < 0) {
      user_credits.left_credits = 0;
    }

    console.log("User credits calculated:", {
      email: user_email,
      base_credits: userData?.credits,
      used_credits: used_credits,
      monthly_credits: user_credits.monthly_credits,
      one_time_credits: user_credits.one_time_credits,
      total_credits: user_credits.total_credits,
      left_credits: user_credits.left_credits
    });

    return user_credits;
  } catch (e) {
    console.error("get user credits failed: ", e);
    return user_credits; // 返回默认值
  }
}