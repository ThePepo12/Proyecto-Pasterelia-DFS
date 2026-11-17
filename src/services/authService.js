import { request } from './api.js';
import { db } from '../data/db.js';

const STORAGE_KEY_AUTH = 'usuario_mil_sabores_activo';
const STORAGE_KEY_TOKEN = 'token_mil_sabores';

export const authService = {
  async login(email, password) {
    try {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      // Si el backend responde con la estructura { token, usuario }
      if (data && data.token && data.usuario) {
        this.guardarToken(data.token);
        this.guardarSesion(data.usuario);
        return data.usuario;
      }

      // Compatibilidad si respondiera solo usuario
      this.guardarSesion(data);
      return data;
    } catch (e) {
      // Fallback a base de datos mock local si el backend no estuviera corriendo
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
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  },

  guardarSesion(usuario) {
    if (usuario) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  },

  guardarToken(token) {
    if (token) {
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
  },

  obtenerToken() {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
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
