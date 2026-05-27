"use client";

import { useMemo, useState } from "react";
import { deleteCategory } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { CategoryEditModal } from "@/components/category-edit-modal";
import type { Category } from "@/lib/types";

const typeLabels = {
  income: "Ingreso",
  expense: "Egreso",
};

type SortDirection = "asc" | "desc";
type CategorySortKey = "name" | "type";

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

export function CategoryTable({ categories }: { categories: Category[] }) {
  const [sort, setSort] = useState<{ key: CategorySortKey; direction: SortDirection }>({
    key: "name",
    direction: "asc",
  });
  const sortedCategories = useMemo(() => {
    return categories.slice().sort((a, b) => {
      const first = sort.key === "name" ? a.name : typeLabels[a.type];
      const second = sort.key === "name" ? b.name : typeLabels[b.type];
      const result = first.localeCompare(second);
      return sort.direction === "asc" ? result : -result;
    });
  }, [categories, sort.direction, sort.key]);

  function updateSort(key: CategorySortKey) {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }

  return (
    <section className="card table-wrap">
      <h2>Categorias</h2>
      <table className="responsive-table categories-table">
        <thead>
          <tr>
            <th><SortButton active={sort.key === "name"} direction={sort.direction} onClick={() => updateSort("name")}>Nombre</SortButton></th>
            <th><SortButton active={sort.key === "type"} direction={sort.direction} onClick={() => updateSort("type")}>Tipo</SortButton></th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedCategories.map((category) => (
            <tr key={category.id}>
              <td data-label="Nombre">{category.name}</td>
              <td data-label="Tipo">
                <span className={category.type === "income" ? "badge included-badge" : "badge expense-badge"}>
                  {typeLabels[category.type]}
                </span>
              </td>
              <td data-label="Acciones">
                <div className="actions">
                  <CategoryEditModal category={category} />
                  <ActionForm
                    action={deleteCategory}
                    confirmMessage="Esta accion no se puede deshacer. Los movimientos anteriores conservaran el texto de la categoria. Deseas continuar?"
                    successMessage="Categoria eliminada correctamente."
                  >
                    <input name="id" type="hidden" value={category.id} />
                    <button aria-label="Eliminar categoria" className="icon-action-button danger-icon-button" title="Eliminar" type="submit">
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
          {categories.length === 0 ? (
            <tr>
              <td colSpan={3}>Todavia no hay categorias.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
      <p className="muted table-note">
        Al eliminar una categoria, los movimientos anteriores conservan el texto registrado.
      </p>
    </section>
  );
}
