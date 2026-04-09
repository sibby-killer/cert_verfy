import { db } from '../../../lib/db/index.js';
import { students } from '../../../lib/db/schema.js';
import { eq } from 'drizzle-orm';
import { withAuth } from '../../../lib/middleware/auth.js';
import { withRole } from '../../../lib/middleware/role.js';
import { success, error, notFound } from '../../../lib/utils/responseHelper.js';

const handler = async (req, res) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    if (!['it_admin', 'registrar', 'principal'].includes(req.user.role)) {
      return error(res, 'Forbidden', 403);
    }
    
    const [student] = await db.select().from(students).where(eq(students.id, id)).limit(1);
    if (!student) return notFound(res, 'Student');
    return success(res, student);
  }

  if (req.method === 'PUT') {
    if (!['it_admin', 'registrar'].includes(req.user.role)) {
      return error(res, 'Forbidden', 403);
    }

    try {
      const { full_name, email, phone, date_of_birth } = req.body;
      
      const [updated] = await db.update(students)
        .set({
          full_name,
          email,
          phone,
          date_of_birth,
          updated_at: Math.floor(Date.now() / 1000)
        })
        .where(eq(students.id, id))
        .returning();

      return success(res, updated);
    } catch (err) {
      return error(res, 'Failed to update student');
    }
  }

  return error(res, 'Method not allowed', 405);
};

export default withAuth(handler);
