import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { Categorias } from '../pages/tienda/Categorias.jsx';
import { db } from '../data/db.js';

describe('1. Módulo de Catálogo y Productos', () => {
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

  it('Prueba 1: Carga y renderiza las tarjetas de categorías y productos iniciales', async () => {
    renderConProviders(<Categorias />);

    await waitFor(() => {
      expect(screen.getByTestId('grid-categorias')).toBeInTheDocument();
    });

    expect(screen.getAllByText('Tortas Cuadradas')[0]).toBeInTheDocument();
    expect(screen.getByText('Tortas Circulares')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('titulo-categoria-activa')).toHaveTextContent('Tortas Cuadradas');
      expect(screen.getByText(/Torta Cuadrada de Chocolate/i)).toBeInTheDocument();
    });
  });

  it('Prueba 2: Filtra productos en tiempo real mediante el buscador de texto', async () => {
    renderConProviders(<Categorias />);

    await waitFor(() => {
      expect(screen.getByText(/Torta Cuadrada de Chocolate/i)).toBeInTheDocument();
    });

    const inputBusqueda = screen.getByPlaceholderText(/Buscar por nombre, código o ingrediente/i);
    await userEvent.type(inputBusqueda, 'Frutas');

    await waitFor(() => {
      expect(screen.getByText(/Torta Cuadrada de Frutas/i)).toBeInTheDocument();
      expect(screen.queryByText(/Torta Cuadrada de Chocolate/i)).not.toBeInTheDocument();
    });
  });
});
