import { forbidden } from '../utils/responseHelper.js';

/**
 * Higher-order function to check user roles
 * Must be used after withAuth
 */
export const withRole = (allowedRoles, handler) => {
  return async (req, res) => {
    // req.user should be populated by withAuth
    if (!req.user || !req.user.role) {
      return forbidden(res);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return forbidden(res);
    }

    return handler(req, res);
  };
};

/**
 * Role Definitions (for reference)
 * - it_admin: all actions
 * - registrar: issue, revoke, view certs, manage students, view logs, view reports
 * - principal: dashboard, certs, reports (read-only)
 * - staff: logs only
 */
