import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../models/menu_item.dart';

class CartProvider extends ChangeNotifier {
  final List<CartItem> _items = [];
  int? _restaurantId;
  String _restaurantName = '';

  List<CartItem> get items => List.unmodifiable(_items);
  int? get restaurantId => _restaurantId;
  String get restaurantName => _restaurantName;
  bool get isEmpty => _items.isEmpty;
  int get itemCount => _items.fold(0, (sum, item) => sum + item.quantity);

  double get subtotal =>
      _items.fold(0, (sum, item) => sum + item.totalPrice);

  double get deliveryFee => _items.isEmpty ? 0 : 2.99;

  double get tax => subtotal * 0.08; // 8% tax

  double get total => subtotal + deliveryFee + tax;

  void addItem(MenuItem menuItem, int restaurantId, String restaurantName) {
    // If cart has items from a different restaurant, clear first
    if (_restaurantId != null && _restaurantId != restaurantId) {
      _items.clear();
    }

    _restaurantId = restaurantId;
    _restaurantName = restaurantName;

    final existingIndex =
        _items.indexWhere((item) => item.menuItem.id == menuItem.id);

    if (existingIndex >= 0) {
      _items[existingIndex].quantity++;
    } else {
      _items.add(CartItem(menuItem: menuItem));
    }

    notifyListeners();
  }

  void removeItem(int menuItemId) {
    _items.removeWhere((item) => item.menuItem.id == menuItemId);
    if (_items.isEmpty) {
      _restaurantId = null;
      _restaurantName = '';
    }
    notifyListeners();
  }

  void updateQuantity(int menuItemId, int quantity) {
    final index =
        _items.indexWhere((item) => item.menuItem.id == menuItemId);
    if (index >= 0) {
      if (quantity <= 0) {
        removeItem(menuItemId);
      } else {
        _items[index].quantity = quantity;
        notifyListeners();
      }
    }
  }

  void updateNotes(int menuItemId, String notes) {
    final index =
        _items.indexWhere((item) => item.menuItem.id == menuItemId);
    if (index >= 0) {
      _items[index].notes = notes;
      notifyListeners();
    }
  }

  int getItemQuantity(int menuItemId) {
    final index =
        _items.indexWhere((item) => item.menuItem.id == menuItemId);
    return index >= 0 ? _items[index].quantity : 0;
  }

  void clear() {
    _items.clear();
    _restaurantId = null;
    _restaurantName = '';
    notifyListeners();
  }
}
