// SRP: Reusable style factory functions — keeps styling logic out of components.
// OCP: Add new style helpers here without touching existing ones.

export const chip = (text, color, bg, border) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "3px 10px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 700,
  color,
  background: bg,
  border: `1.5px solid ${border}`,
});

export const card = {
  background: "white",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
};

export const btn = (bg = "#6366f1", color = "white") => ({
  padding: "9px 18px",
  background: bg,
  color,
  border: "none",
  borderRadius: 9,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
});

export const inp = {
  padding: "10px 13px",
  border: "1.5px solid #e2e8f0",
  borderRadius: 9,
  fontSize: 14,
  color: "#0f172a",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  background: "#f8fafc",
};

export const sel = {
  padding: "10px 13px",
  border: "1.5px solid #e2e8f0",
  borderRadius: 9,
  fontSize: 14,
  color: "#374151",
  outline: "none",
  background: "white",
};
