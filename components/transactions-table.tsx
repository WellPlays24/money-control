import { deleteTransaction, updateTransaction } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { formatMoney } from "@/lib/finance";
import type { Account, Category, Transaction } from "@/lib/types";

export function TransactionsTable({
  accounts,
  categories = [],
  transactions,
}: {
  accounts: Account[];
  categories?: Category[];
  transactions: Transaction[];
}) {
  const accountNames = new Map(accounts.map((account) => [account.id, account.name]));

  return (
    <div className="card table-wrap">
      <h2>Movimientos</h2>
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Cuenta</th>
            <th>Destino</th>
            <th>Categoria</th>
            <th>Descripcion</th>
            <th>Monto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td data-label="Fecha">
                <ActionForm
                  action={updateTransaction}
                  className="inline-form"
                  id={`tx-${transaction.id}`}
                  successMessage="Movimiento actualizado correctamente."
                >
                  <input name="id" type="hidden" value={transaction.id} />
                  <input name="date" type="date" defaultValue={transaction.date} required />
                </ActionForm>
              </td>
              <td data-label="Tipo">
                <select name="type" defaultValue={transaction.type} form={`tx-${transaction.id}`}>
                  <option value="income">Ingreso</option>
                  <option value="expense">Egreso</option>
                  <option value="transfer">Transferencia</option>
                </select>
              </td>
              <td data-label="Cuenta">
                <select
                  name="account_id"
                  defaultValue={transaction.account_id}
                  form={`tx-${transaction.id}`}
                  required
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </td>
              <td data-label="Destino">
                <select
                  name="destination_account_id"
                  defaultValue={transaction.destination_account_id ?? ""}
                  form={`tx-${transaction.id}`}
                >
                  <option value="">Sin destino</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
                <span className="sr-only">{accountNames.get(transaction.account_id) ?? "-"}</span>
              </td>
              <td data-label="Categoria">
                <select
                  name="category"
                  defaultValue={transaction.category}
                  form={`tx-${transaction.id}`}
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                  <option value="Transferencia">Transferencia</option>
                  {!categories.some((category) => category.name === transaction.category) &&
                  transaction.category !== "Transferencia" ? (
                    <option value={transaction.category}>{transaction.category}</option>
                  ) : null}
                </select>
              </td>
              <td data-label="Descripcion">
                <input
                  name="description"
                  defaultValue={transaction.description ?? ""}
                  form={`tx-${transaction.id}`}
                  placeholder="Opcional"
                />
              </td>
              <td data-label="Monto">
                <input
                  name="amount"
                  min="0.01"
                  step="0.01"
                  type="number"
                  defaultValue={transaction.amount}
                  form={`tx-${transaction.id}`}
                  required
                />
                <span className="muted current-amount">{formatMoney(transaction.amount)}</span>
              </td>
              <td data-label="Acciones">
                <div className="actions">
                  <button className="small-button" form={`tx-${transaction.id}`} type="submit">
                    Guardar
                  </button>
                  <ActionForm
                    action={deleteTransaction}
                    confirmMessage="Esta accion no se puede deshacer. El movimiento se eliminara permanentemente. Deseas continuar?"
                    successMessage="Movimiento eliminado correctamente."
                  >
                    <input name="id" type="hidden" value={transaction.id} />
                    <button className="small-button danger-button" type="submit">
                      Eliminar
                    </button>
                  </ActionForm>
                </div>
              </td>
            </tr>
          ))}
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={8}>Todavia no hay movimientos.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
