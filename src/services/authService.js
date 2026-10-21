/**
 * SERVICIO DE AUTENTICACIÓN (src/services/authService.js)
 * 
 * Gestiona el inicio de sesión contra el backend Spring Boot (/api/auth/login),
 * validación de roles ('ADMIN' / 'CLIENTE') y fallback a db.js.
 */
import { request } from './api.js';
import { db } from '../data/db.js';

const STORAGE_KEY_AUTH = 'usuario_mil_sabores_activo';

export const authService = {
  async login(email, password) {
    try {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      this.guardarSesion(data);
      return data;
    } catch (e) {
      // Fallback a db.js si el backend no está disponible
      const usuarioLocal = db.usuarios.login(email, password);
      if (usuarioLocal) {
        this.guardarSesion(usuarioLocal);
        return usuarioLocal;
      }
      throw new Error(e.message || 'Correo o contraseña incorrectos');
    }
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY_AUTH);
  },

  guardarSesion(usuario) {
    if (usuario) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  },

  obtenerUsuarioActual() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_AUTH);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
};
