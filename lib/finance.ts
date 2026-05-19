import type { Account, AccountBalance, Transaction } from "@/lib/types";

export type TransactionSummary = {
  income: number;
  expense: number;
  transfers: number;
  net: number;
};

export type MonthlyHistoryItem = TransactionSummary & {
  month: number;
  year: number;
  label: string;
};

export function formatMoney(value: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function calculateBalances(
  accounts: Account[],
  transactions: Transaction[],
): AccountBalance[] {
  return accounts.map((account) => {
    const totals = transactions.reduce(
      (current, transaction) => {
        if (transaction.type === "income" && transaction.account_id === account.id) {
          current.income += transaction.amount;
        }

        if (transaction.type === "expense" && transaction.account_id === account.id) {
          current.expense += transaction.amount;
        }

        if (transaction.type === "transfer" && transaction.account_id === account.id) {
          current.transfersOut += transaction.amount;
        }

        if (
          transaction.type === "transfer" &&
          transaction.destination_account_id === account.id
        ) {
          current.transfersIn += transaction.amount;
        }

        return current;
      },
      { income: 0, expense: 0, transfersIn: 0, transfersOut: 0 },
    );

    return {
      ...account,
      ...totals,
      balance:
        account.initial_balance +
        totals.income -
        totals.expense +
        totals.transfersIn -
        totals.transfersOut,
    };
  });
}

export function getGeneralBalance(accounts: AccountBalance[]) {
  return accounts.reduce((total, account) => total + account.balance, 0);
}

export function getMonthlySummary(transactions: Transaction[]) {
  const now = new Date();
  return getSummaryForMonth(transactions, now.getMonth() + 1, now.getFullYear());
}

export function getTransactionSummary(transactions: Transaction[]): TransactionSummary {
  return transactions.reduce(
    (summary, transaction) => {
      if (transaction.type === "income") summary.income += transaction.amount;
      if (transaction.type === "expense") summary.expense += transaction.amount;
      if (transaction.type === "transfer") summary.transfers += transaction.amount;

      summary.net = summary.income - summary.expense;
      return summary;
    },
    { income: 0, expense: 0, transfers: 0, net: 0 },
  );
}

export function getSummaryForMonth(
  transactions: Transaction[],
  month: number,
  year: number,
) {
  return getTransactionSummary(
    transactions.filter((transaction) => {
      const date = new Date(`${transaction.date}T00:00:00`);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    }),
  );
}

export function filterTransactionsByDateRange(
  transactions: Transaction[],
  startDate?: string,
  endDate?: string,
) {
  if (!startDate && !endDate) return transactions;

  return transactions.filter((transaction) => {
    if (startDate && transaction.date < startDate) return false;
    if (endDate && transaction.date > endDate) return false;
    return true;
  });
}

export function isValidDateRange(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return true;
  return startDate <= endDate;
}

export function getMonthlyHistory(transactions: Transaction[]): MonthlyHistoryItem[] {
  const grouped = new Map<string, Transaction[]>();

  for (const transaction of transactions) {
    const date = new Date(`${transaction.date}T00:00:00`);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    grouped.set(key, [...(grouped.get(key) ?? []), transaction]);
  }

  return Array.from(grouped.entries())
    .map(([key, monthTransactions]) => {
      const [year, month] = key.split("-").map(Number);
      const summary = getTransactionSummary(monthTransactions);

      return {
        ...summary,
        month,
        year,
        label: new Intl.DateTimeFormat("es-EC", {
          month: "long",
          year: "numeric",
        }).format(new Date(year, month - 1, 1)),
      };
    })
    .sort((a, b) => b.year - a.year || b.month - a.month);
}

export function getExpensesByCategory(transactions: Transaction[]) {
  const categories = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.type !== "expense") continue;
    categories.set(
      transaction.category,
      (categories.get(transaction.category) ?? 0) + transaction.amount,
    );
  }

  return Array.from(categories.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}
