# 🛡 Bungoma National Polytechnic Verification System

Official, blockchain-ready certificate verification platform for Bungoma National Polytechnic. This system allows employers to verify graduate credentials instantly via QR, Security Number, or Digital Certificates.

---

## 🚀 One-Click Setup Guide (For the Creator)

As the creator and owner of the repository, follow these precise steps to get the system live:

### 1. Database Setup (Turso)
This system uses **Turso** for a global, low-latency SQLite database.
1. Install [Turso CLI](https://docs.turso.tech/cli).
2. Create your database: `turso db create bnp-verify`.
3. Get your URL: `turso db show bnp-verify --url`.
4. Get your Token: `turso db tokens create bnp-verify`.
5. Copy these into your `.env` file (see `.env.example`).

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
TURSO_DATABASE_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your-long-token-here

JWT_SECRET=generate-a-random-secure-string
PEPPER_TOKEN=another-random-string-for-passwords

GMAIL_USER=your-institution-email@gmail.com
GMAIL_APP_PASSWORD=your-google-app-password
```

### 3. Local Installation
```bash
# Install core dependencies
npm install

# Install frontend dependencies
cd client && npm install
cd ..

# Initialize database schema
npm run generate
npm run push

# Seed initial admin data
node lib/db/seed.js
```

### 4. Running the Portals
- **Local Dev (Functions):** `npm run dev`
- **Frontend Panel:** `cd client && npm run dev`
- **Admin Access:** Go to `http://localhost:5173/admin`
  - *Default User:* `admin`
  - *Default Pass:* `Admin@BNP2024`

### 5. Deployment (Vercel)
1. Install Vercel CLI: `npm i -g vercel`.
2. Connect to project: `vercel link`.
3. Add environment variables in the Vercel Dashboard.
4. Deploy: `vercel --prod`.

---

## 📂 System Architecture
- **`/api`**: 22+ Serverless Functions handling every logic segment (Auth, Certs, Students, Logs).
- **`/lib`**: Shared services for Security, QR Generation, Email, and Database ORM.
- **`/client`**: React + Vite + Tailwind CSS SPA for both Public and Admin views.
- **`vercel.json`**: Strategic routing configuration for SPA and API compatibility.

## 🔒 Security Protocol
- **JWT Stateless Auth:** No sessions required on serverless.
- **RBAC:** 4 tiers of access (IT Admin, Registrar, Principal, Staff).
- **IP Rate Limiting:** Automated shielding against brute-force verification.
- **Forgery Reporting:** Real-time logging of suspicious activity for investigation.

## 🛠 Maintenance
- Run `npm run studio` to view your database records locally.
- Check `logs` in the Admin Dashboard for a full digital audit trail.

---
© 2024 Bungoma National Polytechnic.
**Proprietary Software - Official Installation Only.**
