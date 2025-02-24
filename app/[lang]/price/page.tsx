'use client'

import React from 'react'
import { useLanguage } from "@/contexts/language"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Zap, Sparkles } from "lucide-react"
import { useUser, useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Plan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  buttonText: string
  popular: boolean
  highlight: string
}

const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/forever',
    description: 'Try one video for free',
    features: [
      '1 free video',
      '480p resolution',
      'Watermark free',
      'Standard generation',
      'Community support',
      'Then $2.99 for 3 videos'
    ],
    buttonText: 'Start Free',
    popular: false,
    highlight: 'No credit card required'
  },
  {
    name: 'Basic',
    price: '$19.9',
    period: '/month',
    description: 'Perfect for starters',
    features: [
      '25 videos per month',
      'Watermark free',
      '720p resolution',
      'Standard queue priority',
      'Basic support',
      'Overage: $0.8/video'
    ],
    buttonText: 'Get Basic',
    popular: true,
    highlight: 'Save 16% with annual billing'
  },
  {
    name: 'Pro',
    price: '$49.9',
    period: '/month',
    description: 'For professional creators',
    features: [
      '80 videos per month',
      'Watermark free',
      '1080p resolution',
      'Priority generation',
      'Priority support',
      'Overage: $0.6/video',
      'API access'
    ],
    buttonText: 'Choose Pro',
    popular: false,
    highlight: 'Most popular for businesses'
  },
  {
    name: 'Pay As You Go',
    price: '$2.99',
    period: '/3 videos',
    description: 'Flexible usage',
    features: [
      'Buy 3 videos at once',
      'No watermark',
      '720p resolution',
      'Priority generation',
      'Credits never expire',
      'Priority support',
      'API access included'
    ],
    buttonText: 'Buy Now',
    popular: false,
    highlight: 'Most flexible option'
  }
]

function PricePage() {
  const { t } = useLanguage()
  const { user } = useUser()
  const router = useRouter()
  const [isYearly, setIsYearly] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const handlePlanSelect = async (plan: string) => {
    if (!user && plan !== 'Free') {
      router.push('/sign-in')
      return
    }

    if (loading) return

    if (plan === 'Free') {
      router.push('/create')
      return
    }

    try {
      setLoading(plan)
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: plan === 'Pay As You Go' ? 'pay-as-you-go' : plan.toLowerCase().replace(/\s+/g, '-'),
          isYearly: plan === 'Pay As You Go' ? false : isYearly,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      if (!data.data?.url) {
        throw new Error('No checkout URL in response')
      }

      window.location.href = data.data.url
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to process payment')
    } finally {
      setLoading(null)
    }
  }

  const getPlanPrice = (plan: Plan) => {
    if (plan.name === 'Free' || plan.name === 'Pay As You Go') {
      return plan.price
    }
    return isYearly 
      ? `$${(Number(plan.price.replace('$', '')) * 0.84).toFixed(1)}`
      : plan.price
  }

  const getPlanPeriod = (plan: Plan) => {
    if (plan.name === 'Free' || plan.name === 'Pay As You Go') {
      return plan.period
    }
    return isYearly ? '/month' : '/month'
  }

  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">{t.pricing?.title || 'Choose Your Plan'}</h1>
        <p className="mt-4 text-xl text-gray-600">
          {t.pricing?.description || 'Start with 3 free videos, no credit card required'}
        </p>
      </div>

      <div className="flex justify-center items-center mt-8 space-x-4">
        <span className={cn(
          "text-sm font-medium transition-colors",
          !isYearly ? "text-blue-600" : "text-gray-500"
        )}>
          {t.pricing?.monthlyLabel || 'Monthly'}
        </span>
        <button 
          onClick={() => setIsYearly(!isYearly)}
          className="relative rounded-full w-12 h-6 bg-blue-600 transition-colors"
        >
          <span className={cn(
            "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200",
            isYearly ? "left-7" : "left-1"
          )}></span>
        </button>
        <span className={cn(
          "text-sm font-medium transition-colors",
          isYearly ? "text-blue-600" : "text-gray-500"
        )}>
          {t.pricing?.yearlyLabel || 'Yearly'} 
          <span className="text-green-500 font-normal">
            {t.pricing?.yearlySavings || '(Save up to 16%)'}
          </span>
        </span>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card key={plan.name} className={cn(
            "flex flex-col border-2",
            plan.popular ? "border-blue-600 shadow-lg shadow-blue-100" : "border-gray-200"
          )}>
            <CardHeader>
              {plan.popular && (
                <div className="mb-2">
                  <span className="px-3 py-1 text-sm text-white bg-blue-600 rounded-full">
                    {t.pricing?.mostPopular || 'Most Popular'}
                  </span>
                </div>
              )}
              <CardTitle className="flex items-center justify-between">
                {t.pricing?.plans?.[plan.name.toLowerCase().replace(/\s+/g, '')]?.name || plan.name}
                {plan.name === 'Free' && <Sparkles className="h-5 w-5 text-yellow-500" />}
                {plan.name === 'Pay As You Go' && <Zap className="h-5 w-5 text-yellow-500" />}
              </CardTitle>
              <CardDescription>
                {t.pricing?.plans?.[plan.name.toLowerCase().replace(/\s+/g, '')]?.description || plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-4">
                <span className="text-4xl font-bold">{getPlanPrice(plan)}</span>
                <span className="text-gray-600">{getPlanPeriod(plan)}</span>
                {isYearly && plan.name !== 'Free' && plan.name !== 'Pay As You Go' && (
                  <div className="mt-1 text-sm text-gray-600">
                    ${(Number(plan.price.replace('$', '')) * 0.84 * 12).toFixed(0)}/year (billed annually)
                  </div>
                )}
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>
                      {t.pricing?.plans?.[plan.name.toLowerCase().replace(/\s+/g, '')]?.features?.[index] || feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handlePlanSelect(plan.name)}
                disabled={loading === plan.name}
                style={{
                  backgroundColor: plan.popular ? '#2563eb' : 'transparent',
                  borderColor: '#2563eb',
                  color: plan.popular ? 'white' : '#2563eb'
                }}
              >
                {loading === plan.name 
                  ? (t.pricing?.processing || 'Processing...') 
                  : (t.pricing?.plans?.[plan.name.toLowerCase().replace(/\s+/g, '')]?.buttonText || plan.buttonText)}
              </Button>
              {plan.highlight && (
                <p className="text-sm text-gray-600 mt-2 text-center w-full">
                  {t.pricing?.plans?.[plan.name.toLowerCase().replace(/\s+/g, '')]?.highlight || plan.highlight}
                </p>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PricePage