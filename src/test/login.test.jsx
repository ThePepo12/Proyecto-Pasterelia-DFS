/**
 * PRUEBAS: Vista de Inicio de Sesión (Login.jsx)
 * 
 * Verifica:
 * 1. Renderiza el formulario con campos de email y contraseña.
 * 2. Muestra validación si se intenta enviar el formulario con campos vacíos.
 * 3. Permite cargar credenciales de prueba con los botones de demo.
 */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { Login } from '../pages/auth/Login.jsx';
import { db } from '../data/db.js';

describe('9. Vista de Login (Autenticación)', () => {
  beforeEach(() => {
    localStorage.clear();
    db.reset();
  });

  const renderLogin = () => {
    return render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );
  };

  it('Prueba 20: Renderiza el formulario de inicio de sesión y sus campos', () => {
    renderLogin();
    expect(screen.getByRole('heading', { name: /Iniciar Sesión/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nombre@ejemplo\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ingresar a mi Cuenta/i })).toBeInTheDocument();
  });

  it('Prueba 21: Muestra alerta si los campos están vacíos al intentar enviar', () => {
    renderLogin();
    const botonIngresar = screen.getByRole('button', { name: /Ingresar a mi Cuenta/i });
    fireEvent.click(botonIngresar);

    expect(screen.getByText(/Por favor completa todos los campos/i)).toBeInTheDocument();
  });

  it('Prueba 22: Actualiza los valores de email y contraseña mediante inputs controlados', () => {
    renderLogin();
    const inputEmail = screen.getByPlaceholderText(/nombre@ejemplo\.com/i);
    const inputPassword = screen.getByPlaceholderText(/••••••••/i);

    fireEvent.change(inputEmail, { target: { value: 'cliente@duocuc.cl' } });
    fireEvent.change(inputPassword, { target: { value: 'clave123' } });

    expect(inputEmail.value).toBe('cliente@duocuc.cl');
    expect(inputPassword.value).toBe('clave123');
  });
});
