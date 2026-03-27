import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  TextInput,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TransactionRow } from '@/components/features/TransactionRow';
import { SummaryCard } from '@/components/features/SummaryCard';
import { useTransactions, useCategories, useDeleteTransaction, useMonthlySum } from '@/hooks/use-transactions';
import type { Transaction, Category } from '@/types/finance';

type FilterType = 'all' | 'income' | 'expense';

const MONTH = new Date().toISOString().slice(0, 7);

export default function TransactionsScreen() {
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const apiFilter = filter === 'all' ? undefined : filter;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useTransactions({ type: apiFilter });
  const { data: categories } = useCategories();
  const { data: monthlySummary } = useMonthlySum(MONTH);
  const deleteTransaction = useDeleteTransaction();

  const allTransactions = data?.pages.flat() ?? [];

  // Build category lookup map
  const categoryMap = Object.fromEntries((categories ?? []).map((c: Category) => [c.id, c]));

  // Client-side search filter
  const filtered = search.trim()
    ? allTransactions.filter(
        (t: Transaction) =>
          t.description?.toLowerCase().includes(search.toLowerCase()) ||
          categoryMap[t.categoryId]?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : allTransactions;

  const triggerHaptic = useCallback((type: 'impactMedium' | 'selection' = 'impactMedium') => {
    ReactNativeHapticFeedback.trigger(type, {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      triggerHaptic('impactMedium');
      deleteTransaction.mutate(id);
    },
    [deleteTransaction, triggerHaptic]
  );

  return (
    <LinearGradient colors={['#020617', '#0F172A', '#0F172A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#F1F5F9', letterSpacing: -0.5 }}>
            Transactions
          </Text>
          <Text style={{ color: '#64748B', fontSize: 13, marginTop: 2 }}>
            {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </Text>
        </View>

        {/* Monthly Summary Row */}
        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 16 }}>
          <SummaryCard
            label="Income"
            amount={monthlySummary?.totalIncome ?? 0}
            color="#10B981"
            subtitle="this month"
          />
          <SummaryCard
            label="Expense"
            amount={monthlySummary?.totalExpense ?? 0}
            color="#EF4444"
            subtitle="this month"
          />
        </View>

        {/* Search Bar */}
        <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.07)',
              borderRadius: 14,
              paddingHorizontal: 12,
              gap: 10,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <Ionicons name="search" size={18} color="#475569" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search transactions…"
              placeholderTextColor="#475569"
              style={{ flex: 1, color: '#F1F5F9', paddingVertical: 12, fontSize: 15 }}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color="#475569" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Type Filter Tabs */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            gap: 8,
            marginBottom: 16,
          }}
        >
          {(['all', 'income', 'expense'] as FilterType[]).map((f) => {
            const isActive = filter === f;
            const color = f === 'income' ? '#10B981' : f === 'expense' ? '#EF4444' : '#6366F1';
            return (
              <Pressable
                key={f}
                onPress={() => {
                  triggerHaptic('selection');
                  setFilter(f);
                }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: isActive ? `${color}22` : 'rgba(255,255,255,0.05)',
                  borderWidth: 1.5,
                  borderColor: isActive ? color : 'rgba(255,255,255,0.1)',
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: isActive ? color : '#64748B',
                    textTransform: 'capitalize',
                  }}
                >
                  {f === 'all' ? 'All' : f === 'income' ? '↑ Income' : '↓ Expense'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Transaction List */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 40 }} />
        ) : filtered.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <Ionicons name="file-tray" size={56} color="#1E293B" />
            <Text style={{ color: '#334155', fontSize: 16, fontWeight: '600' }}>No transactions yet</Text>
            <Text style={{ color: '#1E293B', fontSize: 13 }}>Tap the + button to add one</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, gap: 8 }}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TransactionRow
                transaction={item}
                category={categoryMap[item.categoryId]}
                onLongPress={() => handleDelete(item.id)}
              />
            )}
            onEndReached={() => { if (hasNextPage) fetchNextPage(); }}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator size="small" color="#10B981" style={{ marginTop: 12 }} />
              ) : null
            }
          />
        )}

        {/* FAB — Add Transaction */}
        <Pressable
          onPress={() => {
            triggerHaptic('impactMedium');
            navigation.navigate('AddTransaction');
          }}
          style={({ pressed }) => ({
            position: 'absolute',
            bottom: 24,
            right: 24,
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: '#10B981',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.85 : 1,
            ...Platform.select({
              ios: {
                shadowColor: '#10B981',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.45,
                shadowRadius: 24,
              },
              android: {
                elevation: 8,
              },
            }),
          })}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

