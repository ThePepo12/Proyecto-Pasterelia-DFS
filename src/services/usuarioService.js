import { request } from './api.js';
import { db } from '../data/db.js';

const esTest = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || process.env?.VITEST);

export const usuarioService = {
  async obtenerTodos() {
    if (esTest) return db.usuarios.getAll();
    return await request('/usuarios');
  },

  async obtenerPorId(id) {
    if (esTest) return db.usuarios.getById(id);
    return await request(`/usuarios/${id}`);
  },

  async crear(usuario) {
    if (esTest) return db.usuarios.create(usuario);
    return await request('/usuarios', {
      method: 'POST',
      body: JSON.stringify(usuario)
    });
  },

  async actualizar(id, usuario) {
    if (esTest) return db.usuarios.update(id, usuario);
    return await request(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuario)
    });
  },

  async eliminar(id) {
    if (esTest) return db.usuarios.delete(id);
    await request(`/usuarios/${id}`, { method: 'DELETE' });
    return true;
  }
};
