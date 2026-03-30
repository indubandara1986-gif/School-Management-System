// SRP: Renders the student grade card tab only.

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { GRADE_COLOR } from "../../constants/academic";
import { card, btn, sel } from "../../utils/styles";
import Spinner from "../ui/Spinner";

export default function GradeCardTab({ students, gradeCard, loading, onLoad }) {
  const { user } = useAuth();
  const [cardStudent, setCardStudent] = useState(user?.role === "Student" ? user.id : "");

  const handleLoad = () => onLoad(cardStudent);

  return (
    <>
      {user?.role !== "Student" && (
        <div style={{ display: "flex", gap: 12 }}>
          <select value={cardStudent} onChange={e => setCardStudent(e.target.value)} style={{ ...sel, flex: 1 }}>
            <option value="">Select Student…</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name} — {s.department}</option>)}
          </select>
          <button onClick={handleLoad} disabled={loading || !cardStudent} style={{ ...btn(), display: "flex", alignItems: "center", gap: 8 }}>
            {loading && <Spinner size={14} />}View Grade Card
          </button>
        </div>
      )}

      {user?.role === "Student" && (
        <button onClick={handleLoad} disabled={loading} style={{ ...btn(), display: "flex", alignItems: "center", gap: 8, width: "fit-content" }}>
          {loading && <Spinner size={14} />}Load My Grade Card
        </button>
      )}

      {gradeCard && (() => {
        const { student, grades } = gradeCard;
        const termGroups = {};
        grades.forEach(g => { if (!termGroups[g.term]) termGroups[g.term] = []; termGroups[g.term].push(g); });
        const overall = grades.length > 0 ? (grades.reduce((a,g) => a+g.percentage,0)/grades.length).toFixed(1) : 0;

        return (
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#eef2ff", color: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700 }}>{student.avatar}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{student.name}</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{student.department}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: +overall>=65?"#16a34a":+overall>=40?"#d97706":"#dc2626" }}>{overall}%</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>Overall Average</div>
              </div>
            </div>

            {Object.entries(termGroups).map(([term, gs]) => {
              const termAvg = gs.length>0?(gs.reduce((a,g)=>a+g.percentage,0)/gs.length).toFixed(1):0;
              return (
                <div key={term} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, color: "#374151", fontSize: 14, padding: "4px 12px", background: "#f1f5f9", borderRadius: 20 }}>{term}</div>
                    <div style={{ fontWeight: 700, color: "#6366f1", fontSize: 13 }}>Average: {termAvg}%</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10 }}>
                    {gs.map(g => (
                      <div key={g.id} style={{ padding: "14px 16px", borderRadius: 12, border: `2px solid ${GRADE_COLOR[g.grade_letter]}33`, background: `${GRADE_COLOR[g.grade_letter]}08` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{g.subject}</div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: GRADE_COLOR[g.grade_letter] }}>{g.grade_letter}</div>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{g.marks} <span style={{ fontSize: 12, color: "#94a3b8" }}>/ {g.max_marks}</span></div>
                        <div style={{ marginTop: 6, height: 5, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${g.percentage}%`, height: "100%", background: GRADE_COLOR[g.grade_letter], borderRadius: 3 }} />
                        </div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{g.percentage}%</div>
                        {g.remarks && <div style={{ fontSize: 11, color: "#64748b", marginTop: 5, fontStyle: "italic" }}>"{g.remarks}"</div>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}
    </>
  );
}
