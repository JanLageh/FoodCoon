import { create } from 'zustand';
import { getRestaurants } from '../services/api';
import type { Restaurant } from '../models/Restaurant';

interface RestaurantState {
  restaurants: Restaurant[];
  filteredRestaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCuisine: string;

  fetchRestaurants: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCuisine: (cuisine: string) => void;
  allCuisines: () => string[];
  displayedRestaurants: () => Restaurant[];
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurants: [],
  filteredRestaurants: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCuisine: '',

  fetchRestaurants: async () => {
    set({ isLoading: true, error: null });
    try {
      const restaurants = await getRestaurants();
      set({ restaurants });
      applyFilters(set, get, restaurants);
    } catch (e: any) {
      set({ error: e.message ?? 'Failed to load restaurants' });
    } finally {
      set({ isLoading: false });
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    applyFilters(set, get, get().restaurants);
  },

  setSelectedCuisine: (cuisine) => {
    const current = get().selectedCuisine;
    set({ selectedCuisine: current === cuisine ? '' : cuisine });
    applyFilters(set, get, get().restaurants);
  },

  allCuisines: () => {
    const set_ = new Set<string>();
    get().restaurants.forEach((r) => r.cuisines.forEach((c) => set_.add(c)));
    return Array.from(set_).sort();
  },

  displayedRestaurants: () => {
    const { restaurants, filteredRestaurants, searchQuery, selectedCuisine } = get();
    if (!searchQuery && !selectedCuisine) return restaurants;
    return filteredRestaurants;
  },
}));

function applyFilters(
  set: (partial: Partial<RestaurantState>) => void,
  get: () => RestaurantState,
  restaurants: Restaurant[],
) {
  const { searchQuery, selectedCuisine } = get();
  const filtered = restaurants.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = !selectedCuisine || r.cuisines.includes(selectedCuisine);
    return matchesSearch && matchesCuisine;
  });
  set({ filteredRestaurants: filtered });
}
