"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/finance";
import type { AccountBalance } from "@/lib/types";

export function AccountBalanceSelector({ accounts }: { accounts: AccountBalance[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectedAccounts = accounts.filter((account) => selectedIds.includes(account.id));
  const selectedTotal = selectedAccounts.reduce((total, account) => total + account.balance, 0);

  function toggleAccount(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((currentId) => currentId !== id) : [...current, id],
    );
  }

  return (
    <section className="card stack">
      <div>
        <p className="muted">Suma personalizada</p>
        <h2>Selecciona cuentas para sumar</h2>
        <p className="muted">Ejemplo: efectivo + un banco, sin incluir todas tus cuentas.</p>
      </div>
      <div className="account-selector-grid">
        {accounts.map((account) => (
          <label className="account-check" key={account.id}>
            <input
              checked={selectedIds.includes(account.id)}
              onChange={() => toggleAccount(account.id)}
              type="checkbox"
            />
            <span>
              <strong>{account.name}</strong>
              <small>{formatMoney(account.balance)}</small>
            </span>
          </label>
        ))}
      </div>
      <div className="custom-total">
        <span className="muted">Total seleccionado</span>
        <strong>{formatMoney(selectedTotal)}</strong>
      </div>
      {selectedAccounts.length === 0 ? (
        <p className="muted">Selecciona una o más cuentas para calcular un total parcial.</p>
      ) : null}
    </section>
  );
}
