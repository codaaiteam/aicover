'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLanguage } from "@/contexts/language"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import { Order } from '@/types/order'

interface UserData {
  credits: {
    available: number;
    used: number;
    total: number;
  };
  orders: Order[];
}

export default function DashboardPage() {
  const { t } = useLanguage()
  const { getToken } = useAuth()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const success = searchParams.get('success')
    const orderNo = searchParams.get('order')

    if (success === 'true' && orderNo) {
      toast.success('Payment successful! Your order is being processed.')
    }

    fetchUserData()
  }, [searchParams])

  const fetchUserData = async () => {
    try {
      const token = await getToken()
      const response = await fetch('/api/user/credits', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      const data = await response.json()
      setUserData(data)
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast.error('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatAmount = (amount: number) => {
    return (amount / 100).toFixed(2)
  }

  const getOrderStatus = (status: number) => {
    switch (status) {
      case 1:
        return 'Pending'
      case 2:
        return 'Completed'
      case 3:
        return 'Failed'
      default:
        return 'Unknown'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Credits Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Credits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <p className="text-gray-600">Available Credits</p>
            <p className="text-2xl font-bold">{userData?.credits.available || 0}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-gray-600">Used Credits</p>
            <p className="text-2xl font-bold">{userData?.credits.used || 0}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-gray-600">Total Credits</p>
            <p className="text-2xl font-bold">{userData?.credits.total || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order No</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Plan</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {userData?.orders && userData.orders.length > 0 ? (
                userData.orders.map((order) => (
                  <tr key={order.order_no} className="border-b">
                    <td className="py-3 px-4">{order.order_no}</td>
                    <td className="py-3 px-4">{formatDate(order.created_at)}</td>
                    <td className="py-3 px-4">{order.plan}</td>
                    <td className="py-3 px-4">${formatAmount(order.amount)}</td>
                    <td className="py-3 px-4">{getOrderStatus(order.order_status)}</td>
                  </tr>
                ))
              ) : (
                <tr className="border-b">
                  <td colSpan={5} className="py-3 px-4 text-center text-gray-600">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
