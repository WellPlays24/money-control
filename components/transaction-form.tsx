import { createTransaction } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { TransactionTypeCategoryFields } from "@/components/transaction-type-category-fields";
import type { Account, Category } from "@/lib/types";

const today = new Date().toISOString().slice(0, 10);

export function TransactionForm({
  accounts,
  categories,
  className = "card form",
}: {
  accounts: Account[];
  categories: Category[];
  className?: string;
}) {
  return (
    <ActionForm action={createTransaction} className={className} successMessage="Movimiento registrado correctamente.">
      <h2>Nuevo movimiento</h2>
      <div className="grid">
        <TransactionTypeCategoryFields categories={categories} />
        <div className="field">
          <label htmlFor="date">Fecha</label>
          <input id="date" name="date" type="date" defaultValue={today} required />
        </div>
      </div>
      <div className="grid">
        <div className="field">
          <label htmlFor="account_id">Cuenta origen</label>
          <select id="account_id" name="account_id" required>
            <option value="">Selecciona una cuenta</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="destination_account_id">Cuenta destino</label>
          <select id="destination_account_id" name="destination_account_id">
            <option value="">Solo para transferencias</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid">
        <div className="field">
          <label htmlFor="amount">Monto</label>
          <input id="amount" min="0.01" name="amount" step="0.01" type="number" required />
        </div>
      </div>
      <div className="field">
        <label htmlFor="description">Descripcion</label>
        <textarea id="description" name="description" placeholder="Opcional" rows={3} />
      </div>
      <button className="button" disabled={accounts.length === 0} type="submit">
        Registrar movimiento
      </button>
    </ActionForm>
  );
}
