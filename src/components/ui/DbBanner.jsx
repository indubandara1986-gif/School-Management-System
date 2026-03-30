// SRP: Renders the database-connection error banner — nothing else.

export default function DbBanner({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 12,
      padding: "14px 18px", display: "flex", gap: 12,
      alignItems: "flex-start", marginBottom: 8,
    }}>
      <span style={{ fontSize: 22, flexShrink: 0 }}>⚠</span>
      <div>
        <div style={{ fontWeight: 700, color: "#dc2626", fontSize: 14 }}>Database Connection Error</div>
        <div style={{ color: "#b91c1c", fontSize: 13, marginTop: 3 }}>{msg}</div>
        <div style={{ color: "#7f1d1d", fontSize: 12, marginTop: 4 }}>
          Make sure XAMPP is running and MySQL is started. Then run:{" "}
          <code style={{ background: "#fee2e2", padding: "1px 6px", borderRadius: 4 }}>
            GET /vidyaloka/api.php?action=setup
          </code>
        </div>
      </div>
    </div>
  );
}
