import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/cart_item_tile.dart';
import '../widgets/price_tag.dart';
import 'checkout_screen.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Cart'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Consumer<CartProvider>(
        builder: (context, cart, _) {
          if (cart.isEmpty) {
            return _buildEmptyCart(context);
          }

          return Column(
            children: [
              // Restaurant name
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(
                    horizontal: AppTheme.spacingMd,
                    vertical: AppTheme.spacingSm),
                color: AppTheme.bgCardLight,
                child: Row(
                  children: [
                    const Icon(Icons.restaurant_rounded,
                        color: AppTheme.primary, size: 18),
                    const SizedBox(width: 8),
                    Text(
                      cart.restaurantName,
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const Spacer(),
                    TextButton(
                      onPressed: () {
                        _showClearCartDialog(context, cart);
                      },
                      child: const Text(
                        'Clear',
                        style: TextStyle(
                          color: AppTheme.error,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // Cart items
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.all(AppTheme.spacingMd),
                  itemCount: cart.items.length,
                  itemBuilder: (context, index) {
                    final item = cart.items[index];
                    return CartItemTile(
                      cartItem: item,
                      onQuantityChanged: (qty) {
                        cart.updateQuantity(item.menuItem.id, qty);
                      },
                      onRemove: () => cart.removeItem(item.menuItem.id),
                    );
                  },
                ),
              ),
              // Price breakdown & Checkout button
              Container(
                padding: const EdgeInsets.all(AppTheme.spacingMd),
                decoration: BoxDecoration(
                  color: AppTheme.bgCard,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(AppTheme.radiusXl),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.3),
                      blurRadius: 20,
                      offset: const Offset(0, -5),
                    ),
                  ],
                ),
                child: SafeArea(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Drag indicator
                      Container(
                        width: 40,
                        height: 4,
                        margin: const EdgeInsets.only(bottom: AppTheme.spacingMd),
                        decoration: BoxDecoration(
                          color: AppTheme.textMuted.withValues(alpha: 0.3),
                          borderRadius:
                              BorderRadius.circular(AppTheme.radiusFull),
                        ),
                      ),
                      PriceTag(label: 'Subtotal', amount: cart.subtotal),
                      PriceTag(
                          label: 'Delivery Fee', amount: cart.deliveryFee),
                      PriceTag(label: 'Tax', amount: cart.tax),
                      const Divider(
                          color: AppTheme.bgElevated, height: 20),
                      PriceTag(
                        label: 'Total',
                        amount: cart.total,
                        isTotal: true,
                      ),
                      const SizedBox(height: AppTheme.spacingMd),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => const CheckoutScreen(),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                          ),
                          child: Text(
                            'Proceed to Checkout  •  \$${cart.total.toStringAsFixed(2)}',
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildEmptyCart(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.primary.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.shopping_cart_outlined,
              color: AppTheme.primary,
              size: 56,
            ),
          ),
          const SizedBox(height: AppTheme.spacingLg),
          Text(
            'Your cart is empty',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          const Text(
            'Add items from a restaurant to get started',
            style: TextStyle(color: AppTheme.textSecondary, fontSize: 14),
          ),
          const SizedBox(height: AppTheme.spacingLg),
          ElevatedButton.icon(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.restaurant_menu_rounded),
            label: const Text('Browse Restaurants'),
          ),
        ],
      ),
    );
  }

  void _showClearCartDialog(BuildContext context, CartProvider cart) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.bgCard,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusLg),
        ),
        title: const Text('Clear Cart?',
            style: TextStyle(color: AppTheme.textPrimary)),
        content: const Text(
          'This will remove all items from your cart.',
          style: TextStyle(color: AppTheme.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child:
                const Text('Cancel', style: TextStyle(color: AppTheme.textMuted)),
          ),
          TextButton(
            onPressed: () {
              cart.clear();
              Navigator.pop(ctx);
            },
            child: const Text('Clear',
                style: TextStyle(color: AppTheme.error)),
          ),
        ],
      ),
    );
  }
}
