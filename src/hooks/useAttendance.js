// SRP: All attendance data fetching, mutation, and local record state.

import { useState, useCallback } from "react";
import { get, post } from "../utils/api";

export function useAttendance(userId) {
  const [records,  setRecords]  = useState([]);
  const [summary,  setSummary]  = useState(null);
  const [myAtt,    setMyAtt]    = useState(null);
  const [classes,  setClasses]  = useState([]);
  const [loading,  setLoading]  = useState(false);

  const loadClasses = useCallback(async () => {
    const u = await get("users", { role: "Student" });
    if (u.success) setClasses([...new Set(u.users.map(u => u.department))].sort());
  }, []);

  const loadAttendance = useCallback(async (date, classFilter) => {
    setLoading(true);
    try {
      const d = await get("attendance", { date, class: classFilter });
      if (d.success) setRecords(d.attendance.map(r => ({
        ...r, status: r.status || "Present", note: r.note || "",
      })));
    } catch {}
    setLoading(false);
  }, []);

  const loadSummary = useCallback(async (month, classFilter) => {
    setLoading(true);
    try {
      const d = await get("attendance_summary", { month, class: classFilter });
      if (d.success) setSummary(d);
    } catch {}
    setLoading(false);
  }, []);

  const loadMyAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const d = await get("my_attendance", { student_id: userId });
      if (d.success) setMyAtt(d);
    } catch {}
    setLoading(false);
  }, [userId]);

  const updateRecord = (id, field, value) =>
    setRecords(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  const markAll = (status) =>
    setRecords(prev => prev.map(r => ({ ...r, status })));

  const saveAttendance = async (date) => {
    const d = await post("mark_attendance", {
      date,
      records: records.map(r => ({ student_id: r.id, status: r.status, note: r.note || "" })),
    });
    return d;
  };

  return {
    records, summary, myAtt, classes, loading,
    loadClasses, loadAttendance, loadSummary, loadMyAttendance,
    updateRecord, markAll, saveAttendance,
  };
}
