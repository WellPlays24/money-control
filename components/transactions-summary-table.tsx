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
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Fecha y hora</th>
            <th>Tipo</th>
            <th>Cuenta</th>
            <th>Destino</th>
            <th>Categoria</th>
            <th>Descripcion</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td data-label="Fecha y hora">{formatTransactionDateTime(transaction)}</td>
              <td data-label="Tipo">{typeLabels[transaction.type]}</td>
              <td data-label="Cuenta">{accountNames.get(transaction.account_id) ?? "-"}</td>
              <td data-label="Destino">
                {transaction.destination_account_id
                  ? accountNames.get(transaction.destination_account_id) ?? "-"
                  : "-"}
              </td>
              <td data-label="Categoria">{transaction.category}</td>
              <td data-label="Descripcion">{transaction.description ?? "-"}</td>
              <td data-label="Monto">{formatMoney(transaction.amount)}</td>
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
