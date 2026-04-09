import { withRateLimit } from '../../lib/middleware/rateLimit.js';
import { certificateService } from '../../lib/services/certificate.service.js';
import { success, error } from '../../lib/utils/responseHelper.js';
import { sanitizeInput, validateSecurityNumber } from '../../lib/utils/validators.js';

export const verifyNumber = withRateLimit(10, 60000, async (req, res) => {
  if (req.method !== 'POST') return error(res, 'Method not allowed', 405);

  try {
    const { securityNumber } = req.body;
    const cleanNum = sanitizeInput(securityNumber);
    
    const validation = validateSecurityNumber(cleanNum);
    if (!validation.valid) return error(res, validation.error);

    const result = await certificateService.verifyCertificate(cleanNum, {
      verifierIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      method: 'number'
    });

    return success(res, result);
  } catch (err) {
    return error(res, 'Failed to verify security number');
  }
});
