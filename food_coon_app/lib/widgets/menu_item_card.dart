import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/menu_item.dart';
import '../theme/app_theme.dart';
import 'quantity_selector.dart';

class MenuItemCard extends StatelessWidget {
  final MenuItem menuItem;
  final int quantity;
  final VoidCallback onAdd;
  final ValueChanged<int> onQuantityChanged;

  const MenuItemCard({
    super.key,
    required this.menuItem,
    required this.quantity,
    required this.onAdd,
    required this.onQuantityChanged,
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image
          ClipRRect(
            borderRadius: BorderRadius.circular(AppTheme.radiusSm),
            child: CachedNetworkImage(
              imageUrl: menuItem.imageUrl,
              width: 90,
              height: 90,
              fit: BoxFit.cover,
              placeholder: (context, url) => Container(
                width: 90,
                height: 90,
                color: AppTheme.bgCardLight,
                child: const Icon(Icons.fastfood,
                    color: AppTheme.textMuted, size: 28),
              ),
              errorWidget: (context, url, error) => Container(
                width: 90,
                height: 90,
                color: AppTheme.bgCardLight,
                child: const Icon(Icons.fastfood,
                    color: AppTheme.textMuted, size: 28),
              ),
            ),
          ),
          const SizedBox(width: AppTheme.spacingMd),
          // Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    // Veg/Non-Veg indicator
                    Container(
                      width: 16,
                      height: 16,
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: menuItem.isVeg
                              ? AppTheme.vegGreen
                              : AppTheme.nonVegRed,
                          width: 1.5,
                        ),
                        borderRadius: BorderRadius.circular(3),
                      ),
                      child: Center(
                        child: Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: menuItem.isVeg
                                ? AppTheme.vegGreen
                                : AppTheme.nonVegRed,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        menuItem.name,
                        style: Theme.of(context).textTheme.titleLarge,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  menuItem.description,
                  style: Theme.of(context).textTheme.bodySmall,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: AppTheme.spacingSm),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '\$${menuItem.price.toStringAsFixed(2)}',
                      style: const TextStyle(
                        color: AppTheme.primary,
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    if (!menuItem.isAvailable)
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppTheme.error.withValues(alpha: 0.15),
                          borderRadius:
                              BorderRadius.circular(AppTheme.radiusFull),
                        ),
                        child: const Text(
                          'Unavailable',
                          style: TextStyle(
                            color: AppTheme.error,
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      )
                    else if (quantity > 0)
                      QuantitySelector(
                        quantity: quantity,
                        onChanged: onQuantityChanged,
                      )
                    else
                      _AddButton(onTap: onAdd),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _AddButton extends StatelessWidget {
  final VoidCallback onTap;

  const _AddButton({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppTheme.primary,
      borderRadius: BorderRadius.circular(AppTheme.radiusSm),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppTheme.radiusSm),
        child: const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          child: Text(
            'ADD',
            style: TextStyle(
              color: Colors.white,
              fontSize: 13,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.5,
            ),
          ),
        ),
      ),
    );
  }
}
