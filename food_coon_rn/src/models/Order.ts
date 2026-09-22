export interface Order {
  id?: number;
  customerId: number;
  restaurantId: number;
  addressId: number;
  driverId?: number;
  status: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  notes: string;
  createdAt: string;
}

export function orderFromJson(json: Record<string, any>): Order {
  return {
    id: json.id,
    customerId: json.customerId,
    restaurantId: json.restaurantId,
    addressId: json.addressId,
    driverId: json.driverId,
    status: json.status,
    subtotal: Number(json.subtotal),
    deliveryFee: Number(json.deliveryFee),
    tax: Number(json.tax),
    discount: Number(json.discount),
    total: Number(json.total),
    notes: json.notes ?? '',
    createdAt: json.createdAt,
  };
}

export function orderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    placed: 'Order Placed',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    ready: 'Ready for Pickup',
    picked_up: 'On the Way',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return labels[status] ?? status;
}
