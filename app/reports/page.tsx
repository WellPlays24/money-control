import { AppNav } from "@/components/app-nav";
import { ExportCsvButton } from "@/components/export-csv-button";
import { PrintReportButton } from "@/components/print-report-button";
import { ReportAnalysisButton } from "@/components/report-analysis-button";
import { ReportSection } from "@/components/report-section";
import { ReportsCharts } from "@/components/reports-charts";
import { getFinanceData } from "@/lib/data";
import {
  calculateBalances,
  filterTransactionsByDateRange,
  formatMoney,
  getExpensesByCategory,
  getGeneralBalance,
  getMonthlyHistory,
  getTransactionSummary,
  isValidDateRange,
} from "@/lib/finance";

const typeLabels = {
  income: "Ingreso",
  expense: "Egreso",
  transfer: "Transferencia",
};

const accountTypeLabels = {
  bank: "Banco",
  cooperative: "Cooperativa",
  cash: "Efectivo",
  other: "Otro",
};

const transactionTypes = ["income", "expense", "transfer"];

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
  const accountId = getParam(params?.account) || "";
  const category = getParam(params?.category) || "";
  const requestedType = getParam(params?.type) || "all";
  const type = transactionTypes.includes(requestedType) ? requestedType : "all";
  const validRange = isValidDateRange(startDate || undefined, endDate || undefined);
  const { accounts, transactions, categories } = await getFinanceData();
  const balances = calculateBalances(accounts, transactions);
  const dateFilteredTransactions = validRange
    ? filterTransactionsByDateRange(transactions, startDate || undefined, endDate || undefined)
    : transactions;
  const categoryOptions = Array.from(
    new Set([...categories.map((item) => item.name), ...transactions.map((transaction) => transaction.category)]),
  ).sort((a, b) => a.localeCompare(b));
  const filteredTransactions = dateFilteredTransactions.filter((transaction) => {
    if (accountId && transaction.account_id !== accountId && transaction.destination_account_id !== accountId) {
      return false;
    }
    if (category && transaction.category !== category) return false;
    if (type !== "all" && transaction.type !== type) return false;
    return true;
  });
  const summary = getTransactionSummary(filteredTransactions);
  const expenses = getExpensesByCategory(filteredTransactions);
  const monthlyHistory = getMonthlyHistory(filteredTransactions);
  const accountNames = new Map(accounts.map((account) => [account.id, account.name]));
  const expenseTransactions = filteredTransactions.filter((transaction) => transaction.type === "expense");
  const expensesWithDetails = expenses.map((expense) => {
    const movementCount = expenseTransactions.filter((transaction) => transaction.category === expense.category).length;
    return {
      ...expense,
      movementCount,
      percentage: summary.expense > 0 ? (expense.amount / summary.expense) * 100 : 0,
    };
  });
  const topExpense = expensesWithDetails[0];
  const usedAccounts = new Map<string, number>();
  for (const transaction of filteredTransactions) {
    usedAccounts.set(transaction.account_id, (usedAccounts.get(transaction.account_id) ?? 0) + 1);
    if (transaction.destination_account_id) {
      usedAccounts.set(transaction.destination_account_id, (usedAccounts.get(transaction.destination_account_id) ?? 0) + 1);
    }
  }
  const mostUsedAccount = Array.from(usedAccounts.entries()).sort((a, b) => b[1] - a[1])[0];
  const expensesByDay = new Map<string, number>();
  for (const transaction of expenseTransactions) {
    expensesByDay.set(transaction.date, (expensesByDay.get(transaction.date) ?? 0) + transaction.amount);
  }
  const topExpenseDay = Array.from(expensesByDay.entries()).sort((a, b) => b[1] - a[1])[0];
  const averageExpense = expenseTransactions.length > 0 ? summary.expense / expenseTransactions.length : 0;
  const periodLabel = startDate || endDate
    ? `${startDate || "inicio"} - ${endDate || "hoy"}`
    : "Todos los movimientos";
  const recommendations = filteredTransactions.length > 0
    ? [
        topExpense
          ? `Categoria con mayor gasto: ${topExpense.category} con ${formatMoney(topExpense.amount)}.`
          : "No registraste egresos en este periodo.",
        `Gasto promedio por egreso: ${formatMoney(averageExpense)}.`,
        topExpenseDay
          ? `Dia con mas gasto: ${topExpenseDay[0]} con ${formatMoney(topExpenseDay[1])}.`
          : "No hay dias con egresos para destacar.",
        mostUsedAccount
          ? `Cuenta mas usada: ${accountNames.get(mostUsedAccount[0]) ?? "-"} con ${mostUsedAccount[1]} movimientos.`
          : "No hay cuentas usadas en el periodo.",
        summary.expense > summary.income
          ? `Sugerencia de ahorro: intenta reducir un 10% tu categoria principal para ahorrar ${formatMoney((topExpense?.amount ?? 0) * 0.1)}.`
          : "Sugerencia de ahorro: mantén el nivel de gastos por debajo de tus ingresos.",
      ]
    : ["No existen movimientos para generar recomendaciones con los filtros seleccionados."];
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
          <p className="muted print-only">Rango: {periodLabel}</p>
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
      <form className="card filter-bar report-filter-bar no-print">
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
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="category">Categoria</label>
          <select id="category" name="category" defaultValue={category}>
            <option value="">Todas</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
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
          <p className="amount">
            {formatMoney(
              getGeneralBalance(
                balances.filter((account) => !account.archived && account.include_in_balance),
              ),
            )}
          </p>
        </article>
        <article className="card stat">
          <p className="muted">Ingresos</p>
          <p className="amount positive">{formatMoney(summary.income)}</p>
        </article>
        <article className="card stat">
          <p className="muted">Egresos</p>
          <p className="amount negative">{formatMoney(summary.expense)}</p>
        </article>
        <article className="card stat">
          <p className="muted">Transferencias</p>
          <p className="amount">{formatMoney(summary.transfers)}</p>
        </article>
        <article className="card stat">
          <p className="muted">Balance neto</p>
          <p className={summary.net >= 0 ? "amount positive" : "amount negative"}>
            {formatMoney(summary.net)}
          </p>
        </article>
        <article className="card stat">
          <p className="muted">Cantidad de movimientos</p>
          <p className="amount">{filteredTransactions.length}</p>
        </article>
      </section>
      {filteredTransactions.length === 0 ? (
        <p className="form-message success-message">
          No existen movimientos para los filtros seleccionados.
        </p>
      ) : null}
      <section className="card report-section">
        <h2>Analisis del periodo</h2>
        <p className="muted">
          Durante este periodo registraste {filteredTransactions.length} movimientos. Tus egresos fueron de {formatMoney(summary.expense)} y tus ingresos de {formatMoney(summary.income)}, dejando un balance neto de {formatMoney(summary.net)}. {topExpense ? `La categoria con mayor gasto fue ${topExpense.category}.` : "No hay una categoria de gasto dominante."}
        </p>
      </section>
      <ReportAnalysisButton recommendations={recommendations} />
      <ReportSection defaultOpen title="Graficos">
        {filteredTransactions.length > 0 ? (
          <ReportsCharts accountBalances={balances} expenses={expenses} monthlyHistory={monthlyHistory} />
        ) : (
          <p className="form-message success-message">No existen movimientos para graficar con los filtros seleccionados.</p>
        )}
      </ReportSection>
      <ReportSection title="Saldos por cuenta">
        <section className="card table-wrap">
          <table className="responsive-table report-table">
            <thead>
              <tr>
                <th>Cuenta</th>
                <th className="amount-cell">Saldo actual</th>
                <th>Incluida en balance</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((account) => (
                <tr key={account.id}>
                  <td data-label="Cuenta">{account.name}</td>
                  <td className="amount-cell" data-label="Saldo actual">{formatMoney(account.balance)}</td>
                  <td data-label="Incluida en balance">
                    {account.include_in_balance ? "Incluida" : "Excluida"}
                  </td>
                  <td data-label="Tipo">{accountTypeLabels[account.type]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </ReportSection>
      <ReportSection title="Gastos por categoria">
        <section className="card table-wrap">
          <table className="responsive-table report-table">
            <thead>
              <tr>
                <th>Categoria</th>
                <th className="amount-cell">Total</th>
                <th>% del gasto</th>
                <th>Movimientos</th>
              </tr>
            </thead>
            <tbody>
              {expensesWithDetails.map((expense) => (
                <tr key={expense.category}>
                  <td data-label="Categoria">{expense.category}</td>
                  <td className="amount-cell negative" data-label="Total">{formatMoney(expense.amount)}</td>
                  <td data-label="% del gasto">{expense.percentage.toFixed(1)}%</td>
                  <td data-label="Movimientos">{expense.movementCount}</td>
                </tr>
              ))}
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={4}>Todavia no hay egresos registrados.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>
      </ReportSection>
      <ReportSection title="Historial mensual">
        <section className="card table-wrap">
          <table className="responsive-table report-table">
            <thead>
              <tr>
                <th>Mes/Año</th>
                <th className="amount-cell">Ingresos</th>
                <th className="amount-cell">Egresos</th>
                <th className="amount-cell">Balance</th>
              </tr>
            </thead>
            <tbody>
              {monthlyHistory.map((item) => (
                <tr key={`${item.year}-${item.month}`}>
                  <td data-label="Mes/Año">{item.label}</td>
                  <td className="amount-cell positive" data-label="Ingresos">{formatMoney(item.income)}</td>
                  <td className="amount-cell negative" data-label="Egresos">{formatMoney(item.expense)}</td>
                  <td className={`amount-cell ${item.net >= 0 ? "positive" : "negative"}`} data-label="Balance">
                    {formatMoney(item.net)}
                  </td>
                </tr>
              ))}
              {monthlyHistory.length === 0 ? (
                <tr>
                  <td colSpan={4}>No hay historial mensual para mostrar.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>
      </ReportSection>
      <ReportSection title="Movimientos para analisis">
        <section className="card table-wrap">
          <p className="muted">
            Puedes guardar este reporte como PDF y pedir a una IA que analice patrones, gastos altos y oportunidades de ahorro.
          </p>
          <table>
            <thead>
              <tr>
                <th>Fecha y hora</th>
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
                  <td>{`${transaction.date} ${transaction.time.slice(0, 5)}`}</td>
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
      </ReportSection>
    </main>
  );
}
