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
      <button aria-label="Editar movimiento" className="icon-action-button" onClick={() => setOpen(true)} title="Editar" type="button">
        <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
          <path d="M4 20h4l11-11-4-4L4 16v4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="m13 7 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        </svg>
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
              onSuccess={() => setOpen(false)}
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
