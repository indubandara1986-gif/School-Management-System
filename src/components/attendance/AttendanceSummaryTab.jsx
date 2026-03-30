// SRP: Monthly attendance summary view only.

import { useState } from "react";
import { STATUS_COLOR, STATUS_BG } from "../../constants/academic";
import { card, btn, inp, sel, chip } from "../../utils/styles";
import Spinner from "../ui/Spinner";

export default function AttendanceSummaryTab({ classes, summary, loading, onLoad }) {
  const [month,       setMonth] = useState(new Date().toISOString().slice(0,7));
  const [classFilter, setCls]   = useState("");

  return (
    <>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)} style={{ ...inp, width: 180 }} />
        <select value={classFilter} onChange={e => setCls(e.target.value)} style={{ ...sel, minWidth: 180 }}>
          <option value="">All Classes</option>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => onLoad(month, classFilter)} disabled={loading}
          style={{ ...btn(), display: "flex", alignItems: "center", gap: 8 }}>
          {loading && <Spinner size={14} />}Load Summary
        </button>
      </div>

      {summary && (
        <>
          {/* Totals */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {[
              { label:"Present Days",  value: summary.totals.present,    color:"#16a34a", icon:"✅" },
              { label:"Absent Days",   value: summary.totals.absent,     color:"#dc2626", icon:"❌" },
              { label:"Late Days",     value: summary.totals.late,       color:"#d97706", icon:"⏰" },
              { label:"Total Marked",  value: summary.totals.total_days, color:"#6366f1", icon:"📋" },
            ].map(s => (
              <div key={s.label} style={{ ...card, textAlign: "center" }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Daily chart */}
          {summary.daily.length > 0 && (
            <div style={card}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 18 }}>Daily Attendance — {month}</div>
              <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 100, overflowX: "auto", paddingBottom: 8 }}>
                {summary.daily.map(d => {
                  const total = d.total || 1;
                  return (
                    <div key={d.date} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 24, flex: "0 0 auto" }}>
                      <div style={{ width: 18, display: "flex", flexDirection: "column-reverse", gap: 1, height: 80 }}>
                        {[["present","#10b981"],["late","#f59e0b"],["absent","#ef4444"]].map(([k,c]) => (
                          <div key={k} style={{ width: "100%", height: `${(d[k]/total)*80}px`, background: c, borderRadius: 2, minHeight: d[k]>0?2:0 }} />
                        ))}
                      </div>
                      <div style={{ fontSize: 9, color: "#94a3b8", transform: "rotate(-60deg)", transformOrigin: "center", whiteSpace: "nowrap", marginTop: 8 }}>{d.date.slice(5)}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                {[["Present","#10b981"],["Late","#f59e0b"],["Absent","#ef4444"]].map(([l,c]) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
                    <div style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />{l}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student table */}
          <div style={{ ...card, overflow: "hidden", padding: 0 }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Student Summary — {month}</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Student","Class","Present","Absent","Late","Total","Attendance %"].map(h => (
                      <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {summary.students.map(s => (
                    <tr key={s.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#eef2ff", color: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{s.avatar}</div>
                          <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 13 }}>{s.name}</div>
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 13, color: "#64748b" }}>{s.class}</td>
                      <td style={{ padding: "11px 14px" }}><span style={{ ...chip(s.present,"#16a34a","#f0fdf4","#86efac") }}>{s.present}</span></td>
                      <td style={{ padding: "11px 14px" }}><span style={{ ...chip(s.absent,"#dc2626","#fef2f2","#fecaca") }}>{s.absent}</span></td>
                      <td style={{ padding: "11px 14px" }}><span style={{ ...chip(s.late,"#d97706","#fffbeb","#fde68a") }}>{s.late}</span></td>
                      <td style={{ padding: "11px 14px", fontSize: 13, color: "#374151" }}>{s.total_days}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden", maxWidth: 80 }}>
                            <div style={{ width: `${s.pct||0}%`, height: "100%", background: s.pct>=75?"#10b981":s.pct>=50?"#f59e0b":"#ef4444", borderRadius: 3 }} />
                          </div>
                          <span style={{ fontWeight: 700, fontSize: 13, color: s.pct>=75?"#16a34a":s.pct>=50?"#d97706":"#dc2626" }}>{s.pct||0}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
