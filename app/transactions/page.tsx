import { AppNav } from "@/components/app-nav";
import { ExportCsvButton } from "@/components/export-csv-button";
import { TransactionModal } from "@/components/transaction-modal";
import { TransactionsTable } from "@/components/transactions-table";
import { getFinanceData } from "@/lib/data";

export default async function TransactionsPage() {
  const { accounts, transactions, categories } = await getFinanceData();
  const activeAccounts = accounts.filter((account) => !account.archived);

  return (
    <main className="shell">
      <AppNav />
      <div className="page-heading">
        <h1 className="page-title">Movimientos</h1>
        <div className="page-actions">
          <ExportCsvButton
            accounts={accounts}
            filenamePrefix="moneycontrol_movimientos"
            transactions={transactions}
          />
          <TransactionModal accounts={activeAccounts} categories={categories} />
        </div>
      </div>
      <div className="stack">
        {activeAccounts.length === 0 ? (
          <div className="card">
            <h2>Crea al menos una cuenta</h2>
            <p className="muted">Necesitas una cuenta antes de registrar ingresos, egresos o transferencias.</p>
          </div>
        ) : null}
        {activeAccounts.length > 0 && categories.length === 0 ? (
          <div className="card">
            <h2>Crea tus categorias</h2>
            <p className="muted">
              Es recomendable crear categorias para ordenar tus reportes. Puedes usar Transferencia mientras tanto.
            </p>
          </div>
        ) : null}
        <TransactionsTable accounts={accounts} categories={categories} transactions={transactions} />
      </div>
    </main>
  );
}
