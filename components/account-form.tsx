import { createAccount } from "@/app/actions";

export function AccountForm({ className = "card form" }: { className?: string }) {
  return (
    <form action={createAccount} className={className}>
      <h2>Nueva cuenta</h2>
      <div className="field">
        <label htmlFor="name">Nombre</label>
        <input id="name" name="name" placeholder="Banco Pichincha" required />
      </div>
      <div className="field">
        <label htmlFor="type">Tipo</label>
        <select id="type" name="type" defaultValue="bank">
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
          required
        />
      </div>
      <button className="button" type="submit">
        Crear cuenta
      </button>
    </form>
  );
}
