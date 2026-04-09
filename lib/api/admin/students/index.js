import { db } from '../../../db/index.js';
import { students } from '../../../db/schema.js';
import { eq, or, like } from 'drizzle-orm';
import { success, error } from '../../../utils/responseHelper.js';

export async function listStudents(req, res) {
  try {
    const { search } = req.query;
    let query = db.select().from(students);
    
    if (search) {
      query = query.where(
        or(
          like(students.full_name, `%${search}%`),
          like(students.student_id, `%${search}%`)
        )
      );
    }
    
    const result = await query.all();
    return success(res, result);
  } catch (err) {
    return error(res, 'Failed to fetch students');
  }
}

export async function getStudent(req, res) {
  try {
    const { id } = req.query;
    const [student] = await db.select().from(students).where(eq(students.id, parseInt(id)));
    if (!student) return error(res, 'Student not found', 404);
    return success(res, student);
  } catch (err) {
    return error(res, 'Failed to fetch student');
  }
}

export async function updateStudent(req, res) {
  try {
    const { id } = req.query;
    const data = req.body;
    await db.update(students).set(data).where(eq(students.id, parseInt(id)));
    return success(res, { message: 'Student updated' });
  } catch (err) {
    return error(res, 'Failed to update student');
  }
}
