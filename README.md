# JobConnect — Job Portal Management System

**JobConnect** is a modern, responsive, full-stack Job Portal Management System with Role-Based Access Control (RBAC) designed for **Job Seekers**, **Employers**, and **Administrators**.

---

## 🛠️ Tech Stack

- **Backend**: Java 17+, Spring Boot 3.3.4, Spring Security 6, Spring Data JPA, JJWT (0.12.6), Maven
- **Database**: MySQL (`jobconnect_db`)
- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Lucide React, Axios
- **Storage**: Server-side file storage for Resumes (PDF) and Company Logos

---

## 👥 User Roles & Features

### 1. Job Seeker
- Registration, Login, Logout with JWT Bearer authentication
- Profile completion percentage indicator
- Resume / CV upload, update, preview & removal (PDF, max 5 MB)
- Education, experience, skills tag management, and social links
- Browse, filter (categories, job types, salary, experience, location), and sort jobs
- 1-Click apply with profile CV verification and optional cover letter
- My Applications tracking (`Pending`, `Reviewed`, `Accepted`, `Rejected`)
- Job bookmarking / saved jobs

### 2. Employer
- Employer account registration & login
- Company profile management with branding & logo image upload
- Post new job listings with full specifications and deadlines
- Manage posted jobs (edit details, toggle active/closed, delete)
- Applicant review board per job listing
- Review candidate credentials and download candidate CVs
- Update application status (`Pending` ➔ `Reviewed` ➔ `Accepted` / `Rejected`)

### 3. Administrator
- Governance dashboard with platform metrics & distribution charts
- User management: search, filter by role, activate/deactivate, delete users
- Job moderation: review and remove inappropriate/spam listings
- Global platform-wide application audit

---

## 🔑 Pre-Seeded Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@jobconnect.com` | `admin123` |
| **Employer** | `techcorp@jobconnect.com` | `employer123` |
| **Job Seeker** | `seeker@jobconnect.com` | `seeker123` |

---

## 🚀 Getting Started

### 1. Database Setup
Create a MySQL database named `jobconnect_db`:
```sql
CREATE DATABASE IF NOT EXISTS jobconnect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update your database credentials in `backend/src/main/resources/application.properties` if needed:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/jobconnect_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
```

### 2. Run the Backend
```bash
cd backend
mvn spring-boot:run
```
The backend server runs at `http://localhost:8081`.

### 3. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend dev server runs at `http://localhost:5174` (or `5173`) with API proxy to port `8081`.
