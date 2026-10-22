/**
 * PRUEBAS UNITARIAS FASE 7: CAPA ADMINISTRATIVA (PARTE 1) - SHELL Y PRODUCTOS
 * (src/__tests__/fase7.test.jsx)
 * 
 * Valida:
 * 1. RutaProtegidaAdmin: Bloqueo a usuarios no autenticados o con rol CLIENTE, y acceso a usuarios con rol ADMIN.
 * 2. AdminLayout: Renderizado del Sidebar, Topbar, datos del administrador y logout.
 * 3. AdminDashboard: Carga de KPIs y alerta de productos con stock crítico.
 * 4. AdminProductos (CRUD Completo):
 *    - Renderizado de la tabla de productos con datos de productoService.
 *    - Filtro por texto en tiempo real y selector de categorías.
 *    - Validación de inputs obligatorios en modal de producto.
 *    - Creación de nuevo producto (POST).
 *    - Edición de producto existente (PUT).
 *    - Eliminación de producto con confirmación (DELETE).
 */
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { RutaProtegidaAdmin } from '../components/admin/RutaProtegidaAdmin.jsx';
import { AdminLayout } from '../components/admin/AdminLayout.jsx';
import { AdminDashboard } from '../pages/admin/AdminDashboard.jsx';
import { AdminProductos } from '../pages/admin/AdminProductos.jsx';
import { productoService } from '../services/productoService.js';
import { reporteService } from '../services/reporteService.js';
import { db } from '../data/db.js';

