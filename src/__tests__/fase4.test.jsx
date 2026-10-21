import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { Navbar } from '../components/common/Navbar.jsx';
import { Catalogo } from '../pages/tienda/Catalogo.jsx';
import { DetalleProducto } from '../pages/tienda/DetalleProducto.jsx';
import { Carrito } from '../pages/tienda/Carrito.jsx';
import { Registro } from '../pages/auth/Registro.jsx';
import { Login } from '../pages/auth/Login.jsx';
import { db } from '../data/db.js';

describe('FASE 4: Estructura Común y Vistas Blancas de la Tienda', () => {
  beforeEach(() => {
    localStorage.clear();
    db.reset();
  });

  const renderConProviders = (ui, { route = '/' } = {}) => {
    return render(
      <AuthProvider>
        <CartProvider>
          <MemoryRouter initialEntries={[route]}>
            {ui}
          </MemoryRouter>
        </CartProvider>
      </AuthProvider>
    );
  };

  describe('1. Navbar Común y Navegación', () => {
    it('renderiza la marca Mil Sabores y los enlaces principales de la tienda', () => {
      renderConProviders(<Navbar />);
      expect(screen.getByText(/Mil Sabores/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^Inicio$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^Catálogo$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Ofertas/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^Nosotros$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^Contacto$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^Seguimiento$/i })).toBeInTheDocument();
    });

    it('refleja el acceso al carrito en la cabecera', () => {
      renderConProviders(<Navbar />);
      expect(screen.getByRole('link', { name: /Carrito/i })).toBeInTheDocument();
      expect(screen.queryByTestId('contador-carrito')).not.toBeInTheDocument();
    });
  });

  describe('2. Catálogo de Productos y Filtros Reactivos (Catalogo.jsx)', () => {
    it('muestra los productos iniciales y filtra por buscador en tiempo real', async () => {
      renderConProviders(<Catalogo />);

      // Debe mostrar el contador de productos iniciales
      await waitFor(() => {
        expect(screen.getByText(/Torta Cuadrada de Chocolate/i)).toBeInTheDocument();
      });

      const inputBusqueda = screen.getByPlaceholderText(/Buscar por nombre/i);
      await userEvent.type(inputBusqueda, 'Mousse');

      // Solo debe quedar visible el mousse de chocolate
      await waitFor(() => {
        expect(screen.getByText(/Mousse de Chocolate/i)).toBeInTheDocument();
        expect(screen.queryByText(/Torta Circular de Vainilla/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('3. Detalle de Producto y Cálculo Dinámico de Precios', () => {
    it('ajusta dinámicamente el precio al cambiar el selector de tamaño', async () => {
      renderConProviders(<DetalleProducto />, { route: '/producto/TE001' });

      // Esperar que cargue el producto por defecto (Torta Especial Cumpleaños - Base $55.000)
      await waitFor(() => {
        expect(screen.getAllByText(/Torta Especial de Cumpleaños/i)[0]).toBeInTheDocument();
      });

      const selectorTamano = screen.getByLabelText(/Seleccionar tamaño/i);
      expect(selectorTamano).toBeInTheDocument();

      // Cambiar a tamaño Chica (75% de $55.000 = $41.250)
      fireEvent.change(selectorTamano, { target: { value: 'Chica' } });
      expect(screen.getByTestId('precio-dinamico')).toHaveTextContent('$41.250 CLP');

      // Cambiar a tamaño Grande (130% de $55.000 = $71.500)
      fireEvent.change(selectorTamano, { target: { value: 'Grande' } });
      expect(screen.getByTestId('precio-dinamico')).toHaveTextContent('$71.500 CLP');
    });
  });

  describe('4. Registro de Usuario y Cálculo Reactivo de Edad', () => {
    it('desbloquea el beneficio Senior automáticamente si la fecha indica 50 o más años', async () => {
      renderConProviders(<Registro />);

      const inputFecha = screen.getByLabelText(/Fecha de Nacimiento/i);
      // Simular persona nacida en 1965 (61 años)
      fireEvent.change(inputFecha, { target: { value: '1965-03-20' } });

      await waitFor(() => {
        expect(screen.getByTestId('alerta-senior')).toBeInTheDocument();
        expect(screen.getByText(/50% de descuento de por vida/i)).toBeInTheDocument();
      });
    });
  });

  describe('5. Formulario de Inicio de Sesión (Login.jsx)', () => {
    it('valida campos obligatorios y muestra error si se envía vacío', async () => {
      renderConProviders(<Login />);

      const botonSubmit = screen.getByRole('button', { name: /Ingresar a mi Cuenta/i });
      fireEvent.click(botonSubmit);

      await waitFor(() => {
        expect(screen.getByText(/Por favor completa todos los campos/i)).toBeInTheDocument();
      });
    });
  });

  describe('6. Carrito de Compras Vacío y con Ítems', () => {
    it('muestra el estado vacío con llamado a la acción cuando no hay productos', () => {
      renderConProviders(<Carrito />);
      expect(screen.getByText(/Tu carrito está actualmente vacío/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Ir al Catálogo de Productos/i })).toBeInTheDocument();
    });
  });
});
