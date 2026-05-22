"use client";

import { useState } from "react";

export function ReportAnalysisButton({ recommendations }: { recommendations: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="card report-analysis-card no-print">
      <div className="report-analysis-header">
        <div>
          <p className="muted">Recomendaciones automaticas</p>
          <h2>Analisis inteligente</h2>
        </div>
        <button className="button" onClick={() => setOpen((current) => !current)} type="button">
          Generar analisis
        </button>
      </div>
      {open ? (
        <ul className="analysis-list">
          {recommendations.map((recommendation) => (
            <li key={recommendation}>{recommendation}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
