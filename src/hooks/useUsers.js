// SRP: Fetches and manages the user list — decoupled from any UI.
// DIP: Depends on the get/del API abstraction, not on fetch directly.

import { useState, useCallback } from "react";
import { get, del, post } from "../utils/api";

export function useUsers() {
  const [users,   setUsers]  = useState([]);
  const [loading, setLoad]   = useState(false);
  const [error,   setError]  = useState(null);

  const load = useCallback(async () => {
    setLoad(true);
    try {
      const d = await get("users");
      if (d.success) { setUsers(d.users); setError(null); }
      else setError(d.message);
    } catch {
      setError("Cannot reach server. Is XAMPP running?");
    }
    setLoad(false);
  }, []);

  const addUser = async (form) => {
    const d = await post("register", form);
    if (d.success) setUsers(prev => [d.user, ...prev]);
    return d;
  };

  const removeUser = async (id) => {
    await del("delete_user", { id });
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return { users, loading, error, load, addUser, removeUser };
}
