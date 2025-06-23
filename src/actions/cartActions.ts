'use server';

import { prisma } from '@/lib/prisma';
import { getUserId } from './user.action';

export async function addToCart(productId: string, quantity: number = 1) {
    if (!productId) {
        throw new Error('Thiếu thông tin người dùng hoặc sản phẩm');
    }

    const currentUserId = await getUserId();
    if (!currentUserId) {
        throw new Error('Thiếu thông tin người dùng');
    }

    const existingItem = await prisma.cartItem.findFirst({
        where: {
            userId: currentUserId,
            productId,
        },
    });

    if (existingItem) {
        // Nếu đã có sản phẩm trong giỏ thì tăng số lượng
        return prisma.cartItem.update({
            where: { id: existingItem.id },
            data: {
                quantity: existingItem.quantity + quantity,
            },
        });
    }

    // Thêm mới nếu chưa có
    return prisma.cartItem.create({
        data: {
            userId: currentUserId,
            productId,
            quantity,
        },
    });
}

export async function getCartQuantity() {
    const currentUserId = await getUserId();
    if (!currentUserId) {
        throw new Error('Người dùng chưa đăng nhập');
    }

    // Lấy tất cả item trong giỏ và tính tổng quantity
    const cartItems = await prisma.cartItem.findMany({
        where: { userId: currentUserId },
        select: { quantity: true },
    });

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return totalQuantity;
}

export async function getCartItems() {
    const currentUserId = await getUserId();
    if (!currentUserId) {
        throw new Error('Người dùng chưa đăng nhập');
    }

    // Lấy tất cả item trong giỏ hàng của người dùng
    const cartItems = await prisma.cartItem.findMany({
        where: { userId: currentUserId },
        include: {
            product: true, // Bao gồm thông tin sản phẩm
        },
    });

    return cartItems;
}

export async function decreaseCartItemQuantity(productId: string, quantity: number = 1) {
    if (!productId) {
        throw new Error('Thiếu mã sản phẩm');
    }

    const currentUserId = await getUserId();
    if (!currentUserId) {
        throw new Error('Người dùng chưa đăng nhập');
    }

    const existingItem = await prisma.cartItem.findFirst({
        where: {
            userId: currentUserId,
            productId,
        },
    });

    if (!existingItem) {
        throw new Error('Sản phẩm không tồn tại trong giỏ hàng');
    }

    const newQuantity = existingItem.quantity - quantity;

    if (newQuantity <= 0) {
        // Nếu số lượng <= 0 thì xoá luôn
        return prisma.cartItem.delete({
            where: { id: existingItem.id },
        });
    }

    // Cập nhật số lượng mới
    return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
            quantity: newQuantity,
        },
    });
}

export async function removeItemFromCart(productId: string) {
    const userId = await getUserId();
    if (!userId) throw new Error('Chưa đăng nhập');

    const item = await prisma.cartItem.findFirst({
        where: { userId, productId },
    });

    if (item) {
        await prisma.cartItem.delete({ where: { id: item.id } });
    }
}