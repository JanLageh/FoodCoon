import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class OrderStatusStepper extends StatelessWidget {
  final List<String> statuses;
  final int currentIndex;

  const OrderStatusStepper({
    super.key,
    required this.statuses,
    required this.currentIndex,
  });

  static const Map<String, IconData> _statusIcons = {
    'placed': Icons.receipt_long_rounded,
    'confirmed': Icons.check_circle_outline_rounded,
    'preparing': Icons.restaurant_rounded,
    'ready': Icons.takeout_dining_rounded,
    'picked_up': Icons.delivery_dining_rounded,
    'delivered': Icons.home_rounded,
  };

  static const Map<String, String> _statusLabels = {
    'placed': 'Placed',
    'confirmed': 'Confirmed',
    'preparing': 'Preparing',
    'ready': 'Ready',
    'picked_up': 'On the Way',
    'delivered': 'Delivered',
  };

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(statuses.length, (index) {
        final isCompleted = index <= currentIndex;
        final isCurrent = index == currentIndex;
        final isLast = index == statuses.length - 1;
        final status = statuses[index];

        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon and Line
            Column(
              children: [
                AnimatedContainer(
                  duration: const Duration(milliseconds: 400),
                  curve: Curves.easeOut,
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: isCompleted
                        ? (isCurrent
                            ? AppTheme.primary
                            : AppTheme.success)
                        : AppTheme.bgCardLight,
                    shape: BoxShape.circle,
                    boxShadow: isCurrent
                        ? [
                            BoxShadow(
                              color: AppTheme.primary.withValues(alpha: 0.4),
                              blurRadius: 12,
                              spreadRadius: 2,
                            ),
                          ]
                        : null,
                  ),
                  child: Icon(
                    _statusIcons[status] ?? Icons.circle,
                    color: isCompleted ? Colors.white : AppTheme.textMuted,
                    size: 20,
                  ),
                ),
                if (!isLast)
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 400),
                    width: 2,
                    height: 32,
                    color: index < currentIndex
                        ? AppTheme.success
                        : AppTheme.bgCardLight,
                  ),
              ],
            ),
            const SizedBox(width: AppTheme.spacingMd),
            // Label
            Expanded(
              child: Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _statusLabels[status] ?? status,
                      style: TextStyle(
                        color: isCompleted
                            ? AppTheme.textPrimary
                            : AppTheme.textMuted,
                        fontSize: 15,
                        fontWeight:
                            isCurrent ? FontWeight.w600 : FontWeight.w400,
                      ),
                    ),
                    if (isCurrent)
                      Padding(
                        padding: const EdgeInsets.only(top: 2),
                        child: Text(
                          _getSubtitle(status),
                          style: const TextStyle(
                            color: AppTheme.textSecondary,
                            fontSize: 12,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ],
        );
      }),
    );
  }

  String _getSubtitle(String status) {
    switch (status) {
      case 'placed':
        return 'Waiting for restaurant confirmation...';
      case 'confirmed':
        return 'Restaurant accepted your order';
      case 'preparing':
        return 'Your food is being prepared';
      case 'ready':
        return 'Waiting for driver pickup';
      case 'picked_up':
        return 'Driver is on the way to you';
      case 'delivered':
        return 'Enjoy your meal! 🎉';
      default:
        return '';
    }
  }
}
