// SRP: Renders a pill-style tab bar.
// OCP: Accepts any array of {id, label} tabs — no modification needed for new tabs.

export default function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{
      display: "flex", gap: 4, background: "white",
      borderRadius: 12, padding: 4,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)", width: "fit-content",
    }}>
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          style={{
            padding: "9px 20px", border: "none", borderRadius: 8,
            fontSize: 13, cursor: "pointer",
            fontWeight: active === id ? 700 : 500,
            color:      active === id ? "white" : "#64748b",
            background: active === id ? "#6366f1" : "none",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
