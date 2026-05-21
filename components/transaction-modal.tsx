"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { TransactionForm } from "@/components/transaction-form";
import type { Account, Category } from "@/lib/types";

export function TransactionModal({
  accounts,
  categories,
}: {
  accounts: Account[];
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const modal = open ? (
    <div className="modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
      <section
        aria-modal="true"
        className="modal-card wide-modal"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="muted">Ingreso, egreso o transferencia</p>
            <h2>Agregar movimiento</h2>
          </div>
          <button className="icon-button" onClick={() => setOpen(false)} type="button">
            Cerrar
          </button>
        </div>
        <TransactionForm
          accounts={accounts}
          categories={categories}
          className="form"
          onSuccess={() => setOpen(false)}
        />
      </section>
    </div>
  ) : null;

  return (
    <>
      <button
        className="button add-button"
        disabled={accounts.length === 0}
        onClick={() => setOpen(true)}
        type="button"
      >
        Agregar movimiento
      </button>
      {modal ? createPortal(modal, document.body) : null}
    </>
  );
}
