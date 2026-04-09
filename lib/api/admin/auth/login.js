import { db } from '../../../db/index.js';
import { admin_users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { securityService } from '../../../services/security.service.js';
import { success, error, unauthorized } from '../../../utils/responseHelper.js';

export const login = async (req, res) => {
  if (req.method !== 'POST') return error(res, 'Method not allowed', 405);

  try {
    const { username, password } = req.body;

    if (!username || !password) return error(res, 'Username and password required');

    // 1. Find user
    const [user] = await db.select().from(admin_users).where(eq(admin_users.username, username)).limit(1);

    if (!user || user.is_active === 0) {
      return unauthorized(res); // generic error for security
    }

    // 2. Check password
    const isMatch = await securityService.comparePassword(password, user.password);
    if (!isMatch) {
      return unauthorized(res);
    }

    // 3. Update last login
    await db.update(admin_users)
      .set({ last_login: Math.floor(Date.now() / 1000) })
      .where(eq(admin_users.id, user.id));

    // 4. Generate JWT
    const token = securityService.generateJWT({
      id: user.id,
      username: user.username,
      role: user.role
    });

    return success(res, {
      token,
      user: {
        name: user.full_name,
        role: user.role
      }
    });
  } catch (err) {
    return error(res, 'Login failed due to server error');
  }
};


