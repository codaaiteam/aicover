// webhook.ts
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

interface Env {
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }

      // 获取 Stripe 签名
      const signature = request.headers.get('stripe-signature');
      if (!signature) {
        return new Response('No signature', { status: 400 });
      }

      // 初始化 Stripe
      const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16',
      });

      // 获取请求体
      const payload = await request.text();

      // 验证 webhook
      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(
          payload,
          signature,
          env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        const error = err as Error;
        return new Response(`Webhook Error: ${error.message}`, { status: 400 });
      }

      // 初始化 Supabase
      const supabase = createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY
      );

      // 处理事件
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        // 更新订单状态
        const { error: orderError } = await supabase
          .from('orders')
          .update({ 
            order_status: 2,  // paid
            updated_at: new Date().toISOString() 
          })
          .eq('order_no', session.metadata?.order_no);

        if (orderError) {
          console.error('Order update error:', orderError);
        }

        // 更新用户积分
        if (session.metadata?.credits && session.customer_email) {
          const credits = parseInt(session.metadata.credits);
          
          // 获取当前用户积分
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('credits')
            .eq('email', session.customer_email)
            .single();

          if (!userError && userData) {
            const newCredits = (userData.credits || 0) + credits;
            
            // 更新积分
            await supabase
              .from('users')
              .update({ credits: newCredits })
              .eq('email', session.customer_email);
          }
        }
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });

    } catch (error) {
      console.error('Webhook error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }
  },
};