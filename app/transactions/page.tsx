import { AppNav } from "@/components/app-nav";
import { ExportCsvButton } from "@/components/export-csv-button";
import { TransactionModal } from "@/components/transaction-modal";
import { TransactionsTable } from "@/components/transactions-table";
import { getFinanceData } from "@/lib/data";

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const view = getParam(params?.view) ?? "all";
  const { accounts, transactions, categories } = await getFinanceData();
  const activeAccounts = accounts.filter((account) => !account.archived);
  const filteredTransactions = view === "regular"
    ? transactions.filter((transaction) => transaction.type !== "transfer")
    : view === "transfer"
      ? transactions.filter((transaction) => transaction.type === "transfer")
      : transactions;
  const showDestination = view !== "regular";

  return (
    <main className="shell">
      <AppNav />
      <div className="page-heading">
        <h1 className="page-title">Movimientos</h1>
        <div className="page-actions">
          <ExportCsvButton
            accounts={accounts}
            filenamePrefix="moneycontrol_movimientos"
            transactions={filteredTransactions}
          />
          <TransactionModal accounts={activeAccounts} categories={categories} />
        </div>
      </div>
      <div className="stack">
        <form className="card filter-bar">
          <div className="field">
            <label htmlFor="view">Mostrar</label>
            <select id="view" name="view" defaultValue={view}>
              <option value="all">Todos</option>
              <option value="regular">Ingresos y egresos</option>
              <option value="transfer">Transferencias</option>
            </select>
          </div>
          <button className="button" type="submit">
            Aplicar filtro
          </button>
          <a className="ghost-button clear-filter" href="/transactions">
            Limpiar filtro
          </a>
        </form>
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
        <TransactionsTable
          accounts={accounts}
          categories={categories}
          showDestination={showDestination}
          transactions={filteredTransactions}
        />
      </div>
    </main>
  );
}
