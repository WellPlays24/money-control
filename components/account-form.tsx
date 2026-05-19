import { createAccount } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import type { Account } from "@/lib/types";

export function AccountForm({
  account,
  action = createAccount,
  className = "card form",
  successMessage = "Cuenta creada correctamente.",
  title = "Nueva cuenta",
}: {
  account?: Account;
  action?: (formData: FormData) => Promise<void>;
  className?: string;
  successMessage?: string;
  title?: string;
}) {
  return (
    <ActionForm action={action} className={className} successMessage={successMessage}>
      <h2>{title}</h2>
      {account ? <input name="id" type="hidden" value={account.id} /> : null}
      <div className="field">
        <label htmlFor="name">Nombre</label>
        <input id="name" name="name" placeholder="Banco Pichincha" defaultValue={account?.name} required />
      </div>
      <div className="field">
        <label htmlFor="type">Tipo</label>
        <select id="type" name="type" defaultValue={account?.type ?? "bank"}>
          <option value="bank">Banco</option>
          <option value="cooperative">Cooperativa</option>
          <option value="cash">Efectivo</option>
          <option value="other">Otro</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="initial_balance">Saldo inicial</label>
        <input
          id="initial_balance"
          min="0"
          name="initial_balance"
          placeholder="20.00"
          step="0.01"
          type="number"
          defaultValue={account?.initial_balance}
          required
        />
      </div>
      <button className="button" type="submit">
        {account ? "Guardar cambios" : "Crear cuenta"}
      </button>
    </ActionForm>
  );
}
