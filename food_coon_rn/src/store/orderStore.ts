import { create } from 'zustand';
import { createOrder, createOrderItem, createPayment, getOrders } from '../services/api';
import type { Order } from '../models/Order';
import type { CartItem } from '../models/CartItem';

export const STATUS_PROGRESSION = [
  'placed',
  'confirmed',
  'preparing',
  'ready',
  'picked_up',
  'delivered',
] as const;

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  isPlacingOrder: boolean;
  error: string | null;
  currentStatusIndex: number;
  _statusTimer: ReturnType<typeof setInterval> | null;

  fetchOrders: () => Promise<void>;
  placeOrder: (params: {
    restaurantId: number;
    cartItems: CartItem[];
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
    notes?: string;
  }) => Promise<Order | null>;
  startOrderTracking: (order: Order) => void;
  stopTracking: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  isPlacingOrder: false,
  error: null,
  currentStatusIndex: 0,
  _statusTimer: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const orders = await getOrders(1);
      set({ orders });
    } catch (e: any) {
      set({ error: e.message ?? 'Failed to load orders' });
    } finally {
      set({ isLoading: false });
    }
  },

  placeOrder: async ({ restaurantId, cartItems, subtotal, deliveryFee, tax, total, notes = '' }) => {
    set({ isPlacingOrder: true, error: null });
    try {
      const newOrder = await createOrder({
        customerId: 1,
        restaurantId,
        addressId: 1,
        status: 'placed',
        subtotal,
        deliveryFee,
        tax,
        discount: 0,
        total,
        notes,
        createdAt: new Date().toISOString(),
      });

      for (const cartItem of cartItems) {
        await createOrderItem({
          orderId: newOrder.id!,
          menuItemId: cartItem.menuItem.id,
          quantity: cartItem.quantity,
          unitPrice: cartItem.menuItem.price,
          notes: cartItem.notes,
        });
      }

      await createPayment({
        orderId: newOrder.id,
        method: 'card',
        status: 'completed',
        amount: total,
        createdAt: new Date().toISOString(),
      });

      set({ currentOrder: newOrder, currentStatusIndex: 0 });
      return newOrder;
    } catch (e: any) {
      set({ error: e.message ?? 'Failed to place order' });
      return null;
    } finally {
      set({ isPlacingOrder: false });
    }
  },

  startOrderTracking: (order) => {
    // Clear existing timer
    const existing = get()._statusTimer;
    if (existing) clearInterval(existing);

    const startIndex = Math.max(
      0,
      STATUS_PROGRESSION.indexOf(order.status as any),
    );
    set({ currentOrder: order, currentStatusIndex: startIndex });

    const timer = setInterval(() => {
      const { currentStatusIndex, currentOrder } = get();
      if (currentStatusIndex < STATUS_PROGRESSION.length - 1) {
        const nextIndex = currentStatusIndex + 1;
        set({
          currentStatusIndex: nextIndex,
          currentOrder: currentOrder
            ? {
                ...currentOrder,
                driverId: nextIndex >= 3 ? 10 : undefined,
                status: STATUS_PROGRESSION[nextIndex],
              }
            : null,
        });
      } else {
        clearInterval(timer);
        set({ _statusTimer: null });
      }
    }, 5000);

    set({ _statusTimer: timer });
  },

  stopTracking: () => {
    const timer = get()._statusTimer;
    if (timer) clearInterval(timer);
    set({ currentOrder: null, currentStatusIndex: 0, _statusTimer: null });
  },
}));
