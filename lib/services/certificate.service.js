import { db } from '../db/index.js';
import { certificates, students, courses, institutions } from '../db/schema.js';
import { eq, and, desc, sql, count } from 'drizzle-orm';
import { securityService } from './security.service.js';
import { qrcodeService } from './qrcode.service.js';
import { emailService } from './email.service.js';
import { logService } from './log.service.js';

export const certificateService = {
  async issueSingle(data) {
    const { studentId, courseId, institutionId, graduationYear, issuedDate, expiryDate } = data;

    // 1. Get course code for security number
    const [course] = await db.select().from(courses).where(eq(courses.id, courseId));
    if (!course) throw new Error('Course not found');

    const [student] = await db.select().from(students).where(eq(students.id, studentId));
    if (!student) throw new Error('Student not found');

    // 2. Generate security number
    const securityNumber = await securityService.generateSecurityNumber(graduationYear, course.course_code.substring(0, 3).toUpperCase());

    // 3. Generate QR code
    const { dataUrl, base64 } = await qrcodeService.generateQR(securityNumber);

    // 4. Save to DB
    const [certificate] = await db.insert(certificates).values({
      student_id: studentId,
      course_id: courseId,
      institution_id: institutionId,
      security_number: securityNumber,
      qr_code_url: dataUrl,
      issued_date: issuedDate,
      expiry_date: expiryDate || null,
      graduation_year: graduationYear,
      status: 'valid',
      created_at: Math.floor(Date.now() / 1000)
    }).returning();

    // 5. Send Email
    const verifyUrl = `${process.env.CLIENT_URL}/result?cert=${securityNumber}`;
    try {
      await emailService.sendCertificateEmail(student.email, {
        studentName: student.full_name,
        courseName: course.course_name,
        level: course.level,
        graduationYear: graduationYear,
        securityNumber: securityNumber,
        qrCodeBase64: base64,
        verifyUrl
      });
      
      await db.update(certificates).set({ email_sent: 1 }).where(eq(certificates.id, certificate.id));
    } catch (emailErr) {
      console.error('Email failed to send:', emailErr);
    }

    return { certificate, securityNumber, qrCodeUrl: dataUrl };
  },

  async issueBatch(csvData, meta) {
    const { institutionId } = meta;
    let issued = [];
    let failed = [];

    for (const row of csvData) {
      try {
        // Simple mock of finding student and course from names/codes
        // In real impl, you'd lookup by email/id_number and course_code
        const [student] = await db.select().from(students).where(eq(students.email, row.email));
        const [course] = await db.select().from(courses).where(eq(courses.course_code, row.course_code));

        if (!student || !course) {
          failed.push({ row, reason: student ? 'Course code invalid' : 'Student email not found' });
          continue;
        }

        const res = await this.issueSingle({
          studentId: student.id,
          courseId: course.id,
          institutionId,
          graduationYear: row.graduation_year,
          issuedDate: new Date().toISOString().split('T')[0],
        });
        issued.push(res.certificate);
      } catch (err) {
        failed.push({ row, reason: err.message });
      }
    }

    return {
      totalIssued: issued.length,
      totalFailed: failed.length,
      issued,
      failed
    };
  },

  async verifyCertificate(securityNumber, logData) {
    const { verifierIp, verifierName, purpose, method } = logData;

    // 1. Query for certificate
    const result = await db.select({
      cert: certificates,
      studentName: students.full_name,
      courseName: courses.course_name,
      level: courses.level,
      dept: courses.department
    })
    .from(certificates)
    .innerJoin(students, eq(certificates.student_id, students.id))
    .innerJoin(courses, eq(certificates.course_id, courses.id))
    .where(eq(certificates.security_number, securityNumber))
    .limit(1);

    if (result.length === 0) {
      await logService.logVerification({ verifierIp, verifierName, purpose, method, result: 'invalid' });
      return { status: 'invalid' };
    }

    const data = result[0];
    const cert = data.cert;

    // 2. Handle Revoked
    if (cert.status === 'revoked') {
      await logService.logVerification({ certId: cert.id, verifierIp, verifierName, purpose, method, result: 'revoked' });
      return {
        status: 'revoked',
        revokedAt: cert.revoked_at,
        reason: cert.revoke_reason
      };
    }

    // 3. Handle Valid
    await logService.logVerification({ certId: cert.id, verifierIp, verifierName, purpose, method, result: 'valid' });
    return {
      status: 'valid',
      studentName: data.studentName,
      course: data.courseName,
      level: data.level,
      graduationYear: cert.graduation_year,
      certNumber: securityNumber,
      issuedDate: cert.issued_date,
      issuedBy: 'Bungoma National Polytechnic'
    };
  },

  async revokeCertificate(securityNumber, reason) {
    const [cert] = await db.select().from(certificates).where(eq(certificates.security_number, securityNumber));
    if (!cert) throw new Error('Certificate not found');

    const revokedAt = Math.floor(Date.now() / 1000);
    await db.update(certificates)
      .set({
        status: 'revoked',
        revoked_at: revokedAt,
        revoke_reason: reason,
        updated_at: revokedAt
      })
      .where(eq(certificates.id, cert.id));

    return { success: true, revokedAt };
  },

  async getCertificateDetails(id) {
    const result = await db.select({
      cert: certificates,
      student: students,
      course: courses,
      institution: institutions
    })
    .from(certificates)
    .innerJoin(students, eq(certificates.student_id, students.id))
    .innerJoin(courses, eq(certificates.course_id, courses.id))
    .innerJoin(institutions, eq(certificates.institution_id, institutions.id))
    .where(eq(certificates.id, id))
    .limit(1);

    return result[0] || null;
  },

  async getAllCertificates(filters = {}) {
    const { page = 1, limit = 10, search, status, courseId } = filters;
    const offset = (page - 1) * limit;

    let conditions = [];
    if (status) conditions.push(eq(certificates.status, status));
    if (courseId) conditions.push(eq(certificates.course_id, courseId));
    if (search) {
      conditions.push(sql`(${students.full_name} LIKE ${`%${search}%`} OR ${certificates.security_number} LIKE ${`%${search}%`})`);
    }

    const query = db.select({
      id: certificates.id,
      studentName: students.full_name,
      courseName: courses.course_name,
      graduationYear: certificates.graduation_year,
      securityNumber: certificates.security_number,
      status: certificates.status,
      issuedDate: certificates.issued_date
    })
    .from(certificates)
    .innerJoin(students, eq(certificates.student_id, students.id))
    .innerJoin(courses, eq(certificates.course_id, courses.id))
    .where(and(...conditions))
    .orderBy(desc(certificates.created_at))
    .limit(limit)
    .offset(offset);

    const totalResults = await db.select({ value: count() }).from(certificates)
      .innerJoin(students, eq(certificates.student_id, students.id))
      .where(and(...conditions));

    return {
      data: await query,
      total: totalResults[0]?.value || 0,
      page,
      limit
    };
  }
};
