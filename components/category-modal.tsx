"use client";

import { useState } from "react";
import { CategoryForm } from "@/components/category-form";

export function CategoryModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="button add-button" onClick={() => setOpen(true)} type="button">
        Agregar categoria
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
                <p className="muted">Orden para tus reportes</p>
                <h2>Agregar categoria</h2>
              </div>
              <button className="icon-button" onClick={() => setOpen(false)} type="button">
                Cerrar
              </button>
            </div>
            <CategoryForm className="form" />
          </section>
        </div>
      ) : null}
    </>
  );
}
