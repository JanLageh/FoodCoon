import React, { useEffect, useRef } from 'react';
import {
  Animated,
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
import { useOrderStore, STATUS_PROGRESSION } from '../store/orderStore';
import OrderStatusStepper from '../components/OrderStatusStepper';
import { Colors, FontSize, FontWeight, Radius, Shadows, Spacing } from '../theme/theme';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'OrderTracking'>;

function getETA(statusIndex: number): string {
  const etas = ['~30 min', '~25 min', '~20 min', '~10 min', '~5 min', 'Done!'];
  return etas[statusIndex] ?? 'Done!';
}

export default function OrderTrackingScreen() {
  const navigation = useNavigation<NavProp>();
  const { currentOrder, currentStatusIndex, stopTracking } = useOrderStore();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [pulseAnim]);

  const isDelivered = currentStatusIndex === STATUS_PROGRESSION.length - 1;

  const etaBgOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.22],
  });

  const handleBack = () => {
    stopTracking();
    navigation.navigate('Home');
  };

  if (!currentOrder) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: Colors.textMuted, fontSize: FontSize.base }}>
            No active order
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={8}>
          <Text style={styles.backBtn}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Order ID + ETA ─── */}
        <View style={styles.orderCard}>
          <View style={styles.orderCardLeft}>
            <Text style={styles.orderId}>Order #{currentOrder.id}</Text>
            <Text style={styles.orderTotal}>${currentOrder.total.toFixed(2)}</Text>
          </View>

          {/* Animated ETA box */}
          <Animated.View
            style={[
              styles.etaBox,
              {
                backgroundColor: isDelivered
                  ? Colors.success + '26'
                  : pulseAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [Colors.primary + '1A', Colors.primary + '38'],
                    }),
              },
            ]}
          >
            <Text style={styles.etaIcon}>{isDelivered ? '✅' : '⏱️'}</Text>
            <Text style={[styles.etaText, { color: isDelivered ? Colors.success : Colors.primary }]}>
              {isDelivered ? 'Done!' : getETA(currentStatusIndex)}
            </Text>
          </Animated.View>
        </View>

        {/* ─── Status Stepper ─── */}
        <Text style={styles.sectionTitle}>Order Status</Text>
        <View style={styles.card}>
          <OrderStatusStepper
            statuses={STATUS_PROGRESSION}
            currentIndex={currentStatusIndex}
          />
        </View>

        {/* ─── Driver Info (shown when picked up) ─── */}
        {currentStatusIndex >= 4 && (
          <>
            <Text style={styles.sectionTitle}>Your Driver</Text>
            <View style={[styles.card, styles.driverCard]}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverAvatarText}>M</Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>Mike</Text>
                <Text style={styles.driverSub}>Your delivery partner</Text>
              </View>
              <View style={styles.callBtn}>
                <Text style={{ fontSize: 20 }}>📞</Text>
              </View>
            </View>
          </>
        )}

        {/* ─── Delivery Details ─── */}
        <Text style={styles.sectionTitle}>Delivery Details</Text>
        <View style={styles.card}>
          <DetailRow icon="📍" label="Delivery Address" value="123 Main St, Brooklyn" />
          <View style={{ height: 12 }} />
          <DetailRow icon="📝" label="Notes" value="Ring the bell" />
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={detailStyles.row}>
      <Text style={detailStyles.icon}>{icon}</Text>
      <View style={detailStyles.info}>
        <Text style={detailStyles.label}>{label}</Text>
        <Text style={detailStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 2,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  value: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
});

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
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadows.card,
    marginBottom: Spacing.sm,
  },
  orderCardLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: FontSize.lg,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  etaBox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 80,
  },
  etaIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  etaText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadows.card,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  driverAvatarText: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: FontWeight.bold,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
  driverSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.success + '1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
