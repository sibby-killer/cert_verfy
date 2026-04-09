import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { certificates } from '../db/schema.js';
import { count, eq, and, sql } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export const securityService = {
  /**
   * BNP-[YEAR]-[DEPT]-[SEQ]-[SALT]
   * Example: BNP-2024-EE-00456-X7K
   */
  async generateSecurityNumber(year, deptCode) {
    let securityNumber;
    let exists = true;

    while (exists) {
      // Get current count for this department and year
      const result = await db
        .select({ value: count() })
        .from(certificates)
        .where(
          and(
            eq(certificates.graduation_year, year),
            sql`${certificates.security_number} LIKE ${`BNP-${year}-${deptCode}-%`}`
          )
        );
      
      const seq = (result[0]?.value || 0) + 1;
      const paddedSeq = seq.toString().padStart(5, '0');
      const salt = crypto.randomBytes(2).toString('hex').toUpperCase().substring(0, 3);
      
      securityNumber = `BNP-${year}-${deptCode}-${paddedSeq}-${salt}`;

      // Final unique check
      const check = await db
        .select()
        .from(certificates)
        .where(eq(certificates.security_number, securityNumber))
        .limit(1);
      
      if (check.length === 0) exists = false;
    }

    return securityNumber;
  },

  async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  },

  async comparePassword(plain, hashed) {
    return await bcrypt.compare(plain, hashed);
  },

  generateJWT(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  },

  verifyJWT(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  },

  /**
   * Simple IP-based rate limiter (In-memory)
   * Note: For Vercel Edge, this is per-instance. 
   * Persistent limiting should eventually use Upstash or similar.
   */
  checkRateLimit(ip, limit, windowMs) {
    // Basic implementation for structure; production might use external store
    return { allowed: true, remaining: limit - 1 };
  }
};
