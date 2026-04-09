import { db } from '../../db/index.js';
import { forgery_reports } from '../../db/schema.js';
import { sanitizeInput } from '../../utils/validators.js';
import { success, error } from '../../utils/responseHelper.js';

export async function submitReport(req, res) {
  if (req.method !== 'POST') return error(res, 'Method not allowed', 405);

  try {
    const { certificateNumber, reporterName, reporterContact, description } = req.body;

    if (!description) return error(res, 'Description is required');

    const cleanCertNum = sanitizeInput(certificateNumber);
    const cleanName = sanitizeInput(reporterName);
    const cleanContact = sanitizeInput(reporterContact);
    const cleanDesc = sanitizeInput(description);

    const [report] = await db.insert(forgery_reports).values({
      certificate_number: cleanCertNum,
      reporter_name: cleanName,
      reporter_contact: cleanContact,
      description: cleanDesc,
      status: 'pending',
      submitted_at: Math.floor(Date.now() / 1000)
    }).returning();

    return success(res, { reportId: report.id });
  } catch (err) {
    return error(res, 'Failed to submit forgery report');
  }
}
