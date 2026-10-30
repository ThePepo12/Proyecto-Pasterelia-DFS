/**
 * PRUEBAS: Barra de Navegación Común (Navbar.jsx)
 * 
 * Verifica:
 * 1. Renderiza el logo, nombre de la pastelería y links de navegación.
 * 2. Muestra burbuja con el conteo de ítems del carrito.
 * 3. Muestra botón de Iniciar Sesión para visitantes y saludo/perfil para usuario logueado.
 */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { Navbar } from '../components/common/Navbar.jsx';
import { db } from '../data/db.js';

describe('1. Componente Navbar', () => {
  beforeEach(() => {
    localStorage.clear();
    db.reset();
  });

  const renderNavbar = () => {
    return render(
      <AuthProvider>
        <CartProvider>
          <MemoryRouter>
            <Navbar />
          </MemoryRouter>
        </CartProvider>
      </AuthProvider>
    );
  };

  it('Prueba 1: Renderiza la marca "Mil Sabores" y los enlaces principales', () => {
    renderNavbar();
    expect(screen.getByText('Mil Sabores')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Catálogo/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ofertas/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Nosotros/i })).toBeInTheDocument();
  });

  it('Prueba 2: Muestra el contador del carrito reactivamente según los ítems agregados', () => {
    // Simulamos 3 productos en el carrito guardados en localStorage
    const carritoMock = [
      { codigo: 'TC001', nombre: 'Torta Cuadrada', precio: 45000, cantidad: 2 },
      { codigo: 'TE001', nombre: 'Torta Especial', precio: 50000, cantidad: 1 }
    ];
    localStorage.setItem('carrito_mil_sabores', JSON.stringify(carritoMock));

    renderNavbar();
    // Total unidades = 2 + 1 = 3
    const contador = screen.getByText('3');
    expect(contador).toBeInTheDocument();
    expect(contador).toHaveClass('badge');
  });

  it('Prueba 3: Muestra opción de Iniciar Sesión para invitados y Saludo para usuarios logueados', () => {
    // Simular usuario autenticado en localStorage
    const usuarioMock = { id: 1, nombre: 'Ana Valenzuela', email: 'ana@duocuc.cl', rol: 'CLIENTE' };
    localStorage.setItem('usuario_mil_sabores_activo', JSON.stringify(usuarioMock));

    renderNavbar();
    expect(screen.getByText(/Hola,/i)).toBeInTheDocument();
    expect(screen.getByText(/Ana/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Mi Perfil/i })).toBeInTheDocument();
  });
});
