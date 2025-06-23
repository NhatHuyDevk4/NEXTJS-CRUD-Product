// app/actions/order.action.ts
'use server';

import { prisma } from '@/lib/prisma';
import { getUserId } from './user.action';

export async function placeOrder() {
    const userId = await getUserId();
    if (!userId) throw new Error('User not authenticated');

    // Lấy các item trong giỏ hàng
    const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
    });

    if (cartItems.length === 0) throw new Error('Cart is empty');

    // Tính tổng tiền
    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    // Tạo đơn hàng mới
    const order = await prisma.order.create({
        data: {
            userId,
            totalAmount,
            status: 'paid',
            products: {
                create: cartItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            },
        },
    });

    // Xoá giỏ hàng sau khi đặt hàng
    await prisma.cartItem.deleteMany({
        where: { userId },
    });

    return order;
}


export async function getOrderHistory() {
    const userId = await getUserId()
    if (!userId) throw new Error('Not authenticated')

    const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            products: {
                include: {
                    product: true
                }
            }
        }
    })

    return orders
}