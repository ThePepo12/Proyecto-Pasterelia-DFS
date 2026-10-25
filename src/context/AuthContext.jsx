/**
 * Gestiona el estado global de la sesión de usuario, roles (ADMIN / CLIENTE),
 * beneficios de edad (Senior 50%) y comunidad Duoc UC.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';
import { usuarioService } from '../services/usuarioService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => authService.obtenerUsuarioActual());
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const sesion = authService.obtenerUsuarioActual();
    if (sesion) {
      setUsuario(sesion);
    }
  }, []);

  const login = async (email, password) => {
    setCargando(true);
    try {
      const user = await authService.login(email, password);
      setUsuario(user);
      return { success: true, usuario: user };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setCargando(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  const registro = async (datos) => {
    setCargando(true);
    try {
      const nuevo = await usuarioService.crear(datos);
      // Iniciar sesión automáticamente tras registrarse
      authService.guardarSesion(nuevo);
      setUsuario(nuevo);
      return { success: true, usuario: nuevo };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setCargando(false);
    }
  };

  const actualizarPerfil = async (datosActualizados) => {
    if (!usuario?.id) return { success: false, error: 'No hay usuario autenticado' };
    setCargando(true);
    try {
      const actualizado = await usuarioService.actualizar(usuario.id, {
        ...usuario,
        ...datosActualizados
      });
      authService.guardarSesion(actualizado);
      setUsuario(actualizado);
      return { success: true, usuario: actualizado };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setCargando(false);
    }
  };

  const isAdmin = usuario?.rol === 'ADMIN';
  const isSenior = Boolean(usuario?.descuentoSenior || (usuario?.edad && usuario.edad >= 50));
  const isEstudiante = Boolean(usuario?.esEstudianteDuoc || usuario?.email?.endsWith('@duocuc.cl'));

  return (
    <AuthContext.Provider
      value={{
        usuario,
        user: usuario,
        cargando,
        isAuthenticated: Boolean(usuario),
        isAdmin,
        isSenior,
        isEstudiante,
        login,
        logout,
        registro,
        actualizarPerfil
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
