"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AccountBalance } from "@/lib/types";

function moneyTooltip(value: unknown): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return String(value ?? "");
  return `$${amount.toFixed(2)}`;
}

export function AccountsBalanceChart({ accounts }: { accounts: AccountBalance[] }) {
  const [showExcluded, setShowExcluded] = useState(false);
  const chartAccounts = accounts
    .filter((account) => !account.archived)
    .filter((account) => showExcluded || account.include_in_balance)
    .sort((a, b) => b.balance - a.balance)
    .map((account) => ({
      ...account,
      chartName: account.institution ? `${account.name} (${account.institution})` : account.name,
    }));

  return (
    <section className="card chart-card accounts-chart-card">
      <div className="chart-card-header">
        <div>
          <p className="muted">Orden descendente por saldo actual</p>
          <h2>Saldos por cuenta</h2>
        </div>
        <label className="switch-field compact-switch">
          <input
            checked={showExcluded}
            onChange={(event) => setShowExcluded(event.target.checked)}
            type="checkbox"
          />
          <span>Mostrar excluidas</span>
        </label>
      </div>
      {chartAccounts.length > 0 ? (
        <ResponsiveContainer height={340} width="100%">
          <BarChart data={chartAccounts} layout="vertical" margin={{ left: 18, right: 24 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="chartName" type="category" width={150} />
            <Tooltip formatter={moneyTooltip} />
            <Bar dataKey="balance" name="Saldo actual">
              {chartAccounts.map((account) => (
                <Cell key={account.id} fill={account.include_in_balance ? "#0af2c7" : "#8da6b8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="muted">No hay cuentas para graficar con este filtro.</p>
      )}
    </section>
  );
}
