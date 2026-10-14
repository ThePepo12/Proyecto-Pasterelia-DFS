import React from 'react';
import { render, screen } from '@testing-library/react';

// Componente básico de prueba para verificar el pipeline de Karma + Webpack + Babel
function SaludoPrueba({ nombre }) {
  return (
    <div className="alert alert-success">
      <h1>¡Entorno de Pruebas Configurado!</h1>
      <p>Bienvenido al sistema migrado, {nombre}.</p>
    </div>
  );
}

describe('Configuración del Entorno de Pruebas (Fase 1)', () => {
  it('debe ejecutar Jasmine en Karma correctamente', () => {
    expect(true).toBe(true);
  });

  it('debe renderizar un componente React y verificar sus props en el DOM', () => {
    render(<SaludoPrueba nombre="Duoc UC" />);
    
    const titulo = screen.getByText('¡Entorno de Pruebas Configurado!');
    const mensaje = screen.getByText(/Bienvenido al sistema migrado, Duoc UC/i);
    
    expect(titulo).not.toBeNull();
    expect(mensaje).not.toBeNull();
  });
});
