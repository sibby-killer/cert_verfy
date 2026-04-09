import { db } from '../../../db/index.js';
import { forgery_reports } from '../../../db/schema.js';
import { desc, count, eq } from 'drizzle-orm';
import { withAuth } from '../../../middleware/auth.js';
import { withRole } from '../../../middleware/role.js';
import { success, error } from '../../../utils/responseHelper.js';

export async function \index.js.BaseName(req, res) {
  if (req.method !== 'GET') return error(res, 'Method not allowed', 405);

  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = db.select().from(forgery_reports);
    if (status) query = query.where(eq(forgery_reports.status, status));
    
    const list = await query.orderBy(desc(forgery_reports.submitted_at)).limit(parseInt(limit)).offset(offset);
    const [total] = await db.select({ value: count() }).from(forgery_reports);

    return success(res, { data: list, total: total.value });
  } catch (err) {
    return error(res, 'Failed to fetch forgery reports');
  }
};

export async function updateReport(req, res) {
  try {
    const { id } = req.query;
    const { status, remarks } = req.body;
    await db.update(forgery_reports).set({ status, remarks }).where(eq(forgery_reports.id, parseInt(id)));
    return success(res, { message: 'Report updated' });
  } catch (err) {
    return error(res, 'Failed to update report');
  }
}


