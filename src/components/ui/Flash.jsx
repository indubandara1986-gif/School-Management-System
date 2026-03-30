// SRP: Renders a success/error flash message — nothing else.

export default function Flash({ msg, ok = true }) {
  if (!msg) return null;
  return (
    <div style={{
      padding: "11px 16px", borderRadius: 10,
      fontSize: 14, fontWeight: 500, marginBottom: 16,
      background: ok ? "#f0fdf4" : "#fef2f2",
      color:      ok ? "#16a34a" : "#dc2626",
      border: `1.5px solid ${ok ? "#86efac" : "#fecaca"}`,
    }}>
      {ok ? "✓" : "⚠"} {msg}
    </div>
  );
}
