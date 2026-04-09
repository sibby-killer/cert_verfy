/**
 * Public Verification API Service
 */

export const verifyByQR = async (qrData) => {
  try {
    const response = await fetch('/api/verify/qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrData }),
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Network error or service unavailable' };
  }
};

export const verifyByNumber = async (securityNumber) => {
  try {
    const response = await fetch('/api/verify/number', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ securityNumber }),
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Network error or service unavailable' };
  }
};

export const verifyByFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('certificate', file);
    
    const response = await fetch('/api/verify/file', {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Network error or service unavailable' };
  }
};

export const submitReport = async (reportData) => {
  try {
    const response = await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Network error or service unavailable' };
  }
};
