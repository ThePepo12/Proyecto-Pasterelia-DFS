/**
 * PRUEBAS: Pie de Página Común (Footer.jsx)
 * 
 * Verifica:
 * 1. Muestra la historia conmemorativa de los 50 años.
 * 2. Renderiza la lista de enlaces institucionales de navegación rápida.
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from '../components/common/Footer.jsx';

describe('2. Componente Footer', () => {
  const renderFooter = () => {
    return render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
  };

  it('Prueba 4: Renderiza el título corporativo y la mención de los 50 años', () => {
    renderFooter();
    expect(screen.getByRole('heading', { name: /Pastelería Mil Sabores/i })).toBeInTheDocument();
    expect(screen.getByText(/50 Años endulzando los mejores momentos/i)).toBeInTheDocument();
  });

  it('Prueba 5: Muestra los enlaces de navegación y los beneficios de la pastelería', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: /^Inicio$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Recetas y Blog/i })).toBeInTheDocument();
    expect(screen.getByText(/50% Adulto Mayor/i)).toBeInTheDocument();
  });
});
