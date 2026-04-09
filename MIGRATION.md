# Migration Guide: Moving to Full-Stack Node.js (Express)

This system is built using **Vercel Serverless Functions**. If the institution decides to migrate to a perpetual dedicated server or VPS (e.g. DigitalOcean, AWS EC2), follow these steps:

## 1. Convert API to Express
The `/api` files can be refactored into an Express.js router easily since they already use `req, res` objects.

Example transformation for `/api/verify/number.js`:
```javascript
// From:
export default async function handler(req, res) { ... }

// To:
router.post('/verify/number', async (req, res) => { ... });
```

## 2. Shared Middleware
The `/lib/middleware` functions are already compatible with Express.

## 3. Database Transition
The `lib/db/index.js` uses `libsql`. If migrating to a traditional SQLite file, change the config to local file path. If moving to MySQL/PostgreSQL, update the `drizzle-orm` driver and schema imports in `schema.js`.

## 4. Frontend Environment
Update `vite.config.js` proxy settings to point to your new Express server port (usually 5000).

## 5. Deployment
Use `PM2` or Docker to manage the process on the dedicated server.
