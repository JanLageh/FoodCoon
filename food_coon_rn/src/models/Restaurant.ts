export interface Restaurant {
  id: number;
  name: string;
  description: string;
  logoUrl: string;
  coverUrl: string;
  phone: string;
  lat: number;
  lng: number;
  openingTime: string;
  closingTime: string;
  rating: number;
  cuisines: string[];
}

export function restaurantFromJson(json: Record<string, any>): Restaurant {
  return {
    id: json.id,
    name: json.name,
    description: json.description ?? '',
    logoUrl: json.logoUrl ?? '',
    coverUrl: json.coverUrl ?? '',
    phone: json.phone ?? '',
    lat: Number(json.lat),
    lng: Number(json.lng),
    openingTime: json.openingTime ?? '',
    closingTime: json.closingTime ?? '',
    rating: Number(json.rating ?? 0),
    cuisines: (json.cuisines as string[]) ?? [],
  };
}

export function isRestaurantOpen(restaurant: Restaurant): boolean {
  const now = new Date();
  const [openH, openM] = restaurant.openingTime.split(':').map(Number);
  const [closeH, closeM] = restaurant.closingTime.split(':').map(Number);
  if (isNaN(openH) || isNaN(closeH)) return true;
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const openMins = openH * 60 + openM;
  const closeMins = closeH * 60 + closeM;
  return nowMins >= openMins && nowMins <= closeMins;
}
