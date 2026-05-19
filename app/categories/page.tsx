import { AppNav } from "@/components/app-nav";
import { CategoryModal } from "@/components/category-modal";
import { CategoryTable } from "@/components/category-table";
import { getCategories } from "@/lib/data";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="shell">
      <AppNav />
      <div className="page-heading">
        <h1 className="page-title">Categorias</h1>
        <CategoryModal />
      </div>
      <CategoryTable categories={categories} />
    </main>
  );
}
