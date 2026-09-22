import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme/theme';

interface QuantitySelectorProps {
  quantity: number;
  onChanged: (qty: number) => void;
}

export default function QuantitySelector({ quantity, onChanged }: QuantitySelectorProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.btn, pressed && { opacity: 0.7 }]}
        onPress={() => onChanged(quantity - 1)}
        hitSlop={8}
      >
        <Text style={styles.btnText}>−</Text>
      </Pressable>
      <Text style={styles.qty}>{quantity}</Text>
      <Pressable
        style={({ pressed }) => [styles.btn, pressed && { opacity: 0.7 }]}
        onPress={() => onChanged(quantity + 1)}
        hitSlop={8}
      >
        <Text style={styles.btnText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCardLight,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  btn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  btnText: {
    fontSize: FontSize.md,
    color: Colors.white,
    fontWeight: FontWeight.bold,
    lineHeight: 20,
  },
  qty: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    paddingHorizontal: Spacing.xs,
  },
});
