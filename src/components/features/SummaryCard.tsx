import React from 'react';
import { View, Text } from 'react-native';

interface SummaryCardProps {
  label: string;
  amount: number;
  currencySymbol?: string;
  color?: string;
  subtitle?: string;
}

export function SummaryCard({
  label,
  amount,
  currencySymbol = '₹',
  color = '#10B981',
  subtitle,
}: SummaryCardProps) {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  const isNegative = amount < 0;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 18,
        padding: 14,
        gap: 6,
        borderWidth: 1,
        borderColor: `${color}33`,
        boxShadow: `0 4px 16px ${color}15`,
        minWidth: 100,
      }}
    >
      <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Text>
      <Text
        style={{
          color: isNegative ? '#EF4444' : color,
          fontSize: 18,
          fontWeight: '800',
          fontVariant: ['tabular-nums'],
        }}
        selectable
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {isNegative ? '-' : ''}{currencySymbol}{formatted}
      </Text>
      {subtitle ? (
        <Text style={{ color: '#64748B', fontSize: 10 }}>{subtitle}</Text>
      ) : null}
    </View>
  );
}
