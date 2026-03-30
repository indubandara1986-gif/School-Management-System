// SRP: Renders the decorative left branding panel shown on auth pages.

export default function AuthLeft() {
  return (
    <div style={{
      width: "42%", flexShrink: 0,
      background: "linear-gradient(145deg,#1e1b4b,#312e81,#4338ca)",
      padding: "60px 50px", display: "flex", flexDirection: "column",
      justifyContent: "space-between", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -80, right: -80, width: 300, height: 300,
        borderRadius: "50%", background: "rgba(255,255,255,0.04)",
      }} />
      <div>
        <div style={{
          width: 64, height: 64, background: "rgba(255,255,255,0.15)",
          borderRadius: 16, display: "flex", alignItems: "center",
          justifyContent: "center", marginBottom: 20,
        }}>
          <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
            <path d="M24 8L38 16V32L24 40L10 32V16L24 8Z" stroke="white" strokeWidth="2.5" fill="none" />
            <path d="M24 16L32 20V28L24 32L16 28V20L24 16Z" fill="white" fillOpacity="0.4" />
            <circle cx="24" cy="24" r="3" fill="white" />
          </svg>
        </div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: "white", fontWeight: 700, lineHeight: 1.2 }}>
          Vidyaloka<br />
          <span style={{ fontSize: 18, fontWeight: 400, opacity: 0.7 }}>School Management</span>
        </div>
      </div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
        Empowering Education<br />Through Smart Management
      </div>
      <div style={{ display: "flex", gap: 32 }}>
        {[["1,240","Students"],["86","Teachers"],["42","Classes"]].map(([n,l]) => (
          <div key={l}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "white" }}>{n}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
