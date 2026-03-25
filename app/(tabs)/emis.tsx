import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { EMICard } from '@/components/features/EMICard';
import { useEMIs, useDeleteEMI, useTotalMonthlyEMI } from '@/hooks/use-emis';
import type { EMI } from '@/types/finance';

type EMIFilter = 'active' | 'completed' | 'all';

export default function EMIsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<EMIFilter>('active');
  const apiFilter = filter === 'all' ? undefined : filter as 'active' | 'completed';
  const { data: emis, isLoading } = useEMIs(apiFilter);
  const { data: totalMonthly } = useTotalMonthlyEMI();
  const deleteEMI = useDeleteEMI();

  const handleDelete = (emi: EMI) => {
    Alert.alert(
      'Delete EMI',
      `Remove "${emi.loanName}"? This will also delete all payment records.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            deleteEMI.mutate(emi.id);
          },
        },
      ]
    );
  };

  const filters: { key: EMIFilter; label: string }[] = [
    { key: 'active', label: '● Active' },
    { key: 'completed', label: '✓ Completed' },
    { key: 'all', label: 'All' },
  ];

  const filterColors: Record<EMIFilter, string> = {
    active: '#8B5CF6',
    completed: '#10B981',
    all: '#6366F1',
  };

  return (
    <LinearGradient colors={['#020617', '#0F172A', '#0F172A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#F1F5F9', letterSpacing: -0.5 }}>
            EMI Tracker
          </Text>
          <Text style={{ color: '#64748B', fontSize: 13, marginTop: 2 }}>
            Manage your loan installments
          </Text>
        </View>

        {/* Monthly EMI burden card */}
        <View style={{ marginHorizontal: 20, marginBottom: 16 }}>
          <LinearGradient
            colors={['rgba(139,92,246,0.25)', 'rgba(99,102,241,0.15)']}
            style={{
              borderRadius: 20,
              padding: 18,
              borderWidth: 1,
              borderColor: 'rgba(139,92,246,0.3)',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={{ gap: 4 }}>
              <Text style={{ color: '#A78BFA', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Monthly EMI Burden
              </Text>
              <Text style={{ color: '#F1F5F9', fontSize: 28, fontWeight: '800', fontVariant: ['tabular-nums'] }} selectable>
                ₹{new Intl.NumberFormat('en-IN').format(totalMonthly ?? 0)}
              </Text>
              <Text style={{ color: '#64748B', fontSize: 12 }}>
                {emis?.filter((e: EMI) => e.status === 'active').length ?? 0} active loan{((emis?.filter((e: EMI) => e.status === 'active').length ?? 0) !== 1) ? 's' : ''}
              </Text>
            </View>
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: 'rgba(139,92,246,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: 'rgba(139,92,246,0.3)',
            }}>
              <Image source="sf:creditcard.fill" style={{ width: 26, height: 26, tintColor: '#A78BFA' }} contentFit="contain" />
            </View>
          </LinearGradient>
        </View>

        {/* Filter pills */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 16 }}>
          {filters.map(({ key, label }) => {
            const isActive = filter === key;
            const color = filterColors[key];
            return (
              <Pressable
                key={key}
                onPress={() => {
                  if (process.env.EXPO_OS === 'ios') Haptics.selectionAsync();
                  setFilter(key);
                }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: isActive ? `${color}22` : 'rgba(255,255,255,0.05)',
                  borderWidth: 1.5,
                  borderColor: isActive ? color : 'rgba(255,255,255,0.1)',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: isActive ? color : '#64748B' }}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* EMI List */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#8B5CF6" style={{ marginTop: 40 }} />
        ) : !emis || emis.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <Image source="sf:creditcard.fill" style={{ width: 56, height: 56, tintColor: '#1E293B' }} contentFit="contain" />
            <Text style={{ color: '#334155', fontSize: 16, fontWeight: '600' }}>No EMIs tracked</Text>
            <Text style={{ color: '#1E293B', fontSize: 13 }}>Tap the + button to add a loan</Text>
          </View>
        ) : (
          <FlatList
            data={emis}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, gap: 12 }}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <EMICard
                emi={item}
                onPress={() => router.push(`/emi-detail/${item.id}`)}
              />
            )}
          />
        )}

        {/* FAB — Add EMI */}
        <Pressable
          onPress={() => {
            if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/add-emi');
          }}
          style={({ pressed }) => ({
            position: 'absolute',
            bottom: 24,
            right: 24,
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: '#8B5CF6',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.85 : 1,
            boxShadow: '0 6px 24px rgba(139,92,246,0.45)',
          })}
        >
          <Image source="sf:plus" style={{ width: 22, height: 22, tintColor: '#fff' }} contentFit="contain" />
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}
