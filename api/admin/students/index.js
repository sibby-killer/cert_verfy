import { db } from '../../../lib/db/index.js';
import { students, certificates } from '../../../lib/db/schema.js';
import { eq, count, sql, and } from 'drizzle-orm';
import { withAuth } from '../../../lib/middleware/auth.js';
import { withRole } from '../../../lib/middleware/role.js';
import { success, error } from '../../../lib/utils/responseHelper.js';
import { validateStudentData } from '../../../lib/utils/validators.js';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let whereClause = [];
      if (search) {
        whereClause.push(sql`(${students.full_name} LIKE ${`%${search}%`} OR ${students.id_number} LIKE ${`%${search}%`})`);
      }

      const list = await db.select({
        id: students.id,
        fullName: students.full_name,
        email: students.email,
        idNumber: students.id_number,
        phone: students.phone,
        certCount: sql`(SELECT COUNT(*) FROM certificates WHERE certificates.student_id = students.id)`
      })
      .from(students)
      .where(and(...whereClause))
      .limit(parseInt(limit))
      .offset(offset);

      const [total] = await db.select({ value: count() }).from(students).where(and(...whereClause));

      return success(res, { data: list, total: total.value });
    } catch (err) {
      return error(res, 'Failed to fetch students');
    }
  }

  if (req.method === 'POST') {
    if (!['it_admin', 'registrar'].includes(req.user.role)) return error(res, 'Forbidden', 403);

    try {
      const validation = validateStudentData(req.body);
      if (!validation.valid) return error(res, validation.errors.join(', '));

      const [newStudent] = await db.insert(students).values({
        full_name: req.body.full_name,
        email: req.body.email,
        id_number: req.body.id_number,
        phone: req.body.phone,
        date_of_birth: req.body.date_of_birth
      }).returning();

      return success(res, newStudent, 201);
    } catch (err) {
      if (err.message.includes('unique')) return error(res, 'Email or ID Number already exists');
      return error(res, 'Failed to create student');
    }
  }

  return error(res, 'Method not allowed', 405);
};

export default withAuth(handler);
