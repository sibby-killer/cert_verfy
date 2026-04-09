import { db } from '../../../lib/db/index.js';
import { admin_users } from '../../../lib/db/schema.js';
import { eq } from 'drizzle-orm';
import { withAuth } from '../../../lib/middleware/auth.js';
import { success, error, forbidden, notFound } from '../../../lib/utils/responseHelper.js';

const handler = async (req, res) => {
  if (req.method !== 'PUT') return error(res, 'Method not allowed', 405);
  if (req.user.role !== 'it_admin') return forbidden(res);

  const { id } = req.query;
  const { role, is_active, full_name } = req.body;

  // Prevent self-lockout
  if (id === req.user.id && is_active === 0) {
    return error(res, 'You cannot deactivate your own account to prevent self-lockout');
  }

  try {
    const [updated] = await db.update(admin_users)
      .set({
        role,
        is_active,
        full_name,
        updated_at: Math.floor(Date.now() / 1000)
      })
      .where(eq(admin_users.id, id))
      .returning();

    if (!updated) return notFound(res, 'Admin user');
    return success(res, updated);
  } catch (err) {
    return error(res, 'Failed to update admin user');
  }
};

export default withAuth(handler);
