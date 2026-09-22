import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useRestaurantStore } from '../store/restaurantStore';
import { useCartStore } from '../store/cartStore';
import RestaurantCard from '../components/RestaurantCard';
import CuisineChip from '../components/CuisineChip';
import ShimmerLoading from '../components/ShimmerLoading';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme/theme';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavProp>();
  const [searchText, setSearchText] = useState('');
  const searchRef = useRef<TextInput>(null);

  const {
    isLoading,
    error,
    fetchRestaurants,
    setSearchQuery,
    setSelectedCuisine,
    selectedCuisine,
    allCuisines,
    displayedRestaurants,
  } = useRestaurantStore();
  const { itemCount } = useCartStore();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
    setSearchQuery(text);
  }, [setSearchQuery]);

  const restaurants = displayedRestaurants();
  const cuisines = allCuisines();
  const cartCount = itemCount();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Header ─── */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#FF6B35', '#FF8F5E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoBox}
          >
            <Text style={styles.logoIcon}>🛵</Text>
          </LinearGradient>

          <View style={styles.headerTitle}>
            <Text style={styles.appName}>FoodCoon</Text>
            <Text style={styles.deliveryAddress}>Deliver to: 123 Main St, Brooklyn</Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
              onPress={() => navigation.navigate('Orders')}
            >
              <Text style={styles.iconBtnText}>📋</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
              onPress={() => navigation.navigate('Cart')}
            >
              <Text style={styles.iconBtnText}>🛍️</Text>
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* ─── Search Bar ─── */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            ref={searchRef}
            style={styles.searchInput}
            placeholder="Search restaurants..."
            placeholderTextColor={Colors.textMuted}
            value={searchText}
            onChangeText={handleSearchChange}
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => handleSearchChange('')} hitSlop={8}>
              <Text style={styles.clearIcon}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* ─── Cuisine Filter Chips ─── */}
        {cuisines.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
            style={styles.chipsScroll}
          >
            {cuisines.map((cuisine) => (
              <CuisineChip
                key={cuisine}
                label={cuisine}
                isSelected={selectedCuisine === cuisine}
                onTap={() => setSelectedCuisine(cuisine)}
              />
            ))}
          </ScrollView>
        )}

        {/* ─── Section Title ─── */}
        <Text style={styles.sectionTitle}>Nearby Restaurants</Text>

        {/* ─── Content ─── */}
        {isLoading ? (
          <ShimmerLoading itemCount={3} type="restaurantCard" />
        ) : error ? (
          <View style={styles.stateContainer}>
            <View style={styles.stateIconCircle}>
              <Text style={{ fontSize: 36 }}>📡</Text>
            </View>
            <Text style={styles.stateTitle}>Connection Error</Text>
            <Text style={styles.stateSubtitle}>
              Make sure the mock API is running{'\n'}(node mock-api/server.js)
            </Text>
            <Pressable style={styles.retryBtn} onPress={fetchRestaurants}>
              <Text style={styles.retryBtnText}>↺  Retry</Text>
            </Pressable>
          </View>
        ) : restaurants.length === 0 ? (
          <View style={styles.stateContainer}>
            <View style={styles.stateIconCircle}>
              <Text style={{ fontSize: 36 }}>🔍</Text>
            </View>
            <Text style={styles.stateTitle}>No restaurants found</Text>
            <Text style={styles.stateSubtitle}>Try adjusting your search or filters</Text>
          </View>
        ) : (
          restaurants.map((r) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              onTap={() => navigation.navigate('RestaurantDetail', { restaurant: r })}
            />
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 22,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 12,
  },
  appName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.primary,
  },
  deliveryAddress: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconBtnText: {
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: FontWeight.bold,
    lineHeight: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCardLight,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    marginBottom: Spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    padding: 0,
  },
  clearIcon: {
    fontSize: 16,
    color: Colors.textMuted,
    padding: 4,
  },
  chipsScroll: {
    marginBottom: Spacing.sm,
  },
  chipsRow: {
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  stateContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  stateIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  stateTitle: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    marginBottom: 8,
    textAlign: 'center',
  },
  stateSubtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
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
});
