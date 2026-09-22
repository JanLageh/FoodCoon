import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, FontWeight } from '../theme/theme';

interface PriceTagProps {
  label: string;
  amount: number;
  isTotal?: boolean;
}

export default function PriceTag({ label, amount, isTotal = false }: PriceTagProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, isTotal && styles.totalLabel]}>{label}</Text>
      <Text style={[styles.amount, isTotal && styles.totalAmount]}>
        ${amount.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  label: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontWeight: FontWeight.regular,
  },
  amount: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  totalLabel: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.bold,
  },
  totalAmount: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
});
