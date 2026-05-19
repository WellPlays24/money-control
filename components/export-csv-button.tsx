"use client";

import { useState } from "react";
import { buildTransactionsCsv, downloadCsv, formatCsvDate } from "@/lib/csv";
import type { Account, Transaction } from "@/lib/types";

export function ExportCsvButton({
  accounts,
  filenamePrefix,
  transactions,
}: {
  accounts: Account[];
  filenamePrefix: string;
  transactions: Transaction[];
}) {
  const [error, setError] = useState<string | null>(null);

  function exportCsv() {
    setError(null);

    if (transactions.length === 0) {
      setError("No hay movimientos para exportar.");
      return;
    }

    const csv = buildTransactionsCsv(transactions, accounts);
    downloadCsv(`${filenamePrefix}_${formatCsvDate()}.csv`, csv);
  }

  return (
    <div className="export-action no-print">
      <button className="button add-button" onClick={exportCsv} type="button">
        Exportar CSV
      </button>
      {error ? <p className="form-message error-message">{error}</p> : null}
    </div>
  );
}
