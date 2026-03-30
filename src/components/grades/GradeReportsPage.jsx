// SRP: Composes grade sub-tabs — no data logic here (delegated to useGrades).
// DIP: Depends on useGrades hook abstraction, not API directly.

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useGrades } from "../../hooks/useGrades";
import PageShell from "../ui/PageShell";
import TabBar from "../ui/TabBar";
import GradeReportTab from "./GradeReportTab";
import GradeCardTab from "./GradeCardTab";
import GradeEntryTab from "./GradeEntryTab";

export default function GradeReportsPage() {
  const { hasPerm } = useAuth();
  const canManage = hasPerm("MANAGE_GRADES");
  const [tab, setTab] = useState("report");

  const {
    students, subjects, classes,
    report, gradeCard, loading,
    loadReport, loadGradeCard, saveGrade, addSubject,
  } = useGrades();

  const tabs = [
    { id: "report", label: "📊 Overview" },
    { id: "card",   label: "🎓 Grade Card" },
    ...(canManage ? [{ id: "entry", label: "✏️ Enter Grades" }] : []),
  ];

  return (
    <PageShell title="Grade Reports" subtitle="Manage and view academic performance">
      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === "report" && (
        <GradeReportTab classes={classes} report={report} loading={loading} onLoad={loadReport} />
      )}
      {tab === "card" && (
        <GradeCardTab students={students} gradeCard={gradeCard} loading={loading} onLoad={loadGradeCard} />
      )}
      {tab === "entry" && canManage && (
        <GradeEntryTab students={students} subjects={subjects} onSaveGrade={saveGrade} onAddSubject={addSubject} />
      )}
    </PageShell>
  );
}
