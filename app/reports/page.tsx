import { AppNav } from "@/components/app-nav";
import { ExportCsvButton } from "@/components/export-csv-button";
import { PrintReportButton } from "@/components/print-report-button";
import { ReportsCharts } from "@/components/reports-charts";
import { getFinanceData } from "@/lib/data";
import {
  calculateBalances,
  filterTransactionsByDateRange,
  formatMoney,
  getExpensesByCategory,
  getGeneralBalance,
  getMonthlyHistory,
  getMonthlySummary,
  getTransactionSummary,
  isValidDateRange,
} from "@/lib/finance";

const typeLabels = {
  income: "Ingreso",
  expense: "Egreso",
  transfer: "Transferencia",
};

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const startDate = getParam(params?.start) || "";
  const endDate = getParam(params?.end) || "";
  const validRange = isValidDateRange(startDate || undefined, endDate || undefined);
  const { accounts, transactions } = await getFinanceData();
  const balances = calculateBalances(accounts, transactions);
  const filteredTransactions = validRange
    ? filterTransactionsByDateRange(transactions, startDate || undefined, endDate || undefined)
    : transactions;
  const summary = getTransactionSummary(filteredTransactions);
  const monthly = startDate || endDate ? summary : getMonthlySummary(transactions);
  const expenses = getExpensesByCategory(filteredTransactions);
  const monthlyHistory = getMonthlyHistory(filteredTransactions);
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
        <div className="page-actions">
          <ExportCsvButton
            accounts={accounts}
            filenamePrefix="moneycontrol_reportes"
            transactions={filteredTransactions}
          />
          <PrintReportButton />
        </div>
      </div>
      <form className="card filter-bar no-print">
        <div className="field">
          <label htmlFor="start">Fecha inicio</label>
          <input id="start" name="start" type="date" defaultValue={startDate} />
        </div>
        <div className="field">
          <label htmlFor="end">Fecha fin</label>
          <input id="end" name="end" type="date" defaultValue={endDate} />
        </div>
        <button className="button" type="submit">
          Aplicar filtros
        </button>
        <a className="ghost-button clear-filter" href="/reports">
          Limpiar filtros
        </a>
      </form>
      {!validRange ? (
        <p className="form-message error-message">
          La fecha inicio no puede ser mayor que la fecha fin. Se muestran los datos sin aplicar ese rango.
        </p>
      ) : null}
      <section className="grid report-section">
        <article className="card stat">
          <p className="muted">Balance general</p>
          <p className="amount">{formatMoney(getGeneralBalance(balances))}</p>
        </article>
        <article className="card stat">
          <p className="muted">Ingresos</p>
          <p className="amount positive">{formatMoney(monthly.income)}</p>
        </article>
        <article className="card stat">
          <p className="muted">Egresos</p>
          <p className="amount negative">{formatMoney(monthly.expense)}</p>
        </article>
        <article className="card stat">
          <p className="muted">Transferencias</p>
          <p className="amount">{formatMoney(monthly.transfers)}</p>
        </article>
        <article className="card stat">
          <p className="muted">Balance neto</p>
          <p className={monthly.net >= 0 ? "amount positive" : "amount negative"}>
            {formatMoney(monthly.net)}
          </p>
        </article>
      </section>
      {filteredTransactions.length === 0 ? (
        <p className="form-message success-message">
          No hay movimientos para el rango seleccionado.
        </p>
      ) : null}
      <ReportsCharts expenses={expenses} monthlyHistory={monthlyHistory} />
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
        <h2>Historial mensual</h2>
        <table>
          <thead>
            <tr>
              <th>Mes/Año</th>
              <th>Ingresos</th>
              <th>Egresos</th>
              <th>Transferencias</th>
              <th>Balance neto</th>
            </tr>
          </thead>
          <tbody>
            {monthlyHistory.map((item) => (
              <tr key={`${item.year}-${item.month}`}>
                <td>{item.label}</td>
                <td>{formatMoney(item.income)}</td>
                <td>{formatMoney(item.expense)}</td>
                <td>{formatMoney(item.transfers)}</td>
                <td>{formatMoney(item.net)}</td>
              </tr>
            ))}
            {monthlyHistory.length === 0 ? (
              <tr>
                <td colSpan={5}>No hay historial mensual para mostrar.</td>
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
            {filteredTransactions.map((transaction) => (
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
            {filteredTransactions.length === 0 ? (
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
