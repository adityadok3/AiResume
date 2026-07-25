const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage = data?.detail || data || 'An error occurred';
    throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
  }

  return data;
};

export const api = {
  get: async (endpoint) => {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  post: async (endpoint, body, isMultipart = false) => {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
      method: 'POST',
      headers: getHeaders(isMultipart),
    };
    if (isMultipart) {
      options.body = body;
    } else {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    return handleResponse(response);
  },

  put: async (endpoint, body) => {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
