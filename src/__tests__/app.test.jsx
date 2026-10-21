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

    expect(screen.getAllByRole('link', { name: /^Inicio$/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /^Catálogo$/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Ofertas/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Carrito/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Ingresar/i })[0]).toBeInTheDocument();
  });

  it('renderiza la sección conmemorativa de 50 años', () => {
    render(<App />);
    expect(screen.getAllByText(/50 Años de Historia/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Récord Guinness/i)[0]).toBeInTheDocument();
  });

  it('renderiza el pie de página con créditos institucionales de Duoc UC', () => {
    render(<App />);
    expect(screen.getByText(/DSY1104 Desarrollo Fullstack II/i)).toBeInTheDocument();
  });
});
