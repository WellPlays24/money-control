import { AccountModal } from "@/components/account-modal";
import { AccountTable } from "@/components/account-table";
import { AccountsBalanceChart } from "@/components/accounts-balance-chart";
import { AppNav } from "@/components/app-nav";
import { getFinanceData } from "@/lib/data";
import { calculateBalances, formatMoney } from "@/lib/finance";

export default async function AccountsPage() {
  const { accounts, transactions } = await getFinanceData();
  const balances = calculateBalances(accounts, transactions);
  const activeBalances = balances.filter((account) => !account.archived);
  const includedTotal = activeBalances
    .filter((account) => account.include_in_balance)
    .reduce((total, account) => total + account.balance, 0);
  const excludedBalances = activeBalances.filter((account) => !account.include_in_balance);
  const excludedTotal = excludedBalances.reduce((total, account) => total + account.balance, 0);

  return (
    <main className="shell">
      <AppNav />
      <div className="page-heading">
        <h1 className="page-title">Cuentas</h1>
        <AccountModal />
      </div>
      <div className="stack">
        <section className="card transactions-summary-strip" aria-label="Resumen de cuentas">
          <div>
            <span className="muted">Total incluido en balance</span>
            <strong className="positive">{formatMoney(includedTotal)}</strong>
          </div>
          <div>
            <span className="muted">Total excluido</span>
            <strong>{formatMoney(excludedTotal)}</strong>
          </div>
          <div>
            <span className="muted">Cuentas activas</span>
            <strong>{activeBalances.length}</strong>
          </div>
          <div>
            <span className="muted">Cuentas excluidas</span>
            <strong>{excludedBalances.length}</strong>
          </div>
        </section>
        <AccountsBalanceChart accounts={balances} />
        <AccountTable accounts={balances} />
      </div>
    </main>
  );
}
