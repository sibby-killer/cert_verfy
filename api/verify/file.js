import formidable from 'formidable';
import fs from 'fs';
import { withRateLimit } from '../../lib/middleware/rateLimit.js';
import { certificateService } from '../../lib/services/certificate.service.js';
import { success, error } from '../../lib/utils/responseHelper.js';

export const config = {
  api: {
    bodyParser: false, // Disabling bodyParser for formidable
  },
};

export const verifyFile = withRateLimit(10, 60000, async (req, res) => {
  if (req.method !== 'POST') return error(res, 'Method not allowed', 405);

  const form = formidable({});
  
  try {
    const [fields, files] = await form.parse(req);
    const file = files.certificate?.[0];

    if (!file) return error(res, 'No file uploaded');

    const content = fs.readFileSync(file.filepath, 'utf8');
    const json = JSON.parse(content);
    
    const securityNumber = json.securityNumber;
    if (!securityNumber) return error(res, 'Invalid certificate file content');

    const result = await certificateService.verifyCertificate(securityNumber, {
      verifierIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      method: 'file'
    });

    return success(res, result);
  } catch (err) {
    return error(res, 'Failed to process certificate file');
  }
};

export default withRateLimit(10, 60000, handler);
