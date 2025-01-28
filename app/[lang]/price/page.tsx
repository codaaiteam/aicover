'use client'

import { useLanguage } from "@/contexts/language"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Zap, Sparkles } from "lucide-react"
import { useUser, useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function PricePage() {
  const { t } = useLanguage()
  const { user } = useUser()
  const { getToken } = useAuth()
  const router = useRouter()
  const [isYearly, setIsYearly] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  console.log('Auth state:', { 
    isSignedIn: !!user,
    userId: user?.id,
    userEmail: user?.emailAddresses[0]?.emailAddress 
  })

  const handlePlanSelect = async (plan: string) => {
    if (!user && plan !== 'Free') {
      router.push('/sign-in')
      return
    }

    if (loading) return // Prevent double clicks

    switch (plan) {
      case 'Free':
        router.push('/create')
        break
      case 'Basic':
      case 'Pro':
        try {
          setLoading(plan)
          const token = await getToken()
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              plan: plan.toLowerCase(),
              isYearly: isYearly,
            }),
          })

          const data = await response.json()
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to create order')
          }

          if (data.url) {
            window.location.href = data.url
          } else {
            throw new Error('No checkout URL returned')
          }
        } catch (error) {
          console.error('Error creating order:', error)
          toast.error(error instanceof Error ? error.message : 'Failed to process payment. Please try again.')
        } finally {
          setLoading(null)
        }
        break
      case 'Pay As You Go':
        try {
          setLoading(plan)
          const token = await getToken()
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              plan: 'pay-as-you-go',
              isYearly: false,
            }),
          })

          const data = await response.json()
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to create order')
          }

          if (data.url) {
            window.location.href = data.url
          } else {
            throw new Error('No checkout URL returned')
          }
        } catch (error) {
          console.error('Error creating order:', error)
          toast.error(error instanceof Error ? error.message : 'Failed to process payment. Please try again.')
        } finally {
          setLoading(null)
        }
        break
    }
  }

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/forever',
      description: 'Try it out for free',
      features: [
        '3 free videos',
        '480p resolution',
        'With watermark',
        'Standard generation',
        'Community support',
        'Additional videos: $0.9 each'
      ],
      buttonText: 'Start Free',
      popular: false,
      highlight: 'No credit card required'
    },
    {
      name: 'Basic',
      price: isYearly ? '$16.6' : '$19.9',
      period: isYearly ? '/month' : '/month',
      yearlyPrice: isYearly ? '$199/year' : undefined,
      yearlyNote: isYearly ? '(billed annually)' : undefined,
      description: 'Perfect for starters',
      features: [
        '50 videos per month',
        'With platform watermark',
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
      price: isYearly ? '$41.6' : '$49.9',
      period: isYearly ? '/month' : '/month',
      yearlyPrice: isYearly ? '$499/year' : undefined,
      yearlyNote: isYearly ? '(billed annually)' : undefined,
      description: 'For professional creators',
      features: [
        '150 videos per month',
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
      price: 'From $0.9',
      period: '/video',
      description: 'Flexible volume pricing',
      features: [
        'Minimum $50 initial credit',
        '1-100 videos: $0.9 each',
        '101-500 videos: $0.7 each',
        '500+ videos: $0.6 each',
        'Credits never expire',
        'Priority support',
        'API access included'
      ],
      buttonText: 'Start With Credits',
      popular: false,
      highlight: 'Perfect for variable usage'
    }
  ]

  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">{t.pricingTitle || 'Choose Your Plan'}</h1>
        <p className="mt-4 text-xl text-gray-600">
          {t.pricingDescription || 'Start with 3 free videos, no credit card required'}
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center items-center mt-8 space-x-4">
        <span className={cn(
          "text-sm font-medium transition-colors",
          !isYearly ? "text-blue-600" : "text-gray-500"
        )}>Monthly</span>
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
          Yearly <span className="text-green-500 font-normal">(Save up to 16%)</span>
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
                    {t.mostPopular || 'Most Popular'}
                  </span>
                </div>
              )}
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                {plan.name === 'Free' && <Sparkles className="h-5 w-5 text-yellow-500" />}
                {plan.name === 'Pay As You Go' && <Zap className="h-5 w-5 text-yellow-500" />}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
                {plan.yearlyPrice && (
                  <div className="mt-1 text-sm text-gray-600">
                    {plan.yearlyPrice} {plan.yearlyNote}
                  </div>
                )}
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
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
                {loading === plan.name ? 'Processing...' : plan.buttonText}
              </Button>
              {plan.highlight && (
                <p className="text-sm text-gray-600 mt-2 text-center w-full">
                  {plan.highlight}
                </p>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">{t.pricingFaqTitle || 'Frequently Asked Questions'}</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">How does the free plan work?</h3>
            <p className="text-gray-600">You get 3 free videos to try out our service. No credit card required. After using your free credits, you can purchase additional videos at $0.9 each or upgrade to a subscription plan for better rates.</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">What happens if I exceed my monthly limit?</h3>
            <p className="text-gray-600">You'll be charged the overage rate for your plan. Basic plan users pay $0.8 per additional video, while Pro plan users pay $0.6 per additional video.</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Do unused videos roll over?</h3>
            <p className="text-gray-600">No, video quotas reset at the beginning of each billing cycle. However, credits purchased in the Pay As You Go plan never expire.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
