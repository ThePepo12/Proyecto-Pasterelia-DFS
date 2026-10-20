import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

function SaludoPasteleria({ titulo }) {
  return (
    <div className="card text-center p-3 bg-dark text-light border-warning">
      <h2 className="text-warning">{titulo}</h2>
      <p className="mb-0 text-white">Tradición de 50 años en repostería fina.</p>
    </div>
  );
}

describe('Fase 1: Sanidad y entorno de pruebas con Vitest', () => {
  it('el entorno de pruebas Vitest se encuentra activo y resuelve aserciones matemáticas', () => {
    expect(25 + 25).toBe(50);
  });

  it('renderiza un componente React con Bootstrap y valida texto en el DOM', () => {
    render(<SaludoPasteleria titulo="Pastelería Mil Sabores" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Pastelería Mil Sabores');
    expect(heading).toHaveClass('text-warning');
  });

  it('reconoce aserciones semánticas de jest-dom en español', () => {
    render(<SaludoPasteleria titulo="Catálogo de Productos" />);
    const parrafo = screen.getByText(/Tradición de 50 años/i);
    expect(parrafo).toBeVisible();
    expect(parrafo).toHaveClass('text-white');
  });
});
