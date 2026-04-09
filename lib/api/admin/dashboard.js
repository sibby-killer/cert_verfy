import { withAuth } from '../../middleware/auth.js';
import { withRole } from '../../middleware/role.js';
import { logService } from '../../services/log.service.js';
import { success, error } from '../../utils/responseHelper.js';

export async function \dashboard.js.BaseName(req, res) {
  if (req.method !== 'GET') return error(res, 'Method not allowed', 405);

  try {
    const stats = await logService.getDashboardStats();
    const suspicious = await logService.flagSuspicious();
    
    const logs = await logService.getLogs({ page: 1, limit: 10 });

    return success(res, {
      stats,
      suspicious,
      recentLogs: logs.data
    });
  } catch (err) {
    return error(res, 'Failed to fetch dashboard data');
  }
};


