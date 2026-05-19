import { deleteCategory, updateCategory } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import type { Category } from "@/lib/types";

const typeLabels = {
  income: "Ingreso",
  expense: "Egreso",
};

export function CategoryTable({ categories }: { categories: Category[] }) {
  return (
    <section className="card table-wrap">
      <h2>Categorias</h2>
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td data-label="Nombre">
                <ActionForm
                  action={updateCategory}
                  className="inline-form"
                  id={`category-${category.id}`}
                  successMessage="Categoria actualizada correctamente."
                >
                  <input name="id" type="hidden" value={category.id} />
                  <input name="name" defaultValue={category.name} required />
                </ActionForm>
              </td>
              <td data-label="Tipo">
                <select name="type" defaultValue={category.type} form={`category-${category.id}`}>
                  <option value="expense">Egreso</option>
                  <option value="income">Ingreso</option>
                </select>
                <span className="sr-only">{typeLabels[category.type]}</span>
              </td>
              <td data-label="Acciones">
                <div className="actions">
                  <button className="small-button" form={`category-${category.id}`} type="submit">
                    Guardar
                  </button>
                  <ActionForm
                    action={deleteCategory}
                    confirmMessage="Esta accion no se puede deshacer. Los movimientos anteriores conservaran el texto de la categoria. Deseas continuar?"
                    successMessage="Categoria eliminada correctamente."
                  >
                    <input name="id" type="hidden" value={category.id} />
                    <button className="small-button danger-button" type="submit">
                      Eliminar
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
        Si eliminas una categoria, los movimientos anteriores conservan el texto registrado.
      </p>
    </section>
  );
}
