import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme/theme';
import { STATUS_PROGRESSION } from '../store/orderStore';

const STEP_LABELS: Record<string, string> = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  picked_up: 'On the Way',
  delivered: 'Delivered',
};

const STEP_ICONS: Record<string, string> = {
  placed: '📋',
  confirmed: '✅',
  preparing: '👨‍🍳',
  ready: '📦',
  picked_up: '🛵',
  delivered: '🎉',
};

interface OrderStatusStepperProps {
  statuses: readonly string[];
  currentIndex: number;
}

export default function OrderStatusStepper({ statuses, currentIndex }: OrderStatusStepperProps) {
  return (
    <View style={styles.container}>
      {statuses.map((status, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <View key={status} style={styles.step}>
            {/* Connector line */}
            {index < statuses.length - 1 && (
              <View style={[styles.connector, isDone && styles.connectorDone]} />
            )}

            {/* Step circle */}
            <View
              style={[
                styles.circle,
                isDone && styles.circleDone,
                isCurrent && styles.circleCurrent,
              ]}
            >
              <Text style={styles.circleIcon}>
                {isDone || isCurrent ? STEP_ICONS[status] : '○'}
              </Text>
            </View>

            {/* Label */}
            <View style={styles.labelContainer}>
              <Text
                style={[
                  styles.label,
                  isDone && styles.labelDone,
                  isCurrent && styles.labelCurrent,
                ]}
              >
                {STEP_LABELS[status] ?? status}
              </Text>
              {isCurrent && (
                <View style={styles.activeDot} />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  connector: {
    position: 'absolute',
    left: 16,
    top: 36,
    width: 2,
    height: Spacing.md + 16,
    backgroundColor: Colors.bgElevated,
    zIndex: 0,
  },
  connectorDone: {
    backgroundColor: Colors.primary,
  },
  circle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: Colors.bgElevated,
  },
  circleDone: {
    backgroundColor: Colors.primary + '33',
    borderColor: Colors.primary,
  },
  circleCurrent: {
    backgroundColor: Colors.primary + '22',
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  circleIcon: {
    fontSize: 16,
  },
  labelContainer: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    fontWeight: FontWeight.regular,
  },
  labelDone: {
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  labelCurrent: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});
