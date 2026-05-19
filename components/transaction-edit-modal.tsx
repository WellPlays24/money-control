"use client";

import { useState } from "react";
import { updateTransaction } from "@/app/actions";
import { TransactionForm } from "@/components/transaction-form";
import type { Account, Category, Transaction } from "@/lib/types";

export function TransactionEditModal({
  accounts,
  categories,
  transaction,
}: {
  accounts: Account[];
  categories: Category[];
  transaction: Transaction;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="small-button" onClick={() => setOpen(true)} type="button">
        Editar
      </button>
      {open ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <section
            aria-modal="true"
            className="modal-card wide-modal"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="muted">Actualizar movimiento</p>
                <h2>Editar movimiento</h2>
              </div>
              <button className="icon-button" onClick={() => setOpen(false)} type="button">
                Cerrar
              </button>
            </div>
            <TransactionForm
              accounts={accounts}
              action={updateTransaction}
              categories={categories}
              className="form"
              successMessage="Movimiento actualizado correctamente."
              title="Datos del movimiento"
              transaction={transaction}
            />
          </section>
        </div>
      ) : null}
    </>
  );
}
