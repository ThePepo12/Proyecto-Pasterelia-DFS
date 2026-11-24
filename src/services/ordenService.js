import { request } from './api.js';
import { db } from '../data/db.js';

const esTest = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || process.env?.VITEST);

export const ordenService = {
  async obtenerTodas() {
    if (esTest) return db.ordenes.getAll();
    return await request('/ordenes');
  },

  async obtenerPorId(id) {
    if (esTest) return db.ordenes.getById(id);
    return await request(`/ordenes/${id}`);
  },

  async obtenerPorFolio(folio) {
    if (esTest) return db.ordenes.getByFolio(folio);
    return await request(`/ordenes/folio/${folio}`);
  },

  async obtenerPorUsuario(usuarioId) {
    if (esTest) return db.ordenes.getByUsuario(usuarioId);
    return await request(`/ordenes/usuario/${usuarioId}`);
  },

  async crear(orden) {
    if (esTest) return db.ordenes.create(orden);
    return await request('/ordenes', {
      method: 'POST',
      body: JSON.stringify(orden)
    });
  },

  async cambiarEstado(id, nuevoEstado) {
    if (esTest) return db.ordenes.updateEstado(id, nuevoEstado);
    return await request(`/ordenes/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: nuevoEstado })
    });
  },

  async eliminar(id) {
    if (esTest) return db.ordenes.delete(id);
    await request(`/ordenes/${id}`, { method: 'DELETE' });
    return true;
  }
};
