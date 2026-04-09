import { db } from '../../../lib/db/index.js';
import { courses } from '../../../lib/db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { withAuth } from '../../../lib/middleware/auth.js';
import { withRole } from '../../../lib/middleware/role.js';
import { success, error, forbidden } from '../../../lib/utils/responseHelper.js';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const list = await db.select().from(courses).orderBy(desc(courses.created_at));
      return success(res, list);
    } catch (err) {
      return error(res, 'Failed to fetch courses');
    }
  }

  if (req.method === 'POST') {
    if (req.user.role !== 'it_admin') return forbidden(res);

    try {
      const { course_name, course_code, department, duration_years, level } = req.body;
      
      const [newCourse] = await db.insert(courses).values({
        course_name,
        course_code: course_code.toUpperCase(),
        department,
        duration_years,
        level
      }).returning();

      return success(res, newCourse, 201);
    } catch (err) {
      if (err.message.includes('unique')) return error(res, 'Course code already exists');
      return error(res, 'Failed to create course');
    }
  }

  return error(res, 'Method not allowed', 405);
};

export default withAuth(handler);
