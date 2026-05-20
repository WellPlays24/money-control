"use client";

import { useState } from "react";
import { updateCategory } from "@/app/actions";
import { CategoryForm } from "@/components/category-form";
import type { Category } from "@/lib/types";

export function CategoryEditModal({ category }: { category: Category }) {
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
                <p className="muted">Actualizar categoria</p>
                <h2>Editar categoria</h2>
              </div>
              <button className="icon-button" onClick={() => setOpen(false)} type="button">
                Cerrar
              </button>
            </div>
            <CategoryForm
              action={updateCategory}
              category={category}
              className="form"
              onSuccess={() => setOpen(false)}
              successMessage="Categoria actualizada correctamente."
              title="Datos de la categoria"
            />
          </section>
        </div>
      ) : null}
    </>
  );
}
