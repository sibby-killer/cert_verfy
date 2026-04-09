/**
 * Input Validation Functions
 */

export const validateSecurityNumber = (secNum) => {
  // BNP-[YEAR]-[DEPT]-[SEQ]-[SALT]
  // Example: BNP-2024-EE-00456-X7K
  const regex = /^BNP-\d{4}-[A-Z]{2,3}-\d{5}-[A-Z0-9]{3}$/;
  if (!secNum) return { valid: false, error: 'Security number is required' };
  if (!regex.test(secNum)) return { valid: false, error: 'Invalid security number format' };
  return { valid: true };
};

export const validateStudentData = (data) => {
  const errors = [];
  if (!data.full_name) errors.push('Full name is required');
  if (!data.email || !data.email.includes('@')) errors.push('Valid email is required');
  if (!data.id_number) errors.push('National ID number is required');
  return { valid: errors.length === 0, errors };
};

export const validateCSVRow = (row) => {
  const errors = [];
  const required = ['full_name', 'email', 'id_number', 'course_code', 'graduation_year'];
  required.forEach(field => {
    if (!row[field]) errors.push(`Missing column: ${field}`);
  });
  return { valid: errors.length === 0, errors };
};

export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>'"%;()&+]/g, '');
};

export default {
  validateSecurityNumber,
  validateStudentData,
  validateCSVRow,
  sanitizeInput
};
