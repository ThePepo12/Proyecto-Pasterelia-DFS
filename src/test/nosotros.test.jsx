/**
 * PRUEBAS: Vista Institucional Nosotros (Nosotros.jsx)
 * 
 * Verifica:
 * 1. Renderiza el hero institucional de los 50 años de historia.
 * 2. Renderiza la sección del Récord Guinness de 1995 y la misión institucional.
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Nosotros } from '../pages/tienda/Nosotros.jsx';

describe('3. Vista Nosotros (Institucional)', () => {
  const renderNosotros = () => {
    return render(
      <MemoryRouter>
        <Nosotros />
      </MemoryRouter>
    );
  };

  it('Prueba 6: Renderiza el título de 50 años de tradición y la reseña histórica', () => {
    renderNosotros();
    expect(screen.getByRole('heading', { name: /50 Años de Tradición y Excelencia/i })).toBeInTheDocument();
    expect(screen.getByText(/Nuestra Historia \(1976 - 2026\)/i)).toBeInTheDocument();
  });

  it('Prueba 7: Muestra la mención del hito Récord Guinness de 1995', () => {
    renderNosotros();
    expect(screen.getByText(/Récord Guinness Mundial en 1995/i)).toBeInTheDocument();
    expect(screen.getByText(/torta de milhojas más grande del mundo/i)).toBeInTheDocument();
  });
});
