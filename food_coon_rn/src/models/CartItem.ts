import type { MenuItem } from './MenuItem';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

export function cartItemTotalPrice(item: CartItem): number {
  return item.menuItem.price * item.quantity;
}
