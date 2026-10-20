import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

describe('App y Enrutador Base (Fase 1)', () => {
  it('renderiza la cabecera institucional y el título principal', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1, name: /Pastelería Mil Sabores/i });
    expect(heading).toBeInTheDocument();

    const brandLink = screen.getByRole('link', { name: /Pastelería Mil Sabores/i });
    expect(brandLink).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /^Catálogo$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Ofertas$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Carrito$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Ingresar$/i })).toBeInTheDocument();
  });

  it('muestra el banner de confirmación de Fase 1 con Vitest', () => {
    render(<App />);
    expect(screen.getByText(/Fase 1 Completada con Éxito/i)).toBeInTheDocument();
    expect(screen.getByText(/Vitest/i)).toBeInTheDocument();
  });

  it('renderiza el pie de página con créditos institucionales de Duoc UC', () => {
    render(<App />);
    expect(screen.getByText(/DSY1104 Desarrollo Fullstack II \(Duoc UC\)/i)).toBeInTheDocument();
  });
});
