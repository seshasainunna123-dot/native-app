// ─────────────────────────────────────────────
// WealthFlow — Core Finance Type Definitions
// ─────────────────────────────────────────────

export type TransactionType = 'income' | 'expense';
export type CategoryType = 'income' | 'expense';
export type EMIStatus = 'active' | 'completed' | 'paused';
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY';

// ── Category ──────────────────────────────────
export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;   // SF Symbol name (e.g. "fork.knife")
  color: string;  // Hex color
  isDefault?: boolean;
}

// ── Transaction ────────────────────────────────
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  date: string;          // ISO date string "YYYY-MM-DD"
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: string;     // ISO timestamp
}

// ── EMI ────────────────────────────────────────
export interface EMI {
  id: string;
  loanName: string;
  totalAmount: number;         // Principal amount
  emiAmount: number;           // Monthly EMI
  interestRate: number;        // Annual interest rate %
  startDate: string;           // ISO date "YYYY-MM-DD"
  tenureMonths: number;        // Total number of EMIs
  paidCount: number;           // Number of EMIs paid
  paymentDay: number;          // Day of month (1-28)
  status: EMIStatus;
  createdAt: string;
}

// ── EMI Payment ────────────────────────────────
export interface EMIPayment {
  id: string;
  emiId: string;
  installmentNumber: number;
  amount: number;
  paidDate: string;           // ISO date
  transactionId?: string;     // Linked transaction ID
}

// ── Dashboard Summary ──────────────────────────
export interface MonthlySummary {
  month: string;   // "YYYY-MM"
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export interface DashboardData {
  currentMonthSummary: MonthlySummary;
  last6Months: MonthlySummary[];
  upcomingEMIs: EMI[];         // EMIs due within next 7 days
  totalMonthlyEMI: number;     // Sum of all active EMI amounts
  recentTransactions: Transaction[];
}

// ── App Settings ───────────────────────────────
export interface AppSettings {
  currency: Currency;
  currencySymbol: string;
  theme: 'light' | 'dark' | 'system';
}

// ── Default Values ─────────────────────────────
export const DEFAULT_SETTINGS: AppSettings = {
  currency: 'INR',
  currencySymbol: '₹',
  theme: 'system',
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

export const DEFAULT_INCOME_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Salary',      type: 'income',  icon: 'briefcase.fill',     color: '#10B981', isDefault: true },
  { name: 'Freelance',   type: 'income',  icon: 'laptopcomputer',     color: '#3B82F6', isDefault: true },
  { name: 'Investments', type: 'income',  icon: 'chart.line.uptrend.xyaxis', color: '#8B5CF6', isDefault: true },
  { name: 'Gifts',       type: 'income',  icon: 'gift.fill',          color: '#F59E0B', isDefault: true },
  { name: 'Other',       type: 'income',  icon: 'plus.circle.fill',   color: '#6B7280', isDefault: true },
];

export const DEFAULT_EXPENSE_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Food',          type: 'expense', icon: 'fork.knife',            color: '#EF4444', isDefault: true },
  { name: 'Transport',     type: 'expense', icon: 'car.fill',              color: '#F97316', isDefault: true },
  { name: 'Shopping',      type: 'expense', icon: 'bag.fill',              color: '#EC4899', isDefault: true },
  { name: 'Bills',         type: 'expense', icon: 'doc.text.fill',         color: '#6366F1', isDefault: true },
  { name: 'Rent',          type: 'expense', icon: 'house.fill',            color: '#0EA5E9', isDefault: true },
  { name: 'Entertainment', type: 'expense', icon: 'tv.fill',               color: '#A855F7', isDefault: true },
  { name: 'Health',        type: 'expense', icon: 'heart.fill',            color: '#F43F5E', isDefault: true },
  { name: 'Education',     type: 'expense', icon: 'book.fill',             color: '#14B8A6', isDefault: true },
  { name: 'Other',         type: 'expense', icon: 'ellipsis.circle.fill',  color: '#6B7280', isDefault: true },
];
