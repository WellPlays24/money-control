import { deleteAccount, updateAccount } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { formatMoney } from "@/lib/finance";
import type { AccountBalance } from "@/lib/types";

export function AccountTable({ accounts }: { accounts: AccountBalance[] }) {
  return (
    <section className="card table-wrap">
      <h2>Saldos actuales</h2>
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Cuenta</th>
            <th>Tipo</th>
            <th>Inicial</th>
            <th>Actual</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td data-label="Cuenta">
                <ActionForm
                  action={updateAccount}
                  className="inline-form"
                  id={`account-${account.id}`}
                  successMessage="Cuenta actualizada correctamente."
                >
                  <input name="id" type="hidden" value={account.id} />
                  <input name="name" defaultValue={account.name} required />
                </ActionForm>
              </td>
              <td data-label="Tipo">
                <select name="type" defaultValue={account.type} form={`account-${account.id}`}>
                  <option value="bank">Banco</option>
                  <option value="cooperative">Cooperativa</option>
                  <option value="cash">Efectivo</option>
                  <option value="other">Otro</option>
                </select>
              </td>
              <td data-label="Inicial">
                <input
                  form={`account-${account.id}`}
                  min="0"
                  name="initial_balance"
                  step="0.01"
                  type="number"
                  defaultValue={account.initial_balance}
                  required
                />
              </td>
              <td data-label="Actual">{formatMoney(account.balance)}</td>
              <td data-label="Acciones">
                <div className="actions">
                  <button className="small-button" form={`account-${account.id}`} type="submit">
                    Guardar
                  </button>
                  <ActionForm
                    action={deleteAccount}
                    confirmMessage="Esta accion no se puede deshacer. Si la cuenta tiene movimientos, se archivara para preservar el historial. Deseas continuar?"
                    successMessage="Cuenta eliminada o archivada correctamente."
                  >
                    <input name="id" type="hidden" value={account.id} />
                    <button className="small-button danger-button" type="submit">
                      Eliminar
                    </button>
                  </ActionForm>
                </div>
              </td>
            </tr>
          ))}
          {accounts.length === 0 ? (
            <tr>
              <td colSpan={5}>Todavia no hay cuentas.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
      <p className="muted table-note">
        Si una cuenta tiene movimientos, se archiva para preservar el historial.
      </p>
    </section>
  );
}
