import React from 'react';
import { Text, Pressable } from 'react-native';
import { Image } from 'react-native';
import type { Category } from '@/types/finance';

interface CategoryChipProps {
  category: Category;
  selected?: boolean;
  onPress?: () => void;
}

export function CategoryChip({ category, selected, onPress }: CategoryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: selected
          ? `${category.color}33`
          : pressed
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(255,255,255,0.06)',
        borderWidth: 1.5,
        borderColor: selected ? category.color : 'rgba(255,255,255,0.12)',
      })}
    >
      <Image
        source={`sf:${category.icon}`}
        style={{ width: 14, height: 14, tintColor: selected ? category.color : '#94A3B8' }}
        contentFit="contain"
      />
      <Text
        style={{
          fontSize: 13,
          fontWeight: selected ? '700' : '500',
          color: selected ? category.color : '#94A3B8',
        }}
      >
        {category.name}
      </Text>
    </Pressable>
  );
}
