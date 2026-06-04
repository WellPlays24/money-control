"use client";

import { useMemo, useState } from "react";
import { deleteTransaction } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { TransactionEditModal } from "@/components/transaction-edit-modal";
import { formatMoney, formatTransactionDateTime } from "@/lib/finance";
import type { Account, Category, Transaction } from "@/lib/types";

const pageSize = 10;

const typeLabels = {
  income: "Ingreso",
  expense: "Egreso",
  transfer: "Transferencia",
};

type SortDirection = "asc" | "desc";
type TransactionSortKey = "date" | "type" | "account" | "destination" | "category" | "description" | "amount" | "balance";

function getTransactionSortValue(transaction: Transaction) {
  return `${transaction.date} ${transaction.time} ${transaction.created_at} ${transaction.id}`;
}

function getRunningBalances(
  accounts: Account[],
  transactions: Transaction[],
  focusAccountId?: string,
) {
  const balances = new Map(accounts.map((account) => [account.id, account.initial_balance]));
  const transactionBalances = new Map<string, number>();

  for (const transaction of transactions.slice().sort((a, b) => getTransactionSortValue(a).localeCompare(getTransactionSortValue(b)))) {
    const sourceBalance = balances.get(transaction.account_id) ?? 0;

    if (transaction.type === "income") {
      balances.set(transaction.account_id, sourceBalance + transaction.amount);
    }

    if (transaction.type === "expense") {
      balances.set(transaction.account_id, sourceBalance - transaction.amount);
    }

    if (transaction.type === "transfer") {
      balances.set(transaction.account_id, sourceBalance - transaction.amount);

      if (transaction.destination_account_id) {
        balances.set(
          transaction.destination_account_id,
          (balances.get(transaction.destination_account_id) ?? 0) + transaction.amount,
        );
      }
    }

    const balanceAccountId = focusAccountId && (
      transaction.account_id === focusAccountId || transaction.destination_account_id === focusAccountId
    )
      ? focusAccountId
      : transaction.account_id;
    transactionBalances.set(transaction.id, balances.get(balanceAccountId) ?? 0);
  }

  return transactionBalances;
}

function SortButton({
  active,
  children,
  direction,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  direction: SortDirection;
  onClick: () => void;
}) {
  return (
    <button className="sortable-header" onClick={onClick} type="button">
      <span>{children}</span>
      <span className="sort-indicator">{active ? (direction === "asc" ? "^" : "v") : "-"}</span>
    </button>
  );
}

export function TransactionsTable({
  accounts,
  balanceTransactions,
  categories = [],
  focusAccountId,
  showDestination = true,
  transactions,
}: {
  accounts: Account[];
  balanceTransactions?: Transaction[];
  categories?: Category[];
  focusAccountId?: string;
  showDestination?: boolean;
  transactions: Transaction[];
}) {
  const accountNames = useMemo(() => new Map(accounts.map((account) => [account.id, account.name])), [accounts]);
  const transactionBalances = useMemo(
    () => getRunningBalances(accounts, balanceTransactions ?? transactions, focusAccountId),
    [accounts, balanceTransactions, focusAccountId, transactions],
  );
  const [sort, setSort] = useState<{ key: TransactionSortKey; direction: SortDirection }>({
    key: "date",
    direction: "desc",
  });
  const [page, setPage] = useState(1);
  const sortedTransactions = useMemo(() => {
    return transactions.slice().sort((a, b) => {
      const getValue = (transaction: Transaction) => {
        if (sort.key === "date") return `${transaction.date} ${transaction.time}`;
        if (sort.key === "type") return typeLabels[transaction.type];
        if (sort.key === "account") return accountNames.get(transaction.account_id) ?? "";
        if (sort.key === "destination") return transaction.destination_account_id ? accountNames.get(transaction.destination_account_id) ?? "" : "";
        if (sort.key === "category") return transaction.category;
        if (sort.key === "description") return transaction.description ?? "";
        if (sort.key === "balance") return transactionBalances.get(transaction.id) ?? 0;
        return transaction.amount;
      };
      const first = getValue(a);
      const second = getValue(b);
      const result = typeof first === "number" && typeof second === "number"
        ? first - second
        : String(first).localeCompare(String(second));
      return sort.direction === "asc" ? result : -result;
    });
  }, [accountNames, sort.direction, sort.key, transactionBalances, transactions]);
  const pageCount = Math.max(1, Math.ceil(sortedTransactions.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paginatedTransactions = sortedTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function updateSort(key: TransactionSortKey) {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  }

  return (
    <div className="card table-wrap">
      <h2>Movimientos</h2>
      <table className="responsive-table transactions-table">
        <thead>
          <tr>
            <th className="date-cell"><SortButton active={sort.key === "date"} direction={sort.direction} onClick={() => updateSort("date")}>Fecha y hora</SortButton></th>
            <th><SortButton active={sort.key === "type"} direction={sort.direction} onClick={() => updateSort("type")}>Tipo</SortButton></th>
            <th><SortButton active={sort.key === "account"} direction={sort.direction} onClick={() => updateSort("account")}>Cuenta</SortButton></th>
            {showDestination ? <th><SortButton active={sort.key === "destination"} direction={sort.direction} onClick={() => updateSort("destination")}>Destino</SortButton></th> : null}
            <th className="category-cell"><SortButton active={sort.key === "category"} direction={sort.direction} onClick={() => updateSort("category")}>Categoria</SortButton></th>
            <th className="description-cell"><SortButton active={sort.key === "description"} direction={sort.direction} onClick={() => updateSort("description")}>Descripcion</SortButton></th>
            <th className="amount-cell"><SortButton active={sort.key === "amount"} direction={sort.direction} onClick={() => updateSort("amount")}>Monto</SortButton></th>
            <th className="balance-cell"><SortButton active={sort.key === "balance"} direction={sort.direction} onClick={() => updateSort("balance")}>Saldo</SortButton></th>
            <th className="actions-cell">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTransactions.map((transaction) => (
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
              <td className="description-cell" data-label="Descripcion">
                <span className="description-text">{transaction.description ?? "-"}</span>
              </td>
              <td className={`amount-cell ${transaction.type}-amount`} data-label="Monto">
                {formatMoney(transaction.amount)}
              </td>
              <td className="balance-cell" data-label="Saldo">
                {formatMoney(transactionBalances.get(transaction.id) ?? 0)}
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
              <td colSpan={showDestination ? 9 : 8}>Todavia no hay movimientos.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
      {sortedTransactions.length > pageSize ? (
        <div className="table-pagination" aria-label="Paginacion de movimientos">
          <span>
            Pagina {currentPage} de {pageCount}
          </span>
          <div className="pagination-actions">
            <button
              className="ghost-button pagination-button"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              type="button"
            >
              Anterior
            </button>
            <button
              className="ghost-button pagination-button"
              disabled={currentPage === pageCount}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
              type="button"
            >
              Siguiente
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
