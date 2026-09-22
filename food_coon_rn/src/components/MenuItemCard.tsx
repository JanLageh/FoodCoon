import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { MenuItem } from '../models/MenuItem';
import QuantitySelector from './QuantitySelector';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme/theme';

interface MenuItemCardProps {
  menuItem: MenuItem;
  quantity: number;
  onAdd: () => void;
  onQuantityChanged: (qty: number) => void;
}

export default function MenuItemCard({
  menuItem,
  quantity,
  onAdd,
  onQuantityChanged,
}: MenuItemCardProps) {
  return (
    <View style={styles.card}>
      {/* Food image */}
      <Image
        source={{ uri: menuItem.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Info */}
      <View style={styles.info}>
        {/* Veg/Non-veg indicator + name */}
        <View style={styles.nameRow}>
          <View
            style={[
              styles.vegIndicatorOuter,
              { borderColor: menuItem.isVeg ? Colors.vegGreen : Colors.nonVegRed },
            ]}
          >
            <View
              style={[
                styles.vegIndicatorDot,
                { backgroundColor: menuItem.isVeg ? Colors.vegGreen : Colors.nonVegRed },
              ]}
            />
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {menuItem.name}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {menuItem.description}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>${menuItem.price.toFixed(2)}</Text>

          {!menuItem.isAvailable ? (
            <View style={styles.unavailableBadge}>
              <Text style={styles.unavailableText}>Unavailable</Text>
            </View>
          ) : quantity > 0 ? (
            <QuantitySelector quantity={quantity} onChanged={onQuantityChanged} />
          ) : (
            <Pressable
              style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.75 }]}
              onPress={onAdd}
            >
              <Text style={styles.addBtnText}>ADD</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: Radius.sm,
    backgroundColor: Colors.bgCardLight,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  vegIndicatorOuter: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  vegIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  name: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  unavailableBadge: {
    backgroundColor: Colors.error + '26',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  unavailableText: {
    color: Colors.error,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  addBtnText: {
    color: Colors.white,
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
});
