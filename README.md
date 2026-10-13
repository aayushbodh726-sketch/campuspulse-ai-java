# CampusPulse AI

**A smart campus issue reporting and resolution platform** designed for student voice, role-based departmental routing, SLA enforcement, and recurring pattern detection.

---

## Overview

CampusPulse AI bridges students, departmental staff, and university administrators in a unified, transparent issue tracking environment.

- **Role-Aware Workflows**: Separate access levels for Students (reporting & personal ticket tracking), Staff (departmental queues and status updates), and Administrators (cross-campus governance and access control).
- **Automated Routing & SLAs**: Category-driven dispatch to IT Services, Facilities & Maintenance, Housekeeping, or Campus Administration, paired with dynamically calculated resolution targets (4h to 120h).
- **Audit Trails**: Immutable history tracking of every status change, note, and technician assignment.
- **Campus Intelligence**: 90-day pattern detection that identifies recurring issues across categories and campus locations to encourage permanent infrastructure fixes.
- **Campus Assistant**: Grounded AI guidance based on verified university FAQ policies and reporting procedures.

---

## Demo Accounts

For demonstration and walkthroughs, the prototype comes pre-configured with three simulation roles:

| Role | Account Email | Scope |
|---|---|---|
| **Student** | `student@campuspulse.local` | Reports issues, views personal tickets, tracks resolution timelines |
| **Staff** | `staff@campuspulse.local` | Assigned to IT Services; updates ticket status, logs technician notes |
| **Administrator** | `admin@campuspulse.local` | Campus-wide overview, user permissions, department assignments, notice publishing |

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Manrope & DM Sans typography
- **Icons**: Lucide Icons
- **Animation**: Motion
- **State & Persistence**: Reactive Context with localStorage sync

---

## Quickstart

### 1. Install dependencies
```bash
npm install
```

### 2. Start local development server
```bash
npm run dev
```
Open **http://localhost:3000** in your browser.

### 3. Build for production
```bash
npm run build
```

---

## License
MIT
