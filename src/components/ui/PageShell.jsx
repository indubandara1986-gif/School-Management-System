// SRP: Standard page-level layout wrapper with title, subtitle, optional action button.

export default function PageShell({ title, subtitle, action, children }) {
  return (
    <div style={{
      padding: 32, background: "#f1f5f9", minHeight: "100%",
      fontFamily: "'DM Sans',sans-serif",
      display: "flex", flexDirection: "column", gap: 22,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 14, color: "#64748b", margin: "4px 0 0" }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
