// SRP: All grade-related data fetching and mutations in one hook.

import { useState, useEffect } from "react";
import { get, post } from "../utils/api";

export function useGrades() {
  const [students,  setStudents]  = useState([]);
  const [subjects,  setSubjects]  = useState([]);
  const [classes,   setClasses]   = useState([]);
  const [report,    setReport]    = useState(null);
  const [gradeCard, setGradeCard] = useState(null);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => { loadMeta(); }, []);

  const loadMeta = async () => {
    try {
      const [u, s] = await Promise.all([get("users", { role: "Student" }), get("subjects")]);
      if (u.success) {
        setStudents(u.users);
        setClasses([...new Set(u.users.map(u => u.department))].sort());
      }
      if (s.success) setSubjects(s.subjects);
    } catch {}
  };

  const loadReport = async (classFilter, term) => {
    setLoading(true);
    try {
      const d = await get("grade_report", { class: classFilter, term });
      if (d.success) setReport(d);
    } catch {}
    setLoading(false);
  };

  const loadGradeCard = async (studentId) => {
    setLoading(true);
    const d = await get("student_grade_card", { student_id: studentId });
    if (d.success) setGradeCard(d);
    setLoading(false);
  };

  const saveGrade = async (payload) => {
    const d = await post("save_grade", payload);
    return d;
  };

  const addSubject = async (subjectData) => {
    const d = await post("add_subject", subjectData);
    if (d.success) setSubjects(prev => [...prev, d.subject]);
    return d;
  };

  return {
    students, subjects, classes,
    report, gradeCard, loading,
    loadReport, loadGradeCard, saveGrade, addSubject,
  };
}
