import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { db } from '../data/db.js';
import { productoService } from '../services/productoService.js';
import { authService } from '../services/authService.js';
import { AuthProvider, useAuth } from '../context/AuthContext.jsx';
import { CartProvider, useCarrito } from '../context/CartContext.jsx';

describe('FASE 3: Servicios, Sesión y Carrito de Compras', () => {
  beforeEach(() => {
    localStorage.clear();
    db.reset();
  });

  describe('1. Base de datos local simulada (db.js) y Capa de Servicios', () => {
    it('obtiene los 16 productos iniciales a través del productoService', async () => {
      const productos = await productoService.obtenerTodos();
      expect(Array.isArray(productos)).toBe(true);
      expect(productos.length).toBe(16);
      expect(productos[0]).toHaveProperty('nombre');
      expect(productos[0]).toHaveProperty('precio');
    });

    it('filtra correctamente productos en oferta', async () => {
      const ofertas = await productoService.obtenerOfertas();
      expect(ofertas.length).toBeGreaterThan(0);
      ofertas.forEach(prod => {
        expect(prod.enOferta).toBe(true);
      });
    });

    it('filtra productos críticos con stock menor o igual a 5', async () => {
      const criticos = await productoService.obtenerCriticos(5);
      expect(criticos.length).toBeGreaterThan(0);
      criticos.forEach(prod => {
        expect(prod.stock).toBeLessThanOrEqual(5);
      });
    });

    it('ejecuta el ciclo CRUD completo de un producto en la capa de datos', async () => {
      // Crear
      const nuevo = await productoService.crear({
        codigo: 'TEST01',
        nombre: 'Torta de Prueba CRUD',
        precio: 35000,
        stock: 10,
        stockCritico: 5,
        categoriaId: 1
      });
      expect(nuevo.id).toBeDefined();
      expect(nuevo.nombre).toBe('Torta de Prueba CRUD');

      // Leer detalle
      const encontrado = await productoService.obtenerPorId(nuevo.id);
      expect(encontrado.nombre).toBe('Torta de Prueba CRUD');

      // Actualizar
      const actualizado = await productoService.actualizar(nuevo.id, {
        nombre: 'Torta CRUD Modificada',
        precio: 38000
      });
      expect(actualizado.nombre).toBe('Torta CRUD Modificada');
      expect(actualizado.precio).toBe(38000);

      // Eliminar
      const eliminado = await productoService.eliminar(nuevo.id);
      expect(eliminado).toBe(true);
      const postDelete = await productoService.obtenerPorId(nuevo.id);
      expect(postDelete).toBeNull();
    });
  });

  describe('2. Autenticación y Sesión de Usuario (authService & useAuth)', () => {
    it('permite iniciar sesión con credenciales de administrador válidas', async () => {
      const usuario = await authService.login('admin@pasteleriamilsabores.cl', 'admin123');
      expect(usuario).toBeDefined();
      expect(usuario.rol).toBe('ADMIN');
      expect(usuario.email).toBe('admin@pasteleriamilsabores.cl');
    });

    it('falla el inicio de sesión si la contraseña es incorrecta', async () => {
      await expect(
        authService.login('admin@pasteleriamilsabores.cl', 'claveErronea')
      ).rejects.toThrow();
    });

    it('expone el estado y roles reactivos mediante useAuth', async () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(false);

      await act(async () => {
        const res = await result.current.login('rosa.carrasco@gmail.com', 'rosa123');
        expect(res.success).toBe(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isSenior).toBe(true);
      expect(result.current.isAdmin).toBe(false);

      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.usuario).toBeNull();
    });
  });

  describe('3. Lógica del Carrito de Compras (useCarrito)', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    );

    it('inicia con un carrito vacío y calcula totales en cero', () => {
      const { result } = renderHook(() => useCarrito(), { wrapper });
      expect(result.current.carrito).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.subtotal).toBe(0);
      expect(result.current.total).toBe(0);
    });

    it('agrega productos y acumula cantidades si tienen la misma personalización', () => {
      const { result } = renderHook(() => useCarrito(), { wrapper });

      act(() => {
        result.current.agregarAlCarrito({
          codigo: 'TC001',
          nombre: 'Torta de Chocolate',
          precio: 45000,
          cantidad: 1,
          personalizacion: 'Mediana'
        });
      });

      expect(result.current.carrito.length).toBe(1);
      expect(result.current.totalItems).toBe(1);
      expect(result.current.subtotal).toBe(45000);
      expect(result.current.costoEnvio).toBe(3500);

      // Agregar el mismo producto incrementa la cantidad
      act(() => {
        result.current.agregarAlCarrito({
          codigo: 'TC001',
          nombre: 'Torta de Chocolate',
          precio: 45000,
          cantidad: 2,
          personalizacion: 'Mediana'
        });
      });

      expect(result.current.carrito.length).toBe(1);
      expect(result.current.carrito[0].cantidad).toBe(3);
      expect(result.current.subtotal).toBe(135000);
    });

    it('aplica correctamente el cupón FELICES50 con 10% de descuento', () => {
      const { result } = renderHook(() => useCarrito(), { wrapper });

      act(() => {
        result.current.agregarAlCarrito({
          codigo: 'TC001',
          nombre: 'Torta de Chocolate',
          precio: 50000,
          cantidad: 1
        });
      });

      act(() => {
        const respuesta = result.current.aplicarCupon('FELICES50');
        expect(respuesta.success).toBe(true);
      });

      expect(result.current.porcentajeDescuento).toBe(10);
      expect(result.current.descuentoMonto).toBe(5000);
      // Total = (50000 - 5000) + 3500 envío = 48500
      expect(result.current.total).toBe(48500);
    });

    it('modifica la cantidad, elimina ítems y vacía el carrito', () => {
      const { result } = renderHook(() => useCarrito(), { wrapper });

      act(() => {
        result.current.agregarAlCarrito({
          codigo: 'TC001',
          nombre: 'Torta 1',
          precio: 10000,
          cantidad: 1
        });
        result.current.agregarAlCarrito({
          codigo: 'TC002',
          nombre: 'Torta 2',
          precio: 20000,
          cantidad: 1
        });
      });

      expect(result.current.carrito.length).toBe(2);

      // Actualizar cantidad del primer ítem a 3
      act(() => {
        result.current.actualizarCantidad(0, 3);
      });
      expect(result.current.carrito[0].cantidad).toBe(3);

      // Eliminar segundo ítem
      act(() => {
        result.current.eliminarDelCarrito(1);
      });
      expect(result.current.carrito.length).toBe(1);
      expect(result.current.carrito[0].codigo).toBe('TC001');

      // Vaciar carrito
      act(() => {
        result.current.limpiarCarrito();
      });
      expect(result.current.carrito.length).toBe(0);
      expect(result.current.total).toBe(0);
    });
  });
});
