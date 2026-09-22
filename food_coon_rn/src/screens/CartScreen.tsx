import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useCartStore } from '../store/cartStore';
import CartItemTile from '../components/CartItemTile';
import PriceTag from '../components/PriceTag';
import { Colors, FontSize, FontWeight, Radius, Shadows, Spacing } from '../theme/theme';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Cart'>;

export default function CartScreen() {
  const navigation = useNavigation<NavProp>();
  const cartStore = useCartStore();

  const items = cartStore.items;
  const isEmpty = cartStore.isEmpty();

  const handleClearCart = () => {
    Alert.alert('Clear Cart?', 'This will remove all items from your cart.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => cartStore.clear() },
    ]);
  };

  if (isEmpty) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <Text style={styles.backBtn}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Empty state */}
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Text style={{ fontSize: 48 }}>🛒</Text>
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add items from a restaurant to get started</Text>
          <Pressable
            style={styles.browseBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.browseBtnText}>🍴  Browse Restaurants</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.backBtn}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Restaurant name bar */}
      <View style={styles.restaurantBar}>
        <Text style={{ fontSize: 16, marginRight: 6 }}>🍽️</Text>
        <Text style={styles.restaurantName}>{cartStore.restaurantName}</Text>
        <Pressable onPress={handleClearCart} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Clear</Text>
        </Pressable>
      </View>

      {/* Cart Items */}
      <ScrollView
        style={styles.itemsList}
        contentContainerStyle={{ padding: Spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <CartItemTile
            key={item.menuItem.id}
            cartItem={item}
            onQuantityChanged={(qty) => cartStore.updateQuantity(item.menuItem.id, qty)}
            onRemove={() => cartStore.removeItem(item.menuItem.id)}
          />
        ))}
        <View style={{ height: 240 }} />
      </ScrollView>

      {/* Price breakdown + Checkout button */}
      <View style={styles.summary}>
        <View style={styles.dragHandle} />

        <PriceTag label="Subtotal" amount={cartStore.subtotal()} />
        <PriceTag label="Delivery Fee" amount={cartStore.deliveryFee()} />
        <PriceTag label="Tax" amount={cartStore.tax()} />
        <View style={styles.divider} />
        <PriceTag label="Total" amount={cartStore.total()} isTotal />

        <Pressable
          style={({ pressed }) => [styles.checkoutBtn, pressed && { opacity: 0.85 }]}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutBtnText}>
            Proceed to Checkout  •  ${cartStore.total().toFixed(2)}
          </Text>
        </Pressable>
        <SafeAreaView edges={['bottom']} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgDark,
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
  restaurantBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCardLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  restaurantName: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    color: Colors.error,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  itemsList: {
    flex: 1,
  },
  summary: {
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.md,
    paddingBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.textMuted + '4D',
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.bgElevated,
    marginVertical: 8,
  },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.elevated,
  },
  checkoutBtnText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary + '1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  browseBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
    borderRadius: Radius.md,
  },
  browseBtnText: {
    color: Colors.white,
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.base,
  },
});
