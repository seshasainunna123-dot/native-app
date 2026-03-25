import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEMIs,
  getEMIById,
  addEMI,
  deleteEMI,
  recordEMIPayment,
  getEMIPayments,
  getTotalMonthlyEMI,
  getUpcomingEMIs,
} from '@/services/database';
import { EMI } from '@/types/finance';

const emiKeys = {
  all: ['emis'] as const,
  lists: () => [...emiKeys.all, 'list'] as const,
  list: (status?: string) => [...emiKeys.lists(), status] as const,
  detail: (id: string) => [...emiKeys.all, 'detail', id] as const,
  payments: (id: string) => [...emiKeys.all, 'payments', id] as const,
  upcoming: () => [...emiKeys.all, 'upcoming'] as const,
  totalMonthly: () => [...emiKeys.all, 'totalMonthly'] as const,
};

export function useEMIs(status?: 'active' | 'completed' | 'paused') {
  return useQuery({
    queryKey: emiKeys.list(status),
    queryFn: () => getEMIs(status),
  });
}

export function useEMIDetail(id: string) {
  return useQuery({
    queryKey: emiKeys.detail(id),
    queryFn: () => getEMIById(id),
    enabled: !!id,
  });
}

export function useEMIPayments(emiId: string) {
  return useQuery({
    queryKey: emiKeys.payments(emiId),
    queryFn: () => getEMIPayments(emiId),
    enabled: !!emiId,
  });
}

export function useUpcomingEMIs() {
  return useQuery({
    queryKey: emiKeys.upcoming(),
    queryFn: getUpcomingEMIs,
  });
}

export function useTotalMonthlyEMI() {
  return useQuery({
    queryKey: emiKeys.totalMonthly(),
    queryFn: getTotalMonthlyEMI,
  });
}

export function useAddEMI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (emi: Omit<EMI, 'id' | 'paidCount' | 'status' | 'createdAt'>) =>
      addEMI(emi),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emiKeys.all });
    },
  });
}

export function useDeleteEMI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEMI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emiKeys.all });
    },
  });
}

export function useRecordEMIPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      emiId,
      installmentNumber,
      amount,
    }: {
      emiId: string;
      installmentNumber: number;
      amount: number;
    }) => recordEMIPayment(emiId, installmentNumber, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emiKeys.all });
    },
  });
}
