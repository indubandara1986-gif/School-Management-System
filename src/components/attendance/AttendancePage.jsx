// SRP: Composes attendance sub-tabs — delegates all data ops to useAttendance.
// DIP: Depends on useAttendance abstraction.

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAttendance } from "../../hooks/useAttendance";
import { useFlash } from "../../hooks/useFlash";
import PageShell from "../ui/PageShell";
import Flash from "../ui/Flash";
import TabBar from "../ui/TabBar";
import MarkAttendanceTab from "./MarkAttendanceTab";
import AttendanceSummaryTab from "./AttendanceSummaryTab";
import MyAttendanceTab from "./MyAttendanceTab";

export default function AttendancePage() {
  const { user, hasPerm } = useAuth();
  const canManage = hasPerm("MANAGE_ATTENDANCE");
  const isStudent = user?.role === "Student";
  const { flash, showFlash } = useFlash();

  const {
    records, summary, myAtt, classes, loading,
    loadClasses, loadAttendance, loadSummary, loadMyAttendance,
    updateRecord, markAll, saveAttendance,
  } = useAttendance(user?.id);

  const defaultTab = isStudent ? "my" : "mark";
  const [tab, setTab] = useState(defaultTab);

  useEffect(() => {
    loadClasses();
    if (isStudent) loadMyAttendance();
    else loadAttendance(new Date().toISOString().split("T")[0], "");
  }, []);

  const handleSave = async (date) => {
    const d = await saveAttendance(date);
    showFlash(d.success ? `Attendance saved for ${date}` : d.message, d.success);
  };

  const handleTabChange = (id) => {
    setTab(id);
    if (id === "summary") loadSummary(new Date().toISOString().slice(0,7), "");
    if (id === "mark")    loadAttendance(new Date().toISOString().split("T")[0], "");
    if (id === "my")      loadMyAttendance();
  };

  const tabs = [
    ...(canManage ? [{ id:"mark", label:"✏️ Mark Attendance" }, { id:"summary", label:"📊 Summary" }] : []),
    ...(!canManage && !isStudent ? [{ id:"summary", label:"📊 Summary" }] : []),
    ...(isStudent ? [{ id:"my", label:"📋 My Attendance" }] : []),
  ];

  return (
    <PageShell title="Attendance" subtitle="Track and manage student attendance">
      {flash && <Flash msg={flash.msg} ok={flash.ok} />}
      <TabBar tabs={tabs} active={tab} onChange={handleTabChange} />

      {tab === "mark" && canManage && (
        <MarkAttendanceTab
          classes={classes} records={records} loading={loading}
          onLoad={loadAttendance} onUpdateRecord={updateRecord}
          onMarkAll={markAll} onSave={handleSave}
        />
      )}
      {tab === "summary" && (
        <AttendanceSummaryTab
          classes={classes} summary={summary} loading={loading} onLoad={loadSummary}
        />
      )}
      {tab === "my" && isStudent && (
        <MyAttendanceTab myAtt={myAtt} />
      )}
    </PageShell>
  );
}
