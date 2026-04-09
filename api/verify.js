import { verifyQr } from '../lib/api/verify/qr.js';
import { verifyNumber } from '../lib/api/verify/number.js';
import { verifyFile } from '../lib/api/verify/file.js';
import { submitReport } from '../lib/api/public/report.js';
import { error } from '../lib/utils/responseHelper.js';

export default async function handler(req, res) {
  const { path } = req.query;
  const cleanPath = Array.isArray(path) ? path[0] : path;

  try {
    if (req.method === 'POST') {
      if (cleanPath === 'qr') return await verifyQr(req, res);
      if (cleanPath === 'number') return await verifyNumber(req, res);
      if (cleanPath === 'file') return await verifyFile(req, res);
      if (cleanPath === 'report') return await submitReport(req, res);
    }
    
    return error(res, 'Endpoint not found: ' + cleanPath, 404);
  } catch (err) {
    console.error('Public API Error:', err);
    return error(res, 'Internal server error', 500);
  }
}
