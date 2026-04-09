import { certificateService } from '../../services/certificate.service.js';
import { success, error } from '../../utils/responseHelper.js';

export async function verifyQr(req, res) {
  if (req.method !== 'POST') return error(res, 'Method not allowed', 405);

  try {
    const { qrData } = req.body;
    if (!qrData) return error(res, 'QR data is required');

    // Parse security number from URL
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
}
