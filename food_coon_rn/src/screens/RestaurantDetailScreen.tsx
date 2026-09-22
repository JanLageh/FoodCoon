import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useMenuStore } from '../store/menuStore';
import { useCartStore } from '../store/cartStore';
import MenuItemCard from '../components/MenuItemCard';
import ShimmerLoading from '../components/ShimmerLoading';
import { isRestaurantOpen } from '../models/Restaurant';
import { Colors, FontSize, FontWeight, Radius, Shadows, Spacing } from '../theme/theme';

type RouteProps = NativeStackScreenProps<RootStackParamList, 'RestaurantDetail'>['route'];
type NavProp = NativeStackNavigationProp<RootStackParamList, 'RestaurantDetail'>;

export default function RestaurantDetailScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProp>();
  const { restaurant } = route.params;
  const open = isRestaurantOpen(restaurant);

  const menuStore = useMenuStore();
  const cartStore = useCartStore();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  useEffect(() => {
    menuStore.fetchMenu(restaurant.id);
    return () => menuStore.clear();
  }, [restaurant.id]);

  useEffect(() => {
    menuStore.setSelectedCategory(selectedTabIndex);
  }, [selectedTabIndex]);

  const { categories, isLoading, error } = menuStore;
  const currentItems = menuStore.currentItems();
  const cartCount = cartStore.itemCount();
  const cartTotal = cartStore.total();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ─── Hero Header ─── */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: restaurant.coverUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Overlay gradient */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.75)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0.4 }}
            end={{ x: 0, y: 1 }}
          />
          {/* Back button */}
          <SafeAreaView style={styles.backBtnContainer} edges={['top']}>
            <Pressable
              style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backBtnText}>←</Text>
            </Pressable>
          </SafeAreaView>
        </View>

        {/* ─── Restaurant Info ─── */}
        <View style={styles.infoSection}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantDescription}>{restaurant.description}</Text>

          <View style={styles.infoChips}>
            <InfoChip icon="⭐" text={restaurant.rating.toFixed(1)} color={Colors.accentGold} />
            <InfoChip icon="🕐" text={`${restaurant.openingTime} - ${restaurant.closingTime}`} color={Colors.textSecondary} />
            <InfoChip
              icon={open ? '✅' : '❌'}
              text={open ? 'Open' : 'Closed'}
              color={open ? Colors.success : Colors.error}
            />
          </View>

          {/* Cuisine tags */}
          <View style={styles.cuisineWrap}>
            {restaurant.cuisines.map((c) => (
              <View key={c} style={styles.cuisineTag}>
                <Text style={styles.cuisineTagText}>{c}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ─── Category Tabs ─── */}
        {!isLoading && categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsRow}
            style={styles.tabsScroll}
          >
            {categories.map((cat, index) => (
              <Pressable
                key={cat.id}
                style={[styles.tab, selectedTabIndex === index && styles.tabActive]}
                onPress={() => setSelectedTabIndex(index)}
              >
                <Text
                  style={[styles.tabText, selectedTabIndex === index && styles.tabTextActive]}
                >
                  {cat.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* ─── Menu Items ─── */}
        <View style={styles.menuSection}>
          {isLoading ? (
            <ShimmerLoading itemCount={4} type="menuItem" />
          ) : error ? (
            <View style={styles.stateBox}>
              <Text style={styles.stateText}>Failed to load menu</Text>
            </View>
          ) : currentItems.length === 0 ? (
            <View style={styles.stateBox}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>🍽️</Text>
              <Text style={styles.stateText}>No items in this category</Text>
            </View>
          ) : (
            currentItems.map((item) => (
              <MenuItemCard
                key={item.id}
                menuItem={item}
                quantity={cartStore.getItemQuantity(item.id)}
                onAdd={() => cartStore.addItem(item, restaurant.id, restaurant.name)}
                onQuantityChanged={(qty) => {
                  if (qty <= 0) cartStore.removeItem(item.id);
                  else cartStore.updateQuantity(item.id, qty);
                }}
              />
            ))
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ─── Floating Cart Bar ─── */}
      {cartCount > 0 && (
        <View style={styles.cartBarWrapper}>
          <SafeAreaView edges={['bottom']}>
            <Pressable
              onPress={() => navigation.navigate('Cart')}
              style={({ pressed }) => [pressed && { opacity: 0.9 }]}
            >
              <LinearGradient
                colors={['#FF6B35', '#FF8F5E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cartBar}
              >
                <View style={styles.cartCountBadge}>
                  <Text style={styles.cartCountText}>{cartCount}</Text>
                </View>
                <Text style={styles.cartBarLabel}>View Cart</Text>
                <Text style={styles.cartBarTotal}>${cartTotal.toFixed(2)}</Text>
              </LinearGradient>
            </Pressable>
          </SafeAreaView>
        </View>
      )}
    </View>
  );
}

function InfoChip({ icon, text, color }: { icon: string; text: string; color: string }) {
  return (
    <View style={chipStyles.chip}>
      <Text style={{ fontSize: 12 }}>{icon}</Text>
      <Text style={[chipStyles.text, { color }]}>{text}</Text>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  heroContainer: {
    height: 220,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.bgCardLight,
  },
  backBtnContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    margin: Spacing.sm,
  },
  backBtnText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: FontWeight.bold,
  },
  infoSection: {
    padding: Spacing.md,
  },
  restaurantName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    fontFamily: 'Outfit_700Bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  restaurantDescription: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  infoChips: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  cuisineWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  cuisineTag: {
    backgroundColor: Colors.primary + '1F',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  cuisineTagText: {
    color: Colors.primaryLight,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  tabsScroll: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.bgCardLight,
    backgroundColor: Colors.bgDark,
  },
  tabsRow: {
    paddingHorizontal: Spacing.md,
    gap: 4,
    paddingVertical: Spacing.sm,
  },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  tabActive: {
    backgroundColor: Colors.primary + '22',
  },
  tabText: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  menuSection: {
    padding: Spacing.md,
  },
  stateBox: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  stateText: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
  },
  cartBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  cartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    paddingHorizontal: 20,
    paddingVertical: 14,
    ...Shadows.elevated,
  },
  cartCountBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 12,
  },
  cartCountText: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.base - 1,
  },
  cartBarLabel: {
    flex: 1,
    color: Colors.white,
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.md,
  },
  cartBarTotal: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
});
