import { db } from '../../../lib/db/index.js';
import { forgery_reports } from '../../../lib/db/schema.js';
import { desc, count, eq } from 'drizzle-orm';
import { withAuth } from '../../../lib/middleware/auth.js';
import { withRole } from '../../../lib/middleware/role.js';
import { success, error } from '../../../lib/utils/responseHelper.js';

const handler = async (req, res) => {
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

export default withAuth(withRole(['it_admin', 'registrar', 'principal'], handler));
