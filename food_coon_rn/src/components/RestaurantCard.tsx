import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Restaurant } from '../models/Restaurant';
import { isRestaurantOpen } from '../models/Restaurant';
import { Colors, FontSize, FontWeight, Radius, Shadows, Spacing } from '../theme/theme';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onTap: () => void;
}

export default function RestaurantCard({ restaurant, onTap }: RestaurantCardProps) {
  const open = isRestaurantOpen(restaurant);

  return (
    <Pressable
      onPress={onTap}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
    >
      {/* Cover Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: restaurant.coverUrl }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        {/* Gradient overlay */}
        <View style={styles.gradientOverlay} />

        {/* Open/Closed badge */}
        <View style={[styles.badge, { backgroundColor: open ? Colors.success + 'E6' : Colors.error + 'E6' }]}>
          <Text style={styles.badgeText}>{open ? 'Open' : 'Closed'}</Text>
        </View>

        {/* Rating badge */}
        <View style={styles.ratingBadge}>
          <Text style={styles.starText}>★</Text>
          <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
        <Text style={styles.description} numberOfLines={1}>{restaurant.description}</Text>

        <View style={styles.footer}>
          <View style={styles.cuisines}>
            {restaurant.cuisines.slice(0, 3).map((c) => (
              <View key={c} style={styles.cuisineTag}>
                <Text style={styles.cuisineText}>{c}</Text>
              </View>
            ))}
          </View>
          <View style={styles.hours}>
            <Text style={styles.clockIcon}>🕐</Text>
            <Text style={styles.hoursText}>
              {restaurant.openingTime} - {restaurant.closingTime}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.card,
  },
  imageContainer: {
    height: 160,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.bgCardLight,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
  },
  badge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  badgeText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.72)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    gap: 4,
  },
  starText: {
    fontSize: FontSize.sm,
    color: Colors.accentGold,
  },
  ratingText: {
    color: Colors.white,
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.semibold,
  },
  info: {
    padding: Spacing.md,
  },
  name: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Outfit_600SemiBold',
    marginBottom: 4,
  },
  description: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cuisines: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'nowrap',
  },
  cuisineTag: {
    backgroundColor: Colors.primary + '26',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    marginRight: 6,
  },
  cuisineText: {
    color: Colors.primaryLight,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  hours: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clockIcon: {
    fontSize: 12,
  },
  hoursText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
});
