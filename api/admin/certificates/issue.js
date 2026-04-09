import { withAuth } from '../../../lib/middleware/auth.js';
import { withRole } from '../../../lib/middleware/role.js';
import { certificateService } from '../../../lib/services/certificate.service.js';
import { success, error } from '../../../lib/utils/responseHelper.js';

const handler = async (req, res) => {
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

export default withAuth(withRole(['it_admin', 'registrar'], handler));
