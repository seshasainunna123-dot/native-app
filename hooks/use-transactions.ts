import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getMonthlySummary,
  getRecentTransactions,
  getCategories,
} from '@/services/database';
import { Transaction } from '@/types/finance';

const PAGE_SIZE = 20;

// ── Query Keys ─────────────────────────────────
export const txKeys = {
  all: ['transactions'] as const,
  lists: () => [...txKeys.all, 'list'] as const,
  list: (filters: object) => [...txKeys.lists(), filters] as const,
  recent: () => [...txKeys.all, 'recent'] as const,
  monthly: (month: string) => [...txKeys.all, 'monthly', month] as const,
  categories: (type?: string) => ['categories', type] as const,
};

// ── Paginated Transaction List ─────────────────
export function useTransactions(filters: {
  type?: 'income' | 'expense';
  month?: string;
}) {
  return useInfiniteQuery({
    queryKey: txKeys.list(filters),
    queryFn: ({ pageParam = 0 }) =>
      getTransactions({ ...filters, limit: PAGE_SIZE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.flat().length;
    },
  });
}

// ── Recent Transactions ────────────────────────
export function useRecentTransactions(limit = 5) {
  return useQuery({
    queryKey: txKeys.recent(),
    queryFn: () => getRecentTransactions(limit),
  });
}

// ── Monthly Summary ────────────────────────────
export function useMonthlySum(month: string) {
  return useQuery({
    queryKey: txKeys.monthly(month),
    queryFn: () => getMonthlySummary(month),
  });
}

// ── Categories ─────────────────────────────────
export function useCategories(type?: 'income' | 'expense') {
  return useQuery({
    queryKey: txKeys.categories(type),
    queryFn: () => getCategories(type),
    staleTime: Infinity, // Categories rarely change
  });
}

// ── Add Transaction ────────────────────────────
export function useAddTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tx: Omit<Transaction, 'id' | 'createdAt'>) => addTransaction(tx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: txKeys.all });
    },
  });
}

// ── Delete Transaction ─────────────────────────
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: txKeys.all });
    },
  });
}
