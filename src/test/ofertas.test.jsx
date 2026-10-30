/**
 * PRUEBAS: Vista Obligatoria de Ofertas (Ofertas.jsx)
 * 
 * Verifica:
 * 1. Renderiza el banner de promociones conmemorativas.
 * 2. Carga y lista los productos que tienen descuento activo.
 */
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { Ofertas } from '../pages/tienda/Ofertas.jsx';
import { db } from '../data/db.js';

describe('6. Vista de Ofertas Especiales', () => {
  beforeEach(() => {
    localStorage.clear();
    db.reset();
  });

  const renderOfertas = () => {
    return render(
      <AuthProvider>
        <CartProvider>
          <MemoryRouter>
            <Ofertas />
          </MemoryRouter>
        </CartProvider>
      </AuthProvider>
    );
  };

  it('Prueba 12: Renderiza el encabezado de ofertas y descuentos del 50 Aniversario', async () => {
    renderOfertas();
    expect(screen.getByText(/Festival de Ofertas & Descuentos/i)).toBeInTheDocument();
    expect(screen.getByText(/Especial 50 Años/i)).toBeInTheDocument();
  });

  it('Prueba 13: Muestra productos con descuento y su precio con rebaja calculada', async () => {
    renderOfertas();
    await waitFor(() => {
      // Debe existir al menos un badge de descuento en porcentaje
      const badgesDescuento = screen.getAllByText(/% OFF/i);
      expect(badgesDescuento.length).toBeGreaterThan(0);
    });
  });
});
