import { db } from '../../../db/index.js';
import { admin_users } from '../../../db/schema.js';
import { securityService } from '../../../services/security.service.js';
import { eq } from 'drizzle-orm';
import { success, error } from '../../../utils/responseHelper.js';

export async function listUsers(req, res) {
  try {
    const result = await db.select({
      id: admin_users.id,
      username: admin_users.username,
      full_name: admin_users.full_name,
      email: admin_users.email,
      role: admin_users.role,
      is_active: admin_users.is_active
    }).from(admin_users);
    return success(res, result);
  } catch (err) {
    return error(res, 'Failed to fetch users');
  }
}

export async function createUser(req, res) {
  try {
    const { password, ...data } = req.body;
    const hashedPassword = await securityService.hashPassword(password);
    const [user] = await db.insert(admin_users).values({ ...data, password: hashedPassword }).returning();
    return success(res, user);
  } catch (err) {
    return error(res, 'Failed to create user');
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.query;
    const { password, ...data } = req.body;
    if (password) data.password = await securityService.hashPassword(password);
    await db.update(admin_users).set(data).where(eq(admin_users.id, parseInt(id)));
    return success(res, { message: 'User updated' });
  } catch (err) {
    return error(res, 'Failed to update user');
  }
}
