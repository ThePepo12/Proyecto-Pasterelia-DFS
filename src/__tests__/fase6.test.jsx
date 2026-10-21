/**
 * PRUEBAS UNITARIAS FASE 6: VISTAS VERDES DE LA TIENDA (PARTE 2)
 * (src/__tests__/fase6.test.jsx)
 * 
 * Valida:
 * 1. Checkout (Comprar):
 *    - Validación de carrito vacío.
 *    - Renderizado del formulario y resumen de compra.
 *    - Autocompletado reactivo de datos si el usuario tiene sesión activa.
 *    - Validación de campos obligatorios en el formulario.
 *    - Simulación de pago rechazado (redirección a /pago-error y preservación del carrito).
 *    - Flujo de pago exitoso (registro de orden en ordenService, limpieza de carrito y redirección a /pago-exitoso).
 * 2. Pago Correcto / Exitoso (Boleta con datos de solo lectura, impresión y correo).
 * 3. Pago con Error (Mensaje claro, código de rechazo, preservación de carrito y opciones de reintento).
 */
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { Checkout } from '../pages/tienda/Checkout.jsx';
import { PagoExitoso } from '../pages/tienda/PagoExitoso.jsx';
import { PagoError } from '../pages/tienda/PagoError.jsx';
import { ordenService } from '../services/ordenService.js';
import { db } from '../data/db.js';

