"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyHistoryItem } from "@/lib/finance";
import type { AccountBalance } from "@/lib/types";

const colors = ["#22d3ee", "#0af2c7", "#8b5cf6", "#ff4d6d", "#f59e0b", "#8da6b8"];

type ExpenseCategory = {
  category: string;
  amount: number;
};

function moneyTooltip(value: unknown): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return String(value ?? "");
  return `$${amount.toFixed(2)}`;
}

export function ReportsCharts({
  accountBalances,
  expenses,
  monthlyHistory,
}: {
  accountBalances: AccountBalance[];
  expenses: ExpenseCategory[];
  monthlyHistory: MonthlyHistoryItem[];
}) {
  const monthlyData = monthlyHistory.slice().reverse();
  const activeAccountBalances = accountBalances.filter((account) => !account.archived);

  return (
    <section className="charts-grid report-section">
      <article className="card chart-card">
        <h2>Ingresos vs egresos</h2>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer height={280} width="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={moneyTooltip} />
              <Legend />
              <Bar dataKey="income" fill="#0af2c7" name="Ingresos" />
              <Bar dataKey="expense" fill="#ff4d6d" name="Egresos" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="muted">No hay historial para graficar.</p>
        )}
      </article>
      <article className="card chart-card wide-chart">
        <h2>Gastos por categoria</h2>
        {expenses.length > 0 ? (
          <ResponsiveContainer height={320} width="100%">
            <BarChart data={expenses} layout="vertical" margin={{ left: 18, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={120} />
              <Tooltip formatter={moneyTooltip} />
              <Bar dataKey="amount" name="Gasto">
                {expenses.map((entry, index) => (
                  <Cell key={entry.category} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="muted">No hay egresos para graficar.</p>
        )}
      </article>
      <article className="card chart-card">
        <h2>Distribucion de gastos</h2>
        {expenses.length > 0 ? (
          <ResponsiveContainer height={280} width="100%">
            <PieChart>
              <Pie
                data={expenses}
                dataKey="amount"
                innerRadius={58}
                nameKey="category"
                outerRadius={96}
                paddingAngle={2}
              >
                {expenses.map((entry, index) => (
                  <Cell key={entry.category} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={moneyTooltip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="muted">No hay egresos para graficar.</p>
        )}
      </article>
      <article className="card chart-card wide-chart">
        <h2>Historial mensual</h2>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer height={280} width="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={moneyTooltip} />
              <Bar dataKey="net" name="Balance neto">
                {monthlyData.map((item) => (
                  <Cell key={`${item.year}-${item.month}`} fill={item.net >= 0 ? "#237653" : "#b23b3b"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="muted">No hay balance mensual para graficar.</p>
        )}
      </article>
      <article className="card chart-card wide-chart">
        <h2>Saldos por cuenta</h2>
        {activeAccountBalances.length > 0 ? (
          <ResponsiveContainer height={320} width="100%">
            <BarChart data={activeAccountBalances} layout="vertical" margin={{ left: 18, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip formatter={moneyTooltip} />
              <Bar dataKey="balance" name="Saldo actual">
                {activeAccountBalances.map((account) => (
                  <Cell key={account.id} fill={account.balance >= 0 ? "#0af2c7" : "#ff4d6d"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="muted">No hay cuentas activas para graficar.</p>
        )}
      </article>
    </section>
  );
}
