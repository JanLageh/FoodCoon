import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/restaurant.dart';
import '../models/menu_category.dart';
import '../models/menu_item.dart';
import '../models/order.dart';
import '../models/order_item.dart';

class ApiService {
  // Use 10.0.2.2 for Android emulator, localhost for web/desktop
  static String get baseUrl {
    if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:3000/api';
    }
    return 'http://localhost:3000/api';
  }

  // ─── Restaurants ───
  static Future<List<Restaurant>> getRestaurants() async {
    final response = await http.get(Uri.parse('$baseUrl/restaurants'));
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Restaurant.fromJson(json)).toList();
    }
    throw Exception('Failed to load restaurants');
  }

  static Future<Restaurant> getRestaurant(int id) async {
    final response = await http.get(Uri.parse('$baseUrl/restaurants/$id'));
    if (response.statusCode == 200) {
      return Restaurant.fromJson(jsonDecode(response.body));
    }
    throw Exception('Failed to load restaurant');
  }

  // ─── Menu ───
  static Future<List<MenuCategory>> getMenuCategories(
      int restaurantId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/menuCategories?restaurantId=$restaurantId'),
    );
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => MenuCategory.fromJson(json)).toList();
    }
    throw Exception('Failed to load menu categories');
  }

  static Future<List<MenuItem>> getMenuItems(int categoryId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/menuItems?categoryId=$categoryId'),
    );
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => MenuItem.fromJson(json)).toList();
    }
    throw Exception('Failed to load menu items');
  }

  static Future<List<MenuItem>> getAllMenuItemsForRestaurant(
      int restaurantId) async {
    final categories = await getMenuCategories(restaurantId);
    final List<MenuItem> allItems = [];
    for (final cat in categories) {
      final items = await getMenuItems(cat.id);
      allItems.addAll(items);
    }
    return allItems;
  }

  // ─── Orders ───
  static Future<Order> createOrder(Order order) async {
    final response = await http.post(
      Uri.parse('$baseUrl/orders'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(order.toJson()),
    );
    if (response.statusCode == 201) {
      return Order.fromJson(jsonDecode(response.body));
    }
    throw Exception('Failed to create order');
  }

  static Future<void> createOrderItem(OrderItem item) async {
    final response = await http.post(
      Uri.parse('$baseUrl/orderItems'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(item.toJson()),
    );
    if (response.statusCode != 201) {
      throw Exception('Failed to create order item');
    }
  }

  static Future<List<Order>> getOrders({int? customerId}) async {
    String url = '$baseUrl/orders';
    if (customerId != null) {
      url += '?customerId=$customerId&_sort=createdAt&_order=desc';
    }
    final response = await http.get(Uri.parse(url));
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Order.fromJson(json)).toList();
    }
    throw Exception('Failed to load orders');
  }

  static Future<Order> getOrder(int id) async {
    final response = await http.get(Uri.parse('$baseUrl/orders/$id'));
    if (response.statusCode == 200) {
      return Order.fromJson(jsonDecode(response.body));
    }
    throw Exception('Failed to load order');
  }

  static Future<void> updateOrderStatus(int id, String status) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/orders/$id'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'status': status}),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to update order status');
    }
  }

  // ─── Payments ───
  static Future<void> createPayment(Map<String, dynamic> payment) async {
    final response = await http.post(
      Uri.parse('$baseUrl/payments'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(payment),
    );
    if (response.statusCode != 201) {
      throw Exception('Failed to create payment');
    }
  }
}
