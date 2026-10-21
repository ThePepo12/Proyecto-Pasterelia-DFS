import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

describe('App y Enrutador Base Integrado', () => {
  it('renderiza la cabecera institucional y el título principal de la pastelería', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1, name: /Tradición, Pasión y Sabor/i });
    expect(heading).toBeInTheDocument();

    const brandLink = screen.getByRole('link', { name: /Mil Sabores/i });
    expect(brandLink).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /^Inicio$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Catálogo$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ofertas/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Carrito/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ingresar/i })).toBeInTheDocument();
  });

  it('renderiza la sección conmemorativa de 50 años', () => {
    render(<App />);
    expect(screen.getByText(/50 Años de Historia/i)).toBeInTheDocument();
    expect(screen.getByText(/Récord Guinness/i)).toBeInTheDocument();
  });

  it('renderiza el pie de página con créditos institucionales de Duoc UC', () => {
    render(<App />);
    expect(screen.getByText(/DSY1104 Desarrollo Fullstack II/i)).toBeInTheDocument();
  });
});
