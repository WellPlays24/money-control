"use client";

import { useState } from "react";
import { AccountForm } from "@/components/account-form";

export function AccountModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="button add-button" onClick={() => setOpen(true)} type="button">
        Agregar cuenta
      </button>
      {open ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <section
            aria-modal="true"
            className="modal-card"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="muted">Saldo inicial</p>
                <h2>Agregar cuenta</h2>
              </div>
              <button className="icon-button" onClick={() => setOpen(false)} type="button">
                Cerrar
              </button>
            </div>
            <AccountForm className="form" onSuccess={() => setOpen(false)} />
          </section>
        </div>
      ) : null}
    </>
  );
}
