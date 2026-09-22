import { Platform } from 'react-native';
import { restaurantFromJson, type Restaurant } from '../models/Restaurant';
import { menuCategoryFromJson, type MenuCategory } from '../models/MenuCategory';
import { menuItemFromJson, type MenuItem } from '../models/MenuItem';
import { orderFromJson, type Order } from '../models/Order';
import type { OrderItem } from '../models/OrderItem';

// Use 10.0.2.2 for Android emulator, localhost for iOS sim/web
function getBaseUrl(): string {
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000';
  return 'http://localhost:3000';
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${getBaseUrl()}${path}`, options);
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  return res.json();
}

// ─── Restaurants ──────────────────────────────────────────────────────────────
export async function getRestaurants(): Promise<Restaurant[]> {
  const data = await apiFetch<any[]>('/restaurants');
  return data.map(restaurantFromJson);
}

export async function getRestaurant(id: number): Promise<Restaurant> {
  const data = await apiFetch<any>(`/restaurants/${id}`);
  return restaurantFromJson(data);
}

// ─── Menu ─────────────────────────────────────────────────────────────────────
export async function getMenuCategories(restaurantId: number): Promise<MenuCategory[]> {
  const data = await apiFetch<any[]>(`/menuCategories?restaurantId=${restaurantId}`);
  return data.map(menuCategoryFromJson);
}

export async function getMenuItems(categoryId: number): Promise<MenuItem[]> {
  const data = await apiFetch<any[]>(`/menuItems?categoryId=${categoryId}`);
  return data.map(menuItemFromJson);
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export async function createOrder(order: Omit<Order, 'id'>): Promise<Order> {
  const data = await apiFetch<any>('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  return orderFromJson(data);
}

export async function createOrderItem(item: Omit<OrderItem, 'id'>): Promise<void> {
  await apiFetch('/orderItems', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
}

export async function getOrders(customerId?: number): Promise<Order[]> {
  const qs = customerId
    ? `?customerId=${customerId}&_sort=createdAt&_order=desc`
    : '';
  const data = await apiFetch<any[]>(`/orders${qs}`);
  return data.map(orderFromJson);
}

export async function getOrder(id: number): Promise<Order> {
  const data = await apiFetch<any>(`/orders/${id}`);
  return orderFromJson(data);
}

export async function updateOrderStatus(id: number, status: string): Promise<void> {
  await apiFetch(`/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}

// ─── Payments ─────────────────────────────────────────────────────────────────
export async function createPayment(payment: Record<string, any>): Promise<void> {
  await apiFetch('/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payment),
  });
}
