import 'package:flutter/material.dart';
import '../models/restaurant.dart';
import '../services/api_service.dart';

class RestaurantProvider extends ChangeNotifier {
  List<Restaurant> _restaurants = [];
  List<Restaurant> _filteredRestaurants = [];
  bool _isLoading = false;
  String? _error;
  String _searchQuery = '';
  String _selectedCuisine = '';

  List<Restaurant> get restaurants =>
      _filteredRestaurants.isEmpty && _searchQuery.isEmpty && _selectedCuisine.isEmpty
          ? _restaurants
          : _filteredRestaurants;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String get searchQuery => _searchQuery;
  String get selectedCuisine => _selectedCuisine;

  List<String> get allCuisines {
    final Set<String> cuisines = {};
    for (final r in _restaurants) {
      cuisines.addAll(r.cuisines);
    }
    return cuisines.toList()..sort();
  }

  Future<void> fetchRestaurants() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _restaurants = await ApiService.getRestaurants();
      _applyFilters();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    _applyFilters();
    notifyListeners();
  }

  void setSelectedCuisine(String cuisine) {
    _selectedCuisine = _selectedCuisine == cuisine ? '' : cuisine;
    _applyFilters();
    notifyListeners();
  }

  void _applyFilters() {
    _filteredRestaurants = _restaurants.where((r) {
      final matchesSearch = _searchQuery.isEmpty ||
          r.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          r.description.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesCuisine = _selectedCuisine.isEmpty ||
          r.cuisines.contains(_selectedCuisine);
      return matchesSearch && matchesCuisine;
    }).toList();
  }
}
