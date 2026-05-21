"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { updateCategory } from "@/app/actions";
import { CategoryForm } from "@/components/category-form";
import type { Category } from "@/lib/types";

export function CategoryEditModal({ category }: { category: Category }) {
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
  ) : null;

  return (
    <>
      <button aria-label="Editar categoria" className="icon-action-button" onClick={() => setOpen(true)} title="Editar" type="button">
        <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
          <path d="M4 20h4l11-11-4-4L4 16v4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="m13 7 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        </svg>
      </button>
      {modal ? createPortal(modal, document.body) : null}
    </>
  );
}
