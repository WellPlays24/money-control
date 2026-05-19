import { AppNav } from "@/components/app-nav";
import { PrintReportButton } from "@/components/print-report-button";
import { getFinanceData } from "@/lib/data";
import { calculateBalances, formatMoney, getExpensesByCategory, getGeneralBalance, getMonthlySummary } from "@/lib/finance";

const typeLabels = {
  income: "Ingreso",
  expense: "Egreso",
  transfer: "Transferencia",
};

export default async function ReportsPage() {
  const { accounts, transactions } = await getFinanceData();
  const balances = calculateBalances(accounts, transactions);
  const monthly = getMonthlySummary(transactions);
  const expenses = getExpensesByCategory(transactions);
  const accountNames = new Map(accounts.map((account) => [account.id, account.name]));
  const generatedAt = new Intl.DateTimeFormat("es-EC", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date());

  return (
    <main className="shell">
      <AppNav />
      <div className="page-heading">
        <div>
          <h1 className="page-title">Reportes</h1>
          <p className="muted print-only">Generado: {generatedAt}</p>
        </div>
        <PrintReportButton />
      </div>
      <section className="grid report-section">
        <article className="card stat">
          <p className="muted">Balance general</p>
          <p className="amount">{formatMoney(getGeneralBalance(balances))}</p>
        </article>
        <article className="card stat">
          <p className="muted">Ingresos del mes</p>
          <p className="amount positive">{formatMoney(monthly.income)}</p>
        </article>
        <article className="card stat">
          <p className="muted">Egresos del mes</p>
          <p className="amount negative">{formatMoney(monthly.expense)}</p>
        </article>
      </section>
      <section className="card table-wrap report-section">
        <h2>Saldos por cuenta</h2>
        <table>
          <thead>
            <tr>
              <th>Cuenta</th>
              <th>Saldo inicial</th>
              <th>Ingresos</th>
              <th>Egresos</th>
              <th>Transferencias entrada</th>
              <th>Transferencias salida</th>
              <th>Saldo actual</th>
            </tr>
          </thead>
          <tbody>
            {balances.map((account) => (
              <tr key={account.id}>
                <td>{account.name}</td>
                <td>{formatMoney(account.initial_balance)}</td>
                <td>{formatMoney(account.income)}</td>
                <td>{formatMoney(account.expense)}</td>
                <td>{formatMoney(account.transfersIn)}</td>
                <td>{formatMoney(account.transfersOut)}</td>
                <td>{formatMoney(account.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="card table-wrap report-section">
        <h2>Gastos por categoria</h2>
        <table>
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.category}>
                <td>{expense.category}</td>
                <td>{formatMoney(expense.amount)}</td>
              </tr>
            ))}
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={2}>Todavia no hay egresos registrados.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
      <section className="card table-wrap report-section">
        <h2>Movimientos para analisis</h2>
        <p className="muted">
          Puedes guardar este reporte como PDF y pedir a una IA que analice patrones, gastos altos y oportunidades de ahorro.
        </p>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Cuenta origen</th>
              <th>Cuenta destino</th>
              <th>Categoria</th>
              <th>Descripcion</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{typeLabels[transaction.type]}</td>
                <td>{accountNames.get(transaction.account_id) ?? "-"}</td>
                <td>
                  {transaction.destination_account_id
                    ? accountNames.get(transaction.destination_account_id)
                    : "-"}
                </td>
                <td>{transaction.category}</td>
                <td>{transaction.description ?? "-"}</td>
                <td>{formatMoney(transaction.amount)}</td>
              </tr>
            ))}
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={7}>Todavia no hay movimientos registrados.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </main>
  );
}
