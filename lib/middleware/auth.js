import { securityService } from '../services/security.service.js';
import { unauthorized } from '../utils/responseHelper.js';

/**
 * Extract Bearer token from request headers
 */
export const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
};

/**
 * Higher-order function to wrap Vercel serverless functions with JWT auth
 */
export const withAuth = (handler) => {
  return async (req, res) => {
    const token = getTokenFromRequest(req);
    
    if (!token) {
      return unauthorized(res);
    }

    const decoded = securityService.verifyJWT(token);
    if (!decoded) {
      return unauthorized(res);
    }

    // Attach user to request
    req.user = decoded;
    
    return handler(req, res);
  };
};
