import { db } from '../db/index.js';
import { verification_logs, certificates, students, courses, forgery_reports } from '../db/schema.js';
import { eq, desc, and, gte, count, sql } from 'drizzle-orm';

export const logService = {
  async logVerification(data) {
    const { certId, verifierIp, verifierName, purpose, result, method } = data;
    
    await db.insert(verification_logs).values({
      cert_id: certId || null,
      verifier_ip: verifierIp,
      verifier_name: verifierName,
      purpose,
      result,
      method,
      verified_at: Math.floor(Date.now() / 1000)
    });

    return { success: true };
  },

  async getLogs(filters = {}) {
    const { page = 1, limit = 20, dateFrom, dateTo, result, method } = filters;
    const offset = (page - 1) * limit;

    let conditions = [];
    if (dateFrom) conditions.push(gte(verification_logs.verified_at, dateFrom));
    if (dateTo) conditions.push(sql`${verification_logs.verified_at} <= ${dateTo}`);
    if (result) conditions.push(eq(verification_logs.result, result));
    if (method) conditions.push(eq(verification_logs.method, method));

    const query = db.select({
      id: verification_logs.id,
      verifiedAt: verification_logs.verified_at,
      verifierIp: verification_logs.verifier_ip,
      verifierName: verification_logs.verifier_name,
      result: verification_logs.result,
      method: verification_logs.method,
      securityNumber: certificates.security_number,
      studentName: students.full_name
    })
    .from(verification_logs)
    .leftJoin(certificates, eq(verification_logs.cert_id, certificates.id))
    .leftJoin(students, eq(certificates.student_id, students.id))
    .where(and(...conditions))
    .orderBy(desc(verification_logs.verified_at))
    .limit(limit)
    .offset(offset);

    const totalResults = await db.select({ value: count() }).from(verification_logs).where(and(...conditions));

    return {
      data: await query,
      total: totalResults[0]?.value || 0,
      page,
      limit
    };
  },

  async flagSuspicious() {
    const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60);
    
    // Count verifications per certificate in the last 24 hours
    const suspicious = await db.select({
      certId: verification_logs.cert_id,
      securityNumber: certificates.security_number,
      studentName: students.full_name,
      count: count()
    })
    .from(verification_logs)
    .innerJoin(certificates, eq(verification_logs.cert_id, certificates.id))
    .innerJoin(students, eq(certificates.student_id, students.id))
    .where(gte(verification_logs.verified_at, twentyFourHoursAgo))
    .groupBy(verification_logs.cert_id, certificates.security_number, students.full_name)
    .having(sql`count(*) > 20`);

    return suspicious;
  },

  async getDashboardStats() {
    const [certCount] = await db.select({ value: count() }).from(certificates);
    const [studentCount] = await db.select({ value: count() }).from(students);
    const [pendingReports] = await db.select({ value: count() }).from(forgery_reports).where(eq(forgery_reports.status, 'pending'));
    
    const todayStart = Math.floor(new Date().setHours(0,0,0,0) / 1000);
    const [verificationsToday] = await db.select({ value: count() }).from(verification_logs).where(gte(verification_logs.verified_at, todayStart));

    return {
      totalCertificates: certCount?.value || 0,
      totalStudents: studentCount?.value || 0,
      verificationsToday: verificationsToday?.value || 0,
      pendingReports: pendingReports?.value || 0
    };
  }
};
