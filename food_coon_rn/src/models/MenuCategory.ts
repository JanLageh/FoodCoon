export interface MenuCategory {
  id: number;
  restaurantId: number;
  name: string;
  sortOrder: number;
}

export function menuCategoryFromJson(json: Record<string, any>): MenuCategory {
  return {
    id: json.id,
    restaurantId: json.restaurantId,
    name: json.name,
    sortOrder: json.sortOrder ?? 0,
  };
}