describe('FASE 7: Capa Administrativa (Shell y Gestión de Productos CRUD)', () => {
  beforeEach(() => {
    localStorage.clear();
    db.reset();
    vi.restoreAllMocks();
  });

  const renderConProviders = (ui, { route = '/', initialEntries = [route] } = {}) => {
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

  const usuarioAdmin = {
    id: 1,
    nombre: 'Administrador Pastelería',
    email: 'admin@milsabores.cl',
    rol: 'ADMIN'
  };

  const usuarioCliente = {
    id: 2,
    nombre: 'Cliente Juan Pérez',
    email: 'juan@correo.cl',
    rol: 'CLIENTE'
  };

  describe('1. Seguridad y Protección de Rutas Administrativas', () => {
    it('bloquea el acceso y muestra mensaje de restricción si el usuario no ha iniciado sesión', () => {
      renderConProviders(
        <Routes>
          <Route
            path="/admin"
            element={
              <RutaProtegidaAdmin>
                <div>Contenido Secreto Admin</div>
              </RutaProtegidaAdmin>
            }
          />
        </Routes>,
        { initialEntries: ['/admin'] }
      );

      expect(screen.getByText(/Panel Exclusivo para Administradores/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Iniciar Sesión como Admin/i })).toBeInTheDocument();
      expect(screen.queryByText('Contenido Secreto Admin')).not.toBeInTheDocument();
    });

    it('bloquea el acceso a usuarios autenticados que solo tienen rol CLIENTE', () => {
      localStorage.setItem('usuario_mil_sabores_activo', JSON.stringify(usuarioCliente));

      renderConProviders(
        <Routes>
          <Route
            path="/admin"
            element={
              <RutaProtegidaAdmin>
                <div>Contenido Secreto Admin</div>
              </RutaProtegidaAdmin>
            }
          />
        </Routes>,
        { initialEntries: ['/admin'] }
      );

      expect(screen.getByText(/Panel Exclusivo para Administradores/i)).toBeInTheDocument();
      expect(screen.getByText(/no posee privilegios de administrador/i)).toBeInTheDocument();
      expect(screen.queryByText('Contenido Secreto Admin')).not.toBeInTheDocument();
    });

    it('permite el acceso si el usuario cuenta con rol ADMIN', () => {
      localStorage.setItem('usuario_mil_sabores_activo', JSON.stringify(usuarioAdmin));

      renderConProviders(
        <Routes>
          <Route
            path="/admin"
            element={
              <RutaProtegidaAdmin>
                <div>Contenido Secreto Admin</div>
              </RutaProtegidaAdmin>
            }
          />
        </Routes>,
        { initialEntries: ['/admin'] }
      );

      expect(screen.getByText('Contenido Secreto Admin')).toBeInTheDocument();
    });
  });

  describe('2. Shell y Navegación del Panel (AdminLayout.jsx)', () => {
    beforeEach(() => {
      localStorage.setItem('usuario_mil_sabores_activo', JSON.stringify(usuarioAdmin));
    });

    it('renderiza el sidebar con los enlaces clave de gestión y los datos del admin', () => {
      renderConProviders(
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Vista Dashboard</div>} />
          </Route>
        </Routes>,
        { initialEntries: ['/admin'] }
      );

      expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Productos/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Categorías/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Usuarios/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Pedidos y Reportes/i })).toBeInTheDocument();

      // Muestra datos del admin conectado
      expect(screen.getByText('Administrador Pastelería')).toBeInTheDocument();
      expect(screen.getByText('admin@milsabores.cl')).toBeInTheDocument();
    });

    it('permite cerrar sesión desde el sidebar', () => {
      renderConProviders(
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Vista Dashboard</div>} />
          </Route>
          <Route path="/login" element={<div>Pantalla de Login</div>} />
        </Routes>,
        { initialEntries: ['/admin'] }
      );

      const botonLogout = screen.getByRole('button', { name: /Cerrar Sesión/i });
      fireEvent.click(botonLogout);

      expect(screen.getByText('Pantalla de Login')).toBeInTheDocument();
      expect(localStorage.getItem('usuario_mil_sabores_activo')).toBeNull();
    });
  });

  describe('3. Dashboard Administrativo (AdminDashboard.jsx)', () => {
    beforeEach(() => {
      localStorage.setItem('usuario_mil_sabores_activo', JSON.stringify(usuarioAdmin));
    });

    it('renderiza los indicadores de KPIs y la sección de productos críticos', async () => {
      renderConProviders(<AdminDashboard />);

      // Esperar a que se resuelvan las métricas
      await waitFor(() => {
        expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
      });

      // Validar tarjetas de KPIs
      expect(screen.getByTestId('kpi-total-productos')).toBeInTheDocument();
      expect(screen.getByTestId('kpi-stock-total')).toBeInTheDocument();
      expect(screen.getByTestId('kpi-ventas-totales')).toBeInTheDocument();
      expect(screen.getByTestId('kpi-stock-critico')).toBeInTheDocument();

      // Encabezado de productos con stock crítico
      expect(screen.getByText(/Productos con Stock Crítico/i)).toBeInTheDocument();
    });
  });

  describe('4. Gestión CRUD de Productos (AdminProductos.jsx)', () => {
    beforeEach(() => {
      localStorage.setItem('usuario_mil_sabores_activo', JSON.stringify(usuarioAdmin));
    });

    it('carga y renderiza la tabla de productos desde productoService', async () => {
      renderConProviders(<AdminProductos />);

      await waitFor(() => {
        expect(screen.getByTestId('tabla-admin-productos')).toBeInTheDocument();
      });

      // Debe mostrar productos del mock/db.js
      expect(screen.getByTestId('fila-producto-TC001')).toBeInTheDocument();
      expect(screen.getByText('Torta Cuadrada de Chocolate')).toBeInTheDocument();
      expect(screen.getByTestId('fila-producto-TT001')).toBeInTheDocument();
    });

    it('filtra productos por texto en tiempo real', async () => {
      renderConProviders(<AdminProductos />);

      await waitFor(() => {
        expect(screen.getByTestId('tabla-admin-productos')).toBeInTheDocument();
      });

      const inputBuscar = screen.getByTestId('input-buscar-admin-producto');
      fireEvent.change(inputBuscar, { target: { value: 'Frutas' } });

      // Solo debe quedar la torta de frutas
      expect(screen.getByText('Torta Cuadrada de Frutas')).toBeInTheDocument();
      expect(screen.queryByText('Torta Cuadrada de Chocolate')).not.toBeInTheDocument();
    });

    it('filtra productos según la categoría seleccionada', async () => {
      renderConProviders(<AdminProductos />);

      await waitFor(() => {
        expect(screen.getByTestId('tabla-admin-productos')).toBeInTheDocument();
      });

      const selectCat = screen.getByTestId('select-categoria-admin');
      fireEvent.change(selectCat, { target: { value: 'Postres Individuales' } });

      // Debe mostrar productos de postres individuales
      expect(screen.getByText(/Mousse de Chocolate/i)).toBeInTheDocument();
      expect(screen.queryByText('Torta Cuadrada de Chocolate')).not.toBeInTheDocument();
    });

    it('valida campos requeridos al intentar crear un producto vacío', async () => {
      renderConProviders(<AdminProductos />);

      await waitFor(() => {
        expect(screen.getByTestId('btn-nuevo-producto')).toBeInTheDocument();
      });

      // Abrir modal de nuevo producto
      fireEvent.click(screen.getByTestId('btn-nuevo-producto'));
      expect(screen.getByTestId('modal-producto')).toBeInTheDocument();

      // Guardar sin rellenar datos obligatorios
      fireEvent.click(screen.getByTestId('btn-guardar-producto'));

      // Verificar mensajes de error
      await waitFor(() => {
        expect(screen.getByText(/El código del producto es obligatorio/i)).toBeInTheDocument();
        expect(screen.getByText(/El nombre del producto es obligatorio/i)).toBeInTheDocument();
        expect(screen.getByText(/El precio debe ser un número mayor a \$0/i)).toBeInTheDocument();
      });
    });

    it('crea un nuevo producto exitosamente llamando a productoService.crear', async () => {
      const spyCrear = vi.spyOn(productoService, 'crear').mockResolvedValue({
        id: 999,
        codigo: 'TC999',
        nombre: 'Torta Cuadrada de Manjar y Nuez',
        descripcion: 'Deliciosa combinación de manjar artesanal y nueces.',
        precio: 48000,
        categoria: 'Tortas Cuadradas',
        stock: 12,
        stockCritico: 5,
        enOferta: false,
        porcentajeDescuento: 0,
        imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'
      });

      renderConProviders(<AdminProductos />);

      await waitFor(() => {
        expect(screen.getByTestId('btn-nuevo-producto')).toBeInTheDocument();
      });

      // Abrir modal
      fireEvent.click(screen.getByTestId('btn-nuevo-producto'));

      // Llenar campos
      fireEvent.change(screen.getByLabelText(/Código del producto/i), { target: { value: 'TC999' } });
      fireEvent.change(screen.getByLabelText(/Nombre del producto/i), { target: { value: 'Torta Cuadrada de Manjar y Nuez' } });
      fireEvent.change(screen.getByLabelText(/Precio del producto/i), { target: { value: '48000' } });
      fireEvent.change(screen.getByLabelText(/Stock del producto/i), { target: { value: '12' } });

      // Guardar
      fireEvent.click(screen.getByTestId('btn-guardar-producto'));

      await waitFor(() => {
        expect(spyCrear).toHaveBeenCalledWith(
          expect.objectContaining({
            codigo: 'TC999',
            nombre: 'Torta Cuadrada de Manjar y Nuez',
            precio: 48000,
            stock: 12
          })
        );
      });

      // Debe aparecer el nuevo producto en la tabla
      expect(screen.getByText('Torta Cuadrada de Manjar y Nuez')).toBeInTheDocument();
    });

    it('abre el modal en modo edición y actualiza el producto llamando a productoService.actualizar', async () => {
      const spyActualizar = vi.spyOn(productoService, 'actualizar').mockResolvedValue({
        id: 1,
        codigo: 'TC001',
        nombre: 'Torta Cuadrada de Chocolate Supremo',
        precio: 52000,
        stock: 20
      });

      renderConProviders(<AdminProductos />);

      await waitFor(() => {
        expect(screen.getByTestId('btn-editar-TC001')).toBeInTheDocument();
      });

      // Click en editar primer producto
      fireEvent.click(screen.getByTestId('btn-editar-TC001'));

      // El input de código debe estar deshabilitado en edición
      expect(screen.getByLabelText(/Código del producto/i)).toBeDisabled();

      // Cambiar nombre y precio
      fireEvent.change(screen.getByLabelText(/Nombre del producto/i), {
        target: { value: 'Torta Cuadrada de Chocolate Supremo' }
      });
      fireEvent.change(screen.getByLabelText(/Precio del producto/i), {
        target: { value: '52000' }
      });

      // Guardar cambios
      fireEvent.click(screen.getByTestId('btn-guardar-producto'));

      await waitFor(() => {
        expect(spyActualizar).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            nombre: 'Torta Cuadrada de Chocolate Supremo',
            precio: 52000
          })
        );
      });

      // Nombre actualizado en la tabla
      expect(screen.getByText('Torta Cuadrada de Chocolate Supremo')).toBeInTheDocument();
    });

    it('abre modal de confirmación y elimina un producto con productoService.eliminar', async () => {
      const spyEliminar = vi.spyOn(productoService, 'eliminar').mockResolvedValue(true);

      renderConProviders(<AdminProductos />);

      await waitFor(() => {
        expect(screen.getByTestId('btn-eliminar-TC001')).toBeInTheDocument();
      });

      // Click en botón eliminar
      fireEvent.click(screen.getByTestId('btn-eliminar-TC001'));

      // Debe aparecer el modal de confirmación
      expect(screen.getByTestId('modal-eliminar-producto')).toBeInTheDocument();
      expect(screen.getByText(/Confirmar Eliminación/i)).toBeInTheDocument();

      // Confirmar eliminación
      fireEvent.click(screen.getByTestId('btn-confirmar-eliminar'));

      await waitFor(() => {
        expect(spyEliminar).toHaveBeenCalledWith(1);
      });

      // Ya no debe estar en la tabla
      expect(screen.queryByTestId('fila-producto-TC001')).not.toBeInTheDocument();
    });
  });
});
