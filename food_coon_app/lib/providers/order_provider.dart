import 'dart:async';
import 'package:flutter/material.dart';
import '../models/order.dart';
import '../models/order_item.dart';
import '../models/cart_item.dart';
import '../services/api_service.dart';

class OrderProvider extends ChangeNotifier {
  List<Order> _orders = [];
  Order? _currentOrder;
  bool _isLoading = false;
  bool _isPlacingOrder = false;
  String? _error;

  // Simulated order status progression
  Timer? _statusTimer;
  int _currentStatusIndex = 0;

  static const List<String> _statusProgression = [
    'placed',
    'confirmed',
    'preparing',
    'ready',
    'picked_up',
    'delivered',
  ];

  List<Order> get orders => _orders;
  Order? get currentOrder => _currentOrder;
  bool get isLoading => _isLoading;
  bool get isPlacingOrder => _isPlacingOrder;
  String? get error => _error;
  int get currentStatusIndex => _currentStatusIndex;
  List<String> get statusProgression => _statusProgression;

  Future<void> fetchOrders() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _orders = await ApiService.getOrders(customerId: 1);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<Order?> placeOrder({
    required int restaurantId,
    required List<CartItem> cartItems,
    required double subtotal,
    required double deliveryFee,
    required double tax,
    required double total,
    String notes = '',
  }) async {
    _isPlacingOrder = true;
    _error = null;
    notifyListeners();

    try {
      // Create the order
      final order = Order(
        customerId: 1,
        restaurantId: restaurantId,
        addressId: 1,
        status: 'placed',
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        tax: tax,
        discount: 0,
        total: total,
        notes: notes,
        createdAt: DateTime.now().toUtc().toIso8601String(),
      );

      final createdOrder = await ApiService.createOrder(order);

      // Create order items
      for (final cartItem in cartItems) {
        final orderItem = OrderItem(
          orderId: createdOrder.id!,
          menuItemId: cartItem.menuItem.id,
          quantity: cartItem.quantity,
          unitPrice: cartItem.menuItem.price,
          notes: cartItem.notes,
        );
        await ApiService.createOrderItem(orderItem);
      }

      // Create payment record
      await ApiService.createPayment({
        'orderId': createdOrder.id,
        'method': 'card',
        'status': 'completed',
        'amount': total,
        'createdAt': DateTime.now().toUtc().toIso8601String(),
      });

      _currentOrder = createdOrder;
      _currentStatusIndex = 0;

      return createdOrder;
    } catch (e) {
      _error = e.toString();
      return null;
    } finally {
      _isPlacingOrder = false;
      notifyListeners();
    }
  }

  void startOrderTracking(Order order) {
    _currentOrder = order;
    _currentStatusIndex =
        _statusProgression.indexOf(order.status).clamp(0, _statusProgression.length - 1);
    _statusTimer?.cancel();

    // Simulate status progression every 5 seconds
    _statusTimer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (_currentStatusIndex < _statusProgression.length - 1) {
        _currentStatusIndex++;
        _currentOrder = Order(
          id: _currentOrder!.id,
          customerId: _currentOrder!.customerId,
          restaurantId: _currentOrder!.restaurantId,
          addressId: _currentOrder!.addressId,
          driverId: _currentStatusIndex >= 3 ? 10 : null,
          status: _statusProgression[_currentStatusIndex],
          subtotal: _currentOrder!.subtotal,
          deliveryFee: _currentOrder!.deliveryFee,
          tax: _currentOrder!.tax,
          discount: _currentOrder!.discount,
          total: _currentOrder!.total,
          notes: _currentOrder!.notes,
          createdAt: _currentOrder!.createdAt,
        );
        notifyListeners();
      } else {
        timer.cancel();
      }
    });
    notifyListeners();
  }

  void stopTracking() {
    _statusTimer?.cancel();
    _currentOrder = null;
    _currentStatusIndex = 0;
    notifyListeners();
  }

  @override
  void dispose() {
    _statusTimer?.cancel();
    super.dispose();
  }
}
