// SRP: Owns all authentication state and operations.
// DIP: Exposes an abstraction (useAuth hook) — consumers never touch localStorage or fetch directly.

import { createContext, useContext, useState, useEffect } from "react";
import { post } from "../utils/api";
import { PERMISSIONS } from "../constants/permissions";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user,    setUser]   = useState(null);
  const [loading, setLoad]   = useState(true);
  const [dbError, setDbErr]  = useState(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem("sms_u");
      if (s) setUser(JSON.parse(s));
    } catch (_) {}
    setLoad(false);
  }, []);

  const persist = (u) => {
    setUser(u);
    localStorage.setItem("sms_u", JSON.stringify(u));
  };

  const login = async (email, password) => {
    try {
      const d = await post("login", { email, password });
      if (!d.success) return { success: false, message: d.message };
      persist(d.user);
      setDbErr(null);
      return { success: true };
    } catch {
      return { success: false, message: "Cannot connect to server. Is XAMPP running?" };
    }
  };

  const signup = async (form) => {
    try {
      const d = await post("register", form);
      if (!d.success) return { success: false, message: d.message };
      persist(d.user);
      return { success: true };
    } catch {
      return { success: false, message: "Cannot connect to server." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sms_u");
  };

  const resetPw = async (email) => {
    try { return await post("reset_password", { email }); }
    catch { return { success: false, message: "Server error." }; }
  };

  const updateProfile = async (updates) => {
    try {
      const d = await post("update_profile", { id: user.id, ...updates });
      if (d.success) {
        const u = { ...user, ...updates, avatar: d.avatar || user.avatar };
        persist(u);
      }
      return d;
    } catch { return { success: false, message: "Server error." }; }
  };

  const changePw = async (current, newPw) => {
    try { return await post("change_password", { id: user.id, current, new: newPw }); }
    catch { return { success: false, message: "Server error." }; }
  };

  const hasPerm = (perm) =>
    user ? (PERMISSIONS[perm] || []).includes(user.role) : false;

  return (
    <AuthContext.Provider value={{
      user, loading, dbError, setDbErr,
      login, signup, logout, resetPw, updateProfile, changePw, hasPerm,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
