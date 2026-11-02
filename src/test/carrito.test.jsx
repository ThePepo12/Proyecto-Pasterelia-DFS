import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { CartProvider, useCarrito } from '../context/CartContext.jsx';
import { Carrito } from '../pages/tienda/Carrito.jsx';
import { db } from '../data/db.js';

describe('2. Módulo del Carrito de Compras', () => {
  beforeEach(() => {
    localStorage.clear();
    db.reset();
  });

  const wrapper = ({ children }) => (
    <AuthProvider>
      <CartProvider>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </CartProvider>
    </AuthProvider>
  );

  it('Prueba 3: Agrega productos y calcula subtotales y despacho correctamente', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper });

    act(() => {
      result.current.agregarAlCarrito({
        codigo: 'TC001',
        nombre: 'Torta Cuadrada de Chocolate',
        precio: 45000,
        cantidad: 2,
        personalizacion: 'Estándar',
        stock: 10
      });
    });

    expect(result.current.carrito.length).toBe(1);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.subtotal).toBe(90000);
    expect(result.current.costoEnvio).toBe(3500);
    expect(result.current.total).toBe(93500);
  });

  it('Prueba 4: Aplica cupón de descuento conmemorativo FELICES50 (10% de rebaja)', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper });

    act(() => {
      result.current.agregarAlCarrito({
        codigo: 'TC001',
        nombre: 'Torta Cuadrada de Chocolate',
        precio: 50000,
        cantidad: 1,
        stock: 5
      });
    });

    act(() => {
      const resp = result.current.aplicarCupon('FELICES50');
      expect(resp.success).toBe(true);
    });

    expect(result.current.porcentajeDescuento).toBe(10);
    expect(result.current.descuentoMonto).toBe(5000);
    expect(result.current.total).toBe(48500);
  });

  it('Prueba 5: Respeta el stock reactivo del producto bloqueando el botón de aumento', () => {
    const itemConStockLimite = {
      codigo: 'TC001',
      nombre: 'Torta Cuadrada',
      precio: 45000,
      cantidad: 2,
      personalizacion: 'Estándar',
      imagen: '/img/producto_TC001.avif',
      stock: 2
    };
    localStorage.setItem('carrito_mil_sabores', JSON.stringify([itemConStockLimite]));

    render(
      <AuthProvider>
        <CartProvider>
          <MemoryRouter>
            <Carrito />
          </MemoryRouter>
        </CartProvider>
      </AuthProvider>
    );

    const botonAumentar = screen.getByRole('button', { name: '+' });
    expect(botonAumentar).toBeDisabled();
    expect(botonAumentar).toHaveAttribute('title', 'Solo hay 2 unidades disponibles');
  });
});
