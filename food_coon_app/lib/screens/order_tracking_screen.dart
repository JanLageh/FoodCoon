import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/order_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/order_status_stepper.dart';

class OrderTrackingScreen extends StatefulWidget {
  const OrderTrackingScreen({super.key});

  @override
  State<OrderTrackingScreen> createState() => _OrderTrackingScreenState();
}

class _OrderTrackingScreenState extends State<OrderTrackingScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Order Tracking'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () {
            context.read<OrderProvider>().stopTracking();
            Navigator.of(context).popUntil((route) => route.isFirst);
          },
        ),
      ),
      body: Consumer<OrderProvider>(
        builder: (context, orderProvider, _) {
          final order = orderProvider.currentOrder;
          if (order == null) {
            return const Center(
              child: Text('No active order',
                  style: TextStyle(color: AppTheme.textMuted)),
            );
          }

          final isDelivered = orderProvider.currentStatusIndex ==
              orderProvider.statusProgression.length - 1;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppTheme.spacingMd),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Order ID & ETA
                Container(
                  padding: const EdgeInsets.all(AppTheme.spacingMd),
                  decoration: AppTheme.cardDecoration,
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Order #${order.id}',
                              style: Theme.of(context)
                                  .textTheme
                                  .headlineSmall,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '\$${order.total.toStringAsFixed(2)}',
                              style: const TextStyle(
                                color: AppTheme.primary,
                                fontSize: 18,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Animated ETA
                      AnimatedBuilder(
                        animation: _pulseController,
                        builder: (context, child) {
                          return Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 10),
                            decoration: BoxDecoration(
                              color: isDelivered
                                  ? AppTheme.success.withValues(alpha: 0.15)
                                  : AppTheme.primary.withValues(
                                      alpha: 0.1 +
                                          _pulseController.value * 0.1),
                              borderRadius: BorderRadius.circular(
                                  AppTheme.radiusMd),
                            ),
                            child: Column(
                              children: [
                                Icon(
                                  isDelivered
                                      ? Icons.check_circle_rounded
                                      : Icons.timer_rounded,
                                  color: isDelivered
                                      ? AppTheme.success
                                      : AppTheme.primary,
                                  size: 24,
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  isDelivered ? 'Done!' : _getETA(orderProvider.currentStatusIndex),
                                  style: TextStyle(
                                    color: isDelivered
                                        ? AppTheme.success
                                        : AppTheme.primary,
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppTheme.spacingLg),

                // Status Stepper
                Text('Order Status',
                    style: Theme.of(context).textTheme.headlineSmall),
                const SizedBox(height: AppTheme.spacingMd),
                Container(
                  padding: const EdgeInsets.all(AppTheme.spacingMd),
                  decoration: AppTheme.cardDecoration,
                  child: OrderStatusStepper(
                    statuses: orderProvider.statusProgression,
                    currentIndex: orderProvider.currentStatusIndex,
                  ),
                ),
                const SizedBox(height: AppTheme.spacingLg),

                // Driver Info (show when picked up)
                if (orderProvider.currentStatusIndex >= 4) ...[
                  Text('Your Driver',
                      style: Theme.of(context).textTheme.headlineSmall),
                  const SizedBox(height: AppTheme.spacingSm),
                  Container(
                    padding: const EdgeInsets.all(AppTheme.spacingMd),
                    decoration: AppTheme.cardDecoration,
                    child: Row(
                      children: [
                        Container(
                          width: 50,
                          height: 50,
                          decoration: BoxDecoration(
                            gradient: AppTheme.primaryGradient,
                            shape: BoxShape.circle,
                          ),
                          child: const Center(
                            child: Text(
                              'M',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 22,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: AppTheme.spacingMd),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Mike',
                                style: TextStyle(
                                  color: AppTheme.textPrimary,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                'Your delivery partner',
                                style: TextStyle(
                                  color: AppTheme.textSecondary,
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppTheme.success.withValues(alpha: 0.12),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.phone_rounded,
                              color: AppTheme.success, size: 22),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppTheme.spacingLg),
                ],

                // Delivery details
                Text('Delivery Details',
                    style: Theme.of(context).textTheme.headlineSmall),
                const SizedBox(height: AppTheme.spacingSm),
                Container(
                  padding: const EdgeInsets.all(AppTheme.spacingMd),
                  decoration: AppTheme.cardDecoration,
                  child: const Column(
                    children: [
                      _DetailRow(
                        icon: Icons.location_on_rounded,
                        label: 'Delivery Address',
                        value: '123 Main St, Brooklyn',
                      ),
                      SizedBox(height: 12),
                      _DetailRow(
                        icon: Icons.notes_rounded,
                        label: 'Notes',
                        value: 'Ring the bell',
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppTheme.spacingXl),
              ],
            ),
          );
        },
      ),
    );
  }

  String _getETA(int statusIndex) {
    switch (statusIndex) {
      case 0:
        return '~30 min';
      case 1:
        return '~25 min';
      case 2:
        return '~20 min';
      case 3:
        return '~10 min';
      case 4:
        return '~5 min';
      default:
        return 'Done!';
    }
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _DetailRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: AppTheme.primary, size: 20),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                    color: AppTheme.textMuted, fontSize: 12),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: const TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
