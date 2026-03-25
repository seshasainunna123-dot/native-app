// ─────────────────────────────────────────────────────────────────
// WealthFlow — SQLite Database Service
// ─────────────────────────────────────────────────────────────────
import * as SQLite from 'expo-sqlite';
import {
  Transaction,
  EMI,
  EMIPayment,
  Category,
  MonthlySummary,
  DEFAULT_INCOME_CATEGORIES,
  DEFAULT_EXPENSE_CATEGORIES,
} from '@/types/finance';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('wealthflow.db');
    await initSchema(db);
  }
  return db;
}

// ── Schema ─────────────────────────────────────
async function initSchema(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      isDefault INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      categoryId TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      isRecurring INTEGER DEFAULT 0,
      recurringFrequency TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (categoryId) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS emis (
      id TEXT PRIMARY KEY,
      loanName TEXT NOT NULL,
      totalAmount REAL NOT NULL,
      emiAmount REAL NOT NULL,
      interestRate REAL DEFAULT 0,
      startDate TEXT NOT NULL,
      tenureMonths INTEGER NOT NULL,
      paidCount INTEGER DEFAULT 0,
      paymentDay INTEGER NOT NULL,
      status TEXT DEFAULT 'active',
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS emi_payments (
      id TEXT PRIMARY KEY,
      emiId TEXT NOT NULL,
      installmentNumber INTEGER NOT NULL,
      amount REAL NOT NULL,
      paidDate TEXT NOT NULL,
      transactionId TEXT,
      FOREIGN KEY (emiId) REFERENCES emis(id)
    );
  `);

  // Seed default categories if empty
  const count = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM categories'
  );
  if (!count || count.count === 0) {
    await seedCategories(database);
  }
}

async function seedCategories(database: SQLite.SQLiteDatabase): Promise<void> {
  const allDefaults = [
    ...DEFAULT_INCOME_CATEGORIES,
    ...DEFAULT_EXPENSE_CATEGORIES,
  ];
  for (const cat of allDefaults) {
    const id = `${cat.type}_${cat.name.toLowerCase().replace(/\s+/g, '_')}`;
    await database.runAsync(
      'INSERT OR IGNORE INTO categories (id, name, type, icon, color, isDefault) VALUES (?, ?, ?, ?, ?, ?)',
      [id, cat.name, cat.type, cat.icon, cat.color, 1]
    );
  }
}

// ── Helpers ────────────────────────────────────
function uuid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

// ── Category CRUD ──────────────────────────────
export async function getCategories(type?: 'income' | 'expense'): Promise<Category[]> {
  const database = await getDB();
  if (type) {
    return database.getAllAsync<Category>(
      'SELECT * FROM categories WHERE type = ? ORDER BY isDefault DESC, name ASC',
      [type]
    );
  }
  return database.getAllAsync<Category>(
    'SELECT * FROM categories ORDER BY type, isDefault DESC, name ASC'
  );
}

export async function addCategory(
  cat: Omit<Category, 'id'>
): Promise<Category> {
  const database = await getDB();
  const id = uuid();
  await database.runAsync(
    'INSERT INTO categories (id, name, type, icon, color, isDefault) VALUES (?, ?, ?, ?, ?, ?)',
    [id, cat.name, cat.type, cat.icon, cat.color, 0]
  );
  return { id, ...cat };
}

export async function deleteCategory(id: string): Promise<void> {
  const database = await getDB();
  await database.runAsync('DELETE FROM categories WHERE id = ? AND isDefault = 0', [id]);
}

// ── Transaction CRUD ───────────────────────────
export async function getTransactions(opts: {
  type?: 'income' | 'expense';
  month?: string; // "YYYY-MM"
  limit?: number;
  offset?: number;
}): Promise<Transaction[]> {
  const database = await getDB();
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (opts.type) {
    conditions.push('type = ?');
    params.push(opts.type);
  }
  if (opts.month) {
    conditions.push("strftime('%Y-%m', date) = ?");
    params.push(opts.month);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const limit = opts.limit ?? 50;
  const offset = opts.offset ?? 0;

  const rows = await database.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM transactions ${where} ORDER BY date DESC, createdAt DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  return rows.map(rowToTransaction);
}

export async function getRecentTransactions(limit = 5): Promise<Transaction[]> {
  const database = await getDB();
  const rows = await database.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM transactions ORDER BY date DESC, createdAt DESC LIMIT ?',
    [limit]
  );
  return rows.map(rowToTransaction);
}

export async function addTransaction(
  tx: Omit<Transaction, 'id' | 'createdAt'>
): Promise<Transaction> {
  const database = await getDB();
  const id = uuid();
  const createdAt = new Date().toISOString();
  await database.runAsync(
    `INSERT INTO transactions (id, type, amount, categoryId, description, date, isRecurring, recurringFrequency, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      tx.type,
      tx.amount,
      tx.categoryId,
      tx.description,
      tx.date,
      tx.isRecurring ? 1 : 0,
      tx.recurringFrequency ?? null,
      createdAt,
    ]
  );
  return { id, createdAt, ...tx };
}

