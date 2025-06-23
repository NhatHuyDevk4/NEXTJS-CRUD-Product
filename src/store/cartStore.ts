// stores/cartStore.ts
import { create } from 'zustand';
import { getCartQuantity, getCartItems, addToCart, decreaseCartItemQuantity, removeItemFromCart } from '@/actions/cartActions';

type CartItem = Awaited<ReturnType<typeof getCartItems>>[0];

type CartState = {
    quantity: number;
    items: CartItem[];
    isLoading: boolean;
    fetchQuantity: () => Promise<void>;
    fetchItems: () => Promise<void>;
    decreaseItem: (productId: string, quantity?: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    reset: () => void;
};

interface AddToCartFunction {
    (productId: string, quantity?: number): Promise<void>;
}

interface CartStore extends CartState {
    addToCart: AddToCartFunction;
}

export const useCartStore = create<CartStore>((set) => ({
    quantity: 0,
    items: [],
    isLoading: false,

    fetchQuantity: async (): Promise<void> => {
        set({ isLoading: true });
        try {
            const quantity = await getCartQuantity();
            set({ quantity });
        } catch {
            set({ quantity: 0 });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchItems: async (): Promise<void> => {
        set({ isLoading: true });
        try {
            const items = await getCartItems();
            set({ items });
        } catch (e) {
            console.error('Lỗi khi lấy danh sách giỏ hàng:', e);
            set({ items: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    addToCart: async (productId: string, quantity: number = 1): Promise<void> => {
        await addToCart(productId, quantity);
        // Sau khi thêm → cập nhật lại dữ liệu store
        const items = await getCartItems();
        const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
        set({
            items,
            quantity: totalQuantity,
        });
    },

    decreaseItem: async (productId, quantity = 1) => {
        await decreaseCartItemQuantity(productId, quantity)
        const items = await getCartItems()
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
        set({ items, quantity: totalQuantity })
    },

    removeItem: async (productId) => {
        await removeItemFromCart(productId);
        const items = await getCartItems();
        const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
        set({ items, quantity: totalQuantity });
    },

    reset: (): void => set({ quantity: 0, items: [] }),
}));
