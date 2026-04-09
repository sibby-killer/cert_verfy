import { certificateService } from '../../../services/certificate.service.js';
import { success, error } from '../../../utils/responseHelper.js';

export async function listCertificates(req, res) {
  try {
    const { page, limit, search, status, courseId } = req.query;
    const result = await certificateService.getAllCertificates({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search,
      status,
      courseId
    });
    return success(res, result);
  } catch (err) {
    return error(res, 'Failed to fetch certificates');
  }
}

export async function getCertificate(req, res) {
  try {
    const { id } = req.query;
    const cert = await certificateService.getCertificateBySecurityNumber(id);
    if (!cert) return error(res, 'Certificate not found', 404);
    return success(res, cert);
  } catch (err) {
    return error(res, 'Failed to fetch certificate');
  }
}

export async function updateCertificate(req, res) {
  try {
    const { id } = req.query;
    const data = req.body;
    await certificateService.updateCertificate(id, data);
    return success(res, { message: 'Certificate updated' });
  } catch (err) {
    return error(res, 'Failed to update certificate');
  }
}