export async function deleteTransaction(id: string): Promise<void> {
  const database = await getDB();
  await database.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
}

function rowToTransaction(row: Record<string, unknown>): Transaction {
  return {
    id: row.id as string,
    type: row.type as 'income' | 'expense',
    amount: row.amount as number,
    categoryId: row.categoryId as string,
    description: (row.description as string) ?? '',
    date: row.date as string,
    isRecurring: row.isRecurring === 1,
    recurringFrequency: row.recurringFrequency as Transaction['recurringFrequency'],
    createdAt: row.createdAt as string,
  };
}

// ── Monthly Summary ────────────────────────────
export async function getMonthlySummary(month: string): Promise<MonthlySummary> {
  const database = await getDB();
  const result = await database.getFirstAsync<{
    totalIncome: number;
    totalExpense: number;
  }>(
    `SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS totalIncome,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS totalExpense
     FROM transactions
     WHERE strftime('%Y-%m', date) = ?`,
    [month]
  );
  const totalIncome = result?.totalIncome ?? 0;
  const totalExpense = result?.totalExpense ?? 0;
  return {
    month,
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
  };
}

export async function getLast6MonthsSummary(): Promise<MonthlySummary[]> {
  const months: MonthlySummary[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toISOString().slice(0, 7); // "YYYY-MM"
    months.push(await getMonthlySummary(month));
  }
  return months;
}

// ── EMI CRUD ───────────────────────────────────
export async function getEMIs(status?: 'active' | 'completed' | 'paused'): Promise<EMI[]> {
  const database = await getDB();
  if (status) {
    return database.getAllAsync<EMI>(
      'SELECT * FROM emis WHERE status = ? ORDER BY createdAt DESC',
      [status]
    );
  }
  return database.getAllAsync<EMI>(
    'SELECT * FROM emis ORDER BY status ASC, createdAt DESC'
  );
}

export async function getEMIById(id: string): Promise<EMI | null> {
  const database = await getDB();
  return database.getFirstAsync<EMI>('SELECT * FROM emis WHERE id = ?', [id]);
}

export async function addEMI(emi: Omit<EMI, 'id' | 'paidCount' | 'status' | 'createdAt'>): Promise<EMI> {
  const database = await getDB();
  const id = uuid();
  const createdAt = new Date().toISOString();
  await database.runAsync(
    `INSERT INTO emis (id, loanName, totalAmount, emiAmount, interestRate, startDate, tenureMonths, paidCount, paymentDay, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 'active', ?)`,
    [id, emi.loanName, emi.totalAmount, emi.emiAmount, emi.interestRate, emi.startDate, emi.tenureMonths, emi.paymentDay, createdAt]
  );
  return { id, paidCount: 0, status: 'active', createdAt, ...emi };
}

export async function recordEMIPayment(
  emiId: string,
  installmentNumber: number,
  amount: number
): Promise<void> {
  const database = await getDB();
  const paymentId = uuid();
  const paidDate = today();

  await database.runAsync(
    `INSERT INTO emi_payments (id, emiId, installmentNumber, amount, paidDate) VALUES (?, ?, ?, ?, ?)`,
    [paymentId, emiId, installmentNumber, amount, paidDate]
  );

  const emi = await getEMIById(emiId);
  if (!emi) return;

  const newPaidCount = emi.paidCount + 1;
  const newStatus = newPaidCount >= emi.tenureMonths ? 'completed' : 'active';

  await database.runAsync(
    'UPDATE emis SET paidCount = ?, status = ? WHERE id = ?',
    [newPaidCount, newStatus, emiId]
  );
}

export async function deleteEMI(id: string): Promise<void> {
  const database = await getDB();
  await database.runAsync('DELETE FROM emi_payments WHERE emiId = ?', [id]);
  await database.runAsync('DELETE FROM emis WHERE id = ?', [id]);
}

export async function getEMIPayments(emiId: string): Promise<EMIPayment[]> {
  const database = await getDB();
  return database.getAllAsync<EMIPayment>(
    'SELECT * FROM emi_payments WHERE emiId = ? ORDER BY installmentNumber ASC',
    [emiId]
  );
}

// ── Dashboard aggregation ──────────────────────
export async function getUpcomingEMIs(): Promise<EMI[]> {
  const database = await getDB();
  const now = new Date();
  const dayOfMonth = now.getDate();
  return database.getAllAsync<EMI>(
    `SELECT * FROM emis WHERE status = 'active' AND paymentDay >= ? AND paymentDay <= ? ORDER BY paymentDay ASC`,
    [dayOfMonth, dayOfMonth + 7]
  );
}

export async function getTotalMonthlyEMI(): Promise<number> {
  const database = await getDB();
  const result = await database.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(emiAmount), 0) as total FROM emis WHERE status = 'active'`
  );
  return result?.total ?? 0;
}
