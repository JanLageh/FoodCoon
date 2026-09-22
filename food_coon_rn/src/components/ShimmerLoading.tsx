import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing } from '../theme/theme';

interface ShimmerBoxProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}

function ShimmerBox({ width, height, borderRadius = Radius.sm, style }: ShimmerBoxProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ).start();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View
      style={[
        { width: width as number, height, borderRadius, overflow: 'hidden', backgroundColor: Colors.bgCardLight },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={[Colors.bgCardLight, Colors.bgElevated, Colors.bgCardLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

export type ShimmerType = 'restaurantCard' | 'menuItem' | 'orderCard';

interface ShimmerLoadingProps {
  itemCount?: number;
  type: ShimmerType;
}

export default function ShimmerLoading({ itemCount = 3, type }: ShimmerLoadingProps) {
  return (
    <View>
      {Array.from({ length: itemCount }).map((_, i) => (
        <View key={i} style={styles.card}>
          {type === 'restaurantCard' && (
            <>
              <ShimmerBox width="100%" height={160} borderRadius={Radius.lg} />
              <View style={{ padding: Spacing.md }}>
                <ShimmerBox width="60%" height={18} style={{ marginBottom: 8 }} />
                <ShimmerBox width="90%" height={14} style={{ marginBottom: 8 }} />
                <ShimmerBox width="40%" height={12} />
              </View>
            </>
          )}
          {type === 'menuItem' && (
            <View style={{ flexDirection: 'row', padding: Spacing.md }}>
              <ShimmerBox width={90} height={90} borderRadius={Radius.sm} />
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <ShimmerBox width="70%" height={16} style={{ marginBottom: 8 }} />
                <ShimmerBox width="100%" height={12} style={{ marginBottom: 4 }} />
                <ShimmerBox width="90%" height={12} style={{ marginBottom: 12 }} />
                <ShimmerBox width="30%" height={20} />
              </View>
            </View>
          )}
          {type === 'orderCard' && (
            <View style={{ padding: Spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <ShimmerBox width="40%" height={16} />
                <ShimmerBox width="25%" height={20} borderRadius={Radius.full} />
              </View>
              <ShimmerBox width="60%" height={13} style={{ marginBottom: 6 }} />
              <ShimmerBox width="40%" height={12} />
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
});
