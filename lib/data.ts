import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Account, Category, Transaction } from "@/lib/types";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function getAccounts(): Promise<Account[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((account) => ({
    ...account,
    initial_balance: Number(account.initial_balance),
  })) as Account[];
}

export async function getTransactions(): Promise<Transaction[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((transaction) => ({
    ...transaction,
    amount: Number(transaction.amount),
  })) as Transaction[];
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("type", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []) as Category[];
}

export async function getFinanceData() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const [accountsResult, transactionsResult, categoriesResult] = await Promise.all([
    supabase.from("accounts").select("*").order("created_at", { ascending: true }),
    supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("*")
      .order("type", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  if (accountsResult.error) throw new Error(accountsResult.error.message);
  if (transactionsResult.error) throw new Error(transactionsResult.error.message);
  if (categoriesResult.error) throw new Error(categoriesResult.error.message);

  return {
    accounts: (accountsResult.data ?? []).map((account) => ({
      ...account,
      initial_balance: Number(account.initial_balance),
    })) as Account[],
    transactions: (transactionsResult.data ?? []).map((transaction) => ({
      ...transaction,
      amount: Number(transaction.amount),
    })) as Transaction[],
    categories: (categoriesResult.data ?? []) as Category[],
  };
}
