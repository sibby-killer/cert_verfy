import formidable from 'formidable';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { withAuth } from '../../../middleware/auth.js';
import { withRole } from '../../../middleware/role.js';
import { certificateService } from '../../../services/certificate.service.js';
import { success, error } from '../../../utils/responseHelper.js';
import { validateCSVRow } from '../../../utils/validators.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function \bulk.js.BaseName(req, res) {
  if (req.method !== 'POST') return error(res, 'Method not allowed', 405);

  const form = formidable({});
  
  try {
    const [fields, files] = await form.parse(req);
    const file = files.csv?.[0];
    const institutionId = fields.institutionId?.[0];

    if (!file) return error(res, 'No CSV file uploaded');
    if (!institutionId) return error(res, 'Institution ID is required');

    const content = fs.readFileSync(file.filepath, 'utf8');
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
    });

    // Preview/Validation
    const validatedRecords = [];
    const failedRows = [];

    records.forEach((row, index) => {
      const validation = validateCSVRow(row);
      if (validation.valid) {
        validatedRecords.push(row);
      } else {
        failedRows.push({ row, index, errors: validation.errors });
      }
    });

    if (failedRows.length > 0 && !fields.force?.[0]) {
      return error(res, 'CSV contains validation errors', 400); // Should return failedRows in real impl
    }

    const result = await certificateService.issueBatch(validatedRecords, { institutionId });

    return success(res, result);
  } catch (err) {
    return error(res, 'Failed to process bulk issuance');
  }
};


