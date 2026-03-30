// SRP: Single source of truth for role definitions and metadata.
// OCP: Add new roles here without touching any component.

export const ROLES = [
  "Admin", "Principal", "Teacher", "Student", "Parent", "Accountant",
];

export const ROLE_META = {
  Admin:      { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", icon: "⚙" },
  Principal:  { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", icon: "🏫" },
  Teacher:    { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", icon: "📚" },
  Student:    { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", icon: "🎓" },
  Parent:     { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: "👪" },
  Accountant: { color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: "💼" },
};

export const DEMO_CREDS = [
  { role: "Admin",      email: "admin@school.lk",      password: "admin123",     color: "#dc2626" },
  { role: "Principal",  email: "principal@school.lk",  password: "principal123", color: "#ea580c" },
  { role: "Teacher",    email: "teacher@school.lk",    password: "teacher123",   color: "#2563eb" },
  { role: "Student",    email: "student@school.lk",    password: "student123",   color: "#7c3aed" },
  { role: "Parent",     email: "parent@school.lk",     password: "parent123",    color: "#16a34a" },
  { role: "Accountant", email: "accountant@school.lk", password: "acc123",       color: "#d97706" },
];
