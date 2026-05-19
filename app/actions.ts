"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AccountType, CategoryType, TransactionType } from "@/lib/types";

function parseAmount(value: FormDataEntryValue | null) {
  const amount = Number(String(value ?? "").replace(",", "."));
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("El monto debe ser mayor a cero.");
  }

  return amount;
}

export async function createAccount(formData: FormData) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "other") as AccountType;
  const initialBalance = Number(String(formData.get("initial_balance") ?? "0").replace(",", "."));

  if (!name) throw new Error("El nombre de la cuenta es obligatorio.");
  if (!Number.isFinite(initialBalance) || initialBalance < 0) {
    throw new Error("El saldo inicial no puede ser negativo.");
  }

  const { error } = await supabase.from("accounts").insert({
    user_id: data.user.id,
    name,
    type,
    initial_balance: initialBalance,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/accounts");
  redirect("/accounts");
}

export async function updateAccount(formData: FormData) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "other") as AccountType;
  const initialBalance = Number(String(formData.get("initial_balance") ?? "0").replace(",", "."));

  if (!id) throw new Error("No se encontro la cuenta.");
  if (!name) throw new Error("El nombre de la cuenta es obligatorio.");
  if (!Number.isFinite(initialBalance) || initialBalance < 0) {
    throw new Error("El saldo inicial no puede ser negativo.");
  }

  const { error } = await supabase
    .from("accounts")
    .update({ name, type, initial_balance: initialBalance })
    .eq("id", id)
    .eq("user_id", data.user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/accounts");
  revalidatePath("/transactions");
  revalidatePath("/reports");
}

export async function deleteAccount(formData: FormData) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("No se encontro la cuenta.");

  const { error } = await supabase
    .from("accounts")
    .delete()
    .eq("id", id)
    .eq("user_id", data.user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/accounts");
  revalidatePath("/transactions");
  revalidatePath("/reports");
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "expense") as CategoryType;

  if (!name) throw new Error("El nombre de la categoria es obligatorio.");

  const { error } = await supabase.from("categories").insert({
    user_id: data.user.id,
    name,
    type,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/categories");
  revalidatePath("/transactions");
}

export async function updateCategory(formData: FormData) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "expense") as CategoryType;

  if (!id) throw new Error("No se encontro la categoria.");
  if (!name) throw new Error("El nombre de la categoria es obligatorio.");

  const { error } = await supabase
    .from("categories")
    .update({ name, type })
    .eq("id", id)
    .eq("user_id", data.user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/reports");
}

export async function deleteCategory(formData: FormData) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("No se encontro la categoria.");

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", data.user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/categories");
  revalidatePath("/transactions");
}

export async function createTransaction(formData: FormData) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const type = String(formData.get("type") ?? "expense") as TransactionType;
  const accountId = String(formData.get("account_id") ?? "");
  const destinationAccountId = String(formData.get("destination_account_id") ?? "") || null;
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const date = String(formData.get("date") ?? new Date().toISOString().slice(0, 10));
  const amount = parseAmount(formData.get("amount"));

  if (!accountId) throw new Error("Selecciona una cuenta.");
  if (!category) throw new Error("La categoria es obligatoria.");
  if (type === "transfer" && !destinationAccountId) {
    throw new Error("Selecciona la cuenta destino.");
  }
  if (type === "transfer" && destinationAccountId === accountId) {
    throw new Error("La cuenta origen y destino deben ser diferentes.");
  }

  const { error } = await supabase.from("transactions").insert({
    user_id: data.user.id,
    type,
    account_id: accountId,
    destination_account_id: type === "transfer" ? destinationAccountId : null,
    category,
    amount,
    description,
    date,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/reports");
  redirect("/transactions");
}

export async function updateTransaction(formData: FormData) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const id = String(formData.get("id") ?? "");
  const type = String(formData.get("type") ?? "expense") as TransactionType;
  const accountId = String(formData.get("account_id") ?? "");
  const destinationAccountId = String(formData.get("destination_account_id") ?? "") || null;
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const date = String(formData.get("date") ?? new Date().toISOString().slice(0, 10));
  const amount = parseAmount(formData.get("amount"));

  if (!id) throw new Error("No se encontro el movimiento.");
  if (!accountId) throw new Error("Selecciona una cuenta.");
  if (!category) throw new Error("La categoria es obligatoria.");
  if (type === "transfer" && !destinationAccountId) {
    throw new Error("Selecciona la cuenta destino.");
  }
  if (type === "transfer" && destinationAccountId === accountId) {
    throw new Error("La cuenta origen y destino deben ser diferentes.");
  }

  const { error } = await supabase
    .from("transactions")
    .update({
      type,
      account_id: accountId,
      destination_account_id: type === "transfer" ? destinationAccountId : null,
      category,
      amount,
      description,
      date,
    })
    .eq("id", id)
    .eq("user_id", data.user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/reports");
  revalidatePath("/accounts");
}

export async function deleteTransaction(formData: FormData) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("No se encontro el movimiento.");

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", data.user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/reports");
  revalidatePath("/accounts");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
