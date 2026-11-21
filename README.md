# College Admission Management System

> **Full Stack Application Development (SESAPZG503) — BITS Pilani WILP · Phase 1**
> Team: Debarghya Pal (2025SL70023) · Shantanu Dutta (2025SL70026)

A web-based system that digitises the **end-to-end college admission process** —
from student application entry, through eligibility review and admission, to fee
collection, invoice generation and management reporting.

---

## Table of Contents

1. [What is this project?](#what-is-this-project)
2. [The problem it solves](#the-problem-it-solves)
3. [Tech stack](#tech-stack)
4. [Architecture](#architecture)
5. [User roles](#user-roles)
6. [End-to-end workflow](#end-to-end-workflow)
7. [Data model](#data-model)
8. [Running locally](#running-locally)
9. [Demo credentials](#demo-credentials)
10. [Environment variables](#environment-variables)
11. [Running against PostgreSQL / MySQL](#running-against-postgresql--mysql)
12. [REST API reference](#rest-api-reference)
13. [Key business rules](#key-business-rules)
14. [Project structure](#project-structure)

---

## What is this project?

The College Admission Management System is a **three-tier web application** that
replaces paper forms, spreadsheets and disconnected registers used by colleges to
run their annual admission cycle. It provides a single, role-aware digital system
where front-desk staff capture applications and process fees, and administrators
configure courses, review applicants, grant admissions and view analytics.

It is delivered as:

- a **React single-page application** (the user interface), and
- a **Spring Boot REST API** (business logic + persistence),

talking to each other over JSON and backed by a relational database.

---

## The problem it solves

Most colleges still manage admissions manually, which causes:

| Pain point | How this system fixes it |
|---|---|
| Paper forms & spreadsheets → errors, delays, lost data | A single digital workflow with validation at every step |
| No role separation — anyone can edit sensitive records | **Role-based access control** (Admin vs Clerk) enforced at the API |
| Admission decisions communicated informally | A one-way, auditable **PENDING → APPROVED/REJECTED** state machine |
| Fee records kept in separate registers | Fees linked to the student's admission, with auto invoices |
| Reports require hours of manual effort | **Real-time reports**: seats, admissions, fee collection |
| No audit trail of who approved what | Every decision records the reviewer's user id + timestamp |

---

## Tech stack

| Layer     | Technology                                              |
|-----------|---------------------------------------------------------|
| Frontend  | React 18, Ant Design 5, Axios, React Router v6, Vite    |
| Backend   | Spring Boot 3.3, Spring Security, Spring Data JPA (Hibernate) |
| DB (dev)  | H2 in-memory — auto-configured, zero setup              |
| DB (prod) | PostgreSQL / MySQL — switched via Spring Profiles        |
| Build     | Maven (backend), npm / Vite (frontend)                  |
| Auth      | Session-based, bcrypt password hashing (cost 12)         |

---

## Architecture

```
┌──────────────────────────────┐   HTTP / JSON    ┌───────────────────────────────┐
│   TIER 1 — PRESENTATION       │  (cookie session) │   TIER 2 — APPLICATION        │
│                               │ ───────────────▶ │                               │
│  React 18 SPA (Ant Design 5)  │                  │  Spring Boot 3 REST API       │
│  • role-aware routing/guards  │ ◀─────────────── │  • Spring Security (RBAC)     │
│  • Axios + interceptors       │                  │  Controller → Service → Repo  │
└──────────────────────────────┘                  │  • business logic in Service  │
                                                   └───────────────┬───────────────┘
                                                                   │ JPA / Hibernate
                                                                   ▼
                                                   ┌───────────────────────────────┐
                                                   │   TIER 3 — DATA               │
                                                   │  H2 (dev) · PostgreSQL/MySQL  │
                                                   │  FK + CHECK constraints       │
                                                   └───────────────────────────────┘
```

**Design decisions**

- Business logic lives **only in the Service layer** — controllers stay thin,
  repositories only query.
- Application status transitions are **one-way and final** (irreversible).
- Payment + invoice are created in a **single `@Transactional` block** — both
  commit or both roll back.
- Roll numbers are auto-generated: `COURSE_CODE-YEAR-SEQ` (e.g. `BCA-2026-001`).
- Passwords are **bcrypt**-hashed (cost 12); plain text is never stored or logged.

---

## User roles

| Role  | Title               | Can do                                                                 |
|-------|---------------------|------------------------------------------------------------------------|
| **Admin** | System Administrator | Manage courses, fee structures, subjects and user accounts; review and **approve/reject** applications; view all reports |
| **Clerk** | Front Desk Staff    | Enter new student applications; record fee payments; print invoices — **no** access to admin functions |

Permissions are enforced in two places: the **backend** (Spring Security URL rules
+ `@PreAuthorize`) and the **frontend** (role-aware routes and sidebar). An
unauthorised route redirects to a **403** page.

---

## End-to-end workflow

```
  CLERK                 ADMIN                  SYSTEM (automatic)        OUTPUT
  ─────                 ─────                  ──────────────────        ──────
1. Enter application ─▶
   (status = PENDING)

                     2. Review applicant
                        against eligibility

                     3. Approve ───────────▶ 4. Create admission
                        (irreversible)          + roll number          Roll: BCA-2026-001
                        or Reject               + decrement a seat
                        (with remarks)

5. Search by roll # ─▶
6. Record fee payment ─────────────────────▶ 7. Generate invoice       Invoice: INV-2026-00001
   (Cash/Cheque/Online)                         (atomic with payment)
8. Print invoice ──────────────────────────────────────────────────▶  Printable receipt

                     9. View reports: seat availability,
                        admission counts, fee collection
```

---

## Data model

8 core entities capture the full admission lifecycle:

| Entity        | Purpose |
|---------------|---------|
| `users`       | Admin/Clerk login credentials, role, active status |
| `courses`     | Course catalogue — seats, duration, eligibility |
| `subjects`    | Subjects per course, organised by semester |
| `course_fees` | Fee heads (Tuition, Hostel, Exam…) per course per academic year |
| `applications`| Student applications with PENDING/APPROVED/REJECTED status |
| `admissions`  | Confirmed enrollments with auto-generated roll numbers |
| `payments`    | Fee payment records linked to admissions and fee heads |
| `invoices`    | Auto-numbered invoice for each payment (1:1) |

**Relationships:** `courses 1:N {subjects, course_fees, applications, admissions}` ·
`applications 1:1 admissions` · `admissions 1:N payments` · `payments 1:1 invoices`.

---

## Running locally

**Prerequisites:** JDK 17+, Node.js 18+, Maven 3.9+.

Open **two terminals**.

### 1. Backend (port 8080)

```bash
cd backend
mvn spring-boot:run
```

- Starts with the **dev** profile → H2 in-memory DB (data resets on each restart).
- Seed data is created automatically on startup: the two demo users, three courses
  (BCA, MBA, BCOM) with fees & subjects, and two sample PENDING applications.
- H2 console (optional): http://localhost:8080/h2-console
  — JDBC URL `jdbc:h2:mem:admissiondb`, user `sa`, empty password.

### 2. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Vite proxies every `/api/*` request to the backend
on port 8080, so the session cookie works same-origin — no CORS fiddling needed.

---

## Demo credentials

| Role  | Username | Password   |
|-------|----------|------------|
| Admin | `admin`  | `admin123` |
| Clerk | `clerk`  | `clerk123` |

**Suggested first run:**

1. Login as **admin** → open **Application Review** → open a PENDING application →
   **Approve**. Note the generated roll number (e.g. `BCA-2026-001`).
2. **Logout**, login as **clerk** → **Fee Collection** → search that roll number →
   pick a fee head → record payment → the **invoice** opens → **Print**.
3. Login as **admin** again → **Reports** to see seats, admissions and fee totals.

---

## Environment variables

Real `.env` files are git-ignored. Example templates are committed:

- **`backend/.env.example`** — PostgreSQL/MySQL connection settings for the `prod`
  profile. The dev profile (H2) needs none of these.
- **`frontend/.env.example`** — `VITE_API_BASE_URL` to point the SPA at a deployed
  API for production builds.

Copy and edit as needed:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

---

## Running against PostgreSQL / MySQL

```bash
cd backend

# PostgreSQL (defaults from application-prod.yml / .env)
mvn spring-boot:run -Dspring-boot.run.profiles=prod

# MySQL — override the datasource via env vars (no code changes):
DB_URL=jdbc:mysql://localhost:3306/admissiondb \
DB_DRIVER=com.mysql.cj.jdbc.Driver \
DB_DIALECT=org.hibernate.dialect.MySQLDialect \
DB_USERNAME=admission DB_PASSWORD=yourpass \
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

Build a production frontend bundle with `npm run build` (output in `frontend/dist`).

---

## REST API reference

| Method | Endpoint | Role |
|--------|----------|------|
| POST | `/api/auth/login` · `/api/auth/logout` | both |
| GET  | `/api/auth/me` | both |
| POST | `/api/auth/change-password` | both |
| GET / POST | `/api/users` | Admin |
| PUT | `/api/users/{id}/activate` · `/deactivate` | Admin |
| GET | `/api/courses` · `/api/courses/{id}` | both |
| POST / PUT | `/api/courses` · `/api/courses/{id}` | Admin |
| GET / POST | `/api/courses/{id}/subjects` · `/api/courses/{id}/fees` | Admin |
| POST | `/api/applications` | Clerk |
| GET | `/api/applications?status=PENDING|APPROVED|REJECTED` | Admin |
| GET | `/api/applications/{id}` | both |
| PUT | `/api/applications/{id}/approve` · `/reject` | Admin |
| GET | `/api/admissions` · `/api/admissions/{id}` | both |
| GET | `/api/admissions/roll/{rollNumber}` | both |
| POST | `/api/payments` | Clerk |
| GET | `/api/payments/admission/{admissionId}` | both |
| GET | `/api/invoices/{id}` · `/api/invoices/payment/{paymentId}` | both |
| GET | `/api/reports/summary` · `/seats` · `/admissions` · `/fees` | Admin |

---

## Key business rules

- **RBAC** — Admin/Clerk permissions enforced at the API (`@PreAuthorize` + URL
  rules) and in the UI (role-aware routes & sidebar).
- **Irreversible status** — `PENDING → APPROVED | REJECTED` only; never back.
- **Auto roll number** — `COURSE_CODE-YEAR-SEQ`, per-course per-year, zero-padded
  to 3 digits (`BCA-2026-001`).
- **Atomic payment + invoice** — created together in one `@Transactional` block.
- **Seat management** — an available seat is decremented on approval; approval is
  blocked when a course is full.
- **bcrypt** passwords (cost 12); plain text never persisted.

---

## Project structure

```
college-admission-system/
├── README.md
├── .gitignore
├── backend/                          Spring Boot REST API
│   ├── pom.xml
│   ├── .env.example
│   └── src/main/
│       ├── java/com/bits/fsad/
│       │   ├── AdmissionSystemApplication.java
│       │   ├── entity/               8 JPA entities + enums
│       │   ├── repository/           Spring Data repositories
│       │   ├── service/              Business logic
│       │   ├── controller/           REST endpoints
│       │   ├── dto/                  Request/response objects
│       │   ├── security/             Spring Security + session auth
│       │   ├── exception/            Global error handling
│       │   └── config/               Data seeder
│       └── resources/
│           ├── application.yml        base + active profile
│           ├── application-dev.yml    H2
│           ├── application-prod.yml   PostgreSQL / MySQL
│           └── data.sql               reference data (courses/fees/subjects)
└── frontend/                         React SPA
    ├── package.json
    ├── vite.config.js                dev proxy → :8080
    ├── index.html
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx                   router + role-based routes
        ├── api/client.js             Axios instance + interceptors
        ├── context/AuthContext.jsx   session state
        ├── components/               ProtectedRoute, AppLayout
        └── pages/                    14 screens (S-01 … S-14)
```
