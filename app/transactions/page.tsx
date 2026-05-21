import { AppNav } from "@/components/app-nav";
import { ExportCsvButton } from "@/components/export-csv-button";
import { TransactionModal } from "@/components/transaction-modal";
import { TransactionsTable } from "@/components/transactions-table";
import { getFinanceData } from "@/lib/data";
import { formatMoney, getTransactionSummary } from "@/lib/finance";
import type { TransactionType } from "@/lib/types";

const transactionTypes = ["income", "expense", "transfer"];

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const startDate = getParam(params?.start) || "";
  const endDate = getParam(params?.end) || "";
  const accountId = getParam(params?.account) || "";
  const category = getParam(params?.category) || "";
  const requestedType = getParam(params?.type) || "all";
  const type = transactionTypes.includes(requestedType) ? requestedType as TransactionType : "all";
  const search = (getParam(params?.search) || "").trim();
  const { accounts, transactions, categories } = await getFinanceData();
  const activeAccounts = accounts.filter((account) => !account.archived);
  const categoryOptions = Array.from(
    new Set([...categories.map((item) => item.name), ...transactions.map((transaction) => transaction.category)]),
  ).sort((a, b) => a.localeCompare(b));
  const normalizedSearch = search.toLowerCase();
  const filteredTransactions = transactions.filter((transaction) => {
    if (startDate && transaction.date < startDate) return false;
    if (endDate && transaction.date > endDate) return false;
    if (accountId && transaction.account_id !== accountId && transaction.destination_account_id !== accountId) {
      return false;
    }
    if (category && transaction.category !== category) return false;
    if (type !== "all" && transaction.type !== type) return false;
    if (normalizedSearch && !(transaction.description ?? "").toLowerCase().includes(normalizedSearch)) {
      return false;
    }
    return true;
  });
  const filteredSummary = getTransactionSummary(filteredTransactions);
  const showDestination = type === "all" || type === "transfer";

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
        <form className="card filter-bar transactions-filter-bar">
          <div className="field">
            <label htmlFor="start">Fecha inicio</label>
            <input id="start" name="start" type="date" defaultValue={startDate} />
          </div>
          <div className="field">
            <label htmlFor="end">Fecha fin</label>
            <input id="end" name="end" type="date" defaultValue={endDate} />
          </div>
          <div className="field">
            <label htmlFor="account">Cuenta</label>
            <select id="account" name="account" defaultValue={accountId}>
              <option value="">Todas</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="category">Categoria</label>
            <select id="category" name="category" defaultValue={category}>
              <option value="">Todas</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="type">Tipo</label>
            <select id="type" name="type" defaultValue={type}>
              <option value="all">Todos</option>
              <option value="income">Ingresos</option>
              <option value="expense">Egresos</option>
              <option value="transfer">Transferencias</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="search">Descripcion</label>
            <input id="search" name="search" placeholder="Buscar texto" type="search" defaultValue={search} />
          </div>
          <button className="button filter-action" type="submit">
            Aplicar filtros
          </button>
          <a className="ghost-button clear-filter filter-action" href="/transactions">
            Limpiar filtros
          </a>
        </form>
        <section className="card transactions-summary-strip" aria-label="Resumen de resultados filtrados">
          <div>
            <span className="muted">Resultados</span>
            <strong>{filteredTransactions.length} movimientos</strong>
          </div>
          <div>
            <span className="muted">Ingresos</span>
            <strong className="positive">{formatMoney(filteredSummary.income)}</strong>
          </div>
          <div>
            <span className="muted">Egresos</span>
            <strong className="negative">{formatMoney(filteredSummary.expense)}</strong>
          </div>
          <div>
            <span className="muted">Balance</span>
            <strong className={filteredSummary.net >= 0 ? "positive" : "negative"}>
              {formatMoney(filteredSummary.net)}
            </strong>
          </div>
        </section>
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
