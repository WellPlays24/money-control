"use client";

import { useState } from "react";
import { updateAccount } from "@/app/actions";
import { AccountForm } from "@/components/account-form";
import type { Account } from "@/lib/types";

export function AccountEditModal({ account }: { account: Account }) {
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
              successMessage="Cuenta actualizada correctamente."
              title="Datos de la cuenta"
            />
          </section>
        </div>
      ) : null}
    </>
  );
}
