import { db } from '../data/db.js';

// URL base con versionado de API 
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  // Recuperamos el token JWT guardado en localStorage 
  const token = localStorage.getItem('token_mil_sabores');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Si existe un token JWT, lo inyectamos automáticamente en la cabecera Authorization
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorBody);
      } catch (e) {
        errorData = { error: errorBody || `Error HTTP ${response.status}` };
      }
      throw new Error(errorData.error || errorData.message || `Error HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
