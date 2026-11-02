import { db } from '../data/db.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s timeout para conmutar rápido si el backend no corre

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
