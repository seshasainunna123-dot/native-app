import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'react-native';
import type { EMI } from '@/types/finance';

interface EMICardProps {
  emi: EMI;
  currencySymbol?: string;
  onPress?: () => void;
}

export function EMICard({ emi, currencySymbol = '₹', onPress }: EMICardProps) {
  const progress = emi.tenureMonths > 0 ? emi.paidCount / emi.tenureMonths : 0;
  const remaining = emi.tenureMonths - emi.paidCount;
  const paidAmount = emi.emiAmount * emi.paidCount;
  const remainingAmount = emi.emiAmount * remaining;

  // Next due date calculation
  const now = new Date();
  const nextDue = new Date(now.getFullYear(), now.getMonth(), emi.paymentDay);
  if (nextDue <= now) nextDue.setMonth(nextDue.getMonth() + 1);
  const daysUntilDue = Math.ceil((nextDue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const isUrgent = daysUntilDue <= 3;
  const statusColor = emi.status === 'completed' ? '#10B981' : emi.status === 'paused' ? '#F59E0B' : '#8B5CF6';

  const formatAmount = (n: number) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.07)',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        gap: 12,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      })}
    >
      {/* Header Row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 11,
            backgroundColor: 'rgba(139,92,246,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'rgba(139,92,246,0.35)',
          }}
        >
          <Image
            source="sf:creditcard.fill"
            style={{ width: 20, height: 20, tintColor: '#A78BFA' }}
            contentFit="contain"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#F1F5F9', fontSize: 16, fontWeight: '700' }} numberOfLines={1}>
            {emi.loanName}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: statusColor }} />
            <Text style={{ color: '#94A3B8', fontSize: 12, textTransform: 'capitalize' }}>
              {emi.status}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ color: '#A78BFA', fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums'] }}>
            {currencySymbol}{formatAmount(emi.emiAmount)}
          </Text>
          <Text style={{ color: '#64748B', fontSize: 11 }}>/month</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ color: '#94A3B8', fontSize: 12 }}>
            {emi.paidCount}/{emi.tenureMonths} installments
          </Text>
          <Text style={{ color: '#A78BFA', fontSize: 12, fontWeight: '600' }}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
        <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
          <View
            style={{
              height: '100%',
              width: `${Math.min(progress * 100, 100)}%`,
              backgroundColor: emi.status === 'completed' ? '#10B981' : '#8B5CF6',
              borderRadius: 3,
            }}
          />
        </View>
      </View>

      {/* Footer Row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ color: '#64748B', fontSize: 11 }}>Remaining</Text>
          <Text style={{ color: '#F1F5F9', fontSize: 13, fontWeight: '600', fontVariant: ['tabular-nums'] }}>
            {currencySymbol}{formatAmount(remainingAmount)}
          </Text>
        </View>
        {emi.status === 'active' && (
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: '#64748B', fontSize: 11 }}>Next Due</Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: isUrgent ? '#EF4444' : '#F1F5F9',
              }}
            >
              {isUrgent ? `${daysUntilDue}d left` : nextDue.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </Text>
          </View>
        )}
        {emi.status === 'completed' && (
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: '#10B981', fontSize: 13, fontWeight: '700' }}>✓ Fully Paid</Text>
            <Text style={{ color: '#64748B', fontSize: 11 }}>{currencySymbol}{formatAmount(paidAmount)}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
