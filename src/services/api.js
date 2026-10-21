/**
 * CLIENTE BASE DE API (src/services/api.js)
 * 
 * Gestiona las peticiones HTTP al backend Spring Boot.
 * Incorpora detección de conectividad y fallback automático a db.js si el backend
 * no está disponible o durante la ejecución de pruebas unitarias.
 */
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
    // Si la conexión falla (backend apagado, timeout, CORS o entorno de testing), devolvemos una marca de error
    // para que el servicio correspondiente use la fuente de respaldo db.js.
    throw error;
  }
}
