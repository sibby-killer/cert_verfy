import { verifyQr } from './verify/qr.js';
import { verifyNumber } from './verify/number.js';
import { verifyFile } from './verify/file.js';
import { submitReport } from './report.js';
import { sendError } from '../lib/utils/responseHelper.js';

export default async function handler(req, res) {
  const { path } = req.query;

  try {
    if (req.method === 'POST') {
      if (path === 'qr') return await verifyQr(req, res);
      if (path === 'number') return await verifyNumber(req, res);
      if (path === 'file') return await verifyFile(req, res);
      if (path === 'report') return await submitReport(req, res);
    }
    
    return sendError(res, 'Endpoint not found', 404);
  } catch (error) {
    console.error('Public API Error:', error);
    return sendError(res, 'Internal server error', 500);
  }
}
