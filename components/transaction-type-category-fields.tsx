"use client";

import { useState } from "react";
import type { Category, TransactionType } from "@/lib/types";

export function TransactionTypeCategoryFields({ categories }: { categories: Category[] }) {
  const [type, setType] = useState<TransactionType>("expense");
  const visibleCategories = categories.filter((category) => category.type === type);

  return (
    <>
      <div className="field">
        <label htmlFor="type">Tipo</label>
        <select
          id="type"
          name="type"
          value={type}
          onChange={(event) => setType(event.target.value as TransactionType)}
        >
          <option value="income">Ingreso</option>
          <option value="expense">Egreso</option>
          <option value="transfer">Transferencia</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="category">Categoria</label>
        <select id="category" name="category" required value={type === "transfer" ? "Transferencia" : undefined}>
          {type === "transfer" ? <option value="Transferencia">Transferencia</option> : null}
          {type !== "transfer" ? <option value="">Selecciona una categoria</option> : null}
          {type !== "transfer"
            ? visibleCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))
            : null}
        </select>
      </div>
    </>
  );
}
