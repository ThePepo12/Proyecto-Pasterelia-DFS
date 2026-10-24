/**
 * PRUEBAS DE CHECKOUT Y PASARELA DE PAGO (checkout.test.jsx)
 * Evaluación Parcial 2 - Desarrollo Fullstack II
 * 
 * Contiene 3 pruebas clave:
 * 1. Descuento automático Senior (+50 años) en la orden.
 * 2. Simulación de rechazo de pago (error en pasarela) y preservación del carrito.
 * 3. Pago aprobado con generación de boleta y número de folio.
 */
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, renderHook } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { CartProvider, useCarrito } from '../context/CartContext.jsx';
import { PagoExitoso } from '../pages/tienda/PagoExitoso.jsx';
import { PagoError } from '../pages/tienda/PagoError.jsx';
import { db } from '../data/db.js';

describe('3. Módulo de Checkout y Pagos', () => {
  beforeEach(() => {
    localStorage.clear();
    db.reset();
    vi.restoreAllMocks();
  });

  const renderConProviders = (ui, { initialEntries = ['/'] } = {}) => {
    return render(
      <AuthProvider>
        <CartProvider>
          <MemoryRouter initialEntries={initialEntries}>
            {ui}
          </MemoryRouter>
        </CartProvider>
      </AuthProvider>
    );
  };

  it('Prueba 6: Aplica automáticamente 50% de descuento a clientes Senior (+50 años)', () => {
    // Simular sesión de usuario mayor de 50 años
    const usuarioSenior = {
      id: 10,
      nombre: 'Rosa Carrasco',
      email: 'rosa@gmail.com',
      rol: 'CLIENTE',
      edad: 61,
      descuentoSenior: true
    };
    localStorage.setItem('usuario_mil_sabores_activo', JSON.stringify(usuarioSenior));

    // Carrito con una torta de $40.000
    const item = {
      codigo: 'TT001',
      nombre: 'Torta Circular',
      precio: 40000,
      cantidad: 1,
      stock: 10
    };
    localStorage.setItem('carrito_mil_sabores', JSON.stringify([item]));

    const wrapper = ({ children }) => (
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    );

    const { result } = renderHook(() => useCarrito(), { wrapper });

    expect(result.current.subtotal).toBe(40000);
    // Descuento Senior: 50% = 20.000
    expect(result.current.porcentajeDescuento).toBe(50);
    expect(result.current.descuentoMonto).toBe(20000);
    // Total = (40.000 - 20.000) + 3.500 despacho = 23.500
    expect(result.current.total).toBe(23500);
  });

  it('Prueba 7: Simulación de fallo en pasarela muestra mensaje de rechazo y código de error', () => {
    const errorState = {
      motivo: 'Fondos insuficientes en la cuenta del cliente.',
      codigoError: 'ERR-WEBPAY-904',
      datosIntento: {
        cliente: 'Carlos Méndez',
        email: 'carlos@gmail.com',
        total: 48500
      }
    };

    renderConProviders(
      <Routes>
        <Route path="/pago-error" element={<PagoError />} />
      </Routes>,
      { initialEntries: [{ pathname: '/pago-error', state: errorState }] }
    );

    expect(screen.getByRole('heading', { level: 1, name: /Pago No Procesado/i })).toBeInTheDocument();
    expect(screen.getAllByText(/ERR-WEBPAY-904/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Fondos insuficientes/i)).toBeInTheDocument();
  });

  it('Prueba 8: Pago aprobado genera boleta con folio y datos de entrega en modo lectura', () => {
    const ordenPrueba = {
      folio: 'MS-501991',
      clienteNombre: 'Rosa Carrasco',
      clienteEmail: 'rosa@gmail.com',
      telefono: '+56 9 1234 5678',
      direccionEntrega: 'Av. Concha y Toro #2500',
      comuna: 'Puente Alto',
      region: 'Región Metropolitana',
      fechaEntrega: '24/10/2026',
      subtotal: 40000,
      total: 23500,
      fecha: '24/10/2026',
      hora: '12:00',
      items: [
        {
          codigoProducto: 'TT001',
          nombreProducto: 'Torta Circular',
          precioUnitario: 40000,
          cantidad: 1,
          personalizacion: 'Estándar',
          subtotal: 40000
        }
      ]
    };

    renderConProviders(
      <Routes>
        <Route path="/pago-exitoso" element={<PagoExitoso />} />
      </Routes>,
      { initialEntries: [{ pathname: '/pago-exitoso', state: { orden: ordenPrueba } }] }
    );

    // Boleta con número de folio
    expect(screen.getByTestId('folio-boleta')).toHaveTextContent('MS-501991');
    expect(screen.getByText(/Rosa Carrasco/i)).toBeInTheDocument();
    expect(screen.getByText(/Av. Concha y Toro #2500/i)).toBeInTheDocument();
  });
});
