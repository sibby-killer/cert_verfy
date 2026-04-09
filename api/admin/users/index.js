import { db } from '../../../lib/db/index.js';
import { admin_users } from '../../../lib/db/schema.js';
import { desc } from 'drizzle-orm';
import { withAuth } from '../../../lib/middleware/auth.js';
import { withRole } from '../../../lib/middleware/role.js';
import { securityService } from '../../../lib/services/security.service.js';
import { success, error, forbidden } from '../../../lib/utils/responseHelper.js';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    if (req.user.role !== 'it_admin') return forbidden(res);
    
    try {
      const list = await db.select({
        id: admin_users.id,
        username: admin_users.username,
        email: admin_users.email,
        fullName: admin_users.full_name,
        role: admin_users.role,
        is_active: admin_users.is_active,
        last_login: admin_users.last_login
      }).from(admin_users).orderBy(desc(admin_users.created_at));
      
      return success(res, list);
    } catch (err) {
      return error(res, 'Failed to fetch admin users');
    }
  }

  if (req.method === 'POST') {
    if (req.user.role !== 'it_admin') return forbidden(res);

    try {
      const { username, password, email, full_name, role } = req.body;
      
      const hashedPassword = await securityService.hashPassword(password);
      
      const [newUser] = await db.insert(admin_users).values({
        username,
        password: hashedPassword,
        email,
        full_name,
        role,
        is_active: 1
      }).returning();

      // Don't return password
      const { password: _, ...userWithoutPassword } = newUser;
      return success(res, userWithoutPassword, 201);
    } catch (err) {
      if (err.message.includes('unique')) return error(res, 'Username or Email already exists');
      return error(res, 'Failed to create admin user');
    }
  }

  return error(res, 'Method not allowed', 405);
};

export default withAuth(handler);
