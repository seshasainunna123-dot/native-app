import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'react-native';
import type { Transaction, Category } from '@/types/finance';

interface TransactionRowProps {
  transaction: Transaction;
  category?: Category;
  currencySymbol?: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function TransactionRow({
  transaction,
  category,
  currencySymbol = '₹',
  onPress,
  onLongPress,
}: TransactionRowProps) {
  const isIncome = transaction.type === 'income';
  const iconColor = category?.color ?? (isIncome ? '#10B981' : '#EF4444');
  const amountColor = isIncome ? '#10B981' : '#EF4444';
  const prefix = isIncome ? '+' : '-';

  const formattedDate = new Date(transaction.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(transaction.amount);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        backgroundColor: pressed ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.06)',
        borderRadius: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
      })}
    >
      {/* Category Icon */}
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: `${iconColor}22`,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: `${iconColor}44`,
        }}
      >
        <Image
          source={`sf:${category?.icon ?? 'creditcard.fill'}`}
          style={{ width: 22, height: 22, tintColor: iconColor }}
          contentFit="contain"
        />
      </View>

      {/* Description & Date */}
      <View style={{ flex: 1, gap: 3 }}>
        <Text
          style={{ color: '#F1F5F9', fontSize: 15, fontWeight: '600' }}
          numberOfLines={1}
        >
          {transaction.description || category?.name || 'Transaction'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ color: '#94A3B8', fontSize: 12 }}>{category?.name}</Text>
          {transaction.isRecurring && (
            <View
              style={{
                backgroundColor: 'rgba(139,92,246,0.2)',
                borderRadius: 4,
                paddingHorizontal: 5,
                paddingVertical: 1,
              }}
            >
              <Text style={{ color: '#A78BFA', fontSize: 10, fontWeight: '600' }}>
                RECURRING
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Amount & Date */}
      <View style={{ alignItems: 'flex-end', gap: 3 }}>
        <Text
          style={{
            color: amountColor,
            fontSize: 16,
            fontWeight: '700',
            fontVariant: ['tabular-nums'],
          }}
          selectable
        >
          {prefix}{currencySymbol}{formattedAmount}
        </Text>
        <Text style={{ color: '#64748B', fontSize: 12 }}>{formattedDate}</Text>
      </View>
    </Pressable>
  );
}
