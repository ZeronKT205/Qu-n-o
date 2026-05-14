import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // combination of productId-color-size
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  color: string;
  colorName?: string; // Optional name for display
  size: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // UI state
  setIsOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
  
  // Computed (getters)
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const id = `${newItem.productId}-${newItem.color}-${newItem.size}`;
        
        set((state) => {
          const existingItemIndex = state.items.findIndex(item => item.id === id);
          
          if (existingItemIndex !== -1) {
            // Update existing item
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += newItem.quantity;
            return { items: newItems, isOpen: true }; // Open cart when adding
          } else {
            // Add new item
            return { items: [...state.items, { ...newItem, id }], isOpen: true };
          }
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) return;
        
        set((state) => ({
          items: state.items.map(item => 
            item.id === id ? { ...item, quantity } : item
          )
        }));
      },

      clearCart: () => set({ items: [] }),

      setIsOpen: (isOpen) => set({ isOpen }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'levents-cart-storage', // key in local storage
      partialize: (state) => ({ items: state.items }), // Only persist items, not UI state like isOpen
    }
  )
);
