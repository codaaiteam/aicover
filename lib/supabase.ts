import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export async function getUserCredits(userEmail: string) {
  // 先获取用户基本积分
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('credits')
    .eq('email', userEmail)
    .single()

  if (userError) {
    console.error('Error fetching user credits:', userError)
    throw userError
  }

  // 计算已使用的积分（通过视频生成记录）
  const { count: usedCredits, error: videoError } = await supabase
    .from('videos')
    .select('id', { count: 'exact' })
    .eq('user_email', userEmail)
    .eq('status', 1)  // 只计算成功的视频

  if (videoError) {
    console.error('Error counting used credits:', videoError)
    throw videoError
  }

  const totalCredits = userData?.credits || 0
  
  return {
    total_credits: totalCredits,
    used_credits: usedCredits || 0,
    left_credits: totalCredits - (usedCredits || 0),
    one_time_credits: 1,  // 保持与现有接口一致
    monthly_credits: totalCredits - 1  // 保持与现有接口一致
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

export async function updateUserCredits(userEmail: string, credits: number) {
  const { data, error } = await supabase
    .from('users')
    .update({ credits: credits })
    .eq('email', userEmail)
    .select()
    .single();

  if (error) {
    console.error('Error updating user credits:', error);
    throw error;
  }

  return data;
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
