export function ReportSection({
  children,
  defaultOpen = false,
  title,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  title: string;
}) {
  return (
    <details className="report-accordion report-section" open={defaultOpen}>
      <summary>{title}</summary>
      <div className="report-accordion-content">{children}</div>
    </details>
  );
}
