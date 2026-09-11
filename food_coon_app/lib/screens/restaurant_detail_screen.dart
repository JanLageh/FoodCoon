import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/restaurant.dart';
import '../providers/menu_provider.dart';
import '../providers/cart_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/menu_item_card.dart';
import '../widgets/shimmer_loading.dart';
import 'cart_screen.dart';

class RestaurantDetailScreen extends StatefulWidget {
  final Restaurant restaurant;

  const RestaurantDetailScreen({super.key, required this.restaurant});

  @override
  State<RestaurantDetailScreen> createState() =>
      _RestaurantDetailScreenState();
}

class _RestaurantDetailScreenState extends State<RestaurantDetailScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 0, vsync: this);
    Future.microtask(() async {
      if (!mounted) return;
      final menuProvider = context.read<MenuProvider>();
      await menuProvider.fetchMenu(widget.restaurant.id);
      if (mounted && menuProvider.categories.isNotEmpty) {
        setState(() {
          _tabController = TabController(
            length: menuProvider.categories.length,
            vsync: this,
          );
          _tabController.addListener(() {
            if (!_tabController.indexIsChanging) {
              menuProvider.setSelectedCategory(_tabController.index);
            }
          });
        });
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Hero Header
          SliverAppBar(
            expandedHeight: 220,
            pinned: true,
            backgroundColor: AppTheme.bgDark,
            leading: Container(
              margin: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.5),
                shape: BoxShape.circle,
              ),
              child: IconButton(
                icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
                onPressed: () => Navigator.pop(context),
              ),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  CachedNetworkImage(
                    imageUrl: widget.restaurant.coverUrl,
                    fit: BoxFit.cover,
                    placeholder: (context, url) =>
                        Container(color: AppTheme.bgCardLight),
                    errorWidget: (context, url, error) => Container(
                      color: AppTheme.bgCardLight,
                      child: const Icon(Icons.restaurant,
                          color: AppTheme.textMuted, size: 60),
                    ),
                  ),
                  Container(
                    decoration: const BoxDecoration(
                      gradient: AppTheme.overlayGradient,
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Restaurant Info
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(AppTheme.spacingMd),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.restaurant.name,
                    style: Theme.of(context).textTheme.headlineLarge,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    widget.restaurant.description,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: AppTheme.spacingMd),
                  // Info chips row
                  Row(
                    children: [
                      _infoChip(
                        Icons.star_rounded,
                        widget.restaurant.rating.toStringAsFixed(1),
                        AppTheme.accentGold,
                      ),
                      const SizedBox(width: 10),
                      _infoChip(
                        Icons.access_time_rounded,
                        '${widget.restaurant.openingTime} - ${widget.restaurant.closingTime}',
                        AppTheme.textSecondary,
                      ),
                      const SizedBox(width: 10),
                      _infoChip(
                        widget.restaurant.isOpen
                            ? Icons.check_circle_rounded
                            : Icons.cancel_rounded,
                        widget.restaurant.isOpen ? 'Open' : 'Closed',
                        widget.restaurant.isOpen
                            ? AppTheme.success
                            : AppTheme.error,
                      ),
                    ],
                  ),
                  const SizedBox(height: AppTheme.spacingSm),
                  // Cuisine tags
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: widget.restaurant.cuisines
                        .map(
                          (c) => Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppTheme.primary.withValues(alpha: 0.12),
                              borderRadius:
                                  BorderRadius.circular(AppTheme.radiusFull),
                            ),
                            child: Text(
                              c,
                              style: const TextStyle(
                                color: AppTheme.primaryLight,
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        )
                        .toList(),
                  ),
                ],
              ),
            ),
          ),
          // Divider
          const SliverToBoxAdapter(
            child: Divider(color: AppTheme.bgCardLight, height: 1),
          ),
          // Category Tabs
          Consumer<MenuProvider>(
            builder: (context, menu, _) {
              if (menu.isLoading || menu.categories.isEmpty) {
                return const SliverToBoxAdapter(child: SizedBox.shrink());
              }
              return SliverPersistentHeader(
                pinned: true,
                delegate: _TabBarDelegate(
                  TabBar(
                    controller: _tabController,
                    isScrollable: true,
                    tabAlignment: TabAlignment.start,
                    labelColor: AppTheme.primary,
                    unselectedLabelColor: AppTheme.textMuted,
                    indicatorColor: AppTheme.primary,
                    indicatorSize: TabBarIndicatorSize.label,
                    dividerColor: Colors.transparent,
                    tabs: menu.categories
                        .map((cat) => Tab(text: cat.name))
                        .toList(),
                  ),
                ),
              );
            },
          ),
          // Menu Items
          Consumer<MenuProvider>(
            builder: (context, menu, _) {
              if (menu.isLoading) {
                return SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: AppTheme.spacingMd),
                    child: ShimmerLoading(
                      itemCount: 4,
                      type: ShimmerType.menuItem,
                    ),
                  ),
                );
              }

              if (menu.error != null) {
                return SliverToBoxAdapter(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(AppTheme.spacingXl),
                      child: Text(
                        'Failed to load menu',
                        style: TextStyle(color: AppTheme.textMuted),
                      ),
                    ),
                  ),
                );
              }

              final items = menu.currentItems;
              if (items.isEmpty) {
                return SliverToBoxAdapter(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(AppTheme.spacingXl),
                      child: Column(
                        children: [
                          const Icon(Icons.restaurant_menu,
                              color: AppTheme.textMuted, size: 48),
                          const SizedBox(height: 12),
                          const Text('No items in this category',
                              style: TextStyle(color: AppTheme.textMuted)),
                        ],
                      ),
                    ),
                  ),
                );
              }

              return SliverPadding(
                padding: const EdgeInsets.all(AppTheme.spacingMd),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final item = items[index];
                      return MenuItemCard(
                        menuItem: item,
                        quantity: cart.getItemQuantity(item.id),
                        onAdd: () {
                          cart.addItem(item, widget.restaurant.id,
                              widget.restaurant.name);
                        },
                        onQuantityChanged: (qty) {
                          if (qty <= 0) {
                            cart.removeItem(item.id);
                          } else {
                            cart.updateQuantity(item.id, qty);
                          }
                        },
                      );
                    },
                    childCount: items.length,
                  ),
                ),
              );
            },
          ),
          // Bottom spacing for cart bar
          const SliverToBoxAdapter(
            child: SizedBox(height: 100),
          ),
        ],
      ),
      // Floating cart bar
      bottomSheet: cart.isEmpty
          ? null
          : Container(
              padding: const EdgeInsets.all(AppTheme.spacingMd),
              decoration: BoxDecoration(
                color: AppTheme.bgCard,
                border: Border(
                  top: BorderSide(
                      color: Colors.white.withValues(alpha: 0.06)),
                ),
              ),
              child: SafeArea(
                child: GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) => const CartScreen()),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 20, vertical: 14),
                    decoration: BoxDecoration(
                      gradient: AppTheme.primaryGradient,
                      borderRadius:
                          BorderRadius.circular(AppTheme.radiusMd),
                      boxShadow: AppTheme.elevatedShadow,
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.25),
                            borderRadius:
                                BorderRadius.circular(AppTheme.radiusSm),
                          ),
                          child: Text(
                            '${cart.itemCount}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w700,
                              fontSize: 14,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Text(
                            'View Cart',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w600,
                              fontSize: 16,
                            ),
                          ),
                        ),
                        Text(
                          '\$${cart.total.toStringAsFixed(2)}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w700,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
    );
  }

  Widget _infoChip(IconData icon, String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: AppTheme.glassDecoration,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 4),
          Text(
            text,
            style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }
}

class _TabBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar tabBar;

  _TabBarDelegate(this.tabBar);

  @override
  double get minExtent => tabBar.preferredSize.height;

  @override
  double get maxExtent => tabBar.preferredSize.height;

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: AppTheme.bgDark,
      child: tabBar,
    );
  }

  @override
  bool shouldRebuild(_TabBarDelegate oldDelegate) => false;
}
