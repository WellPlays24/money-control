"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { updateAccount } from "@/app/actions";
import { AccountForm } from "@/components/account-form";
import type { Account } from "@/lib/types";

export function AccountEditModal({ account }: { account: Account }) {
  const [open, setOpen] = useState(false);
  const modal = open ? (
    <div className="modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
      <section
        aria-modal="true"
        className="modal-card"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="muted">Actualizar cuenta</p>
            <h2>Editar cuenta</h2>
          </div>
          <button className="icon-button" onClick={() => setOpen(false)} type="button">
            Cerrar
          </button>
        </div>
        <AccountForm
          account={account}
          action={updateAccount}
          className="form"
          onSuccess={() => setOpen(false)}
          successMessage="Cuenta actualizada correctamente."
          title="Datos de la cuenta"
        />
      </section>
    </div>
  ) : null;

  return (
    <>
      <button aria-label="Editar cuenta" className="icon-action-button" onClick={() => setOpen(true)} title="Editar" type="button">
        <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
          <path d="M4 20h4l11-11-4-4L4 16v4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="m13 7 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        </svg>
      </button>
      {modal ? createPortal(modal, document.body) : null}
    </>
  );
}
