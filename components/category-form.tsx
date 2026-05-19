import { createCategory } from "@/app/actions";

export function CategoryForm({ className = "card form" }: { className?: string }) {
  return (
    <form action={createCategory} className={className}>
      <h2>Nueva categoria</h2>
      <div className="field">
        <label htmlFor="name">Nombre</label>
        <input id="name" name="name" placeholder="Comida" required />
      </div>
      <div className="field">
        <label htmlFor="type">Tipo</label>
        <select id="type" name="type" defaultValue="expense">
          <option value="expense">Egreso</option>
          <option value="income">Ingreso</option>
        </select>
      </div>
      <button className="button" type="submit">
        Crear categoria
      </button>
    </form>
  );
}
