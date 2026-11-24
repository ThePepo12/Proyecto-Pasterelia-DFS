import { request } from './api.js';
import { db } from '../data/db.js';

const esTest = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || process.env?.VITEST);

export const categoriaService = {
  async obtenerTodas() {
    if (esTest) return db.categorias.getAll();
    return await request('/categorias');
  },

  async obtenerPorId(id) {
    if (esTest) return db.categorias.getById(id);
    return await request(`/categorias/${id}`);
  },

  async crear(categoria) {
    if (esTest) return db.categorias.create(categoria);
    return await request('/categorias', {
      method: 'POST',
      body: JSON.stringify(categoria)
    });
  },

  async actualizar(id, categoria) {
    if (esTest) return db.categorias.update(id, categoria);
    return await request(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoria)
    });
  },

  async eliminar(id) {
    if (esTest) return db.categorias.delete(id);
    await request(`/categorias/${id}`, { method: 'DELETE' });
    return true;
  }
};
