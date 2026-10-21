/**
 * SERVICIO DE ÓRDENES Y BOLETAS (src/services/ordenService.js)
 * 
 * Gestiona el registro de compras (checkout), consulta de boletas,
 * historial por usuario y cambio de estado para la administración.
 */
import { request } from './api.js';
import { db } from '../data/db.js';

export const ordenService = {
  async obtenerTodas() {
    try {
      return await request('/ordenes');
    } catch (e) {
      return db.ordenes.getAll();
    }
  },

  async obtenerPorId(id) {
    try {
      return await request(`/ordenes/${id}`);
    } catch (e) {
      return db.ordenes.getById(id);
    }
  },

  async obtenerPorFolio(folio) {
    try {
      return await request(`/ordenes/folio/${folio}`);
    } catch (e) {
      return db.ordenes.getByFolio(folio);
    }
  },

  async obtenerPorUsuario(usuarioId) {
    try {
      return await request(`/ordenes/usuario/${usuarioId}`);
    } catch (e) {
      return db.ordenes.getByUsuario(usuarioId);
    }
  },

  async crear(orden) {
    try {
      return await request('/ordenes', {
        method: 'POST',
        body: JSON.stringify(orden)
      });
    } catch (e) {
      return db.ordenes.create(orden);
    }
  },

  async cambiarEstado(id, nuevoEstado) {
    try {
      return await request(`/ordenes/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: nuevoEstado })
      });
    } catch (e) {
      return db.ordenes.updateEstado(id, nuevoEstado);
    }
  },

  async eliminar(id) {
    try {
      await request(`/ordenes/${id}`, { method: 'DELETE' });
      return true;
    } catch (e) {
      return db.ordenes.delete(id);
    }
  }
};
