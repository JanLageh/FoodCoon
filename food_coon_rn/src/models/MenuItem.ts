export interface MenuItem {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
  isAvailable: boolean;
}

export function menuItemFromJson(json: Record<string, any>): MenuItem {
  return {
    id: json.id,
    categoryId: json.categoryId,
    name: json.name,
    description: json.description ?? '',
    price: Number(json.price),
    imageUrl: json.imageUrl ?? '',
    isVeg: json.isVeg ?? false,
    isAvailable: json.isAvailable ?? true,
  };
}
