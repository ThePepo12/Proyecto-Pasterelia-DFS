/**
 * PRUEBAS: Vista de Contacto y Sucursales (Contacto.jsx)
 * 
 * Verifica:
 * 1. Renderiza el formulario de contacto con sus campos obligatorios.
 * 2. Valida el envío y muestra mensaje de éxito al completar los datos.
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Contacto } from '../pages/tienda/Contacto.jsx';

describe('5. Vista de Contacto y Sucursales', () => {
  it('Prueba 10: Renderiza el formulario de contacto y sus campos', () => {
    render(<Contacto />);
    expect(screen.getByRole('heading', { name: /Contáctanos & Sucursales/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ej: Francisco Morales/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/correo@ejemplo\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Cuéntanos fecha requerida/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enviar Mensaje/i })).toBeInTheDocument();
  });

  it('Prueba 11: Envía el formulario y muestra mensaje de confirmación en pantalla', () => {
    render(<Contacto />);

    const inputNombre = screen.getByPlaceholderText(/Ej: Francisco Morales/i);
    const inputEmail = screen.getByPlaceholderText(/correo@ejemplo\.com/i);
    const inputMensaje = screen.getByPlaceholderText(/Cuéntanos fecha requerida/i);
    const botonEnviar = screen.getByRole('button', { name: /Enviar Mensaje/i });

    fireEvent.change(inputNombre, { target: { value: 'Camila Soto' } });
    fireEvent.change(inputEmail, { target: { value: 'camila@duocuc.cl' } });
    fireEvent.change(inputMensaje, { target: { value: 'Consulta sobre pedido especial para boda' } });
    fireEvent.click(botonEnviar);

    expect(screen.getByText(/¡Mensaje enviado con éxito!/i)).toBeInTheDocument();
  });
});
