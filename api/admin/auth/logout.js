import { success, error } from '../../../lib/utils/responseHelper.js';

const handler = async (req, res) => {
  if (req.method !== 'POST') return error(res, 'Method not allowed', 405);
  
  // Client-side will handle token deletion, but we provide the endpoint for completeness
  return success(res, { message: 'Logged out successfully' });
};

export default handler;
