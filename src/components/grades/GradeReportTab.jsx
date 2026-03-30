// SRP: Renders the grade overview report tab only.

import { useState } from "react";
import { TERMS } from "../../constants/academic";
import { card, btn, sel } from "../../utils/styles";
import Spinner from "../ui/Spinner";

const DIST_COLORS = { A:"#16a34a", B:"#2563eb", C:"#d97706", D:"#ea580c", F:"#dc2626" };

export default function GradeReportTab({ classes, report, loading, onLoad }) {
  const [classFilter, setCls]  = useState("");
  const [term,        setTerm] = useState("");

  return (
    <>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <select value={classFilter} onChange={e => setCls(e.target.value)} style={{ ...sel, minWidth: 180 }}>
          <option value="">All Classes</option>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={term} onChange={e => setTerm(e.target.value)} style={{ ...sel, minWidth: 140 }}>
          <option value="">All Terms</option>
          {TERMS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={() => onLoad(classFilter, term)} disabled={loading}
          style={{ ...btn(), display: "flex", alignItems: "center", gap: 8 }}>
          {loading && <Spinner size={14} />}Generate Report
        </button>
      </div>

      {report && (
        <>
          {/* Grade distribution */}
          <div style={card}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 18 }}>Grade Distribution {term||"(All Terms)"}</div>
            <div style={{ display: "flex", gap: 14 }}>
              {Object.entries(report.distribution||{}).map(([g, count]) => (
                <div key={g} style={{ flex: 1, textAlign: "center", padding: "16px 10px", borderRadius: 12, background: DIST_COLORS[g]+"15", border: `2px solid ${DIST_COLORS[g]}33` }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: DIST_COLORS[g] }}>{count}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: DIST_COLORS[g], marginTop: 4 }}>{g}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                    {g==="A"?"≥ 75%":g==="B"?"65–75%":g==="C"?"55–65%":g==="D"?"40–55%":"< 40%"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject performance table */}
          <div style={card}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 18 }}>Subject Performance</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Subject","Average %","Avg Marks","Highest","Lowest","Entries"].map(h => (
                    <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #f1f5f9" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(report.subjects||[]).map(s => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "#0f172a" }}>{s.subject}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1, height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden", maxWidth: 100 }}>
                          <div style={{ width: `${s.avg_pct}%`, height: "100%", background: s.avg_pct>=65?"#10b981":s.avg_pct>=40?"#f59e0b":"#ef4444", borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: s.avg_pct>=65?"#16a34a":s.avg_pct>=40?"#d97706":"#dc2626" }}>{s.avg_pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 14 }}>{s.avg_marks} / {s.max_marks}</td>
                    <td style={{ padding: "12px 14px", fontSize: 14, color: "#16a34a", fontWeight: 600 }}>{s.max_scored}</td>
                    <td style={{ padding: "12px 14px", fontSize: 14, color: "#dc2626", fontWeight: 600 }}>{s.min_scored}</td>
                    <td style={{ padding: "12px 14px", fontSize: 14, color: "#64748b" }}>{s.entries}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top performers */}
          {(report.top_students||[]).length > 0 && (
            <div style={card}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>🏆 Top Performers</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {report.top_students.map((s, i) => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 10,
                    background: i===0?"linear-gradient(135deg,#fef3c7,#fde68a)":i===1?"linear-gradient(135deg,#f1f5f9,#e2e8f0)":i===2?"linear-gradient(135deg,#fff7ed,#fed7aa)":"#f8fafc",
                    border: `1px solid ${i===0?"#fbbf24":i===1?"#e2e8f0":i===2?"#fb923c":"#f1f5f9"}` }}>
                    <div style={{ fontSize: 22, width: 32, textAlign: "center", fontWeight: 900, color: i===0?"#b45309":i===1?"#475569":i===2?"#c2410c":"#6366f1" }}>#{i+1}</div>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{s.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{s.class}</div>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.avg_pct>=75?"#16a34a":s.avg_pct>=55?"#d97706":"#dc2626" }}>{s.avg_pct}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Class comparison */}
          {(report.classes||[]).length > 1 && (
            <div style={card}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Class Comparison</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {report.classes.map(c => (
                  <div key={c.class} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 140, fontSize: 13, fontWeight: 600, color: "#374151", flexShrink: 0 }}>{c.class}</div>
                    <div style={{ flex: 1, height: 10, background: "#f1f5f9", borderRadius: 5, overflow: "hidden" }}>
                      <div style={{ width: `${c.avg_pct}%`, height: "100%", background: "linear-gradient(90deg,#4338ca,#6366f1)", borderRadius: 5 }} />
                    </div>
                    <div style={{ width: 60, textAlign: "right", fontWeight: 700, fontSize: 14, color: "#6366f1" }}>{c.avg_pct}%</div>
                    <div style={{ width: 60, textAlign: "right", fontSize: 12, color: "#94a3b8" }}>{c.students} students</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
