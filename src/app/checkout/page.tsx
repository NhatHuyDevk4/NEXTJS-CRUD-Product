'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import SimplePaymentCheckout from '@/components/SimplePaymentCheckout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default function CheckoutPage() {
    const router = useRouter()
    const { items: cartItems, fetchItems } = useCartStore()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchItems().finally(() => setIsLoading(false))
    }, [fetchItems])

    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    // Remove tax calculation
    const deliveryFee = 5.99
    const total = subtotal + deliveryFee

    const handlePaymentSuccess = () => {
        router.push('/order-history')
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">Loading...</div>
            </div>
        )
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">Your cart is empty</h1>
                    <Button onClick={() => router.push('/')}>
                        Continue Shopping
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold">Checkout</h1>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">                    <Image
                                        src={item.product.image ?? '/product_default2.jpg'}
                                        alt={item.product.name}
                                        width={60}
                                        height={60}
                                        className="rounded-md object-cover"
                                    />
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.product.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                ${(item.product.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery</span>
                                        <span>${deliveryFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>          {/* Payment Form */}
          <div>
            {/* Simple payment form without Stripe */}
            <SimplePaymentCheckout
              amount={total}
              onSuccess={handlePaymentSuccess}
            />
          </div>
                </div>
            </div>
        </div>
    )
}
