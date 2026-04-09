/**
 * Authenticated Admin API Service
 */

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
    return { success: false, error: 'Session expired' };
  }
  return await response.json();
};

export const adminApi = {
  // Auth
  login: async (username, password) => {
    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return await res.json();
  },

  // Dashboard
  getDashboard: async () => {
    const res = await fetch('/api/admin/dashboard', { headers: getHeaders() });
    return await handleResponse(res);
  },

  // Certificates
  getCertificates: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/admin/certificates?${params}`, { headers: getHeaders() });
    return await handleResponse(res);
  },

  getCertificateById: async (id) => {
    const res = await fetch(`/api/admin/certificates/${id}`, { headers: getHeaders() });
    return await handleResponse(res);
  },

  issueSingle: async (data) => {
    const res = await fetch('/api/admin/certificates/issue', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  },

  issueBulk: async (formData) => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/admin/certificates/bulk', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    return await handleResponse(res);
  },

  revokeCertificate: async (id, securityNumber, reason) => {
    const res = await fetch(`/api/admin/certificates/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ action: 'revoke', securityNumber, reason })
    });
    return await handleResponse(res);
  },

  // Students
  getStudents: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/admin/students?${params}`, { headers: getHeaders() });
    return await handleResponse(res);
  },

  createStudent: async (data) => {
    const res = await fetch('/api/admin/students', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  },

  updateStudent: async (id, data) => {
    const res = await fetch(`/api/admin/students/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  },

  // Courses
  getCourses: async () => {
    const res = await fetch('/api/admin/courses', { headers: getHeaders() });
    return await handleResponse(res);
  },

  createCourse: async (data) => {
    const res = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  },

  updateCourse: async (id, data) => {
    const res = await fetch(`/api/admin/courses/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  },

  // Logs & Reports
  getLogs: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/admin/logs?${params}`, { headers: getHeaders() });
    return await handleResponse(res);
  },

  getReports: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/admin/reports?${params}`, { headers: getHeaders() });
    return await handleResponse(res);
  },

  updateReport: async (id, data) => {
    const res = await fetch(`/api/admin/reports/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  },

  // Users
  getUsers: async () => {
    const res = await fetch('/api/admin/users', { headers: getHeaders() });
    return await handleResponse(res);
  },

  createUser: async (data) => {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  },

  updateUser: async (id, data) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  }
};
