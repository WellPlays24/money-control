import { deleteAccount } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { AccountEditModal } from "@/components/account-edit-modal";
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
            <th>Balance general</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td data-label="Cuenta">{account.name}</td>
              <td data-label="Tipo">{account.type}</td>
              <td data-label="Inicial">{formatMoney(account.initial_balance)}</td>
              <td data-label="Actual">{formatMoney(account.balance)}</td>
              <td data-label="Balance general">
                {account.include_in_balance ? "Si suma" : "No suma"}
              </td>
              <td data-label="Acciones">
                <div className="actions">
                  <AccountEditModal account={account} />
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
              <td colSpan={6}>Todavia no hay cuentas.</td>
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
