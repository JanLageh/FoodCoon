import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../providers/order_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/price_tag.dart';
import 'order_tracking_screen.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen>
    with SingleTickerProviderStateMixin {
  String _selectedPayment = 'card';
  bool _orderPlaced = false;
  late AnimationController _animController;
  late Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _scaleAnim = CurvedAnimation(
      parent: _animController,
      curve: Curves.elasticOut,
    );
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();
    final orderProvider = context.watch<OrderProvider>();

    if (_orderPlaced) {
      return _buildSuccessScreen(context, orderProvider);
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Checkout'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppTheme.spacingMd),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Delivery Address
            Text('Delivery Address',
                style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: AppTheme.spacingSm),
            Container(
              padding: const EdgeInsets.all(AppTheme.spacingMd),
              decoration: AppTheme.cardDecoration,
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppTheme.primary.withValues(alpha: 0.12),
                      borderRadius:
                          BorderRadius.circular(AppTheme.radiusSm),
                    ),
                    child: const Icon(Icons.location_on_rounded,
                        color: AppTheme.primary, size: 24),
                  ),
                  const SizedBox(width: AppTheme.spacingMd),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Home',
                          style: TextStyle(
                            color: AppTheme.textPrimary,
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          '123 Main St, Brooklyn',
                          style: TextStyle(
                            color: AppTheme.textSecondary,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.check_circle_rounded,
                      color: AppTheme.success, size: 22),
                ],
              ),
            ),
            const SizedBox(height: AppTheme.spacingLg),

            // Order Summary
            Text('Order Summary',
                style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: AppTheme.spacingSm),
            Container(
              padding: const EdgeInsets.all(AppTheme.spacingMd),
              decoration: AppTheme.cardDecoration,
              child: Column(
                children: [
                  Row(
                    children: [
                      const Icon(Icons.restaurant_rounded,
                          color: AppTheme.primary, size: 18),
                      const SizedBox(width: 8),
                      Text(
                        cart.restaurantName,
                        style: const TextStyle(
                          color: AppTheme.textPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ...cart.items.map(
                    (item) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        children: [
                          Text(
                            '${item.quantity}x',
                            style: const TextStyle(
                              color: AppTheme.primary,
                              fontWeight: FontWeight.w600,
                              fontSize: 13,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              item.menuItem.name,
                              style: const TextStyle(
                                color: AppTheme.textSecondary,
                                fontSize: 14,
                              ),
                            ),
                          ),
                          Text(
                            '\$${item.totalPrice.toStringAsFixed(2)}',
                            style: const TextStyle(
                              color: AppTheme.textPrimary,
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const Divider(
                      color: AppTheme.bgElevated, height: 24),
                  PriceTag(label: 'Subtotal', amount: cart.subtotal),
                  PriceTag(
                      label: 'Delivery Fee', amount: cart.deliveryFee),
                  PriceTag(label: 'Tax', amount: cart.tax),
                  const Divider(
                      color: AppTheme.bgElevated, height: 16),
                  PriceTag(
                    label: 'Total',
                    amount: cart.total,
                    isTotal: true,
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppTheme.spacingLg),

            // Payment Method
            Text('Payment Method',
                style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: AppTheme.spacingSm),
            _buildPaymentOption(
              icon: Icons.credit_card_rounded,
              label: 'Credit / Debit Card',
              subtitle: '•••• 4242',
              value: 'card',
            ),
            const SizedBox(height: 8),
            _buildPaymentOption(
              icon: Icons.account_balance_wallet_rounded,
              label: 'Digital Wallet',
              subtitle: 'Pay with wallet',
              value: 'wallet',
            ),
            const SizedBox(height: 8),
            _buildPaymentOption(
              icon: Icons.money_rounded,
              label: 'Cash on Delivery',
              subtitle: 'Pay when delivered',
              value: 'cash',
            ),
            const SizedBox(height: AppTheme.spacingXl),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(AppTheme.spacingMd),
        decoration: BoxDecoration(
          color: AppTheme.bgCard,
          border: Border(
            top:
                BorderSide(color: Colors.white.withValues(alpha: 0.06)),
          ),
        ),
        child: SafeArea(
          child: SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: orderProvider.isPlacingOrder
                  ? null
                  : () => _placeOrder(context),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: orderProvider.isPlacingOrder
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : Text(
                      'Place Order  •  \$${cart.total.toStringAsFixed(2)}'),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPaymentOption({
    required IconData icon,
    required String label,
    required String subtitle,
    required String value,
  }) {
    final isSelected = _selectedPayment == value;
    return GestureDetector(
      onTap: () => setState(() => _selectedPayment = value),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(AppTheme.spacingMd),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primary.withValues(alpha: 0.08)
              : AppTheme.bgCard,
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          border: Border.all(
            color: isSelected
                ? AppTheme.primary
                : Colors.white.withValues(alpha: 0.06),
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          children: [
            Icon(icon,
                color: isSelected ? AppTheme.primary : AppTheme.textMuted,
                size: 24),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 14,
                      fontWeight:
                          isSelected ? FontWeight.w600 : FontWeight.w400,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: const TextStyle(
                        color: AppTheme.textMuted, fontSize: 12),
                  ),
                ],
              ),
            ),
            Icon(
              isSelected
                  ? Icons.radio_button_checked_rounded
                  : Icons.radio_button_off_rounded,
              color: isSelected ? AppTheme.primary : AppTheme.textMuted,
              size: 22,
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _placeOrder(BuildContext context) async {
    final cart = context.read<CartProvider>();
    final orderProvider = context.read<OrderProvider>();

    final order = await orderProvider.placeOrder(
      restaurantId: cart.restaurantId!,
      cartItems: cart.items,
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      tax: cart.tax,
      total: cart.total,
    );

    if (order != null && mounted) {
      cart.clear();
      setState(() => _orderPlaced = true);
      _animController.forward();
    }
  }

  Widget _buildSuccessScreen(
      BuildContext context, OrderProvider orderProvider) {
    return Scaffold(
      body: Center(
        child: ScaleTransition(
          scale: _scaleAnim,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppTheme.success.withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.check_circle_rounded,
                  color: AppTheme.success,
                  size: 72,
                ),
              ),
              const SizedBox(height: AppTheme.spacingLg),
              Text(
                'Order Placed! 🎉',
                style: Theme.of(context).textTheme.headlineLarge,
              ),
              const SizedBox(height: 8),
              const Text(
                'Your order has been placed successfully.\nSit back and relax!',
                textAlign: TextAlign.center,
                style: TextStyle(
                    color: AppTheme.textSecondary, fontSize: 15),
              ),
              const SizedBox(height: AppTheme.spacingXl),
              ElevatedButton.icon(
                onPressed: () {
                  if (orderProvider.currentOrder != null) {
                    orderProvider
                        .startOrderTracking(orderProvider.currentOrder!);
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const OrderTrackingScreen(),
                      ),
                    );
                  }
                },
                icon: const Icon(Icons.delivery_dining_rounded),
                label: const Text('Track Order'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 32, vertical: 14),
                ),
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: () {
                  Navigator.of(context)
                      .popUntil((route) => route.isFirst);
                },
                child: const Text(
                  'Back to Home',
                  style: TextStyle(color: AppTheme.textSecondary),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
