import { withAuth } from '../../../lib/middleware/auth.js';
import { withRole } from '../../../lib/middleware/role.js';
import { logService } from '../../../lib/services/log.service.js';
import { success, error } from '../../../lib/utils/responseHelper.js';

const handler = async (req, res) => {
  if (req.method !== 'GET') return error(res, 'Method not allowed', 405);

  try {
    const { page, limit, dateFrom, dateTo, result, method } = req.query;

    const logs = await logService.getLogs({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      dateFrom: dateFrom ? parseInt(dateFrom) : null,
      dateTo: dateTo ? parseInt(dateTo) : null,
      result,
      method
    });

    const suspicious = await logService.flagSuspicious();

    return success(res, {
      logs: logs.data,
      total: logs.total,
      suspicious
    });
  } catch (err) {
    return error(res, 'Failed to fetch logs');
  }
};

export default withAuth(withRole(['it_admin', 'registrar', 'principal', 'staff'], handler));
