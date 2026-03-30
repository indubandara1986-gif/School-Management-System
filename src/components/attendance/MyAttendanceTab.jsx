// SRP: Student's personal attendance view only.

import { STATUS_COLOR, STATUS_BG } from "../../constants/academic";
import { card } from "../../utils/styles";

export default function MyAttendanceTab({ myAtt }) {
  if (!myAtt) return null;

  const rate = myAtt.totals.total > 0
    ? ((myAtt.totals.present / myAtt.totals.total) * 100).toFixed(0) : 0;

  return (
    <>
      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {[
          { label:"Present", value: myAtt.totals.present, color:"#16a34a", icon:"✅" },
          { label:"Absent",  value: myAtt.totals.absent,  color:"#dc2626", icon:"❌" },
          { label:"Late",    value: myAtt.totals.late,    color:"#d97706", icon:"⏰" },
          { label:"Rate",    value: `${rate}%`,           color:"#6366f1", icon:"📊" },
        ].map(s => (
          <div key={s.label} style={{ ...card, textAlign: "center" }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Monthly trend */}
      <div style={card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 18 }}>Monthly Trend (Last 6 Months)</div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 100 }}>
          {myAtt.monthly.map(m => {
            const pct = m.total > 0 ? (m.present / m.total) * 100 : 0;
            return (
              <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: pct>=75?"#16a34a":pct>=50?"#d97706":"#dc2626" }}>{pct.toFixed(0)}%</div>
                <div style={{ width: "100%", background: pct>=75?"#10b981":pct>=50?"#f59e0b":"#ef4444", borderRadius: "6px 6px 0 0", height: `${(pct/100)*80}px`, minHeight: 4 }} />
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{m.month.slice(5)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent records */}
      <div style={card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Recent Attendance (Last 30 Days)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 320, overflowY: "auto" }}>
          {myAtt.recent.map(r => (
            <div key={r.date} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 14px", borderRadius: 9, background: STATUS_BG[r.status]||"#f8fafc", border: `1px solid ${STATUS_COLOR[r.status]||"#e2e8f0"}30` }}>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "#374151" }}>{r.date}</div>
              <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: STATUS_COLOR[r.status]+"20", color: STATUS_COLOR[r.status] }}>{r.status}</span>
              {r.note && <div style={{ fontSize: 12, color: "#64748b", fontStyle: "italic" }}>{r.note}</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
