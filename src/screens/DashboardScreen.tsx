import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SummaryCard } from '@/components/features/SummaryCard';

export default function DashboardScreen() {
  const navigation = useNavigation<any>();


  return (
    <LinearGradient colors={['#020617', '#0F172A', '#0F172A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Overview</Text>
          <Text style={styles.headerSubtitle}>Your Financial Summary</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.summaryRow}>
            <SummaryCard
              label="Total Balance"
              amount={125000}
              color="#10B981"
              subtitle="All accounts"
            />
          </View>
          
          <View style={styles.summaryRow}>
            <SummaryCard
              label="Income"
              amount={85000}
              color="#3B82F6"
              subtitle="This month"
            />
            <View style={{ width: 12 }} />
            <SummaryCard
              label="Expense"
              amount={32000}
              color="#EF4444"
              subtitle="This month"
            />
          </View>

          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>Recent Activity</Text>
            <Text style={styles.placeholderSubtext}>Feature coming soon...</Text>
          </View>
        </ScrollView>

        <Pressable
          onPress={() => navigation.navigate('Chat')}

          style={({ pressed }) => ({
            position: 'absolute',
            bottom: 24,
            right: 24,
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: '#3B82F6',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.85 : 1,
            boxShadow: '0 8px 32px rgba(59,130,246,0.5)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)',
          })}
        >
          <Ionicons name="sparkles" size={24} color="#FFFFFF" />
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F1F5F9',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 16,
    width: '100%',
  },
  placeholderBox: {
    marginTop: 20,
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholderSubtext: {
    color: '#64748B',
    marginTop: 8,
    fontSize: 14,
  }
});
