const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const API_ROOT = `${API_BASE_URL.replace(/\/+$/, '')}/api`;

export default API_BASE_URL;
