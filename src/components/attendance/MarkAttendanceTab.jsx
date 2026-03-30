// SRP: Mark attendance for a date + class only.

import { useState } from "react";
import { STATUSES, STATUS_COLOR, STATUS_BG } from "../../constants/academic";
import { card, btn, inp, sel } from "../../utils/styles";
import Spinner from "../ui/Spinner";

export default function MarkAttendanceTab({ classes, records, loading, onLoad, onUpdateRecord, onMarkAll, onSave }) {
  const [date,        setDate]   = useState(new Date().toISOString().split("T")[0]);
  const [classFilter, setCls]    = useState("");
  const [saving,      setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(date);
    setSaving(false);
  };

  return (
    <>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...inp, width: 160 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>Class</label>
          <select value={classFilter} onChange={e => setCls(e.target.value)} style={{ ...sel, minWidth: 180 }}>
            <option value="">All Classes</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={() => onLoad(date, classFilter)} disabled={loading}
          style={{ ...btn("#f1f5f9","#374151"), display: "flex", alignItems: "center", gap: 8 }}>
          {loading && <Spinner size={14} />}Load Students
        </button>
      </div>

      {records.length > 0 && (
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{records.length} Students · {date}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>Mark all:</span>
              {STATUSES.map(s => (
                <button key={s} onClick={() => onMarkAll(s)}
                  style={{ padding: "6px 14px", border: `1.5px solid ${STATUS_COLOR[s]}`, borderRadius: 8, background: STATUS_BG[s], color: STATUS_COLOR[s], fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{s}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 500, overflowY: "auto" }}>
            {records.map(r => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: STATUS_BG[r.status]||"#f8fafc", border: `1.5px solid ${STATUS_COLOR[r.status]||"#e2e8f0"}30` }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{r.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{r.department}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => onUpdateRecord(r.id, "status", s)}
                      style={{ padding: "5px 12px", border: `1.5px solid ${r.status===s?STATUS_COLOR[s]:"#e2e8f0"}`, borderRadius: 7, background: r.status===s?STATUS_COLOR[s]:"white", color: r.status===s?"white":STATUS_COLOR[s]||"#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>{s}</button>
                  ))}
                </div>
                <input value={r.note||""} onChange={e => onUpdateRecord(r.id, "note", e.target.value)} placeholder="Note…" style={{ ...inp, width: 140, fontSize: 12, padding: "6px 10px" }} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleSave} disabled={saving} style={{ ...btn(), padding: "11px 28px", display: "flex", alignItems: "center", gap: 8, fontSize: 15 }}>
              {saving && <Spinner size={15} />}{saving ? "Saving…" : "Save Attendance"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
