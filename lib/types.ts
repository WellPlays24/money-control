export type AccountType = "bank" | "cooperative" | "cash" | "other";

export type TransactionType = "income" | "expense" | "transfer";

export type CategoryType = "income" | "expense";

export type Account = {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  initial_balance: number;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  type: TransactionType;
  account_id: string;
  destination_account_id: string | null;
  category: string;
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
};

export type Category = {
  id: string;
  user_id: string;
  name: string;
  type: CategoryType;
  created_at: string;
};

export type AccountBalance = Account & {
  balance: number;
  income: number;
  expense: number;
  transfersIn: number;
  transfersOut: number;
};
