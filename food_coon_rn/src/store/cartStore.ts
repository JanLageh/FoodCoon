import { create } from 'zustand';
import type { CartItem } from '../models/CartItem';
import type { MenuItem } from '../models/MenuItem';
import { cartItemTotalPrice } from '../models/CartItem';

interface CartState {
  items: CartItem[];
  restaurantId: number | null;
  restaurantName: string;

  addItem: (menuItem: MenuItem, restaurantId: number, restaurantName: string) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  updateNotes: (menuItemId: number, notes: string) => void;
  getItemQuantity: (menuItemId: number) => number;
  clear: () => void;

  // Computed
  isEmpty: () => boolean;
  itemCount: () => number;
  subtotal: () => number;
  deliveryFee: () => number;
  tax: () => number;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  restaurantId: null,
  restaurantName: '',

  addItem: (menuItem, restaurantId, restaurantName) => {
    set((state) => {
      let items = [...state.items];
      // If different restaurant, clear first
      if (state.restaurantId !== null && state.restaurantId !== restaurantId) {
        items = [];
      }
      const idx = items.findIndex((i) => i.menuItem.id === menuItem.id);
      if (idx >= 0) {
        items[idx] = { ...items[idx], quantity: items[idx].quantity + 1 };
      } else {
        items.push({ menuItem, quantity: 1, notes: '' });
      }
      return { items, restaurantId, restaurantName };
    });
  },

  removeItem: (menuItemId) => {
    set((state) => {
      const items = state.items.filter((i) => i.menuItem.id !== menuItemId);
      return {
        items,
        restaurantId: items.length === 0 ? null : state.restaurantId,
        restaurantName: items.length === 0 ? '' : state.restaurantName,
      };
    });
  },

  updateQuantity: (menuItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(menuItemId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.menuItem.id === menuItemId ? { ...i, quantity } : i,
      ),
    }));
  },

  updateNotes: (menuItemId, notes) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.menuItem.id === menuItemId ? { ...i, notes } : i,
      ),
    }));
  },

  getItemQuantity: (menuItemId) => {
    const item = get().items.find((i) => i.menuItem.id === menuItemId);
    return item?.quantity ?? 0;
  },

  clear: () => set({ items: [], restaurantId: null, restaurantName: '' }),

  isEmpty: () => get().items.length === 0,
  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  subtotal: () => get().items.reduce((sum, i) => sum + cartItemTotalPrice(i), 0),
  deliveryFee: () => (get().items.length === 0 ? 0 : 2.99),
  tax: () => get().subtotal() * 0.08,
  total: () => get().subtotal() + get().deliveryFee() + get().tax(),
}));