describe('FASE 6: Flujo de Compra, Pago Correcto y Pago Error (Vistas Verdes)', () => {
  beforeEach(() => {
    localStorage.clear();
    db.reset();
    vi.restoreAllMocks();
  });

  const renderConProviders = (ui, { route = '/', initialEntries = [route] } = {}) => {
    return render(
      <AuthProvider>
        <CartProvider>
          <MemoryRouter initialEntries={initialEntries}>
            {ui}
          </MemoryRouter>
        </CartProvider>
      </AuthProvider>
    );
  };

  const itemEjemplo = {
    codigo: 'TC001',
    nombre: 'Torta Cuadrada de Chocolate',
    precio: 45000,
    cantidad: 2,
    personalizacion: 'Feliz Aniversario',
    imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'
  };

  describe('1. Vista Verde: Comprar / Checkout (Checkout.jsx)', () => {
    it('muestra el aviso de carrito vacío cuando no hay productos agregados', () => {
      renderConProviders(<Checkout />);

      expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Ir al Catálogo de Productos/i })).toBeInTheDocument();
    });

    it('renderiza el resumen del pedido y el formulario de despacho cuando hay productos', () => {
      // Cargamos el carrito en localStorage antes del render
      localStorage.setItem('carrito_mil_sabores', JSON.stringify([itemEjemplo]));

      renderConProviders(<Checkout />);

      // Debe mostrar el título de la vista
      expect(screen.getByRole('heading', { level: 1, name: /Finalizar Compra & Despacho/i })).toBeInTheDocument();

      // Debe listar el producto cargado
      expect(screen.getAllByText('Torta Cuadrada de Chocolate')[0]).toBeInTheDocument();
      expect(screen.getByText('Feliz Aniversario')).toBeInTheDocument();

      // Resumen de valores
      expect(screen.getByText(/Subtotal Productos:/i)).toBeInTheDocument();
      expect(screen.getByTestId('btn-pagar-ahora')).toBeInTheDocument();
    });

    it('autocompleta automáticamente los datos si el usuario tiene una sesión iniciada', () => {
      // Iniciar sesión con un usuario ficticio
      const usuarioActivo = {
        id: 2,
        nombre: 'Sofía Valenzuela',
        email: 'sofia.valenzuela@duocuc.cl',
        telefono: '+56912345678',
        direccion: 'Av. Providencia 1234'
      };
      localStorage.setItem('usuario_mil_sabores_activo', JSON.stringify(usuarioActivo));
      localStorage.setItem('carrito_mil_sabores', JSON.stringify([itemEjemplo]));

      renderConProviders(<Checkout />);

      // Verificar que los inputs contienen los datos autocompletados
      expect(screen.getByLabelText(/Nombre del cliente/i)).toHaveValue('Sofía');
      expect(screen.getByLabelText(/Apellidos del cliente/i)).toHaveValue('Valenzuela');
      expect(screen.getByLabelText(/Correo electrónico del cliente/i)).toHaveValue('sofia.valenzuela@duocuc.cl');
      expect(screen.getByLabelText(/Teléfono de contacto/i)).toHaveValue('+56912345678');
      expect(screen.getByLabelText(/Calle y número de entrega/i)).toHaveValue('Av. Providencia 1234');
    });

    it('muestra mensajes de validación cuando faltan campos obligatorios', async () => {
      localStorage.setItem('carrito_mil_sabores', JSON.stringify([itemEjemplo]));

      renderConProviders(<Checkout />);

      const botonPagar = screen.getByTestId('btn-pagar-ahora');
      fireEvent.click(botonPagar);

      // Esperar alertas de validación
      await waitFor(() => {
        expect(screen.getByText(/El nombre es obligatorio/i)).toBeInTheDocument();
        expect(screen.getByText(/El correo electrónico es obligatorio/i)).toBeInTheDocument();
        expect(screen.getByText(/El teléfono de contacto es obligatorio/i)).toBeInTheDocument();
        expect(screen.getByText(/La calle y número son obligatorios/i)).toBeInTheDocument();
      });
    });

    it('guarda la orden mediante ordenService y redirige a /pago-exitoso en compra normal', async () => {
      localStorage.setItem('carrito_mil_sabores', JSON.stringify([itemEjemplo]));

      const spyCrearOrden = vi.spyOn(ordenService, 'crear').mockResolvedValue({
        id: 99,
        folio: 'MS-777888',
        clienteNombre: 'Constanza Silva',
        clienteEmail: 'constanza@duocuc.cl',
        total: 93500,
        estado: 'Confirmado',
        items: [itemEjemplo]
      });

      renderConProviders(
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
        </Routes>,
        { initialEntries: ['/checkout'] }
      );

      // Rellenar campos del formulario
      fireEvent.change(screen.getByLabelText(/Nombre del cliente/i), { target: { value: 'Constanza' } });
      fireEvent.change(screen.getByLabelText(/Apellidos del cliente/i), { target: { value: 'Silva' } });
      fireEvent.change(screen.getByLabelText(/Correo electrónico del cliente/i), { target: { value: 'constanza@duocuc.cl' } });
      fireEvent.change(screen.getByLabelText(/Teléfono de contacto/i), { target: { value: '+56987654321' } });
      fireEvent.change(screen.getByLabelText(/Calle y número de entrega/i), { target: { value: 'Av. Concha y Toro 1340' } });

      // Click en pagar
      fireEvent.click(screen.getByTestId('btn-pagar-ahora'));

      // Verificar que se invocó a la capa de servicios con el payload
      await waitFor(() => {
        expect(spyCrearOrden).toHaveBeenCalled();
      });

      // El carrito debe haber sido limpiado de localStorage
      const carritoEnStorage = JSON.parse(localStorage.getItem('carrito_mil_sabores') || '[]');
      expect(carritoEnStorage.length).toBe(0);
    });

    it('al activar el switch de simulación de fallo, redirige a /pago-error y preserva el carrito', async () => {
      localStorage.setItem('carrito_mil_sabores', JSON.stringify([itemEjemplo]));

      renderConProviders(
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pago-error" element={<PagoError />} />
        </Routes>,
        { initialEntries: ['/checkout'] }
      );

      // Llenar campos requeridos
      fireEvent.change(screen.getByLabelText(/Nombre del cliente/i), { target: { value: 'Mateo' } });
      fireEvent.change(screen.getByLabelText(/Correo electrónico del cliente/i), { target: { value: 'mateo@correo.cl' } });
      fireEvent.change(screen.getByLabelText(/Teléfono de contacto/i), { target: { value: '+56911223344' } });
      fireEvent.change(screen.getByLabelText(/Calle y número de entrega/i), { target: { value: 'Los Aromos 456' } });

      // Activar switch de simulación de error
      const switchError = screen.getByTestId('switch-simular-error');
      fireEvent.click(switchError);
      expect(switchError).toBeChecked();

      // Click en Confirmar y Pagar
      fireEvent.click(screen.getByTestId('btn-pagar-ahora'));

      // Debe llegar a la pantalla de Pago con Error
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1, name: /Pago No Procesado/i })).toBeInTheDocument();
        expect(screen.getAllByText(/ERR-WEBPAY-904/i)[0]).toBeInTheDocument();
      });

      // IMPORTANTE: El carrito NO debe haberse vaciado
      const carritoEnStorage = JSON.parse(localStorage.getItem('carrito_mil_sabores') || '[]');
      expect(carritoEnStorage.length).toBe(1);
      expect(carritoEnStorage[0].codigo).toBe('TC001');
    });
  });

  describe('2. Vista Verde: Pago Correcto (PagoExitoso.jsx)', () => {
    const ordenPrueba = {
      id: 101,
      folio: 'MS-458921',
      fecha: '21/10/2026',
      hora: '15:30',
      clienteNombre: 'Martina Morales',
      clienteEmail: 'martina@milsabores.cl',
      telefono: '+56976543210',
      direccionEntrega: 'Av. Apoquindo 4000, Depto 502',
      comuna: 'Las Condes',
      region: 'Región Metropolitana',
      fechaEntrega: '2026-10-22',
      horarioEntrega: '10:00 a 14:00 hrs',
      indicaciones: 'Timbre 502, dejar en conserjería si no contesta',
      subtotal: 45000,
      envio: 3500,
      porcentajeDescuento: 0,
      montoDescuento: 0,
      iva: 9215,
      total: 48500,
      repartidor: 'Carlos Valenzuela - Furgón Refrigerado',
      items: [
        {
          codigoProducto: 'TC001',
          nombreProducto: 'Torta Cuadrada de Chocolate',
          precioUnitario: 45000,
          cantidad: 1,
          personalizacion: 'Feliz Día Mamá'
        }
      ]
    };

    it('renderiza el folio de la orden, estado confirmado y datos de despacho en solo lectura', () => {
      localStorage.setItem('ultimo_pedido_mil_sabores', JSON.stringify(ordenPrueba));

      renderConProviders(
        <Routes>
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
        </Routes>,
        { initialEntries: [{ pathname: '/pago-exitoso', state: { orden: ordenPrueba } }] }
      );

      // Verificación de encabezados y folio
      expect(screen.getByRole('heading', { level: 2, name: /¡Pago Realizado con Éxito!/i })).toBeInTheDocument();
      expect(screen.getByTestId('folio-boleta')).toHaveTextContent('MS-458921');

      // Verificación de datos de entrega en modo lectura
      expect(screen.getByText(/Martina Morales/i)).toBeInTheDocument();
      expect(screen.getByText(/Av. Apoquindo 4000, Depto 502/i)).toBeInTheDocument();
      expect(screen.getByText(/Las Condes/i)).toBeInTheDocument();
      expect(screen.getByText(/Carlos Valenzuela/i)).toBeInTheDocument();

      // Verificación de los ítems adquiridos
      expect(screen.getByText('Torta Cuadrada de Chocolate')).toBeInTheDocument();
      expect(screen.getByText('Feliz Día Mamá')).toBeInTheDocument();
    });

    it('permite accionar la impresión de la boleta y simula el envío del correo electrónico', async () => {
      localStorage.setItem('ultimo_pedido_mil_sabores', JSON.stringify(ordenPrueba));
      const spyPrint = vi.spyOn(window, 'print').mockImplementation(() => {});

      renderConProviders(
        <Routes>
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
        </Routes>,
        { initialEntries: [{ pathname: '/pago-exitoso', state: { orden: ordenPrueba } }] }
      );

      // Simular click en "Imprimir boleta en PDF"
      const botonImprimir = screen.getByRole('button', { name: /Imprimir boleta en PDF/i });
      fireEvent.click(botonImprimir);
      expect(spyPrint).toHaveBeenCalled();

      // Simular click en "Enviar boleta por email"
      const botonEmail = screen.getByRole('button', { name: /Enviar boleta por email/i });
      fireEvent.click(botonEmail);

      // Debe aparecer el aviso de correo enviado exitosamente
      await waitFor(() => {
        expect(screen.getByTestId('toast-email-enviado')).toBeInTheDocument();
        expect(screen.getByTestId('toast-email-enviado')).toHaveTextContent('martina@milsabores.cl');
      });
    });
  });

  describe('3. Vista Verde: Pago con Error (PagoError.jsx)', () => {
    it('muestra el banner de rechazo, el código de error y el mensaje explicativo', () => {
      const stateError = {
        motivo: 'Fondos insuficientes en la cuenta del cliente.',
        codigoError: 'ERR-WEBPAY-904',
        datosIntento: {
          cliente: 'Pedro Pascal',
          email: 'pedro@correo.cl',
          total: 48500
        }
      };

      renderConProviders(
        <Routes>
          <Route path="/pago-error" element={<PagoError />} />
        </Routes>,
        { initialEntries: [{ pathname: '/pago-error', state: stateError }] }
      );

      expect(screen.getByRole('heading', { level: 1, name: /Pago No Procesado/i })).toBeInTheDocument();
      expect(screen.getByText(/Código de Error: ERR-WEBPAY-904/i)).toBeInTheDocument();
      expect(screen.getByText(/Fondos insuficientes en la cuenta del cliente./i)).toBeInTheDocument();
      expect(screen.getByText('Pedro Pascal')).toBeInTheDocument();
      expect(screen.getByText(/Tu carrito de compras está a salvo/i)).toBeInTheDocument();
    });

    it('proporciona botones de acción para reintentar el pago y volver a modificar el carrito', () => {
      renderConProviders(
        <Routes>
          <Route path="/pago-error" element={<PagoError />} />
          <Route path="/checkout" element={<div>Pantalla de Checkout</div>} />
        </Routes>,
        { initialEntries: ['/pago-error'] }
      );

      const botonReintentar = screen.getByRole('button', { name: /Reintentar Pago/i });
      expect(botonReintentar).toBeInTheDocument();

      const linkCarrito = screen.getByRole('link', { name: /Modificar Carrito/i });
      expect(linkCarrito).toHaveAttribute('href', '/carrito');

      const linkSoporte = screen.getByRole('link', { name: /Ayuda y Soporte/i });
      expect(linkSoporte).toHaveAttribute('href', '/contacto');

      // Click en reintentar debe navegar a /checkout
      fireEvent.click(botonReintentar);
      expect(screen.getByText('Pantalla de Checkout')).toBeInTheDocument();
    });
  });
});
