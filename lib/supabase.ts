import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export async function getUserCredits(userEmail: string) {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('credits')
    .eq('user_email', userEmail)
    .eq('order_status', 2)
    .gte('expired_at', new Date().toISOString())

  if (error) {
    console.error('Error fetching credits:', error)
    throw error
  }

  const totalCredits = orders?.reduce((sum, order) => sum + (order.credits || 0), 0) || 0
  const usedCredits = 0 // 暂时 hardcode

  return {
    total: totalCredits,
    used: usedCredits,
    available: totalCredits - usedCredits
  }
}

export async function getUserOrders(userEmail: string) {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_email', userEmail)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    throw error
  }

  return orders || []
}

export async function createOrder(orderData: {
  order_no: string
  user_email: string
  credits: number
  amount: number
}) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      ...orderData,
      order_status: 0, // pending
      expired_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating order:', error)
    throw error
  }

  return data
}

export async function updateOrderStatus(orderNo: string, status: number) {
  const { data, error } = await supabase
    .from('orders')
    .update({ order_status: status })
    .eq('order_no', orderNo)
    .select()
    .single()

  if (error) {
    console.error('Error updating order:', error)
    throw error
  }

  return data
}
