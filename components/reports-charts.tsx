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

const colors = ["#d7772f", "#237653", "#173b33", "#b23b3b", "#d2a24c", "#6b7f76"];

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
  expenses,
  monthlyHistory,
}: {
  expenses: ExpenseCategory[];
  monthlyHistory: MonthlyHistoryItem[];
}) {
  const monthlyData = monthlyHistory.slice().reverse();

  return (
    <section className="charts-grid report-section no-print">
      <article className="card chart-card">
        <h2>Gastos por categoria</h2>
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
              <Bar dataKey="income" fill="#237653" name="Ingresos" />
              <Bar dataKey="expense" fill="#b23b3b" name="Egresos" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="muted">No hay historial para graficar.</p>
        )}
      </article>
      <article className="card chart-card wide-chart">
        <h2>Balance neto mensual</h2>
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
    </section>
  );
}
