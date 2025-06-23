'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'

interface SimpleCheckoutProps {
    readonly amount: number
    readonly onSuccess?: () => void
}

export default function SimpleCheckout({ amount, onSuccess }: SimpleCheckoutProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handlePayment = async () => {
        setIsLoading(true)

        try {
            // Simulate payment process
            await new Promise(resolve => setTimeout(resolve, 2000))
            toast.success('Payment successful! (Simulated)')
            onSuccess?.()
        } catch {
            toast.error('Payment failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Test Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 border rounded-md bg-yellow-50">
                    <p className="text-sm text-yellow-800">
                        This is a test payment component.
                        To use real Stripe payments, you need to:
                    </p>
                    <ol className="list-decimal list-inside mt-2 text-sm text-yellow-800">
                        <li>Get Stripe API keys from dashboard.stripe.com</li>
                        <li>Add them to your .env.local file</li>
                        <li>Replace the fake keys I provided</li>
                    </ol>
                </div>

                <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold">
                        Total: ${amount.toFixed(2)}
                    </div>
                    <Button
                        onClick={handlePayment}
                        disabled={isLoading}
                        className="min-w-[120px]"
                    >
                        {isLoading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
