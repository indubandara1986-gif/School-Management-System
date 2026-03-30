// SRP: Owns the entire permission matrix.
// OCP: Add new permissions by adding a key — no component changes needed.

export const PERMISSIONS = {
  MANAGE_USERS:        ["Admin"],
  VIEW_ALL_USERS:      ["Admin", "Principal"],
  VIEW_USER_OVERVIEW:  ["Admin", "Principal"],
  VIEW_GRADE_REPORTS:  ["Admin", "Principal", "Teacher"],
  MANAGE_GRADES:       ["Admin", "Principal", "Teacher"],
  VIEW_GRADES:         ["Admin", "Principal", "Teacher", "Student", "Parent"],
  MANAGE_ATTENDANCE:   ["Admin", "Principal", "Teacher"],
  VIEW_ATTENDANCE:     ["Admin", "Principal", "Teacher", "Student", "Parent"],
  VIEW_FEE_MANAGEMENT: ["Admin", "Accountant", "Principal"],
  VIEW_DASHBOARD:      ["Admin", "Principal", "Teacher", "Student", "Parent", "Accountant"],
  MANAGE_SETTINGS:     ["Admin"],
};
