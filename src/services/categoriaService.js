/**
 * SERVICIO DE CATEGORÍAS (src/services/categoriaService.js)
 * 
 * Implementa CRUD completo de categorías conectando con Spring Boot (/api/categorias)
 * y conmutando a db.js en caso de desconexión.
 */
import { request } from './api.js';
import { db } from '../data/db.js';

export const categoriaService = {
  async obtenerTodas() {
    try {
      return await request('/categorias');
    } catch (e) {
      return db.categorias.getAll();
    }
  },

  async obtenerPorId(id) {
    try {
      return await request(`/categorias/${id}`);
    } catch (e) {
      return db.categorias.getById(id);
    }
  },

  async crear(categoria) {
    try {
      return await request('/categorias', {
        method: 'POST',
        body: JSON.stringify(categoria)
      });
    } catch (e) {
      return db.categorias.create(categoria);
    }
  },

  async actualizar(id, categoria) {
    try {
      return await request(`/categorias/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoria)
      });
    } catch (e) {
      return db.categorias.update(id, categoria);
    }
  },

  async eliminar(id) {
    try {
      await request(`/categorias/${id}`, { method: 'DELETE' });
      return true;
    } catch (e) {
      return db.categorias.delete(id);
    }
  }
};
