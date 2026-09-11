import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class PriceTag extends StatelessWidget {
  final String label;
  final double amount;
  final bool isTotal;
  final bool isDiscount;

  const PriceTag({
    super.key,
    required this.label,
    required this.amount,
    this.isTotal = false,
    this.isDiscount = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: isTotal ? AppTheme.textPrimary : AppTheme.textSecondary,
              fontSize: isTotal ? 16 : 14,
              fontWeight: isTotal ? FontWeight.w700 : FontWeight.w400,
            ),
          ),
          Text(
            '${isDiscount ? '-' : ''}\$${amount.toStringAsFixed(2)}',
            style: TextStyle(
              color: isDiscount
                  ? AppTheme.success
                  : isTotal
                      ? AppTheme.primary
                      : AppTheme.textPrimary,
              fontSize: isTotal ? 18 : 14,
              fontWeight: isTotal ? FontWeight.w700 : FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
