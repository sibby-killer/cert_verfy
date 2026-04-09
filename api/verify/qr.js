import { withRateLimit } from '../../lib/middleware/rateLimit.js';
import { certificateService } from '../../lib/services/certificate.service.js';
import { success, error } from '../../lib/utils/responseHelper.js';

const handler = async (req, res) => {
  if (req.method !== 'POST') return error(res, 'Method not allowed', 405);

  try {
    const { qrData } = req.body;
    if (!qrData) return error(res, 'QR data is required');

    // Parse security number from URL (e.g., https://.../verify?cert=BNP-XXXX)
    const url = new URL(qrData);
    const securityNumber = url.searchParams.get('cert');

    if (!securityNumber) return error(res, 'Invalid QR code content');

    const result = await certificateService.verifyCertificate(securityNumber, {
      verifierIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      method: 'qr'
    });

    return success(res, result);
  } catch (err) {
    return error(res, 'Failed to process QR verification');
  }
};

export default withRateLimit(10, 60000, handler);
