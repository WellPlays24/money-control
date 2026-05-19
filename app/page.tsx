import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { TransactionsTable } from "@/components/transactions-table";
import { getFinanceData } from "@/lib/data";
import { calculateBalances, formatMoney, getGeneralBalance, getSummaryForMonth } from "@/lib/finance";

const monthOptions = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const now = new Date();
  const selectedMonth = Number(getParam(params?.month)) || now.getMonth() + 1;
  const selectedYear = Number(getParam(params?.year)) || now.getFullYear();

  const { accounts, transactions, categories } = await getFinanceData();
  const balances = calculateBalances(accounts, transactions);
  const activeBalances = balances.filter((account) => !account.archived);
  const generalBalance = getGeneralBalance(balances);
  const monthly = getSummaryForMonth(transactions, selectedMonth, selectedYear);
  const availableYears = Array.from(
    new Set([
      now.getFullYear(),
      ...transactions.map((transaction) => new Date(`${transaction.date}T00:00:00`).getFullYear()),
    ]),
  ).sort((a, b) => b - a);

  return (
    <main className="shell">
      <AppNav />
      <section className="hero">
        <p className="muted">Balance general</p>
        <h1>{formatMoney(generalBalance)}</h1>
        <p className="muted">Tu dinero actual sumando todas tus cuentas registradas.</p>
      </section>
      <form className="card filter-bar">
        <div className="field">
          <label htmlFor="month">Mes</label>
          <select id="month" name="month" defaultValue={selectedMonth}>
            {monthOptions.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="year">Año</label>
          <select id="year" name="year" defaultValue={selectedYear}>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <button className="button" type="submit">
          Aplicar
        </button>
      </form>
      <section className="grid">
        <article className="card stat">
          <p className="muted">Ingresos del mes</p>
          <p className="amount positive">{formatMoney(monthly.income)}</p>
        </article>
        <article className="card stat">
          <p className="muted">Egresos del mes</p>
          <p className="amount negative">{formatMoney(monthly.expense)}</p>
        </article>
        <article className="card stat">
          <p className="muted">Transferencias del mes</p>
          <p className="amount">{formatMoney(monthly.transfers)}</p>
        </article>
      </section>
      <section className="stack" style={{ marginTop: 16 }}>
        <div className="grid">
          {activeBalances.map((account) => (
            <article className="card" key={account.id}>
              <p className="muted">{account.type}</p>
              <h2>{account.name}</h2>
              <p className="amount">{formatMoney(account.balance)}</p>
            </article>
          ))}
        </div>
        {accounts.length === 0 ? (
          <div className="card">
            <h2>Primero crea tus cuentas</h2>
            <p className="muted">Registra con cuanto dinero empiezas en cada banco, cooperativa o efectivo.</p>
            <Link className="button" href="/accounts">
              Crear cuentas
            </Link>
          </div>
        ) : null}
        <TransactionsTable accounts={accounts} categories={categories} transactions={transactions.slice(0, 8)} />
      </section>
    </main>
  );
}
