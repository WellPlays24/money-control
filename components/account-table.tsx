import { deleteAccount } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { AccountEditModal } from "@/components/account-edit-modal";
import { formatMoney } from "@/lib/finance";
import type { AccountBalance } from "@/lib/types";

const accountTypeLabels = {
  bank: "Banco",
  cooperative: "Cooperativa",
  cash: "Efectivo",
  other: "Otro",
};

function hasMovements(account: AccountBalance) {
  return account.income > 0 || account.expense > 0 || account.transfersIn > 0 || account.transfersOut > 0;
}

export function AccountTable({ accounts }: { accounts: AccountBalance[] }) {
  return (
    <section className="card table-wrap">
      <h2>Saldos actuales</h2>
      <table className="responsive-table accounts-table">
        <thead>
          <tr>
            <th>Cuenta</th>
            <th>Institucion</th>
            <th>Tipo</th>
            <th className="money-cell">Inicial</th>
            <th className="money-cell">Actual</th>
            <th>Balance general</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => {
            const accountHasMovements = hasMovements(account);
            return (
              <tr key={account.id}>
                <td data-label="Cuenta">{account.name}</td>
                <td data-label="Institucion">{account.institution || "-"}</td>
                <td data-label="Tipo">
                  <span className={`badge account-type-badge ${account.type}-badge`}>
                    {accountTypeLabels[account.type]}
                  </span>
                </td>
                <td className="money-cell" data-label="Inicial">{formatMoney(account.initial_balance)}</td>
                <td className="money-cell" data-label="Actual">{formatMoney(account.balance)}</td>
                <td data-label="Balance general">
                  <span className={account.include_in_balance ? "badge included-badge" : "badge excluded-badge"}>
                    {account.include_in_balance ? "Incluida" : "Excluida"}
                  </span>
                </td>
                <td data-label="Estado">
                  <span className={account.archived ? "badge archived-badge" : "badge active-badge"}>
                    {account.archived ? "Archivada" : "Activa"}
                  </span>
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
                      <button
                        aria-label={accountHasMovements ? "Archivar cuenta" : "Eliminar cuenta"}
                        className="icon-action-button danger-icon-button"
                        title={accountHasMovements ? "Archivar" : "Eliminar"}
                        type="submit"
                      >
                        {accountHasMovements ? (
                          <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
                            <path d="M4 8h16v12H4V8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
                            <path d="M2 4h20v4H2V4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
                            <path d="M9 12h6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                          </svg>
                        ) : (
                          <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
                            <path d="M4 7h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                            <path d="M10 11v6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                            <path d="M14 11v6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                            <path d="M6 7l1 13h10l1-13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            <path d="M9 7V4h6v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          </svg>
                        )}
                      </button>
                    </ActionForm>
                  </div>
                </td>
              </tr>
            );
          })}
          {accounts.length === 0 ? (
            <tr>
              <td colSpan={8}>Todavia no hay cuentas.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
      <p className="muted table-note">
        Las cuentas con movimientos se archivan para conservar el historial financiero.
      </p>
    </section>
  );
}
