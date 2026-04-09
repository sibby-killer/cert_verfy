import { db } from '../../../lib/db/index.js';
import { courses } from '../../../lib/db/schema.js';
import { eq } from 'drizzle-orm';
import { withAuth } from '../../../lib/middleware/auth.js';
import { withRole } from '../../../lib/middleware/role.js';
import { success, error, forbidden, notFound } from '../../../lib/utils/responseHelper.js';

const handler = async (req, res) => {
  if (req.method !== 'PUT') return error(res, 'Method not allowed', 405);
  if (req.user.role !== 'it_admin') return forbidden(res);

  const { id } = req.query;

  try {
    const { course_name, department, duration_years, level } = req.body;
    
    const [updated] = await db.update(courses)
      .set({
        course_name,
        department,
        duration_years,
        level
      })
      .where(eq(courses.id, id))
      .returning();

    if (!updated) return notFound(res, 'Course');
    return success(res, updated);
  } catch (err) {
    return error(res, 'Failed to update course');
  }
};

export default withAuth(handler);
