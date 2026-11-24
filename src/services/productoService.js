import { request } from './api.js';
import { db } from '../data/db.js';

// En entorno de test unitario (Vitest / JSDOM), usamos db.js como Mock.
// En producción / navegador real con Docker, dependemos 100% de la API REST de Spring Boot.
const esTest = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || process.env?.VITEST);

export const productoService = {
  async obtenerTodos() {
    if (esTest) return db.productos.getAll();
    return await request('/productos');
  },

  async obtenerPorId(id) {
    if (esTest) return db.productos.getById(id);
    return await request(`/productos/${id}`);
  },

  async obtenerPorCodigo(codigo) {
    if (esTest) return db.productos.getByCodigo(codigo);
    return await request(`/productos/codigo/${codigo}`);
  },

  async obtenerPorCategoria(categoriaId) {
    if (esTest) return db.productos.getByCategoria(categoriaId);
    return await request(`/productos/categoria/${categoriaId}`);
  },

  async obtenerOfertas() {
    if (esTest) return db.productos.getOfertas();
    return await request('/productos/ofertas');
  },

  async obtenerCriticos(limite = 5) {
    if (esTest) return db.productos.getCriticos(limite);
    return await request(`/productos/criticos?limite=${limite}`);
  },

  async crear(producto) {
    if (esTest) return db.productos.create(producto);
    return await request('/productos', {
      method: 'POST',
      body: JSON.stringify(producto)
    });
  },

  async actualizar(id, producto) {
    if (esTest) return db.productos.update(id, producto);
    return await request(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(producto)
    });
  },

  async eliminar(id) {
    if (esTest) return db.productos.delete(id);
    await request(`/productos/${id}`, { method: 'DELETE' });
    return true;
  }
};
