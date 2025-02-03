// netlify/functions/stripe-webhook.ts
import { Handler } from '@netlify/functions'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: 'Method Not Allowed',
      }
    }

    const signature = event.headers['stripe-signature']
    if (!signature || !webhookSecret) {
      console.error('Missing stripe signature or webhook secret')
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing stripe signature' }),
      }
    }

    // 构造 Stripe 事件
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      signature,
      webhookSecret
    )

    console.log(`Processing webhook event: ${stripeEvent.type}`)

    // 处理事件
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session

        if (!session.metadata?.order_no) {
          throw new Error('No order number in session metadata')
        }

        // 更新订单状态
        const { error: orderError } = await supabase
          .from('orders')
          .update({ 
            order_status: 2,
            updated_at: new Date().toISOString()
          })
          .eq('order_no', session.metadata.order_no)

        if (orderError) {
          console.error('Error updating order:', orderError)
          throw orderError
        }

        // 如果存在积分信息，更新用户积分
        if (session.metadata.credits && session.customer_email) {
          const credits = parseInt(session.metadata.credits)
          
          // 先获取当前用户积分
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('credits')
            .eq('email', session.customer_email)
            .single()

          if (userError) {
            console.error('Error fetching user:', userError)
            throw userError
          }

          // 更新用户积分
          const newCredits = (userData?.credits || 0) + credits
          const { error: updateError } = await supabase
            .from('users')
            .update({ credits: newCredits })
            .eq('email', session.customer_email)

          if (updateError) {
            console.error('Error updating user credits:', updateError)
            throw updateError
          }
        }

        break
      }

      case 'checkout.session.expired': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session
        
        if (session.metadata?.order_no) {
          const { error } = await supabase
            .from('orders')
            .update({ 
              order_status: 3,
              updated_at: new Date().toISOString()
            })
            .eq('order_no', session.metadata.order_no)

          if (error) {
            console.error('Error updating expired order:', error)
            throw error
          }
        }
        break
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    }
  } catch (error) {
    console.error('Webhook error:', error)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}