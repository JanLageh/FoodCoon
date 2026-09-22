import React from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { CartItem } from '../models/CartItem';
import { cartItemTotalPrice } from '../models/CartItem';
import QuantitySelector from './QuantitySelector';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme/theme';

interface CartItemTileProps {
  cartItem: CartItem;
  onQuantityChanged: (qty: number) => void;
  onRemove: () => void;
}

export default function CartItemTile({ cartItem, onQuantityChanged, onRemove }: CartItemTileProps) {
  const confirmRemove = () =>
    Alert.alert('Remove Item', `Remove ${cartItem.menuItem.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: onRemove },
    ]);

  return (
    <View style={styles.tile}>
      <Image
        source={{ uri: cartItem.menuItem.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {cartItem.menuItem.name}
        </Text>
        <Text style={styles.price}>${cartItemTotalPrice(cartItem).toFixed(2)}</Text>
        <View style={styles.bottomRow}>
          <QuantitySelector
            quantity={cartItem.quantity}
            onChanged={onQuantityChanged}
          />
          <Pressable onPress={confirmRemove} hitSlop={8}>
            <Text style={styles.remove}>✕</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: Radius.sm,
    backgroundColor: Colors.bgCardLight,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  name: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    marginBottom: 4,
  },
  price: {
    fontSize: FontSize.base,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  remove: {
    color: Colors.error,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    padding: 4,
  },
});
