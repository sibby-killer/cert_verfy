import { success, error } from '../../../utils/responseHelper.js';

export async function \logout.js.BaseName(req, res) {
  if (req.method !== 'POST') return error(res, 'Method not allowed', 405);
  
  // Client-side will handle token deletion, but we provide the endpoint for completeness
  return success(res, { message: 'Logged out successfully' });
};


