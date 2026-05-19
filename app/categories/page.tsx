import { AppNav } from "@/components/app-nav";
import { CategoryModal } from "@/components/category-modal";
import { CategoryTable } from "@/components/category-table";
import { getCategories } from "@/lib/data";

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const type = getParam(params?.type) ?? "all";
  const categories = await getCategories();
  const filteredCategories = type === "income" || type === "expense"
    ? categories.filter((category) => category.type === type)
    : categories;

  return (
    <main className="shell">
      <AppNav />
      <div className="page-heading">
        <h1 className="page-title">Categorias</h1>
        <CategoryModal />
      </div>
      <form className="card filter-bar">
        <div className="field">
          <label htmlFor="type">Tipo</label>
          <select id="type" name="type" defaultValue={type}>
            <option value="all">Todas</option>
            <option value="income">Ingresos</option>
            <option value="expense">Egresos</option>
          </select>
        </div>
        <button className="button" type="submit">
          Aplicar filtro
        </button>
        <a className="ghost-button clear-filter" href="/categories">
          Limpiar filtro
        </a>
      </form>
      <CategoryTable categories={filteredCategories} />
    </main>
  );
}
