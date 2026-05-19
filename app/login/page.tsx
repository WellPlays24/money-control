import { redirect } from "next/navigation";
import { LoginButton } from "./login-button";
import { getCurrentUser } from "@/lib/data";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <main className="login-page">
      <section className="card login-card stack">
        <div>
          <p className="muted">Finanzas personales</p>
          <h1 className="page-title">MoneyControl</h1>
          <p className="muted">
            Ingresa con Google para que solo tu puedas ver tus cuentas y movimientos.
          </p>
        </div>
        <LoginButton />
        <p className="developer-credit">
          Desarrollado por: {" "}
          <a
            href="https://www.linkedin.com/in/wellington-castillo-medina-876577260/"
            rel="noreferrer"
            target="_blank"
          >
            Ing. Wellington Castillo
          </a>
        </p>
      </section>
    </main>
  );
}
