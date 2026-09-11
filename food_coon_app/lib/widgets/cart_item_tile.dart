import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../theme/app_theme.dart';
import 'quantity_selector.dart';

class CartItemTile extends StatelessWidget {
  final CartItem cartItem;
  final ValueChanged<int> onQuantityChanged;
  final VoidCallback onRemove;

  const CartItemTile({
    super.key,
    required this.cartItem,
    required this.onQuantityChanged,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppTheme.spacingSm),
      padding: const EdgeInsets.all(AppTheme.spacingMd),
      decoration: BoxDecoration(
        color: AppTheme.bgCard,
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Row(
        children: [
          // Veg/Non-Veg dot
          Container(
            width: 14,
            height: 14,
            decoration: BoxDecoration(
              border: Border.all(
                color: cartItem.menuItem.isVeg
                    ? AppTheme.vegGreen
                    : AppTheme.nonVegRed,
                width: 1.5,
              ),
              borderRadius: BorderRadius.circular(3),
            ),
            child: Center(
              child: Container(
                width: 7,
                height: 7,
                decoration: BoxDecoration(
                  color: cartItem.menuItem.isVeg
                      ? AppTheme.vegGreen
                      : AppTheme.nonVegRed,
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),
          // Name & Price
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  cartItem.menuItem.name,
                  style: Theme.of(context).textTheme.titleMedium,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  '\$${cartItem.totalPrice.toStringAsFixed(2)}',
                  style: const TextStyle(
                    color: AppTheme.primary,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          // Quantity selector
          QuantitySelector(
            quantity: cartItem.quantity,
            onChanged: onQuantityChanged,
          ),
        ],
      ),
    );
  }
}
