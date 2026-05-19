"use client";

import { useState } from "react";
import type { Category, TransactionType } from "@/lib/types";

export function TransactionTypeCategoryFields({
  categories,
  initialCategory = "",
  initialType = "expense",
}: {
  categories: Category[];
  initialCategory?: string;
  initialType?: TransactionType;
}) {
  const [type, setType] = useState<TransactionType>(initialType);
  const [category, setCategory] = useState(initialCategory);
  const visibleCategories = categories.filter((category) => category.type === type);
  const showCurrentCategory =
    type !== "transfer" &&
    category &&
    !visibleCategories.some((visibleCategory) => visibleCategory.name === category);

  return (
    <>
      <div className="field">
        <label htmlFor="type">Tipo</label>
        <select
          id="type"
          name="type"
          value={type}
          onChange={(event) => {
            const nextType = event.target.value as TransactionType;
            setType(nextType);
            setCategory(nextType === "transfer" ? "Transferencia" : "");
          }}
        >
          <option value="income">Ingreso</option>
          <option value="expense">Egreso</option>
          <option value="transfer">Transferencia</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="category">Categoria</label>
        <select
          id="category"
          name="category"
          required
          value={type === "transfer" ? "Transferencia" : category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {type === "transfer" ? <option value="Transferencia">Transferencia</option> : null}
          {type !== "transfer" ? <option value="">Selecciona una categoria</option> : null}
          {type !== "transfer"
            ? visibleCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))
            : null}
          {showCurrentCategory ? <option value={category}>{category}</option> : null}
        </select>
      </div>
    </>
  );
}
