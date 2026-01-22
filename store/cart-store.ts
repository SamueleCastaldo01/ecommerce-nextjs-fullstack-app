import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  image: string;
  variant?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variant?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean; 
  setCartOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === newItem.id && item.variant === newItem.variant
          );

          if (existingItemIndex !== -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          }

          return { items: [...state.items, newItem] };
        });
      },
      
      isCartOpen: false, // Inizia chiuso
      setCartOpen: (open) => set({ isCartOpen: open }),

      removeItem: (id: string, variant?: string) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === id && item.variant === variant
          );

          if (existingItemIndex === -1) return state;

          const updatedItems = [...state.items];
          const item = updatedItems[existingItemIndex];

          if (item.quantity > 1) {
            item.quantity -= 1;
          } else {
            updatedItems.splice(existingItemIndex, 1);
          }

          return { items: updatedItems };
        });
      },
      clearCart: () =>
        set(() => {
          return { items: [] };
        }),
    }),
    { name: "cart" }
  )
);
