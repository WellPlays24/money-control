import type { Account, AccountBalance, Transaction } from "@/lib/types";

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
  const month = now.getMonth();
  const year = now.getFullYear();

  return transactions.reduce(
    (summary, transaction) => {
      const date = new Date(`${transaction.date}T00:00:00`);
      if (date.getMonth() !== month || date.getFullYear() !== year) {
        return summary;
      }

      if (transaction.type === "income") summary.income += transaction.amount;
      if (transaction.type === "expense") summary.expense += transaction.amount;
      if (transaction.type === "transfer") summary.transfers += transaction.amount;

      return summary;
    },
    { income: 0, expense: 0, transfers: 0 },
  );
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
