import { createCategory } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import type { Category } from "@/lib/types";

export function CategoryForm({
  action = createCategory,
  category,
  className = "card form",
  successMessage = "Categoria creada correctamente.",
  title = "Nueva categoria",
}: {
  action?: (formData: FormData) => Promise<void>;
  category?: Category;
  className?: string;
  successMessage?: string;
  title?: string;
}) {
  return (
    <ActionForm action={action} className={className} successMessage={successMessage}>
      <h2>{title}</h2>
      {category ? <input name="id" type="hidden" value={category.id} /> : null}
      <div className="field">
        <label htmlFor="name">Nombre</label>
        <input id="name" name="name" placeholder="Comida" defaultValue={category?.name} required />
      </div>
      <div className="field">
        <label htmlFor="type">Tipo</label>
        <select id="type" name="type" defaultValue={category?.type ?? "expense"}>
          <option value="expense">Egreso</option>
          <option value="income">Ingreso</option>
        </select>
      </div>
      <button className="button" type="submit">
        {category ? "Guardar cambios" : "Crear categoria"}
      </button>
    </ActionForm>
  );
}
