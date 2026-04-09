import { tooManyRequests } from '../utils/responseHelper.js';

/**
 * IP-based Rate Limiter Middleware
 * Note: Simple in-memory implementation for Vercel Serverless.
 * For persistent multi-instance limiting, use an external store like Redis.
 */

const cache = new Map();

export const withRateLimit = (limit, windowMs, handler) => {
  return async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();
    
    if (!cache.has(ip)) {
      cache.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      const entry = cache.get(ip);
      
      if (now > entry.resetTime) {
        // Window expired, reset
        entry.count = 1;
        entry.resetTime = now + windowMs;
      } else {
        entry.count++;
      }

      if (entry.count > limit) {
        return tooManyRequests(res);
      }
    }

    // Cleanup cache periodically (simple 10% chance)
    if (Math.random() < 0.1) {
      for (const [key, value] of cache.entries()) {
        if (now > value.resetTime) cache.delete(key);
      }
    }

    return handler(req, res);
  };
};
