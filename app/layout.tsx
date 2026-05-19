import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MoneyControl",
  description: "Control personal de cuentas, ingresos, egresos y transferencias.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
