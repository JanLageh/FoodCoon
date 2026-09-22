import React, { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
import PriceTag from '../components/PriceTag';
import { Colors, FontSize, FontWeight, Radius, Shadows, Spacing } from '../theme/theme';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Checkout'>;

type PaymentMethod = 'card' | 'wallet' | 'cash';

const PAYMENT_OPTIONS: { icon: string; label: string; subtitle: string; value: PaymentMethod }[] = [
  { icon: '💳', label: 'Credit / Debit Card', subtitle: '•••• 4242', value: 'card' },
  { icon: '👛', label: 'Digital Wallet', subtitle: 'Pay with wallet', value: 'wallet' },
  { icon: '💵', label: 'Cash on Delivery', subtitle: 'Pay when delivered', value: 'cash' },
];

export default function CheckoutScreen() {
  const navigation = useNavigation<NavProp>();
  const cartStore = useCartStore();
  const orderStore = useOrderStore();

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('card');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const handlePlaceOrder = async () => {
    const order = await orderStore.placeOrder({
      restaurantId: cartStore.restaurantId!,
      cartItems: cartStore.items,
      subtotal: cartStore.subtotal(),
      deliveryFee: cartStore.deliveryFee(),
      tax: cartStore.tax(),
      total: cartStore.total(),
    });

    if (order) {
      cartStore.clear();
      setOrderPlaced(true);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  if (orderPlaced) {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.successContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.successIconCircle}>
            <Text style={{ fontSize: 60 }}>✅</Text>
          </View>
          <Text style={styles.successTitle}>Order Placed! 🎉</Text>
          <Text style={styles.successSubtitle}>
            Your order has been placed successfully.{'\n'}Sit back and relax!
          </Text>

          <Pressable
            style={styles.trackBtn}
            onPress={() => {
              if (orderStore.currentOrder) {
                orderStore.startOrderTracking(orderStore.currentOrder);
                navigation.replace('OrderTracking');
              }
            }}
          >
            <Text style={styles.trackBtnText}>🛵  Track Order</Text>
          </Pressable>

          <Pressable
            style={styles.homeLink}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.homeLinkText}>Back to Home</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.backBtn}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address */}
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <View style={styles.card}>
          <View style={styles.locationIconBox}>
            <Text style={{ fontSize: 22 }}>📍</Text>
          </View>
          <View style={styles.addressInfo}>
            <Text style={styles.addressTitle}>Home</Text>
            <Text style={styles.addressSub}>123 Main St, Brooklyn</Text>
          </View>
          <Text style={{ fontSize: 20 }}>✅</Text>
        </View>

        {/* Order Summary */}
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.card}>
          <View style={styles.restaurantRow}>
            <Text style={{ fontSize: 16 }}>🍽️</Text>
            <Text style={styles.restaurantName}> {cartStore.restaurantName}</Text>
          </View>
          <View style={styles.orderItemsDivider} />
          {cartStore.items.map((item) => (
            <View key={item.menuItem.id} style={styles.orderItemRow}>
              <Text style={styles.orderItemQty}>{item.quantity}x</Text>
              <Text style={styles.orderItemName}>{item.menuItem.name}</Text>
              <Text style={styles.orderItemPrice}>
                ${(item.menuItem.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <PriceTag label="Subtotal" amount={cartStore.subtotal()} />
          <PriceTag label="Delivery Fee" amount={cartStore.deliveryFee()} />
          <PriceTag label="Tax" amount={cartStore.tax()} />
          <View style={styles.divider} />
          <PriceTag label="Total" amount={cartStore.total()} isTotal />
        </View>

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {PAYMENT_OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            style={[
              styles.paymentOption,
              selectedPayment === opt.value && styles.paymentOptionSelected,
            ]}
            onPress={() => setSelectedPayment(opt.value)}
          >
            <Text style={styles.paymentIcon}>{opt.icon}</Text>
            <View style={styles.paymentInfo}>
              <Text
                style={[
                  styles.paymentLabel,
                  selectedPayment === opt.value && styles.paymentLabelSelected,
                ]}
              >
                {opt.label}
              </Text>
              <Text style={styles.paymentSub}>{opt.subtitle}</Text>
            </View>
            <Text
              style={{
                fontSize: 18,
                color: selectedPayment === opt.value ? Colors.primary : Colors.textMuted,
              }}
            >
              {selectedPayment === opt.value ? '🔘' : '⚪'}
            </Text>
          </Pressable>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <SafeAreaView edges={['bottom']}>
          <Pressable
            style={({ pressed }) => [
              styles.placeOrderBtn,
              orderStore.isPlacingOrder && styles.placeOrderBtnDisabled,
              pressed && { opacity: 0.85 },
            ]}
            onPress={handlePlaceOrder}
            disabled={orderStore.isPlacingOrder}
          >
            {orderStore.isPlacingOrder ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.placeOrderBtnText}>
                Place Order  •  ${cartStore.total().toFixed(2)}
              </Text>
            )}
          </Pressable>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bgCardLight,
  },
  backBtn: {
    fontSize: 24,
    color: Colors.textPrimary,
    width: 32,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadows.card,
    flexDirection: undefined,
  },
  locationIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary + '1F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    flexDirection: 'row' as any,
  },
  addressInfo: {
    flex: 1,
  },
  addressTitle: {
    fontSize: FontSize.base + 1,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
  addressSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
  orderItemsDivider: {
    height: 1,
    backgroundColor: Colors.bgElevated,
    marginBottom: 12,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  orderItemQty: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.sm,
    width: 28,
  },
  orderItemName: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.base,
  },
  orderItemPrice: {
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.bgElevated,
    marginVertical: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    ...Shadows.card,
  },
  paymentOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '14',
  },
  paymentIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontWeight: FontWeight.regular,
  },
  paymentLabelSelected: {
    fontWeight: FontWeight.semibold,
  },
  paymentSub: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  footer: {
    backgroundColor: Colors.bgCard,
    padding: Spacing.md,
    paddingBottom: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  placeOrderBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.elevated,
  },
  placeOrderBtnDisabled: {
    opacity: 0.7,
  },
  placeOrderBtnText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  // Success screen
  successContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  successIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.success + '26',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    fontFamily: 'Outfit_700Bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  trackBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl + 8,
    paddingVertical: 14,
    borderRadius: Radius.md,
    ...Shadows.elevated,
    marginBottom: 12,
  },
  trackBtnText: {
    color: Colors.white,
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.base,
  },
  homeLink: {
    padding: 8,
  },
  homeLinkText: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
  },
});
