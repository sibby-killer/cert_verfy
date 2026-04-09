import { withAuth } from '../../../lib/middleware/auth.js';
import { withRole } from '../../../lib/middleware/role.js';
import { certificateService } from '../../../lib/services/certificate.service.js';
import { success, error, notFound, forbidden } from '../../../lib/utils/responseHelper.js';

const handler = async (req, res) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Roles for GET: it_admin, registrar, principal
    if (!['it_admin', 'registrar', 'principal'].includes(req.user.role)) {
      return forbidden(res);
    }
    
    try {
      const details = await certificateService.getCertificateDetails(id);
      if (!details) return notFound(res, 'Certificate');
      return success(res, details);
    } catch (err) {
      return error(res, 'Failed to fetch certificate details');
    }
  }

  if (req.method === 'PUT') {
    // Roles for PUT: it_admin, registrar
    if (!['it_admin', 'registrar'].includes(req.user.role)) {
      return forbidden(res);
    }

    try {
      const { action, reason, securityNumber } = req.body;
      if (action === 'revoke') {
        const result = await certificateService.revokeCertificate(securityNumber, reason);
        return success(res, result);
      }
      return error(res, 'Invalid action');
    } catch (err) {
      return error(res, err.message);
    }
  }

  return error(res, 'Method not allowed', 405);
};

export default withAuth(handler);
