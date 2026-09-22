import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme/theme';

interface CuisineChipProps {
  label: string;
  isSelected: boolean;
  onTap: () => void;
}

export default function CuisineChip({ label, isSelected, onTap }: CuisineChipProps) {
  return (
    <Pressable
      onPress={onTap}
      style={({ pressed }) => [
        styles.chip,
        isSelected && styles.chipSelected,
        pressed && { opacity: 0.75 },
      ]}
    >
      <Text style={[styles.label, isSelected && styles.labelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    backgroundColor: Colors.bgCardLight,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: Colors.primary + '33', // ~20% opacity
    borderColor: Colors.primary,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  labelSelected: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
});
