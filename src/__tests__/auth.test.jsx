/**
 * PRUEBAS DE AUTENTICACIÓN Y SEGURIDAD (auth.test.jsx)
 * Evaluación Parcial 2 - Desarrollo Fullstack II
 * 
 * Contiene 2 pruebas clave:
 * 1. Inicio de sesión exitoso y recuperación de roles.
 * 2. Protección de rutas administrativas (bloqueo a rol CLIENTE).
 */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, renderHook, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext.jsx';
import { RutaProtegidaAdmin } from '../components/admin/RutaProtegidaAdmin.jsx';
import { authService } from '../services/authService.js';
import { db } from '../data/db.js';

describe('4. Módulo de Autenticación y Seguridad', () => {
  beforeEach(() => {
    localStorage.clear();
    db.reset();
  });

  it('Prueba 9: Inicia sesión correctamente y expone roles mediante useAuth', async () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);

    // Login con usuario administrador
    await act(async () => {
      const res = await result.current.login('admin@pasteleriamilsabores.cl', 'admin123');
      expect(res.success).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.usuario.email).toBe('admin@pasteleriamilsabores.cl');
  });

  it('Prueba 10: Bloquea el acceso al panel administrativo a usuarios sin rol ADMIN', () => {
    // Simular sesión de usuario con rol CLIENTE
    const usuarioCliente = {
      id: 2,
      nombre: 'Carlos Méndez',
      email: 'carlos@gmail.com',
      rol: 'CLIENTE'
    };
    localStorage.setItem('usuario_mil_sabores_activo', JSON.stringify(usuarioCliente));

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <RutaProtegidaAdmin>
                  <div>Panel Secreto Admin</div>
                </RutaProtegidaAdmin>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Debe mostrar la vista de acceso restringido y no el panel
    expect(screen.queryByText('Panel Secreto Admin')).not.toBeInTheDocument();
    expect(screen.getByText('Panel Exclusivo para Administradores')).toBeInTheDocument();
  });
});
