import { db } from '../../../db/index.js';
import { courses } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { success, error } from '../../../utils/responseHelper.js';

export async function listCourses(req, res) {
  try {
    const result = await db.select().from(courses);
    return success(res, result);
  } catch (err) {
    return error(res, 'Failed to fetch courses');
  }
}

export async function createCourse(req, res) {
  try {
    const data = req.body;
    const [course] = await db.insert(courses).values(data).returning();
    return success(res, course);
  } catch (err) {
    return error(res, 'Failed to create course');
  }
}

export async function updateCourse(req, res) {
  try {
    const { id } = req.query;
    const data = req.body;
    await db.update(courses).set(data).where(eq(courses.id, parseInt(id)));
    return success(res, { message: 'Course updated' });
  } catch (err) {
    return error(res, 'Failed to update course');
  }
}
