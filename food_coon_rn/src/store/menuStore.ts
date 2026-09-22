import { create } from 'zustand';
import { getMenuCategories, getMenuItems } from '../services/api';
import type { MenuCategory } from '../models/MenuCategory';
import type { MenuItem } from '../models/MenuItem';

interface MenuState {
  categories: MenuCategory[];
  itemsByCategory: Record<number, MenuItem[]>;
  isLoading: boolean;
  error: string | null;
  selectedCategoryIndex: number;

  fetchMenu: (restaurantId: number) => Promise<void>;
  setSelectedCategory: (index: number) => void;
  clear: () => void;

  selectedCategory: () => MenuCategory | null;
  currentItems: () => MenuItem[];
  allItems: () => MenuItem[];
}

export const useMenuStore = create<MenuState>((set, get) => ({
  categories: [],
  itemsByCategory: {},
  isLoading: false,
  error: null,
  selectedCategoryIndex: 0,

  fetchMenu: async (restaurantId) => {
    set({ isLoading: true, error: null, selectedCategoryIndex: 0 });
    try {
      const categories = await getMenuCategories(restaurantId);
      const itemsByCategory: Record<number, MenuItem[]> = {};
      for (const cat of categories) {
        itemsByCategory[cat.id] = await getMenuItems(cat.id);
      }
      set({ categories, itemsByCategory });
    } catch (e: any) {
      set({ error: e.message ?? 'Failed to load menu' });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedCategory: (index) => set({ selectedCategoryIndex: index }),

  clear: () =>
    set({ categories: [], itemsByCategory: {}, selectedCategoryIndex: 0 }),

  selectedCategory: () => {
    const { categories, selectedCategoryIndex } = get();
    return categories.length > 0 ? categories[selectedCategoryIndex] : null;
  },

  currentItems: () => {
    const cat = get().selectedCategory();
    if (!cat) return [];
    return get().itemsByCategory[cat.id] ?? [];
  },

  allItems: () =>
    Object.values(get().itemsByCategory).flat(),
}));
