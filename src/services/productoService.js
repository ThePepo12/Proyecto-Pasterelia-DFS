/**
 * SERVICIO DE PRODUCTOS (src/services/productoService.js)
 * 
 * Implementa CRUD completo y consultas específicas (ofertas, críticos, por categoría)
 * conectando con Spring Boot (/api/productos) y conmutando a db.js en caso de fallo.
 */
import { request } from './api.js';
import { db } from '../data/db.js';

export const productoService = {
  async obtenerTodos() {
    try {
      return await request('/productos');
    } catch (e) {
      return db.productos.getAll();
    }
  },

  async obtenerPorId(id) {
    try {
      return await request(`/productos/${id}`);
    } catch (e) {
      return db.productos.getById(id);
    }
  },

  async obtenerPorCodigo(codigo) {
    try {
      return await request(`/productos/codigo/${codigo}`);
    } catch (e) {
      return db.productos.getByCodigo(codigo);
    }
  },

  async obtenerPorCategoria(categoriaId) {
    try {
      return await request(`/productos/categoria/${categoriaId}`);
    } catch (e) {
      return db.productos.getByCategoria(categoriaId);
    }
  },

  async obtenerOfertas() {
    try {
      return await request('/productos/ofertas');
    } catch (e) {
      return db.productos.getOfertas();
    }
  },

  async obtenerCriticos(limite = 5) {
    try {
      return await request(`/productos/criticos?limite=${limite}`);
    } catch (e) {
      return db.productos.getCriticos(limite);
    }
  },

  async crear(producto) {
    try {
      return await request('/productos', {
        method: 'POST',
        body: JSON.stringify(producto)
      });
    } catch (e) {
      return db.productos.create(producto);
    }
  },

  async actualizar(id, producto) {
    try {
      return await request(`/productos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(producto)
      });
    } catch (e) {
      return db.productos.update(id, producto);
    }
  },

  async eliminar(id) {
    try {
      await request(`/productos/${id}`, { method: 'DELETE' });
      return true;
    } catch (e) {
      return db.productos.delete(id);
    }
  }
};
