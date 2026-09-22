export interface OrderItem {
  id?: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  unitPrice: number;
  notes: string;
}

export function orderItemToJson(item: OrderItem): Record<string, any> {
  return {
    orderId: item.orderId,
    menuItemId: item.menuItemId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    notes: item.notes,
  };
}
