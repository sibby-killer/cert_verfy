import { db } from './index.js';
import { admin_users, courses, institutions } from './schema.js';
import { securityService } from '../services/security.service.js';
import 'dotenv/config';

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. Seed Institution
    console.log('Adding institution...');
    await db.insert(institutions).values({
      name: 'Bungoma National Polytechnic',
      code: 'BNP',
      website: 'https://bungomapoly.ac.ke',
      email: 'info@bungomapoly.ac.ke',
      contact_details: 'P.O. Box 1599 - 50200, Bungoma, Kenya'
    }).onConflictDoNothing();

    // 2. Seed IT Admin
    console.log('Creating master IT Admin...');
    const hashedPassword = await securityService.hashPassword('Admin@BNP2024');
    await db.insert(admin_users).values({
      username: 'admin',
      password: hashedPassword,
      email: 'it@bungomapoly.ac.ke',
      full_name: 'Master IT Administrator',
      role: 'it_admin',
      is_active: 1
    }).onConflictDoNothing();

    // 3. Seed Initial Courses
    console.log('Populating initial courses...');
    const initialCourses = [
      { name: 'Diploma in Electrical Engineering', code: 'EE-DIP', dept: 'Engineering', years: 3, level: 'Diploma' },
      { name: 'Certificate in ICT', code: 'ICT-CERT', dept: 'ICT', years: 2, level: 'Certificate' },
      { name: 'Diploma in Business Management', code: 'BUS-DIP', dept: 'Business', years: 3, level: 'Diploma' }
    ];

    for (const c of initialCourses) {
      await db.insert(courses).values({
        course_name: c.name,
        course_code: c.code,
        department: c.dept,
        duration_years: c.years,
        level: c.level
      }).onConflictDoNothing();
    }

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
