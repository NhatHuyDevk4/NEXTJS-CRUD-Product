"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2 } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import toast from "react-hot-toast"

export default function page() {
    const router = useRouter()
    const {
        items: cartItems,
        fetchItems,
        addToCart,
        decreaseItem,
        removeItem,
        isLoading,
    } = useCartStore();

    const [deliveryOption, setDeliveryOption] = useState("free")
    const [promocode, setPromocode] = useState("")
    const [discountPercentage, setDiscountPercentage] = useState(0)

    const handleQuantityChange = async (productId: string, quantity: number) => {
        if (quantity <= 0) {
            await removeItem(productId);
        } else {
            const current = cartItems.find((item) => item.productId === productId);
            if (!current) return;
            const diff = quantity - current.quantity;
            if (diff > 0) {
                await addToCart(productId, diff);
                toast.success(`Added ${diff} more ${current.product.name}(s) to your cart.`);
            } else if (diff < 0) {
                await decreaseItem(productId, -diff);
                toast.success(`Removed ${-diff} ${current.product.name}(s) from your cart.`);
            }
        }
    };

    const handleRemoveItem = async (productId: string) => {
        await removeItem(productId);
        toast.success("Item removed from cart.");
    };

    const handleApplyPromocode = () => {
        setDiscountPercentage(10);
    };

    useEffect(() => {
        fetchItems();
    }, []); const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const deliveryFee = deliveryOption === "free" ? 0 : 9.99;
    // Remove tax calculation
    const total = subtotal - subtotal * (discountPercentage / 100) + deliveryFee;

    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <h1 className="text-2xl font-bold mb-8">Cart</h1>
            <div className="grid md:grid-cols-[1fr_300px] gap-8">
                <div className="space-y-8">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="border rounded-lg p-4 grid grid-cols-[100px_1fr] gap-4">
                                <Skeleton className="w-[100px] h-[100px] rounded-md" />
                                <div className="space-y-2">
                                    <Skeleton className="w-2/3 h-6" />
                                    <Skeleton className="w-1/4 h-5" />
                                    <Skeleton className="w-1/2 h-5" />
                                    <Skeleton className="w-1/3 h-5" />
                                </div>
                            </div>
                        ))
                    ) : (
                        cartItems.map((item) => {
                            const stockItem = item.product.stock || 0;
                            return (
                                <div key={item.id} className="border rounded-lg p-4 grid grid-cols-[100px_1fr] gap-4">
                                    <Image
                                        src={item.product.image || '/product_default2.jpg'}
                                        alt={item.product.name}
                                        width={100}
                                        height={100}
                                        className="rounded-md object-cover"
                                        style={{ aspectRatio: "100/100", objectFit: "cover" }}
                                    />
                                    <div className="space-y-2">
                                        <h3 className="font-semibold">{item.product.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="text-lg font-bold">${item.product.price}</div>
                                            <Badge variant="secondary">In Stock: {item.product.stock}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </Button>
                                            <div>{item.quantity}</div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                disabled={item.quantity >= stockItem}
                                            >
                                                +
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleRemoveItem(item.productId)}>
                                                <Trash2 />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        )
                    )}
                </div>
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Promocode</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="text"
                                    placeholder="Enter promocode"
                                    value={promocode}
                                    onChange={(e) => setPromocode(e.target.value)}
                                />
                                <Button onClick={handleApplyPromocode}>Apply</Button>
                            </div>
                            {discountPercentage > 0 && (
                                <div className="text-sm text-muted-foreground mt-2">{discountPercentage}% discount applied</div>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>                            <div className="grid gap-2">
                            <div className="flex justify-between">
                                <div className="text-muted-foreground">Subtotal</div>
                                <div>${subtotal.toFixed(2)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="text-muted-foreground">Discount</div>
                                <div>-${(subtotal * (discountPercentage / 100)).toFixed(2)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="text-muted-foreground">Delivery</div>
                                <div>${deliveryFee.toFixed(2)}</div>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-semibold">
                                <div>Total</div>
                                <div>${total.toFixed(2)}</div>
                            </div>
                        </div>
                        </CardContent>                        <CardFooter className="flex flex-col gap-2 p-1">
                            <Button variant="outline" onClick={() => router.push('/')} className="w-full">
                                Continue Shopping
                            </Button>
                            <Button
                                className="w-full"
                                onClick={() => router.push('/checkout')}
                                disabled={cartItems.length === 0}
                            >
                                Proceed to Checkout
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
