import { deleteCategory } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { CategoryEditModal } from "@/components/category-edit-modal";
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
              <td data-label="Nombre">{category.name}</td>
              <td data-label="Tipo">{typeLabels[category.type]}</td>
              <td data-label="Acciones">
                <div className="actions">
                  <CategoryEditModal category={category} />
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
