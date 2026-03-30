# Vidyaloka School Management System v2.0
### React Frontend — SOLID-Refactored Architecture

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start XAMPP → Apache + MySQL
# 3. Run DB setup:   GET http://localhost/vidyaloka/api.php?action=setup

# 4. Start the dev server
npm run dev
# → http://localhost:5173
```

---

## Project Structure

```
src/
├── main.jsx                              React entry point
├── App.jsx                               Root compositor — pure layout, no logic
│
├── constants/
│   ├── roles.js                          ROLES, ROLE_META, DEMO_CREDS
│   ├── permissions.js                    PERMISSIONS matrix (role → allowed actions)
│   ├── academic.js                       TERMS, STATUSES, GRADE_COLOR, STATUS_COLOR/BG
│   └── index.js                          Barrel re-export
│
├── utils/
│   ├── api.js                            get() / post() / del() HTTP helpers
│   └── styles.js                         chip / card / btn / inp / sel style factories
│
├── context/
│   └── AuthContext.jsx                   AuthProvider + useAuth hook
│
├── hooks/
│   ├── useFlash.js                       Timed flash/notification state
│   ├── useUsers.js                       User list: fetch, addUser, removeUser
│   ├── useGrades.js                      Grades: report, card, save, subjects
│   └── useAttendance.js                  Attendance: mark, summary, my records
│
└── components/
    ├── ui/
    │   ├── Spinner.jsx                   Loading spinner
    │   ├── Flash.jsx                     Success / error message banner
    │   ├── PageShell.jsx                 Standard page layout wrapper
    │   ├── TabBar.jsx                    Pill-style tab switcher
    │   ├── Modal.jsx                     Overlay modal wrapper
    │   └── DbBanner.jsx                  Database error banner
    │
    ├── auth/
    │   ├── AuthLeft.jsx                  Decorative left branding panel
    │   ├── LoginPage.jsx                 Login form + demo quick-login
    │   ├── ForgotPage.jsx                Forgot-password flow
    │   └── SignupPage.jsx                2-step role → details signup
    │
    ├── layout/
    │   └── Sidebar.jsx                   App sidebar (nav, user badge, logout)
    │
    ├── dashboard/
    │   └── DashboardPage.jsx             Role-aware stats, modules, permissions view
    │
    ├── users/
    │   ├── UserOverviewPage.jsx          Aggregate stats, role cards, monthly chart
    │   └── UserManagementPage.jsx        User table, add/delete modal (Admin only)
    │
    ├── grades/
    │   ├── GradeReportsPage.jsx          Tab compositor (delegates to useGrades)
    │   ├── GradeReportTab.jsx            Class/term report, distribution, top performers
    │   ├── GradeCardTab.jsx              Individual student grade card
    │   └── GradeEntryTab.jsx             Grade entry form + subjects panel
    │
    ├── attendance/
    │   ├── AttendancePage.jsx            Tab compositor (delegates to useAttendance)
    │   ├── MarkAttendanceTab.jsx         Mark attendance for a date + class
    │   ├── AttendanceSummaryTab.jsx      Monthly summary, daily chart, student table
    │   └── MyAttendanceTab.jsx           Student's personal attendance view
    │
    └── profile/
        └── ProfilePage.jsx               Profile info edit + change-password tabs
```

---

## SOLID Principles Applied

### S — Single Responsibility
Every file has exactly one reason to change:
- `api.js` — only if the HTTP transport changes
- `useFlash.js` — only if notification timing logic changes
- `TabBar.jsx` — only if the tab UI design changes
- `MarkAttendanceTab.jsx` — only if mark-attendance UI changes

### O — Open/Closed
Extension without modification:
- Add a **new role**: add one entry to `ROLE_META` in `roles.js` — all components update automatically
- Add a **new permission**: add one key to `PERMISSIONS` — `Sidebar` and `DashboardPage` pick it up
- Add a **new nav item**: add one object to `NAV_ITEMS` array in `Sidebar.jsx`
- Add a **new page**: add one entry to `PAGE_MAP` in `App.jsx`

### L — Liskov Substitution
All tab components share a consistent prop contract:
```jsx
// Any of these can be swapped for another component with the same shape:
<GradeReportTab   classes report loading onLoad />
<GradeCardTab     students gradeCard loading onLoad />
<GradeEntryTab    students subjects onSaveGrade onAddSubject />
```

### I — Interface Segregation
Components receive only what they use:
- `TabBar` → `{ tabs, active, onChange }` — not the full page state
- `Flash` → `{ msg, ok }` — not the flash hook internals
- `Modal` → `{ onClose, children }` — not business data
- `MarkAttendanceTab` → attendance slice only, not auth or grades

### D — Dependency Inversion
High-level modules depend on abstractions:
- Pages depend on **hooks** (`useGrades`, `useAttendance`), not on `fetch()`
- Hooks depend on **`api.js`** (`get`, `post`, `del`), not on raw `fetch()`
- `App.jsx` depends on the `PAGE_MAP` object, not on concrete page imports scattered in logic
- `AuthContext` exposes a **`hasPerm()`** abstraction — consumers never inspect `PERMISSIONS` directly

---

## Demo Credentials

| Role       | Email                    | Password       |
|------------|--------------------------|----------------|
| Admin      | admin@school.lk          | admin123       |
| Principal  | principal@school.lk      | principal123   |
| Teacher    | teacher@school.lk        | teacher123     |
| Student    | student@school.lk        | student123     |
| Parent     | parent@school.lk         | parent123      |
| Accountant | accountant@school.lk     | acc123         |

---

## Backend Requirements

- **XAMPP** (Apache + MySQL)
- PHP backend at `http://localhost/vidyaloka/api.php`
- Run setup endpoint once: `GET /vidyaloka/api.php?action=setup`

### API Actions Used

| Action                | Method | Description                        |
|-----------------------|--------|------------------------------------|
| `login`               | POST   | Authenticate user                  |
| `register`            | POST   | Create new account                 |
| `reset_password`      | POST   | Send password reset link           |
| `update_profile`      | POST   | Update name/phone/department       |
| `change_password`     | POST   | Change authenticated password      |
| `users`               | GET    | List users (optional role filter)  |
| `user_stats`          | GET    | Aggregate stats for User Overview  |
| `delete_user`         | DELETE | Remove user by ID                  |
| `subjects`            | GET    | List all subjects                  |
| `add_subject`         | POST   | Create new subject                 |
| `save_grade`          | POST   | Insert/update grade entry          |
| `grade_report`        | GET    | Aggregated grade report            |
| `student_grade_card`  | GET    | Individual student grade card      |
| `attendance`          | GET    | Students list for marking          |
| `mark_attendance`     | POST   | Save attendance records            |
| `attendance_summary`  | GET    | Monthly attendance summary         |
| `my_attendance`       | GET    | Student's own attendance records   |
