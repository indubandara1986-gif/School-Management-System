// SRP: Grade entry form + subjects list panel.

import { useState } from "react";
import { TERMS } from "../../constants/academic";
import { card, btn, inp, sel } from "../../utils/styles";
import Flash from "../ui/Flash";
import Spinner from "../ui/Spinner";

export default function GradeEntryTab({ students, subjects, onSaveGrade, onAddSubject }) {
  const [entryStudent,  setEntryStudent]  = useState("");
  const [entrySubject,  setEntrySubject]  = useState("");
  const [entryTerm,     setEntryTerm]     = useState("Term 1");
  const [entryMarks,    setEntryMarks]    = useState("");
  const [entryRemarks,  setEntryRemarks]  = useState("");
  const [entryMsg,      setEntryMsg]      = useState(null);
  const [saving,        setSaving]        = useState(false);
  const [showAddSub,    setShowAddSub]    = useState(false);
  const [newSub,        setNewSub]        = useState({ name:"", code:"", max_marks:100 });

  const saveGrade = async (e) => {
    e.preventDefault();
    if (!entryStudent || !entrySubject) { setEntryMsg({ ok: false, text: "Select student and subject." }); return; }
    setSaving(true);
    const d = await onSaveGrade({ student_id: +entryStudent, subject_id: +entrySubject, marks: +entryMarks, term: entryTerm, remarks: entryRemarks });
    setSaving(false);
    setEntryMsg({ ok: d.success, text: d.success ? "Grade saved successfully!" : d.message });
    if (d.success) { setEntryMarks(""); setEntryRemarks(""); }
  };

  const addSubject = async (e) => {
    e.preventDefault();
    await onAddSubject(newSub);
    setNewSub({ name:"", code:"", max_marks:100 });
    setShowAddSub(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {/* Grade entry form */}
      <div style={card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 18 }}>Enter / Update Grade</div>
        {entryMsg && <Flash msg={entryMsg.text} ok={entryMsg.ok} />}
        <form onSubmit={saveGrade} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            ["Student", entryStudent, setEntryStudent, students.map(s => <option key={s.id} value={s.id}>{s.name} — {s.department}</option>)],
            ["Subject", entrySubject, setEntrySubject, subjects.map(s => <option key={s.id} value={s.id}>{s.name} (max {s.max_marks})</option>)],
            ["Term",    entryTerm,    setEntryTerm,    TERMS.map(t => <option key={t} value={t}>{t}</option>)],
          ].map(([label, val, setter, opts]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>
              <select value={val} onChange={e => setter(e.target.value)} style={{ ...sel, width: "100%" }} required>
                <option value="">Select {label}…</option>
                {opts}
              </select>
            </div>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>Marks</label>
            <input type="number" value={entryMarks} onChange={e => setEntryMarks(e.target.value)} min="0" max="100" step="0.5" required style={inp} placeholder="Enter marks…" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>Remarks (optional)</label>
            <input value={entryRemarks} onChange={e => setEntryRemarks(e.target.value)} style={inp} placeholder="e.g. Excellent performance" />
          </div>
          <button type="submit" disabled={saving} style={{ ...btn(), display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {saving && <Spinner size={14} />}{saving ? "Saving…" : "Save Grade"}
          </button>
        </form>
      </div>

      {/* Subjects list */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Subjects</div>
          <button onClick={() => setShowAddSub(p => !p)} style={{ ...btn("#f1f5f9","#374151"), fontSize: 12 }}>+ Add Subject</button>
        </div>

        {showAddSub && (
          <form onSubmit={addSubject} style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16, padding: 14, background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
            <input value={newSub.name} onChange={e => setNewSub(p=>({...p,name:e.target.value}))} placeholder="Subject name *" style={inp} required />
            <input value={newSub.code} onChange={e => setNewSub(p=>({...p,code:e.target.value}))} placeholder="Code (e.g. MATH)" style={inp} />
            <input type="number" value={newSub.max_marks} onChange={e => setNewSub(p=>({...p,max_marks:+e.target.value}))} placeholder="Max marks" style={inp} min="1" />
            <button type="submit" style={btn()}>Add Subject</button>
          </form>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {subjects.map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 9, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.code} · Max: {s.max_marks}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
