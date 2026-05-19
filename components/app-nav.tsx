import Link from "next/link";
import { signOut } from "@/app/actions";

export function AppNav() {
  return (
    <nav className="nav">
      <Link className="brand" href="/">
        MoneyControl
      </Link>
      <div className="nav-links">
        <Link href="/">Dashboard</Link>
        <Link href="/accounts">Cuentas</Link>
        <Link href="/transactions">Movimientos</Link>
        <Link href="/categories">Categorias</Link>
        <Link href="/reports">Reportes</Link>
        <form action={signOut}>
          <button className="ghost-button" type="submit">
            Salir
          </button>
        </form>
      </div>
    </nav>
  );
}
