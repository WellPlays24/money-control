import { AccountModal } from "@/components/account-modal";
import { AccountTable } from "@/components/account-table";
import { AppNav } from "@/components/app-nav";
import { getFinanceData } from "@/lib/data";
import { calculateBalances } from "@/lib/finance";

export default async function AccountsPage() {
  const { accounts, transactions } = await getFinanceData();
  const balances = calculateBalances(accounts, transactions);
  const activeBalances = balances.filter((account) => !account.archived);

  return (
    <main className="shell">
      <AppNav />
      <div className="page-heading">
        <h1 className="page-title">Cuentas</h1>
        <AccountModal />
      </div>
      <div className="stack">
        <AccountTable accounts={activeBalances} />
      </div>
    </main>
  );
}
