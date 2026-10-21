/**
 * PRUEBAS UNITARIAS FASE 5: VISTAS VERDES DE LA TIENDA (PARTE 1)
 * (src/__tests__/fase5.test.jsx)
 * 
 * Valida:
 * 1. Categorías -> Categoría #1: grid de categorías, selección interactiva y carga de productos.
 * 2. Filtros de búsqueda en tiempo real (por texto y por forma).
 * 3. Ofertas: renderizado de productos con descuento, precio original tachado y precio promocional.
 * 4. Detalle de Producto: dedicatoria personalizada y adición reactiva al carrito.
 */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { CartProvider, useCarrito } from '../context/CartContext.jsx';
import { Categorias } from '../pages/tienda/Categorias.jsx';
import { Ofertas } from '../pages/tienda/Ofertas.jsx';
import { DetalleProducto } from '../pages/tienda/DetalleProducto.jsx';
import { db } from '../data/db.js';

describe('FASE 5: Vistas Verdes de la Tienda (Categorías, Ofertas y Detalle)', () => {
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

  describe('1. Vista Verde: Categorías -> Categoría #1 (Categorias.jsx)', () => {
    it('renderiza las 8 tarjetas de categorías y selecciona la primera por defecto', async () => {
      renderConProviders(<Categorias />);

      // Esperar a que se carguen las categorías
      await waitFor(() => {
        expect(screen.getByTestId('grid-categorias')).toBeInTheDocument();
      });

      // Validar que se muestran las tarjetas de categorías principales
      expect(screen.getAllByText('Tortas Cuadradas')[0]).toBeInTheDocument();
      expect(screen.getByText('Tortas Circulares')).toBeInTheDocument();
      expect(screen.getByText('Postres Individuales')).toBeInTheDocument();
      expect(screen.getByText('Tortas Especiales')).toBeInTheDocument();

      // Por defecto carga los productos de la Categoría #1 (Tortas Cuadradas)
      await waitFor(() => {
        expect(screen.getByTestId('titulo-categoria-activa')).toHaveTextContent('Tortas Cuadradas');
        expect(screen.getByText(/Torta Cuadrada de Chocolate/i)).toBeInTheDocument();
        expect(screen.getByText(/Torta Cuadrada de Frutas/i)).toBeInTheDocument();
      });
    });

    it('cambia reactivamente de categoría al hacer clic en otra tarjeta', async () => {
      renderConProviders(<Categorias />);

      await waitFor(() => {
        expect(screen.getByTestId('grid-categorias')).toBeInTheDocument();
      });

      // Hacer clic en la tarjeta de Postres Individuales (id 3)
      const tarjetaPostres = screen.getByTestId('categoria-card-3');
      fireEvent.click(tarjetaPostres);

      // Debe actualizarse el título y cargar productos de esa categoría
      await waitFor(() => {
        expect(screen.getByTestId('titulo-categoria-activa')).toHaveTextContent('Postres Individuales');
        expect(screen.getByText(/Mousse de Chocolate/i)).toBeInTheDocument();
        expect(screen.getByText(/Tiramisú Clásico/i)).toBeInTheDocument();
        expect(screen.queryByText(/Torta Cuadrada de Chocolate/i)).not.toBeInTheDocument();
      });
    });

    it('filtra productos en tiempo real mediante el buscador de texto', async () => {
      renderConProviders(<Categorias />);

      await waitFor(() => {
        expect(screen.getByText(/Torta Cuadrada de Chocolate/i)).toBeInTheDocument();
      });

      const inputBusqueda = screen.getByPlaceholderText(/Buscar por nombre, código o ingrediente/i);
      await userEvent.type(inputBusqueda, 'Frutas');

      // Solo debe permanecer visible la torta de frutas
      await waitFor(() => {
        expect(screen.getByText(/Torta Cuadrada de Frutas/i)).toBeInTheDocument();
        expect(screen.queryByText(/Torta Cuadrada de Chocolate/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('2. Vista Verde: Catálogo de Ofertas (Ofertas.jsx)', () => {
    it('muestra el banner promocional y la lista de productos con descuento activo', async () => {
      renderConProviders(<Ofertas />);

      // Verificar encabezado y banner
      expect(screen.getByText(/Festival de Ofertas & Descuentos/i)).toBeInTheDocument();
      expect(screen.getByText(/Especial 50 Años/i)).toBeInTheDocument();

      // Esperar a que cargue la lista de ofertas
      await waitFor(() => {
        expect(screen.getByTestId('lista-ofertas')).toBeInTheDocument();
      });

      // Productos en oferta sembrados (TC001, TT001, PI002, PSA002, PV001)
      expect(screen.getByText(/Torta Cuadrada de Chocolate/i)).toBeInTheDocument();
      expect(screen.getByText(/Tiramisú Clásico/i)).toBeInTheDocument();

      // Debe exhibir badges de porcentaje de descuento
      expect(screen.getAllByText(/-10% OFF/i)[0]).toBeInTheDocument();
    });

    it('exhibe el precio regular tachado y el precio de oferta en CLP', async () => {
      renderConProviders(<Ofertas />);

      await waitFor(() => {
        expect(screen.getByTestId('precio-oferta-TC001')).toBeInTheDocument();
      });

      // Torta Cuadrada de Chocolate (Oferta: $45.000 CLP, regular: $49.500 CLP)
      expect(screen.getByTestId('precio-oferta-TC001')).toHaveTextContent('$45.000 CLP');
      expect(screen.getByTestId('precio-original-TC001')).toHaveTextContent('$49.500 CLP');
    });

    it('filtra ofertas interactivamente según el buscador textual', async () => {
      renderConProviders(<Ofertas />);

      await waitFor(() => {
        expect(screen.getByTestId('lista-ofertas')).toBeInTheDocument();
      });

      const inputFiltro = screen.getByPlaceholderText(/Ej: Chocolate, Tiramisú, Naranja/i);
      await userEvent.type(inputFiltro, 'Tiramisú');

      await waitFor(() => {
        expect(screen.getByText(/Tiramisú Clásico/i)).toBeInTheDocument();
        expect(screen.queryByText(/Torta Cuadrada de Chocolate/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('3. Detalle de Producto con Dedicatoria y Adición al Carrito', () => {
    // Componente espía para verificar el estado interno del carrito
    function CarritoInspector() {
      const { carrito, totalItems } = useCarrito();
      return (
        <div data-testid="inspector-carrito">
          <span data-testid="items-count">{totalItems}</span>
          {carrito.map((it, idx) => (
            <div key={idx} data-testid={`cart-item-${idx}`}>
              <span>{it.nombre}</span>
              <span>{it.personalizacion}</span>
            </div>
          ))}
        </div>
      );
    }

    it('agrega al carrito con tamaño, forma y dedicatoria personalizada', async () => {
      render(
        <AuthProvider>
          <CartProvider>
            <MemoryRouter initialEntries={['/producto/TE001']}>
              <DetalleProducto />
              <CarritoInspector />
            </MemoryRouter>
          </CartProvider>
        </AuthProvider>
      );

      // Esperar a que cargue el producto
      await waitFor(() => {
        expect(screen.getAllByText(/Torta Especial de Cumpleaños/i)[0]).toBeInTheDocument();
      });

      // Escribir dedicatoria
      const inputDedicatoria = screen.getByPlaceholderText(/¡Feliz Aniversario Mamá!/i);
      await userEvent.type(inputDedicatoria, 'Feliz Jubilación Carmen');

      // Seleccionar forma Cuadrada
      const selectForma = screen.getByLabelText(/Seleccionar forma/i);
      fireEvent.change(selectForma, { target: { value: 'Cuadrada' } });

      // Hacer clic en Añadir al Carrito
      const btnAgregar = screen.getByRole('button', { name: /Añadir al Carrito/i });
      fireEvent.click(btnAgregar);

      // Verificar que el carrito ahora tiene 1 ítem con los datos personalizados
      await waitFor(() => {
        expect(screen.getByTestId('items-count')).toHaveTextContent('1');
        expect(screen.getByTestId('cart-item-0')).toHaveTextContent('Feliz Jubilación Carmen');
      });
    });
  });
});
