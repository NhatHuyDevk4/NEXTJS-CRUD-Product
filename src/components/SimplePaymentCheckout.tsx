'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'
import { placeOrder } from '@/actions/orderActions'
import { useCartStore } from '@/store/cartStore'

interface SimplePaymentCheckoutProps {
    readonly amount: number
    readonly onSuccess?: () => void
}

export default function SimplePaymentCheckout({ amount, onSuccess }: SimplePaymentCheckoutProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
    })
    const { fetchItems } = useCartStore()

    const handleInputChange = (field: string, value: string) => {
        setPaymentData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        // Basic validation
        if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cardholderName) {
            toast.error('Please fill in all payment fields')
            return
        }

        setIsLoading(true)

        try {
            const res = await placeOrder()
            toast.success('Payment successful! Order placed.')
            fetchItems() // Refresh cart
            onSuccess?.()
        } catch (error: any) {
            console.error('Payment error:', error)
            toast.error(error.message ?? 'Payment failed')
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
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label htmlFor="cardholderName">Cardholder Name</Label>
                            <Input
                                id="cardholderName"
                                placeholder="John Doe"
                                value={paymentData.cardholderName}
                                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={paymentData.cardNumber}
                                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                                id="expiryDate"
                                placeholder="MM/YY"
                                value={paymentData.expiryDate}
                                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        {/* <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                                id="cvv"
                                placeholder="123"
                                value={paymentData.cvv}
                                onChange={(e) => handleInputChange('cvv', e.target.value)}
                                disabled={isLoading}
                            />
                        </div> */}
                    </div>

                    {/* <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This is a demo payment form. No real payment processing occurs.
            </p>
          </div> */}
                </CardContent>
            </Card>

            <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">
                    Total: ${amount.toFixed(2)}
                </div>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-[120px]"
                >
                    {isLoading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
                </Button>
            </div>
        </form>
    )
}
