import type { Account, Transaction } from "@/lib/types";

const typeLabels = {
  income: "Ingreso",
  expense: "Egreso",
  transfer: "Transferencia",
};

function escapeCsvValue(value: string | number | null | undefined) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function formatCsvDate() {
  return new Date().toISOString().slice(0, 10);
}

export function buildTransactionsCsv(transactions: Transaction[], accounts: Account[]) {
  const accountNames = new Map(accounts.map((account) => [account.id, account.name]));
  const headers = [
    "Fecha y hora",
    "Tipo",
    "Cuenta origen",
    "Cuenta destino",
    "Categoria",
    "Descripcion",
    "Monto",
  ];

  const rows = transactions.map((transaction) => [
    `${transaction.date} ${transaction.time.slice(0, 5)}`,
    typeLabels[transaction.type],
    accountNames.get(transaction.account_id) ?? "",
    transaction.destination_account_id ? accountNames.get(transaction.destination_account_id) ?? "" : "",
    transaction.category,
    transaction.description ?? "",
    transaction.amount.toFixed(2),
  ]);

  return [headers, ...rows]
    .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
    .join("\r\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
