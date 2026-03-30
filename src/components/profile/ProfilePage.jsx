// SRP: Profile info and security tabs — delegates auth ops to useAuth.

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { ROLE_META } from "../../constants/roles";
import { card, btn, inp, chip } from "../../utils/styles";
import Flash from "../ui/Flash";
import Spinner from "../ui/Spinner";
import TabBar from "../ui/TabBar";

function ProfileInfoTab({ user, updateProfile }) {
  const [editing, setEd]   = useState(false);
  const [form,    setForm] = useState({ name: user.name, phone: user.phone||"", department: user.department||"" });
  const [msg,     setMsg]  = useState(null);
  const [saving,  setSave] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) { setMsg({ ok: false, text: "Name cannot be empty." }); return; }
    setSave(true);
    const r = await updateProfile(form);
    setSave(false);
    setMsg({ ok: r.success, text: r.success ? "Profile updated!" : r.message||"Update failed." });
    if (r.success) setEd(false);
    setTimeout(() => setMsg(null), 3000);
  };

  const FIELDS = [
    { label:"Full Name",         key:"name",       editable:true  },
    { label:"Email Address",     key:"email",      editable:false, val:user.email    },
    { label:"Phone",             key:"phone",      editable:true  },
    { label:"Department / Class",key:"department", editable:true  },
    { label:"Role",              key:"role",       editable:false, val:user.role     },
    { label:"Joined",            key:"joined",     editable:false, val:user.joined   },
  ];

  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Personal Information</div>
        {!editing ? (
          <button onClick={() => setEd(true)} style={{ ...btn("#f1f5f9","#374151") }}>Edit Profile</button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setEd(false); setForm({ name:user.name, phone:user.phone||"", department:user.department||"" }); }} style={{ ...btn("#f1f5f9","#374151") }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ ...btn(), display:"flex", alignItems:"center", gap:8 }}>
              {saving && <Spinner size={13} />}{saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        )}
      </div>
      {msg && <Flash msg={msg.text} ok={msg.ok} />}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {FIELDS.map(f => (
          <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{f.label}</div>
            {editing && f.editable ? (
              <input value={form[f.key]||""} onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))} style={inp} />
            ) : (
              <div style={{ fontSize: 15, color: "#0f172a", fontWeight: 500 }}>{f.val !== undefined ? f.val : user[f.key]||"—"}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SecurityTab({ changePw }) {
  const [pwForm, setPwF]  = useState({ current:"", next:"", confirm:"" });
  const [msg,    setMsg]  = useState(null);
  const [saving, setSave] = useState(false);

  const handlePw = async (e) => {
    e.preventDefault();
    if (pwForm.next.length < 6) { setMsg({ ok:false, text:"New password must be at least 6 characters." }); return; }
    if (pwForm.next !== pwForm.confirm) { setMsg({ ok:false, text:"Passwords do not match." }); return; }
    setSave(true);
    const r = await changePw(pwForm.current, pwForm.next);
    setSave(false);
    setMsg({ ok: r.success, text: r.success ? "Password changed successfully!" : r.message||"Failed." });
    if (r.success) setPwF({ current:"", next:"", confirm:"" });
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div style={card}>
      <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 22 }}>Change Password</div>
      {msg && <Flash msg={msg.text} ok={msg.ok} />}
      <form onSubmit={handlePw} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}>
        {[["Current Password","current"],["New Password","next"],["Confirm New Password","confirm"]].map(([l,k]) => (
          <div key={k} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</label>
            <input type="password" value={pwForm[k]} onChange={e => setPwF(p=>({...p,[k]:e.target.value}))} required style={inp} />
          </div>
        ))}
        <button type="submit" disabled={saving} style={{ ...btn(), padding:"11px 20px", display:"flex", alignItems:"center", gap:8, width:"fit-content" }}>
          {saving && <Spinner size={13} />}{saving ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateProfile, changePw } = useAuth();
  const [tab, setTab] = useState("info");
  const meta = ROLE_META[user.role] || { color:"#6366f1", bg:"#eef2ff", border:"#c7d2fe" };

  const tabs = [{ id:"info", label:"👤 Profile Details" }, { id:"security", label:"🔒 Security" }];

  return (
    <div style={{ padding: 32, background: "#f1f5f9", minHeight: "100%", fontFamily: "'DM Sans',sans-serif", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header banner */}
      <div style={{ background: "linear-gradient(135deg,#4338ca,#6366f1)", borderRadius: 20, padding: "36px 40px", display: "flex", gap: 28, alignItems: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.25)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, border: "3px solid rgba(255,255,255,0.4)", flexShrink: 0 }}>{user.avatar}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: "white" }}>{user.name}</div>
          <span style={{ ...chip(user.role, meta.color, meta.bg, meta.border), fontSize: 12 }}>{meta.icon} {user.role}</span>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>{user.email} · {user.department}</div>
        </div>
      </div>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === "info"     && <ProfileInfoTab user={user} updateProfile={updateProfile} />}
      {tab === "security" && <SecurityTab changePw={changePw} />}
    </div>
  );
}
