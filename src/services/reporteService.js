import { request } from './api.js';
import { db } from '../data/db.js';

export const reporteService = {
  async reporteProductos() {
    try {
      return await request('/reportes/productos');
    } catch (e) {
      return db.reportes.getProductos();
    }
  },

  async reporteGenerales() {
    try {
      return await request('/reportes/generales');
    } catch (e) {
      return db.reportes.getGenerales();
    }
  }
};
