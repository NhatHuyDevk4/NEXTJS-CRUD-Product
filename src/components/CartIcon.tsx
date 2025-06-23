'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { getCartQuantity } from '@/actions/cartActions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';

export default function CartIcon() {

    const { quantity, fetchQuantity } = useCartStore();
    console.log('CartIcon quantity:', quantity);

    useEffect(() => {
        const fetchCartQuantity = async () => {
            await fetchQuantity();
        };

        fetchCartQuantity();
    }, [fetchQuantity]);

    return (
        <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/cart" className="relative">
                <ShoppingCart size={20} />
                <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums absolute -top-1 -right-0 bg-primary text-primary-foreground">
                    {quantity > 0 ? quantity : 0}
                </Badge>
            </Link>
        </Button>
    );
}
