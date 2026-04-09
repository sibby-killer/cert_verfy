import { withAuth } from '../../../lib/middleware/auth.js';
import { withRole } from '../../../lib/middleware/role.js';
import { certificateService } from '../../../lib/services/certificate.service.js';
import { success, error } from '../../../lib/utils/responseHelper.js';

const handler = async (req, res) => {
  if (req.method !== 'GET') return error(res, 'Method not allowed', 405);

  try {
    const { page, limit, search, status, courseId } = req.query;

    const result = await certificateService.getAllCertificates({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search,
      status,
      courseId
    });

    return success(res, result);
  } catch (err) {
    return error(res, 'Failed to fetch certificates');
  }
};

export default withAuth(withRole(['it_admin', 'registrar', 'principal'], handler));
