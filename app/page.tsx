import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { TransactionsTable } from "@/components/transactions-table";
import { getFinanceData } from "@/lib/data";
import { calculateBalances, formatMoney, getGeneralBalance, getMonthlySummary } from "@/lib/finance";

export default async function DashboardPage() {
  const { accounts, transactions, categories } = await getFinanceData();
  const balances = calculateBalances(accounts, transactions);
  const generalBalance = getGeneralBalance(balances);
  const monthly = getMonthlySummary(transactions);

  return (
    <main className="shell">
      <AppNav />
      <section className="hero">
        <p className="muted">Balance general</p>
        <h1>{formatMoney(generalBalance)}</h1>
        <p className="muted">Tu dinero actual sumando todas tus cuentas registradas.</p>
      </section>
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
          {balances.map((account) => (
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
