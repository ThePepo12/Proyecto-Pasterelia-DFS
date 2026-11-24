import { request } from './api.js';
import { db } from '../data/db.js';

const esTest = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || process.env?.VITEST);

export const reporteService = {
  async reporteProductos() {
    if (esTest) return db.reportes.getProductos();
    return await request('/reportes/productos');
  },

  async reporteGenerales() {
    if (esTest) return db.reportes.getGenerales();
    return await request('/reportes/generales');
  }
};
