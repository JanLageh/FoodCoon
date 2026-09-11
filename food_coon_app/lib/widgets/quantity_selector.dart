import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class QuantitySelector extends StatelessWidget {
  final int quantity;
  final ValueChanged<int> onChanged;
  final bool compact;

  const QuantitySelector({
    super.key,
    required this.quantity,
    required this.onChanged,
    this.compact = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.primary.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(AppTheme.radiusSm),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildButton(
            icon: Icons.remove,
            onTap: () => onChanged(quantity - 1),
          ),
          Padding(
            padding: EdgeInsets.symmetric(
                horizontal: compact ? 10 : 16),
            child: Text(
              '$quantity',
              style: const TextStyle(
                color: AppTheme.primary,
                fontSize: 14,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          _buildButton(
            icon: Icons.add,
            onTap: () => onChanged(quantity + 1),
          ),
        ],
      ),
    );
  }

  Widget _buildButton(
      {required IconData icon, required VoidCallback onTap}) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppTheme.radiusSm),
        child: Padding(
          padding: const EdgeInsets.all(6),
          child: Icon(icon, size: 18, color: AppTheme.primary),
        ),
      ),
    );
  }
}
