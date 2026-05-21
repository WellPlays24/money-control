import { deleteTransaction } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { TransactionEditModal } from "@/components/transaction-edit-modal";
import { formatMoney, formatTransactionDateTime } from "@/lib/finance";
import type { Account, Category, Transaction } from "@/lib/types";

const typeLabels = {
  income: "Ingreso",
  expense: "Egreso",
  transfer: "Transferencia",
};

export function TransactionsTable({
  accounts,
  categories = [],
  showDestination = true,
  transactions,
}: {
  accounts: Account[];
  categories?: Category[];
  showDestination?: boolean;
  transactions: Transaction[];
}) {
  const accountNames = new Map(accounts.map((account) => [account.id, account.name]));

  return (
    <div className="card table-wrap">
      <h2>Movimientos</h2>
      <table className="responsive-table transactions-table">
        <thead>
          <tr>
            <th className="date-cell">Fecha y hora</th>
            <th>Tipo</th>
            <th>Cuenta</th>
            {showDestination ? <th>Destino</th> : null}
            <th className="category-cell">Categoria</th>
            <th className="description-cell">Descripcion</th>
            <th className="amount-cell">Monto</th>
            <th className="actions-cell">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="date-cell" data-label="Fecha y hora">{formatTransactionDateTime(transaction)}</td>
              <td data-label="Tipo">{typeLabels[transaction.type]}</td>
              <td data-label="Cuenta">{accountNames.get(transaction.account_id) ?? "-"}</td>
              {showDestination ? (
                <td data-label="Destino">
                  {transaction.destination_account_id
                    ? accountNames.get(transaction.destination_account_id) ?? "-"
                    : "-"}
                </td>
              ) : null}
              <td className="category-cell" data-label="Categoria">{transaction.category}</td>
              <td className="description-cell" data-label="Descripcion">{transaction.description ?? "-"}</td>
              <td className={`amount-cell ${transaction.type}-amount`} data-label="Monto">
                {formatMoney(transaction.amount)}
              </td>
              <td className="actions-cell" data-label="Acciones">
                <div className="actions">
                  <TransactionEditModal
                    accounts={accounts}
                    categories={categories}
                    transaction={transaction}
                  />
                  <ActionForm
                    action={deleteTransaction}
                    confirmMessage="Esta accion no se puede deshacer. El movimiento se eliminara permanentemente. Deseas continuar?"
                    successMessage="Movimiento eliminado correctamente."
                  >
                    <input name="id" type="hidden" value={transaction.id} />
                    <button aria-label="Eliminar movimiento" className="icon-action-button danger-icon-button" title="Eliminar" type="submit">
                      <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
                        <path d="M4 7h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                        <path d="M10 11v6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                        <path d="M14 11v6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                        <path d="M6 7l1 13h10l1-13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M9 7V4h6v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </button>
                  </ActionForm>
                </div>
              </td>
            </tr>
          ))}
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={showDestination ? 8 : 7}>Todavia no hay movimientos.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
