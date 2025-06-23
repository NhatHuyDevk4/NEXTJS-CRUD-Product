'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'
import { placeOrder } from '@/actions/orderActions'
import { useCartStore } from '@/store/cartStore'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
    readonly amount: number
    readonly onSuccess?: () => void
}

function CheckoutForm({ amount, onSuccess }: CheckoutFormProps) {
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)
    const { fetchItems, fetchQuantity } = useCartStore()

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        if (!stripe || !elements) {
            toast.error('Stripe not loaded yet. Please try again.')
            return
        } const cardElement = elements.getElement(CardElement)
        if (!cardElement) {
            toast.error('Card element not found. Please refresh the page.')
            return
        }

        setIsLoading(true)

        try {
            // Direct order placement for testing (skip Stripe payment)
            await placeOrder()
            toast.success('Order placed successfully!')
            fetchItems() // Refresh cart
            fetchQuantity() // Refresh cart quantity
            onSuccess?.()
        } catch {
            toast.error('An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 border rounded-md">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">
                    Total: ${amount.toFixed(2)}
                </div>
                <Button
                    type="submit"
                    disabled={!stripe || isLoading}
                    className="min-w-[120px]"
                >
                    {isLoading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
                </Button>
            </div>
        </form>
    )
}

interface StripeCheckoutProps {
    readonly amount: number
    readonly onSuccess?: () => void
}

export default function StripeCheckout({ amount, onSuccess }: StripeCheckoutProps) {
    // Check if Stripe key is available
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center text-red-500">
                        <p>Stripe is not configured. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your environment variables.</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm amount={amount} onSuccess={onSuccess} />
        </Elements>
    )
}
