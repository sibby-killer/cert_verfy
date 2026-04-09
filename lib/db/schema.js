import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * DATABASE SCHEMA for Bungoma National Polytechnic Verification System
 * Dialect: SQLite (Turso)
 * All PKs use crypto.randomUUID()
 * All timestamps are Unix (integer)
 * Booleans are 0 or 1
 */

// TABLE 1 — institutions
export const institutions = sqliteTable('institutions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  logo_url: text('logo_url'),
  website: text('website'),
  contact_email: text('contact_email'),
  contact_phone: text('contact_phone'),
  stamp_image_url: text('stamp_image_url'),
  created_at: integer('created_at').default(sql`(strftime('%s', 'now'))`),
  updated_at: integer('updated_at').default(sql`(strftime('%s', 'now'))`),
});

// TABLE 2 — students
export const students = sqliteTable('students', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  full_name: text('full_name').notNull(),
  email: text('email').unique(),
  id_number: text('id_number').unique().notNull(), // national ID
  date_of_birth: text('date_of_birth'),
  phone: text('phone'),
  created_at: integer('created_at').default(sql`(strftime('%s', 'now'))`),
  updated_at: integer('updated_at').default(sql`(strftime('%s', 'now'))`),
}, (table) => ({
  idNumberIdx: uniqueIndex('id_number_idx').on(table.id_number),
  emailIdx: uniqueIndex('email_idx').on(table.email),
}));

// TABLE 3 — courses
export const courses = sqliteTable('courses', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  course_name: text('course_name').notNull(),
  course_code: text('course_code').unique().notNull(),
  department: text('department'),
  duration_years: integer('duration_years'),
  level: text('level'), // 'Certificate' | 'Diploma' | 'Degree'
  created_at: integer('created_at').default(sql`(strftime('%s', 'now'))`),
});

// TABLE 4 — certificates
export const certificates = sqliteTable('certificates', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  student_id: text('student_id').notNull().references(() => students.id),
  course_id: text('course_id').notNull().references(() => courses.id),
  institution_id: text('institution_id').notNull().references(() => institutions.id),
  security_number: text('security_number').unique().notNull(),
  qr_code_url: text('qr_code_url'),
  issued_date: text('issued_date'),
  expiry_date: text('expiry_date'), // NULL = no expiry
  graduation_year: text('graduation_year'),
  status: text('status').notNull(), // 'valid' | 'revoked' | 'suspended'
  revoked_at: integer('revoked_at'), // NULL if not revoked
  revoke_reason: text('revoke_reason'),
  email_sent: integer('email_sent').default(0), // 0 or 1
  created_at: integer('created_at').default(sql`(strftime('%s', 'now'))`),
  updated_at: integer('updated_at').default(sql`(strftime('%s', 'now'))`),
}, (table) => ({
  secNumIdx: uniqueIndex('security_number_idx').on(table.security_number),
  statusIdx: index('status_idx').on(table.status),
  studentIdIdx: index('student_id_idx').on(table.student_id),
}));

// TABLE 5 — verification_logs
export const verification_logs = sqliteTable('verification_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  cert_id: text('cert_id').references(() => certificates.id),
  verified_at: integer('verified_at').default(sql`(strftime('%s', 'now'))`),
  verifier_ip: text('verifier_ip'),
  verifier_name: text('verifier_name'), // optional
  purpose: text('purpose'), // 'Employment' | 'Admission' | 'Other'
  result: text('result'), // 'valid' | 'invalid' | 'revoked'
  method: text('method'), // 'qr' | 'number' | 'file'
}, (table) => ({
  certIdIdx: index('cert_id_idx').on(table.cert_id),
  verifiedAtIdx: index('verified_at_idx').on(table.verified_at),
}));

// TABLE 6 — forgery_reports
export const forgery_reports = sqliteTable('forgery_reports', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  certificate_number: text('certificate_number'),
  reporter_name: text('reporter_name'), // optional
  reporter_contact: text('reporter_contact'), // optional
  description: text('description').notNull(),
  evidence_url: text('evidence_url'), // optional
  status: text('status'), // 'pending' | 'reviewing' | 'resolved'
  admin_notes: text('admin_notes'),
  submitted_at: integer('submitted_at').default(sql`(strftime('%s', 'now'))`),
  updated_at: integer('updated_at').default(sql`(strftime('%s', 'now'))`),
});

// TABLE 7 — admin_users
export const admin_users = sqliteTable('admin_users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text('username').unique().notNull(),
  password: text('password').notNull(), // bcrypt hashed
  email: text('email').unique().notNull(),
  full_name: text('full_name'),
  role: text('role').notNull(), // 'it_admin' | 'registrar' | 'principal' | 'staff'
  is_active: integer('is_active').default(1), // 0 or 1
  last_login: integer('last_login'),
  created_at: integer('created_at').default(sql`(strftime('%s', 'now'))`),
  updated_at: integer('updated_at').default(sql`(strftime('%s', 'now'))`),
}, (table) => ({
  usernameIdx: uniqueIndex('username_idx').on(table.username),
}));
