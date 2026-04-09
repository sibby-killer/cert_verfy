# Bungoma National Polytechnic Certificate Verification System

Official digital verification portal for Bungoma National Polytechnic (Kenya). Secure, serverless, and mobile-ready.

## 🚀 Features
- **Public Portal:** Verify certificates via QR Code, Security Number, or JSON file.
- **Admin Dashboard:** Real-time analytics, suspicious activity monitoring, and staff audit logs.
- **Credential Management:** Single and Bulk (CSV) certificate issuance, student registry, and revocation tools.
- **Forgery Protection:** Public reporting system and automated logging for security monitoring.
- **PWA support:** Installable on mobile devices with offline asset caching.

## 🛠 Tech Stack
- **Database:** Turso (SQLite/libSQL) + Drizzle ORM
- **Backend:** Vercel Serverless Functions (Node.js)
- **Frontend:** React + Tailwind CSS + Vite
- **Security:** JWT Authentication + RBAC + IP Rate Limiting
- **Deployment:** Vercel + GitHub Actions

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- Turso Database CLI or URL
- Vercel CLI (for local deployment)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/sibby-killer/cert_verfy.git
   cd cert_verfy
   ```
2. Install dependencies:
   ```bash
   npm install && cd client && npm install
   ```
3. Setup Environment Variables:
   Create a `.env` file in the root based on `.env.example`.
4. Run Database Migrations:
   ```bash
   npm run generate
   npm run push
   ```
5. Seed Initial Data:
   ```bash
   node lib/db/seed.js
   ```

### Development
- Root: `npm run dev` (Starts backend functions)
- Client: `cd client && npm run dev` (Starts frontend)

## 🔐 Security Information
Admin credentials and security salts are strictly managed via environment variables. Ensure `JWT_SECRET` and `PEPPER_TOKEN` are rotated periodically in production.

---
© 2024 Bungoma National Polytechnic. All rights reserved.
