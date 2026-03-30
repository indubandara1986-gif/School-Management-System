// SRP: Admin user list, add, and delete.
// DIP: Delegates data ops to useUsers hook.

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../hooks/useUsers";
import { useFlash } from "../../hooks/useFlash";
import { ROLES, ROLE_META } from "../../constants/roles";
import { card, btn, inp, sel, chip } from "../../utils/styles";
import PageShell from "../ui/PageShell";
import Flash from "../ui/Flash";
import Spinner from "../ui/Spinner";
import DbBanner from "../ui/DbBanner";
import Modal from "../ui/Modal";

function AddUserForm({ onAdd, onClose }) {
  const [form,    setForm]   = useState({ name:"", email:"", password:"", role:"Teacher", department:"", phone:"" });
  const [error,   setError]  = useState("");
  const [loading, setLoad]   = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError("Name, email and password required."); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setError("Enter a valid email."); return; }
    setLoad(true);
    const d = await onAdd(form);
    setLoad(false);
    if (!d.success) { setError(d.message); return; }
    onClose();
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Add New User</div>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, color: "#94a3b8", cursor: "pointer" }}>✕</button>
      </div>
      {error && <Flash msg={error} ok={false} />}
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[["Full Name","name","text"],["Email","email","email"],["Password","password","password"],["Department / Class","department","text"],["Phone","phone","tel"]].map(([l,k,t]) => (
          <div key={k} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {l}{["name","email","password"].includes(k) && <span style={{ color: "#ef4444" }}> *</span>}
            </label>
            <input type={t} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={inp} required={["name","email","password"].includes(k)} />
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>Role</label>
          <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={{ ...sel, width: "100%" }}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <button type="submit" disabled={loading} style={{ ...btn(), padding: 12, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 6 }}>
          {loading && <Spinner size={15} />}{loading ? "Creating…" : "Create User"}
        </button>
      </form>
    </>
  );
}

function DeleteConfirm({ target, onConfirm, onCancel }) {
  return (
    <div style={{ textAlign: "center", padding: "4px 4px" }}>
      <div style={{ fontSize: 44, marginBottom: 14 }}>🗑</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>Remove User</div>
      <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 26 }}>
        Are you sure you want to remove <strong>{target.name}</strong>? This cannot be undone.
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={onCancel} style={{ ...btn("#f1f5f9","#374151"), padding: "10px 24px" }}>Cancel</button>
        <button onClick={onConfirm} style={{ ...btn("#dc2626"), padding: "10px 24px" }}>Yes, Remove</button>
      </div>
    </div>
  );
}

export default function UserManagementPage() {
  const { user: me, dbError, setDbErr } = useAuth();
  const { users, loading, error, load, addUser, removeUser } = useUsers();
  const { flash, showFlash } = useFlash();
  const [search,     setSearch]  = useState("");
  const [roleF,      setRoleF]   = useState("All");
  const [showModal,  setModal]   = useState(false);
  const [delTarget,  setDel]     = useState(null);

  useEffect(() => {
    load();
    if (error) setDbErr(error);
  }, []);

  const filtered = users.filter(u =>
    (roleF === "All" || u.role === roleF) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) ||
     u.email.toLowerCase().includes(search.toLowerCase()) ||
     (u.department||"").toLowerCase().includes(search.toLowerCase()))
  );

  const roleCounts = ROLES.reduce((a,r) => ({ ...a, [r]: users.filter(u => u.role === r).length }), {});

  const handleAdd = async (form) => {
    const d = await addUser(form);
    if (d.success) showFlash(`User "${d.user.name}" added successfully!`);
    return d;
  };

  const handleDelete = async () => {
    if (!delTarget) return;
    await removeUser(delTarget.id);
    setDel(null);
    showFlash("User removed successfully.");
  };

  return (
    <PageShell title="User Management" subtitle={`${users.length} users in database`}
      action={<button onClick={() => setModal(true)} style={{ ...btn(), fontSize: 14 }}>+ Add User</button>}>
      <DbBanner msg={dbError} />
      {flash && <Flash msg={flash.msg} ok={flash.ok} />}

      {/* Role filter tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
        {ROLES.map(role => {
          const m = ROLE_META[role];
          return (
            <button key={role} onClick={() => setRoleF(roleF === role ? "All" : role)}
              style={{ background: roleF === role ? m.bg : "white", border: `2px solid ${roleF === role ? m.color : "#e2e8f0"}`, borderRadius: 12, padding: "14px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer" }}>
              <span style={{ fontSize: 20 }}>{m.icon}</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: roleF === role ? m.color : "#0f172a" }}>{roleCounts[role]||0}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: m.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>{role}s</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ display: "flex", gap: 12 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, department…" style={{ ...inp, flex: 1 }} />
        <select value={roleF} onChange={e => setRoleF(e.target.value)} style={{ ...sel, minWidth: 160 }}>
          <option value="All">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 48, color: "#64748b" }}><Spinner size={32} /><div style={{ marginTop: 12 }}>Loading users…</div></div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["User","Email","Department","Role","Joined","Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #f1f5f9" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>No users found.</td></tr>
              ) : filtered.map(u => {
                const m = ROLE_META[u.role] || ROLE_META.Student;
                return (
                  <tr key={u.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: m.bg, color: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{u.avatar}</div>
                        <span style={{ fontWeight: 600, color: "#0f172a", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                          {u.name}
                          {u.id === me.id && <span style={{ background: "#6366f1", color: "white", fontSize: 9, padding: "2px 7px", borderRadius: 4, fontWeight: 700 }}>You</span>}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{u.email}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>{u.department||"—"}</td>
                    <td style={{ padding: "12px 16px" }}><span style={{ ...chip(`${m.icon} ${u.role}`, m.color, m.bg, m.border) }}>{m.icon} {u.role}</span></td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>{u.joined}</td>
                    <td style={{ padding: "12px 16px" }}>
                      {u.id !== me.id && (
                        <button onClick={() => setDel(u)} style={{ padding: "5px 12px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Remove</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && <Modal onClose={() => setModal(false)}><AddUserForm onAdd={handleAdd} onClose={() => setModal(false)} /></Modal>}
      {delTarget  && <Modal onClose={() => setDel(null)}><DeleteConfirm target={delTarget} onConfirm={handleDelete} onCancel={() => setDel(null)} /></Modal>}
    </PageShell>
  );
}
