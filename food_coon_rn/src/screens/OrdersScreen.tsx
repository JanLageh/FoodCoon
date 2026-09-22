import React, { useEffect } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useOrderStore } from '../store/orderStore';
import ShimmerLoading from '../components/ShimmerLoading';
import { orderStatusLabel } from '../models/Order';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme/theme';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Orders'>;

function statusColor(status: string): string {
  switch (status) {
    case 'delivered': return Colors.success;
    case 'cancelled': return Colors.error;
    case 'placed':
    case 'confirmed': return Colors.info;
    default: return Colors.warning;
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} at ${h}:${m}`;
  } catch {
    return iso;
  }
}

export default function OrdersScreen() {
  const navigation = useNavigation<NavProp>();
  const { orders, isLoading, error, fetchOrders, startOrderTracking } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.backBtn}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 32 }} />
      </View>

      {isLoading ? (
        <View style={{ padding: Spacing.md }}>
          <ShimmerLoading itemCount={5} type="orderCard" />
        </View>
      ) : error ? (
        <View style={styles.stateContainer}>
          <Text style={{ fontSize: 40, marginBottom: Spacing.md }}>⚠️</Text>
          <Text style={styles.stateTitle}>Failed to load orders</Text>
          <Pressable style={styles.retryBtn} onPress={fetchOrders}>
            <Text style={styles.retryBtnText}>↺  Retry</Text>
          </Pressable>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.stateContainer}>
          <View style={styles.stateIconCircle}>
            <Text style={{ fontSize: 48 }}>📋</Text>
          </View>
          <Text style={styles.stateTitle}>No orders yet</Text>
          <Text style={styles.stateSubtitle}>Your order history will appear here</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: Spacing.md }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchOrders}
              tintColor={Colors.primary}
            />
          }
        >
          {orders.map((order) => {
            const sc = statusColor(order.status);
            return (
              <Pressable
                key={order.id}
                style={({ pressed }) => [styles.orderCard, pressed && { opacity: 0.85 }]}
                onPress={() => {
                  startOrderTracking(order);
                  navigation.navigate('OrderTracking');
                }}
              >
                {/* Order ID + Status */}
                <View style={styles.orderRow}>
                  <Text style={styles.orderId}>Order #{order.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: sc + '26' }]}>
                    <Text style={[styles.statusText, { color: sc }]}>
                      {orderStatusLabel(order.status)}
                    </Text>
                  </View>
                </View>

                {/* Restaurant + Total */}
                <View style={styles.orderRow}>
                  <Text style={styles.orderMeta}>🍽️  Restaurant #{order.restaurantId}</Text>
                  <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                </View>

                {/* Date */}
                <View style={styles.orderRow}>
                  <Text style={styles.orderDate}>📅  {formatDate(order.createdAt)}</Text>
                  <Text style={styles.chevron}>›</Text>
                </View>
              </Pressable>
            );
          })}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
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
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  stateIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary + '1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  stateTitle: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    marginBottom: 8,
  },
  stateSubtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
    borderRadius: Radius.md,
  },
  retryBtnText: {
    color: Colors.white,
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.base,
  },
  orderCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 8,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderId: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  orderMeta: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  orderTotal: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  orderDate: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  chevron: {
    fontSize: 18,
    color: Colors.textMuted,
  },
});
