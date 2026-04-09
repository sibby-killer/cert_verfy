# Bungoma National Polytechnic Certificate Verification System

![BNP Logo](https://img.shields.io/badge/Status-Official-1B3A6B?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_Serverless_|_Turso-C9A84C?style=for-the-badge)

## Project Overview
This is the official digital infrastructure for Bungoma National Polytechnic designed to eliminate academic forgery and streamline certificate authentication. Graduates are issued certificates with unique security identifiers and QR codes which employers can verify instantly through this portal.

Developed as a modern, blockchain-ready verification solution, the system ensures that credentials are secure, authentic, and easily verifiable globally.

---

## 🛠 Features
- **Instant QR Verification:** Mobile-optimized scanner for physical certificate validation.
- **Security Number Lookup:** Manual verification via secondary secure identifiers.
- **Digital Asset Verification:** Support for verifying official digital certificate files.
- **Forgery Incident Reporting:** Secure channel for employers to flag suspicious documents.
- **Enterprise Admin Suite:** Centralized management of students, courses, and issuance registry.
- **Audit & Analytics:** Real-time monitoring of verification traffic and suspicious activities.

---

## 🚀 Setup & Local Development

If you're looking to run this project locally or initialize a new environment, follow these steps:

### 1. Prerequisites
- **Node.js 18+** installed.
- A **Turso Database** (SQLite) account.
- **Vercel CLI** for serverless function testing.

### 2. Physical Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/sibby-killer/cert_verfy.git
   cd cert_verfy
   ```
2. Install dependencies for both backend and frontend:
   ```bash
   npm install
   cd client && npm install
   cd ..
   ```

### 3. Environment Configuration
Create a `.env` file in the root directory. You can use `.env.example` as a template.
```env
TURSO_DATABASE_URL=libsql://your-db-url
TURSO_AUTH_TOKEN=your-token

JWT_SECRET=your-secure-secret
GMAIL_USER=your-email
GMAIL_APP_PASSWORD=your-app-password
```

### 4. Database Initialization
This project uses **Drizzle ORM**. Run the following to sync the schema to your Turso DB and create the initial admin user:
```bash
# Push schema to Turso
npm run push

# Seed initial admin and courses
npm run seed
```

### 5. Running the Application
- **Frontend Development:** `cd client && npm run dev`
- **API Functions (Local):** `vercel dev`

---

## 🚢 Deployment (Vercel)
The system is architected for Vercel. To deploy:
1. Ensure your `.env` variables are added to the Vercel project settings.
2. Run `npm run deploy` to push to production.

Once deployed on Vercel, the system automatically handles the routing defined in `vercel.json`, ensuring the React frontend and Serverless APIs work in harmony.

---
© 2024 Bungoma National Polytechnic. All rights reserved.
*Built for security, integrity, and transparency.*
