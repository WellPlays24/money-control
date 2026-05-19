"use client";

export function PrintReportButton() {
  return (
    <button className="button add-button no-print" onClick={() => window.print()} type="button">
      Descargar PDF
    </button>
  );
}
