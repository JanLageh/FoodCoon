import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/restaurant_provider.dart';
import '../providers/cart_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/restaurant_card.dart';
import '../widgets/cuisine_chip.dart';
import '../widgets/shimmer_loading.dart';
import 'restaurant_detail_screen.dart';
import 'cart_screen.dart';
import 'orders_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      if (mounted) {
        context.read<RestaurantProvider>().fetchRestaurants();
      }
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // Header
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(
                    AppTheme.spacingMd, AppTheme.spacingLg, AppTheme.spacingMd, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            gradient: AppTheme.primaryGradient,
                            borderRadius:
                                BorderRadius.circular(AppTheme.radiusMd),
                          ),
                          child: const Icon(Icons.delivery_dining_rounded,
                              color: Colors.white, size: 24),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'FoodCoon',
                              style: Theme.of(context)
                                  .textTheme
                                  .headlineMedium
                                  ?.copyWith(
                                    foreground: Paint()
                                      ..shader = const LinearGradient(
                                        colors: [
                                          AppTheme.primary,
                                          AppTheme.accent,
                                        ],
                                      ).createShader(
                                          const Rect.fromLTWH(0, 0, 150, 30)),
                                  ),
                            ),
                            Text(
                              'Deliver to: 123 Main St, Brooklyn',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
                        ),
                        const Spacer(),
                        IconButton(
                          icon: const Icon(Icons.receipt_long_rounded,
                              color: AppTheme.textSecondary),
                          tooltip: 'Orders',
                          onPressed: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (_) => const OrdersScreen()),
                          ),
                        ),
                        Consumer<CartProvider>(
                          builder: (context, cart, _) => Badge(
                            isLabelVisible: cart.itemCount > 0,
                            label: Text('${cart.itemCount}'),
                            backgroundColor: AppTheme.primary,
                            child: IconButton(
                              icon: const Icon(Icons.shopping_bag_outlined,
                                  color: AppTheme.textPrimary),
                              tooltip: 'Cart',
                              onPressed: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (_) => const CartScreen()),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppTheme.spacingLg),
                    // Search bar
                    Container(
                      decoration: BoxDecoration(
                        color: AppTheme.bgCardLight,
                        borderRadius:
                            BorderRadius.circular(AppTheme.radiusMd),
                        border: Border.all(
                            color: Colors.white.withValues(alpha: 0.06)),
                      ),
                      child: TextField(
                        controller: _searchController,
                        onChanged: (value) {
                          context
                              .read<RestaurantProvider>()
                              .setSearchQuery(value);
                        },
                        style: const TextStyle(color: AppTheme.textPrimary),
                        decoration: InputDecoration(
                          hintText: 'Search restaurants...',
                          prefixIcon: const Icon(Icons.search_rounded,
                              color: AppTheme.textMuted),
                          suffixIcon: _searchController.text.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(Icons.close_rounded,
                                      color: AppTheme.textMuted, size: 20),
                                  onPressed: () {
                                    _searchController.clear();
                                    context
                                        .read<RestaurantProvider>()
                                        .setSearchQuery('');
                                  },
                                )
                              : null,
                          border: InputBorder.none,
                          filled: false,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Cuisine Chips
            Consumer<RestaurantProvider>(
              builder: (context, provider, _) {
                if (provider.allCuisines.isEmpty) {
                  return const SliverToBoxAdapter(child: SizedBox.shrink());
                }
                return SliverToBoxAdapter(
                  child: Padding(
                    padding:
                        const EdgeInsets.only(top: AppTheme.spacingMd),
                    child: SizedBox(
                      height: 40,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        padding: const EdgeInsets.symmetric(
                            horizontal: AppTheme.spacingMd),
                        itemCount: provider.allCuisines.length,
                        separatorBuilder: (context, index) =>
                            const SizedBox(width: 8),
                        itemBuilder: (context, index) {
                          final cuisine = provider.allCuisines[index];
                          return CuisineChip(
                            label: cuisine,
                            isSelected:
                                provider.selectedCuisine == cuisine,
                            onTap: () =>
                                provider.setSelectedCuisine(cuisine),
                          );
                        },
                      ),
                    ),
                  ),
                );
              },
            ),
            // Section title
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(
                    AppTheme.spacingMd, AppTheme.spacingLg, AppTheme.spacingMd, AppTheme.spacingSm),
                child: Text(
                  'Nearby Restaurants',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
              ),
            ),
            // Restaurant List
            Consumer<RestaurantProvider>(
              builder: (context, provider, _) {
                if (provider.isLoading) {
                  return SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: AppTheme.spacingMd),
                      child: ShimmerLoading(
                        itemCount: 3,
                        type: ShimmerType.restaurantCard,
                      ),
                    ),
                  );
                }

                if (provider.error != null) {
                  return SliverToBoxAdapter(
                    child: _buildErrorState(provider),
                  );
                }

                if (provider.restaurants.isEmpty) {
                  return SliverToBoxAdapter(
                    child: _buildEmptyState(),
                  );
                }

                return SliverPadding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: AppTheme.spacingMd),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final restaurant = provider.restaurants[index];
                        return RestaurantCard(
                          restaurant: restaurant,
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => RestaurantDetailScreen(
                                    restaurant: restaurant),
                              ),
                            );
                          },
                        );
                      },
                      childCount: provider.restaurants.length,
                    ),
                  ),
                );
              },
            ),
            // Bottom spacing
            const SliverToBoxAdapter(
              child: SizedBox(height: 100),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorState(RestaurantProvider provider) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.spacingXl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppTheme.error.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.wifi_off_rounded,
                  color: AppTheme.error, size: 40),
            ),
            const SizedBox(height: AppTheme.spacingMd),
            const Text(
              'Connection Error',
              style: TextStyle(
                color: AppTheme.textPrimary,
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Make sure the mock API is running\n(node mock-api/server.js)',
              style: const TextStyle(
                color: AppTheme.textSecondary,
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppTheme.spacingMd),
            ElevatedButton.icon(
              onPressed: () => provider.fetchRestaurants(),
              icon: const Icon(Icons.refresh_rounded),
              label: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.spacingXl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppTheme.primary.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.search_off_rounded,
                  color: AppTheme.primary, size: 40),
            ),
            const SizedBox(height: AppTheme.spacingMd),
            const Text(
              'No restaurants found',
              style: TextStyle(
                color: AppTheme.textPrimary,
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Try adjusting your search or filters',
              style: TextStyle(color: AppTheme.textSecondary, fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }
}
