/**
 * SERVICIO DE USUARIOS (src/services/usuarioService.js)
 * 
 * Implementa CRUD de usuarios y consulta de perfiles conectando con Spring Boot (/api/usuarios)
 * y conmutando a db.js en caso de desconexión.
 */
import { request } from './api.js';
import { db } from '../data/db.js';

export const usuarioService = {
  async obtenerTodos() {
    try {
      return await request('/usuarios');
    } catch (e) {
      return db.usuarios.getAll();
    }
  },

  async obtenerPorId(id) {
    try {
      return await request(`/usuarios/${id}`);
    } catch (e) {
      return db.usuarios.getById(id);
    }
  },

  async crear(usuario) {
    try {
      return await request('/usuarios', {
        method: 'POST',
        body: JSON.stringify(usuario)
      });
    } catch (e) {
      return db.usuarios.create(usuario);
    }
  },

  async actualizar(id, usuario) {
    try {
      return await request(`/usuarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(usuario)
      });
    } catch (e) {
      return db.usuarios.update(id, usuario);
    }
  },

  async eliminar(id) {
    try {
      await request(`/usuarios/${id}`, { method: 'DELETE' });
      return true;
    } catch (e) {
      return db.usuarios.delete(id);
    }
  }
};
