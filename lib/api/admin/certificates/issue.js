import { withAuth } from '../../../middleware/auth.js';
import { withRole } from '../../../middleware/role.js';
import { certificateService } from '../../../services/certificate.service.js';
import { success, error } from '../../../utils/responseHelper.js';

export async function \issue.js.BaseName(req, res) {
  if (req.method !== 'POST') return error(res, 'Method not allowed', 405);

  try {
    const { studentId, courseId, institutionId, graduationYear, issuedDate, expiryDate } = req.body;

    if (!studentId || !courseId || !institutionId || !graduationYear || !issuedDate) {
      return error(res, 'All required fields must be provided');
    }

    // Check for duplicates would happen in service or here (already in service logic plan)
    const result = await certificateService.issueSingle({
      studentId,
      courseId,
      institutionId,
      graduationYear,
      issuedDate,
      expiryDate
    });

    return success(res, result);
  } catch (err) {
    return error(res, err.message);
  }
};


