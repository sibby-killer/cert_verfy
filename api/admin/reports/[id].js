import { db } from '../../../lib/db/index.js';
import { forgery_reports } from '../../../lib/db/schema.js';
import { eq } from 'drizzle-orm';
import { withAuth } from '../../../lib/middleware/auth.js';
import { withRole } from '../../../lib/middleware/role.js';
import { success, error, notFound } from '../../../lib/utils/responseHelper.js';

const handler = async (req, res) => {
  if (req.method !== 'PUT') return error(res, 'Method not allowed', 405);

  const { id } = req.query;
  const { status, adminNotes } = req.body;

  try {
    const [updated] = await db.update(forgery_reports)
      .set({
        status,
        admin_notes: adminNotes,
        updated_at: Math.floor(Date.now() / 1000)
      })
      .where(eq(forgery_reports.id, id))
      .returning();

    if (!updated) return notFound(res, 'Report');
    return success(res, updated);
  } catch (err) {
    return error(res, 'Failed to update report');
  }
};

export default withAuth(withRole(['it_admin', 'registrar'], handler));
