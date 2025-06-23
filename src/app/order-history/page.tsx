// app/(user)/order-history/page.tsx
'use client'


import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { getOrderHistory } from "@/actions/orderActions"

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true)
                const res = await getOrderHistory()
                setOrders(res)
            } catch (error) {
                console.error('Error fetching orders:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrders()
    }, [])

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
            <div className="space-y-6">                {isLoading ? (
                // Skeleton loading state
                [1, 2, 3].map((id) => (
                    <Card key={`skeleton-${id}`}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-6 w-16" />
                            </CardTitle>
                            <Skeleton className="h-4 w-48 mt-2" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-36" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </div>
                            <hr />
                            <div className="flex justify-between font-semibold">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                orders.map(order => (
                    <Card key={order.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Mã đơn: {order.id}</span>
                                <Badge variant={order.status === 'paid' ? "default" : "secondary"}>
                                    {order.status}
                                </Badge>
                            </CardTitle>
                            <p className="text-muted-foreground text-sm">
                                Ngày đặt: {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {order.products.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center text-sm"
                                >
                                    <div>
                                        {item.product.name} x {item.quantity}
                                    </div>
                                    <div>
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                            <hr />
                            <div className="flex justify-between font-semibold">
                                <span>Tổng tiền</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
                {!isLoading && orders.length === 0 && <p>Không có đơn hàng nào.</p>}
            </div>
        </div>
    )
}
