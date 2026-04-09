import { login } from '../lib/api/admin/auth/login.js';
import { logout } from '../lib/api/admin/auth/logout.js';
import { getDashboard } from '../lib/api/admin/dashboard.js';
import { listCertificates, getCertificate, updateCertificate } from '../lib/api/admin/certificates/index.js';
import { issueCertificate } from '../lib/api/admin/certificates/issue.js';
import { bulkIssue } from '../lib/api/admin/certificates/bulk.js';
import { listStudents, getStudent, updateStudent } from '../lib/api/admin/students/index.js';
import { listCourses, createCourse, updateCourse } from '../lib/api/admin/courses/index.js';
import { listLogs } from '../lib/api/admin/logs/index.js';
import { listReports, updateReport } from '../lib/api/admin/reports/index.js';
import { listUsers, createUser, updateUser } from '../lib/api/admin/users/index.js';
import { error } from '../lib/utils/responseHelper.js';
import { authMiddleware } from '../lib/middleware/auth.js';

export default async function handler(req, res) {
  const { path } = req.query;
  const segments = Array.isArray(path) ? path : path.split('/');
  
  const resource = segments[0];
  const subResource = segments[1];
  const id = segments[segments.length - 1]; // Fallback for simple ID at end

  // Route identifier
  const route = segments.slice(0, 2).join('/'); // e.g., 'auth/login' or 'certificates/bulk' or just 'certificates'

  // Public Admin Routes
  if (route === 'auth/login') return await login(req, res);

  // Protected Admin Routes
  return await authMiddleware(req, res, async () => {
    // 1. Exact route matches
    if (route === 'auth/logout') return await logout(req, res);
    if (resource === 'dashboard') return await getDashboard(req, res);
    if (route === 'certificates/bulk') return await bulkIssue(req, res);
    if (route === 'certificates/issue') return await issueCertificate(req, res);

    // 2. Resource-based routing with ID support
    switch (resource) {
      case 'certificates':
        if (req.method === 'GET') {
          // If 2nd segment exists and it's not 'issue' or 'bulk', it's an ID
          if (subResource && !['issue', 'bulk'].includes(subResource)) {
            req.query.id = subResource;
            return await getCertificate(req, res);
          }
          return await listCertificates(req, res);
        }
        if (req.method === 'PUT' && subResource) {
          req.query.id = subResource;
          return await updateCertificate(req, res);
        }
        if (req.method === 'POST') return await issueCertificate(req, res);
        break;

      case 'students':
        if (req.method === 'GET') {
          if (subResource) {
            req.query.id = subResource;
            return await getStudent(req, res);
          }
          return await listStudents(req, res);
        }
        if (req.method === 'PUT' && subResource) {
          req.query.id = subResource;
          return await updateStudent(req, res);
        }
        break;

      case 'courses':
        if (req.method === 'GET') return await listCourses(req, res);
        if (req.method === 'POST') return await createCourse(req, res);
        if (req.method === 'PUT' && subResource) {
          req.query.id = subResource;
          return await updateCourse(req, res);
        }
        break;

      case 'logs':
        if (req.method === 'GET') return await listLogs(req, res);
        break;

      case 'reports':
        if (req.method === 'GET') return await listReports(req, res);
        if (req.method === 'PUT' && subResource) {
          req.query.id = subResource;
          return await updateReport(req, res);
        }
        break;

      case 'users':
        if (req.method === 'GET') return await listUsers(req, res);
        if (req.method === 'POST') return await createUser(req, res);
        if (req.method === 'PUT' && subResource) {
          req.query.id = subResource;
          return await updateUser(req, res);
        }
        break;

      default:
        return error(res, 'Admin endpoint not found: ' + resource, 404);
    }
    
    return error(res, 'Method not allowed', 405);
  });
}
