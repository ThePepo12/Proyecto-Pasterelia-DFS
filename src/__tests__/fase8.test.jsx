/**
 * PRUEBAS UNITARIAS FASE 8: CAPA ADMINISTRATIVA (PARTE 2) - CATEGORÍAS, USUARIOS Y REPORTES
 * (src/__tests__/fase8.test.jsx)
 * 
 * Valida:
 * 1. AdminCategorias: Listado, conteo de productos, buscador, validación, creación (POST), edición (PUT) y eliminación (DELETE).
 * 2. AdminUsuarios: Listado, filtro por rol, asignación de rol ADMIN/CLIENTE, validación, protección de auto-eliminación y CRUD.
 * 3. AdminReportes: Indicadores financieros, listado de pedidos, filtro por estado, actualización reactiva de estado (PATCH) y modal de boleta.
 */
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { AdminCategorias } from '../pages/admin/AdminCategorias.jsx';
import { AdminUsuarios } from '../pages/admin/AdminUsuarios.jsx';
import { AdminReportes } from '../pages/admin/AdminReportes.jsx';
import { categoriaService } from '../services/categoriaService.js';
import { usuarioService } from '../services/usuarioService.js';
import { ordenService } from '../services/ordenService.js';
import { db } from '../data/db.js';

describe('FASE 8: Capa Administrativa (Categorías, Usuarios y Reportes/Pedidos)', () => {
  beforeEach(() => {
    localStorage.clear();
    db.reset();
    vi.restoreAllMocks();
  });

  const usuarioAdmin = {
    id: 1,
    nombre: 'Administrador Pastelería',
    email: 'admin@pasteleriamilsabores.cl',
    rol: 'ADMIN'
  };

  const renderConProviders = (ui, { route = '/', initialEntries = [route] } = {}) => {
    localStorage.setItem('usuario_mil_sabores_activo', JSON.stringify(usuarioAdmin));
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

  describe('1. Gestión de Categorías (AdminCategorias.jsx)', () => {
    it('renderiza la lista de categorías con conteo de productos asociados', async () => {
      renderConProviders(<AdminCategorias />);

      await waitFor(() => {
        expect(screen.getByTestId('tabla-admin-categorias')).toBeInTheDocument();
      });

      // Debe mostrar categorías iniciales de la pastelería
      expect(screen.getByText('Tortas Cuadradas')).toBeInTheDocument();
      expect(screen.getByText('Tortas Circulares')).toBeInTheDocument();
      expect(screen.getByText('Postres Individuales')).toBeInTheDocument();

      // Debe mostrar badges con productos asociados
      expect(screen.getAllByText(/productos/i)[0]).toBeInTheDocument();
    });

    it('filtra categorías en tiempo real mediante el buscador de texto', async () => {
      renderConProviders(<AdminCategorias />);

      await waitFor(() => {
        expect(screen.getByTestId('tabla-admin-categorias')).toBeInTheDocument();
      });

      const inputBuscar = screen.getByTestId('input-buscar-categoria');
      fireEvent.change(inputBuscar, { target: { value: 'Veganos' } });

      expect(screen.getByText('Productos Veganos')).toBeInTheDocument();
      expect(screen.queryByText('Tortas Cuadradas')).not.toBeInTheDocument();
    });

    it('valida campos obligatorios al intentar crear una categoría vacía', async () => {
      renderConProviders(<AdminCategorias />);

      await waitFor(() => {
        expect(screen.getByTestId('btn-nueva-categoria')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('btn-nueva-categoria'));
      expect(screen.getByTestId('modal-categoria')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('btn-guardar-categoria'));

      await waitFor(() => {
        expect(screen.getByText(/El nombre de la categoría es obligatorio/i)).toBeInTheDocument();
      });
    });

    it('crea una nueva categoría llamando a categoriaService.crear', async () => {
      const spyCrear = vi.spyOn(categoriaService, 'crear').mockResolvedValue({
        id: 99,
        nombre: 'Galletería Fina Artesanal',
        descripcion: 'Galletas de mantequilla, alfajores y delicias surtidas.',
        imagen: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500'
      });

      renderConProviders(<AdminCategorias />);

      await waitFor(() => {
        expect(screen.getByTestId('btn-nueva-categoria')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('btn-nueva-categoria'));

      fireEvent.change(screen.getByLabelText(/Nombre de la categoría/i), {
        target: { value: 'Galletería Fina Artesanal' }
      });
      fireEvent.change(screen.getByLabelText(/Descripción de la categoría/i), {
        target: { value: 'Galletas de mantequilla, alfajores y delicias surtidas.' }
      });

      fireEvent.click(screen.getByTestId('btn-guardar-categoria'));

      await waitFor(() => {
        expect(spyCrear).toHaveBeenCalledWith(
          expect.objectContaining({
            nombre: 'Galletería Fina Artesanal'
          })
        );
      });

      expect(screen.getByText('Galletería Fina Artesanal')).toBeInTheDocument();
    });

    it('edita una categoría existente llamando a categoriaService.actualizar', async () => {
      const spyActualizar = vi.spyOn(categoriaService, 'actualizar').mockResolvedValue({
        id: 1,
        nombre: 'Tortas Cuadradas de Gala',
        descripcion: 'Versión premium con decoración artesanal.'
      });

      renderConProviders(<AdminCategorias />);

      await waitFor(() => {
        expect(screen.getByTestId('btn-editar-cat-1')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('btn-editar-cat-1'));

      fireEvent.change(screen.getByLabelText(/Nombre de la categoría/i), {
        target: { value: 'Tortas Cuadradas de Gala' }
      });

      fireEvent.click(screen.getByTestId('btn-guardar-categoria'));

      await waitFor(() => {
        expect(spyActualizar).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            nombre: 'Tortas Cuadradas de Gala'
          })
        );
      });

      expect(screen.getByText('Tortas Cuadradas de Gala')).toBeInTheDocument();
    });

    it('elimina una categoría con modal de confirmación llamando a categoriaService.eliminar', async () => {
      const spyEliminar = vi.spyOn(categoriaService, 'eliminar').mockResolvedValue(true);

      renderConProviders(<AdminCategorias />);

      await waitFor(() => {
        expect(screen.getByTestId('btn-eliminar-cat-1')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('btn-eliminar-cat-1'));

      expect(screen.getByTestId('modal-eliminar-categoria')).toBeInTheDocument();
      expect(screen.getByText(/Confirmar Eliminación de Categoría/i)).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('btn-confirmar-eliminar-cat'));

      await waitFor(() => {
        expect(spyEliminar).toHaveBeenCalledWith(1);
      });

      expect(screen.queryByTestId('fila-categoria-1')).not.toBeInTheDocument();
    });
  });

  describe('2. Gestión de Usuarios y Roles (AdminUsuarios.jsx)', () => {
    it('renderiza la lista de usuarios y permite filtrar por rol', async () => {
      renderConProviders(<AdminUsuarios />);

      await waitFor(() => {
        expect(screen.getByTestId('tabla-admin-usuarios')).toBeInTheDocument();
      });

      // Mostrar admin y clientes
      expect(screen.getByText('admin@pasteleriamilsabores.cl')).toBeInTheDocument();

      // Filtrar solo por ADMIN
      const selectRol = screen.getByTestId('select-filtro-rol');
      fireEvent.change(selectRol, { target: { value: 'ADMIN' } });

      expect(screen.getByText('admin@pasteleriamilsabores.cl')).toBeInTheDocument();
    });

    it('filtra usuarios por texto en tiempo real', async () => {
      renderConProviders(<AdminUsuarios />);

      await waitFor(() => {
        expect(screen.getByTestId('tabla-admin-usuarios')).toBeInTheDocument();
      });

      const inputBuscar = screen.getByTestId('input-buscar-usuario');
      fireEvent.change(inputBuscar, { target: { value: 'pasteleriamilsabores' } });

      expect(screen.getByText('admin@pasteleriamilsabores.cl')).toBeInTheDocument();
    });

    it('valida campos obligatorios y formato de correo al crear usuario', async () => {
      renderConProviders(<AdminUsuarios />);

      await waitFor(() => {
        expect(screen.getByTestId('btn-nuevo-usuario')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('btn-nuevo-usuario'));
      expect(screen.getByTestId('modal-usuario')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('btn-guardar-usuario'));

      await waitFor(() => {
        expect(screen.getByText(/El nombre completo es obligatorio/i)).toBeInTheDocument();
        expect(screen.getByText(/El correo electrónico es obligatorio/i)).toBeInTheDocument();
        expect(screen.getByText(/La contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument();
      });
    });

    it('crea un nuevo usuario con rol asignado llamando a usuarioService.crear', async () => {
      const spyCrear = vi.spyOn(usuarioService, 'crear').mockResolvedValue({
        id: 50,
        nombre: 'Loreto Aravena',
        email: 'loreto@milsabores.cl',
        telefono: '+56944332211',
        direccion: 'Av. Las Condes 7000',
        edad: 32,
        rol: 'ADMIN',
        descuentoSenior: false,
        esEstudianteDuoc: false
      });

      renderConProviders(<AdminUsuarios />);

      await waitFor(() => {
        expect(screen.getByTestId('btn-nuevo-usuario')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('btn-nuevo-usuario'));

      fireEvent.change(screen.getByLabelText(/Nombre Completo/i), { target: { value: 'Loreto Aravena' } });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'loreto@milsabores.cl' } });
      fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'Secret123!' } });
      fireEvent.change(screen.getByLabelText(/Edad/i), { target: { value: '32' } });
      fireEvent.change(screen.getByTestId('select-modal-rol'), { target: { value: 'ADMIN' } });

      fireEvent.click(screen.getByTestId('btn-guardar-usuario'));

      await waitFor(() => {
        expect(spyCrear).toHaveBeenCalledWith(
          expect.objectContaining({
            nombre: 'Loreto Aravena',
            email: 'loreto@milsabores.cl',
            rol: 'ADMIN'
          })
        );
      });

      expect(screen.getByText('Loreto Aravena')).toBeInTheDocument();
    });

    it('actualiza el rol y datos de un usuario llamando a usuarioService.actualizar', async () => {
      const spyActualizar = vi.spyOn(usuarioService, 'actualizar').mockResolvedValue({
        id: 2,
        nombre: 'Carlos Silva Promovido',
        rol: 'ADMIN'
      });

      renderConProviders(<AdminUsuarios />);

      await waitFor(() => {
        expect(screen.getByTestId('btn-editar-usuario-2')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('btn-editar-usuario-2'));

      fireEvent.change(screen.getByLabelText(/Nombre Completo/i), {
        target: { value: 'Carlos Silva Promovido' }
      });
      fireEvent.change(screen.getByTestId('select-modal-rol'), {
        target: { value: 'ADMIN' }
      });

      fireEvent.click(screen.getByTestId('btn-guardar-usuario'));

      await waitFor(() => {
        expect(spyActualizar).toHaveBeenCalledWith(
          2,
          expect.objectContaining({
            nombre: 'Carlos Silva Promovido',
            rol: 'ADMIN'
          })
        );
      });

      expect(screen.getByText('Carlos Silva Promovido')).toBeInTheDocument();
    });

    it('protege al administrador activo de ser auto-eliminado', async () => {
      const spyAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

      renderConProviders(<AdminUsuarios />);

      await waitFor(() => {
        expect(screen.getByTestId('btn-eliminar-usuario-1')).toBeInTheDocument();
      });

      // Intentar eliminar el usuario con ID 1 (admin activo)
      fireEvent.click(screen.getByTestId('btn-eliminar-usuario-1'));

      expect(screen.getByTestId('modal-eliminar-usuario')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('btn-confirmar-eliminar-usuario'));

      expect(spyAlert).toHaveBeenCalledWith(
        expect.stringContaining('no puedes eliminar la cuenta de administrador con la que iniciaste sesión')
      );
    });
  });

  describe('3. Gestión de Pedidos y Reportes Financieros (AdminReportes.jsx)', () => {
    it('renderiza indicadores financieros y lista de órdenes históricas', async () => {
      renderConProviders(<AdminReportes />);

      await waitFor(() => {
        expect(screen.getByTestId('admin-reportes')).toBeInTheDocument();
      });

      expect(screen.getByTestId('metric-ventas-totales')).toBeInTheDocument();
      expect(screen.getByTestId('metric-total-pedidos')).toBeInTheDocument();
      expect(screen.getByTestId('metric-ticket-promedio')).toBeInTheDocument();

      // Debe listar órdenes
      expect(screen.getByTestId('tabla-admin-ordenes')).toBeInTheDocument();
    });

    it('permite cambiar el estado de una orden interactivamente llamando a ordenService.cambiarEstado', async () => {
      const spyEstado = vi.spyOn(ordenService, 'cambiarEstado').mockResolvedValue(true);

      renderConProviders(<AdminReportes />);

      await waitFor(() => {
        expect(screen.getByTestId('select-estado-1')).toBeInTheDocument();
      });

      const selectEstado = screen.getByTestId('select-estado-1');
      fireEvent.change(selectEstado, { target: { value: 'En Reparto' } });

      await waitFor(() => {
        expect(spyEstado).toHaveBeenCalledWith(1, 'En Reparto');
      });
    });

    it('abre el modal con la boleta electrónica detallada al presionar el botón Boleta', async () => {
      renderConProviders(<AdminReportes />);

      await waitFor(() => {
        expect(screen.getByTestId('btn-ver-orden-1')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('btn-ver-orden-1'));

      expect(screen.getByTestId('modal-detalle-orden')).toBeInTheDocument();
      expect(screen.getByText(/Boleta Electrónica/i)).toBeInTheDocument();
      expect(screen.getByTestId('total-boleta-modal')).toBeInTheDocument();

      // Botón imprimir dentro del modal
      const spyPrint = vi.spyOn(window, 'print').mockImplementation(() => {});
      const btnImprimir = screen.getByRole('button', { name: /Imprimir Boleta/i });
      fireEvent.click(btnImprimir);
      expect(spyPrint).toHaveBeenCalled();
    });

    it('permite accionar la exportación de ventas a formato CSV', async () => {
      vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

      renderConProviders(<AdminReportes />);

      await waitFor(() => {
        expect(screen.getByTestId('btn-exportar-csv')).toBeInTheDocument();
      });

      const btnCsv = screen.getByTestId('btn-exportar-csv');
      fireEvent.click(btnCsv);

      // Debe mostrar toast de éxito
      await waitFor(() => {
        expect(screen.getByTestId('toast-exito-reporte')).toBeInTheDocument();
        expect(screen.getByText(/Reporte CSV descargado con éxito/i)).toBeInTheDocument();
      });
    });
  });
});
