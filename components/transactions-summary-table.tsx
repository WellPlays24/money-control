import { formatMoney, formatTransactionDateTime } from "@/lib/finance";
import type { Account, Transaction } from "@/lib/types";

const typeLabels = {
  income: "Ingreso",
  expense: "Egreso",
  transfer: "Transferencia",
};

export function TransactionsSummaryTable({
  accounts,
  transactions,
}: {
  accounts: Account[];
  transactions: Transaction[];
}) {
  const accountNames = new Map(accounts.map((account) => [account.id, account.name]));

  return (
    <div className="card table-wrap">
      <h2>Resumen de movimientos</h2>
      <table className="responsive-table transactions-table">
        <thead>
          <tr>
            <th className="date-cell">Fecha y hora</th>
            <th>Tipo</th>
            <th>Cuenta</th>
            <th>Destino</th>
            <th className="category-cell">Categoria</th>
            <th className="description-cell">Descripcion</th>
            <th className="amount-cell">Monto</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="date-cell" data-label="Fecha y hora">{formatTransactionDateTime(transaction)}</td>
              <td data-label="Tipo">{typeLabels[transaction.type]}</td>
              <td data-label="Cuenta">{accountNames.get(transaction.account_id) ?? "-"}</td>
              <td data-label="Destino">
                {transaction.destination_account_id
                  ? accountNames.get(transaction.destination_account_id) ?? "-"
                  : "-"}
              </td>
              <td className="category-cell" data-label="Categoria">{transaction.category}</td>
              <td className="description-cell" data-label="Descripcion">{transaction.description ?? "-"}</td>
              <td className="amount-cell" data-label="Monto">{formatMoney(transaction.amount)}</td>
            </tr>
          ))}
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={7}>Todavia no hay movimientos.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
