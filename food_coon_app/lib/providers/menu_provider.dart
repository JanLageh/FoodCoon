import 'package:flutter/material.dart';
import '../models/menu_category.dart';
import '../models/menu_item.dart';
import '../services/api_service.dart';

class MenuProvider extends ChangeNotifier {
  List<MenuCategory> _categories = [];
  Map<int, List<MenuItem>> _itemsByCategory = {};
  bool _isLoading = false;
  String? _error;
  int _selectedCategoryIndex = 0;

  List<MenuCategory> get categories => _categories;
  Map<int, List<MenuItem>> get itemsByCategory => _itemsByCategory;
  bool get isLoading => _isLoading;
  String? get error => _error;
  int get selectedCategoryIndex => _selectedCategoryIndex;

  MenuCategory? get selectedCategory =>
      _categories.isNotEmpty ? _categories[_selectedCategoryIndex] : null;

  List<MenuItem> get currentItems {
    if (selectedCategory == null) return [];
    return _itemsByCategory[selectedCategory!.id] ?? [];
  }

  List<MenuItem> get allItems {
    return _itemsByCategory.values.expand((items) => items).toList();
  }

  void setSelectedCategory(int index) {
    _selectedCategoryIndex = index;
    notifyListeners();
  }

  Future<void> fetchMenu(int restaurantId) async {
    _isLoading = true;
    _error = null;
    _selectedCategoryIndex = 0;
    notifyListeners();

    try {
      _categories = await ApiService.getMenuCategories(restaurantId);
      _itemsByCategory = {};

      for (final cat in _categories) {
        final items = await ApiService.getMenuItems(cat.id);
        _itemsByCategory[cat.id] = items;
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clear() {
    _categories = [];
    _itemsByCategory = {};
    _selectedCategoryIndex = 0;
    notifyListeners();
  }
}
