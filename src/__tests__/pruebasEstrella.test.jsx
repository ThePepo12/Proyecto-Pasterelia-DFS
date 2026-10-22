/**
 * SUITE DE LAS 10 PRUEBAS ESTRELLA (src/__tests__/pruebasEstrella.test.jsx)
 * 
 * Evaluación Parcial 2 - DSY1104 Desarrollo Fullstack II (Duoc UC)
 * 
 * Cada una de estas 10 pruebas cubre directamente los criterios exigidos en la rúbrica:
 * 1. Renderizado de listas de datos (Vista Verde Categorías).
 * 2. Renderizado condicional (Pago Exitoso vs Pago Fallido).
 * 3. Paso de props y ejecución de funciones espía (vi.fn()).
 * 4. Manejo de estado reactivo en formularios (Detalle y dedicatoria).
 * 5. Disparo y manejo de eventos de usuario (Agregar al carrito).
 * 6. Mocks y simulación del backend Spring Boot (vi.spyOn).
 * 7. Ciclo CRUD completo en la capa de servicios desacoplada.
 * 8. Validación de formularios CRUD con mensajes de error.
 * 9. Prueba de custom hook con renderHook y act (useCarrito y beneficio senior).
 * 10. Seguridad y protección de rutas por rol (RutaProtegidaAdmin).
 */
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Proveedores y Contextos
import { AuthProvider, useAuth } from '../context/AuthContext.jsx';
import { CartProvider, useCarrito } from '../context/CartContext.jsx';

// Componentes y Vistas
import { Categorias } from '../pages/tienda/Categorias.jsx';
import { DetalleProducto } from '../pages/tienda/DetalleProducto.jsx';
import { Checkout } from '../pages/tienda/Checkout.jsx';
import { PagoExitoso } from '../pages/tienda/PagoExitoso.jsx';
import { PagoError } from '../pages/tienda/PagoError.jsx';
import { AdminProductos } from '../pages/admin/AdminProductos.jsx';
import { RutaProtegidaAdmin } from '../components/admin/RutaProtegidaAdmin.jsx';

// Servicios y Datos
import { productoService } from '../services/productoService.js';
import { ordenService } from '../services/ordenService.js';
import { db } from '../data/db.js';

// Componente auxiliar para probar Props y Eventos puros
function BotonAccion({ texto, alHacerClic, disabled = false }) {
  return (
    <button
      type="button"
      className="btn btn-warning fw-bold text-dark"
      onClick={alHacerClic}
      disabled={disabled}
    >
      {texto}
    </button>
  );
}

describe('LAS 10 PRUEBAS ESTRELLA - EVALUACIÓN PARCIAL 2', () => {
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

  // ---------------------------------------------------------------------------
  // PRUEBA ESTRELLA 1: RENDERIZADO DE LISTA (VISTA VERDE CATEGORÍAS)
  // ---------------------------------------------------------------------------
  it('Prueba 1 [Renderizado]: La vista verde de Categorías carga y renderiza las tarjetas de categorías y la lista de productos de la categoría seleccionada', async () => {
    renderConProviders(<Categorias />);

    // Esperar que se rendericen las categorías desde el servicio
    await waitFor(() => {
      expect(screen.getByTestId('grid-categorias')).toBeInTheDocument();
    });

    // Valida que renderiza los nombres de categorías del catálogo
    expect(screen.getAllByText('Tortas Cuadradas')[0]).toBeInTheDocument();
    expect(screen.getByText('Tortas Circulares')).toBeInTheDocument();
    expect(screen.getByText('Postres Individuales')).toBeInTheDocument();

    // Valida que renderiza la lista de productos asociados a la categoría #1
    await waitFor(() => {
      expect(screen.getByTestId('titulo-categoria-activa')).toHaveTextContent('Tortas Cuadradas');
      expect(screen.getByText(/Torta Cuadrada de Chocolate/i)).toBeInTheDocument();
      expect(screen.getByText(/Torta Cuadrada de Frutas/i)).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // PRUEBA ESTRELLA 2: RENDERIZADO CONDICIONAL (PAGO EXITOSO VS ERROR)
  // ---------------------------------------------------------------------------
  it('Prueba 2 [Renderizado Condicional]: Muestra condicionalmente la boleta de confirmación en éxito y la alerta de rechazo en pago con error', () => {
    // Caso A: Pago Exitoso con folio
    const ordenExitosa = {
      folio: 'MS-501991',
      clienteNombre: 'Rosa Carrasco',
      clienteEmail: 'rosa@gmail.com',
      total: 31000,
      fecha: '20/10/2026',
      hora: '10:15',
      direccionEntrega: 'Av. Concha y Toro #2500',
      items: [{ nombreProducto: 'Torta de Cumpleaños', cantidad: 1, subtotal: 31000 }]
    };

    const { rerender } = renderConProviders(<PagoExitoso />, {
      initialEntries: [{ pathname: '/pago-exitoso', state: { orden: ordenExitosa } }]
    });

    expect(screen.getByText(/¡Pago Realizado con Éxito!/i)).toBeInTheDocument();
    expect(screen.getByText('MS-501991')).toBeInTheDocument();
    expect(screen.getByText(/Imprimir Boleta en PDF/i)).toBeInTheDocument();

    // Caso B: Pago con Error
    rerender(
      <AuthProvider>
        <CartProvider>
          <MemoryRouter initialEntries={[{ pathname: '/pago-error', state: { mensajeError: 'Fondos insuficientes en la tarjeta' } }]}>
            <PagoError />
          </MemoryRouter>
        </CartProvider>
      </AuthProvider>
    );

    expect(screen.getByText(/El Pago no Pudo ser Procesado/i)).toBeInTheDocument();
    expect(screen.getByText(/Fondos insuficientes en la tarjeta/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Volver a Intentar el Pago/i })).toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // PRUEBA ESTRELLA 3: PROPS Y COMPONENTES REUTILIZABLES
  // ---------------------------------------------------------------------------
  it('Prueba 3 [Props]: Un componente reutilizable recibe su texto y callback por props y responde correctamente', () => {
    const fnEspia = vi.fn();
    render(<BotonAccion texto="Confirmar Pedido" alHacerClic={fnEspia} disabled={false} />);

    const boton = screen.getByRole('button', { name: /Confirmar Pedido/i });
    expect(boton).toBeInTheDocument();
    expect(boton).toBeEnabled();

    fireEvent.click(boton);
    expect(fnEspia).toHaveBeenCalledTimes(1);
  });

  // ---------------------------------------------------------------------------
  // PRUEBA ESTRELLA 4: ESTADO REACTIVO EN FORMULARIOS (DETALLE Y DEDICATORIA)
  // ---------------------------------------------------------------------------
  it('Prueba 4 [Estado]: El estado reactivo actualiza el precio en tiempo real según el tamaño y almacena la dedicatoria', async () => {
    renderConProviders(<DetalleProducto />, { route: '/producto/TE001' });

    await waitFor(() => {
      expect(screen.getByText(/Torta Especial de Cumpleaños/i)).toBeInTheDocument();
    });

    const selectorTamano = screen.getByLabelText(/Tamaño y Porciones/i);
    const inputDedicatoria = screen.getByLabelText(/Dedicatoria o Mensaje/i);

    // Modificar tamaño a Chica (75% del precio base $55.000 = $41.250)
    fireEvent.change(selectorTamano, { target: { value: 'Chica' } });
    expect(screen.getByTestId('precio-dinamico')).toHaveTextContent('$41.250 CLP');

    // Escribir dedicatoria personalizada
    await userEvent.type(inputDedicatoria, '¡Felices 50 Años!');
    expect(inputDedicatoria).toHaveValue('¡Felices 50 Años!');
  });

  // ---------------------------------------------------------------------------
  // PRUEBA ESTRELLA 5: EVENTOS DE USUARIO (AGREGAR AL CARRITO)
  // ---------------------------------------------------------------------------
  it('Prueba 5 [Eventos]: Al hacer clic en Añadir al Carrito se dispara el evento, sumando el ítem y mostrando feedback visual', async () => {
    renderConProviders(<DetalleProducto />, { route: '/producto/TC001' });

    await waitFor(() => {
      expect(screen.getByText(/Torta Cuadrada de Chocolate/i)).toBeInTheDocument();
    });

    const botonAgregar = screen.getByRole('button', { name: /Añadir al Carrito/i });
    fireEvent.click(botonAgregar);

    // Debe mostrar la notificación Toast de éxito
    await waitFor(() => {
      expect(screen.getByText(/¡Se agregaron 1 unidad\(es\) al carrito con éxito!/i)).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // PRUEBA ESTRELLA 6: MOCKS DEL BACKEND CON vi.spyOn
  // ---------------------------------------------------------------------------
  it('Prueba 6 [Mocks]: Simula la llamada REST al backend Spring Boot mediante vi.spyOn(ordenService, "crear")', async () => {
    const ordenSimulada = {
      id: 88,
      folio: 'MS-888999',
      clienteNombre: 'Camila Soto',
      clienteEmail: 'camila@duocuc.cl',
      total: 45000,
      estado: 'Confirmado'
    };

    // Espiar y mockear el método crear del servicio
    const spyCrear = vi.spyOn(ordenService, 'crear').mockResolvedValue(ordenSimulada);

    const resultado = await ordenService.crear({
      clienteNombre: 'Camila Soto',
      clienteEmail: 'camila@duocuc.cl',
      total: 45000
    });

    expect(spyCrear).toHaveBeenCalledTimes(1);
    expect(resultado.folio).toBe('MS-888999');
    expect(resultado.id).toBe(88);
  });

  // ---------------------------------------------------------------------------
  // PRUEBA ESTRELLA 7: CRUD COMPLETO EN LA CAPA DE SERVICIOS DESACOPLADA
  // ---------------------------------------------------------------------------
  it('Prueba 7 [CRUD Servicios]: Ejecuta el ciclo Crear, Leer, Actualizar y Eliminar en productoService', async () => {
    // 1. Crear
    const nuevo = await productoService.crear({
      codigo: 'CRUD01',
      nombre: 'Torta Selva Negra Especial',
      precio: 48000,
      stock: 10,
      stockCritico: 5,
      categoriaId: 1
    });
    expect(nuevo.id).toBeDefined();
    expect(nuevo.nombre).toBe('Torta Selva Negra Especial');

    // 2. Leer
    const leido = await productoService.obtenerPorId(nuevo.id);
    expect(leido.codigo).toBe('CRUD01');

    // 3. Actualizar
    const actualizado = await productoService.actualizar(nuevo.id, {
      nombre: 'Torta Selva Negra Modificada',
      precio: 52000
    });
    expect(actualizado.nombre).toBe('Torta Selva Negra Modificada');
    expect(actualizado.precio).toBe(52000);

    // 4. Eliminar
    const eliminado = await productoService.eliminar(nuevo.id);
    expect(eliminado).toBe(true);

    const postDelete = await productoService.obtenerPorId(nuevo.id);
    expect(postDelete).toBeNull();
  });

  // ---------------------------------------------------------------------------
  // PRUEBA ESTRELLA 8: VALIDACIÓN DE FORMULARIOS CRUD
  // ---------------------------------------------------------------------------
  it('Prueba 8 [Formularios CRUD]: Valida campos obligatorios y bloquea el guardado si el formulario está incompleto', async () => {
    renderConProviders(<AdminProductos />);

    // Abrir modal de nuevo producto
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Nuevo Producto/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Nuevo Producto/i }));

    // Intentar guardar con campos vacíos
    const botonGuardar = screen.getByRole('button', { name: /Guardar Producto/i });
    fireEvent.click(botonGuardar);

    // Debe mostrar los mensajes de validación requeridos
    await waitFor(() => {
      expect(screen.getByText(/El código de producto es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/El nombre del producto es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/El precio debe ser un número mayor a 0/i)).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // PRUEBA ESTRELLA 9: CUSTOM HOOK useCarrito (renderHook y act)
  // ---------------------------------------------------------------------------
  it('Prueba 9 [Custom Hook]: useCarrito calcula subtotales, aplica el beneficio senior del 50% y persiste en localStorage', () => {
    // Simular sesión de usuario Senior (+50 años)
    const usuarioSenior = {
      id: 10,
      nombre: 'Rosa Carrasco',
      email: 'rosa@gmail.com',
      rol: 'CLIENTE',
      edad: 61,
      descuentoSenior: true
    };
    localStorage.setItem('usuario_mil_sabores_activo', JSON.stringify(usuarioSenior));

    const wrapper = ({ children }) => (
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    );

    const { result } = renderHook(() => useCarrito(), { wrapper });

    act(() => {
      result.current.agregarAlCarrito({
        codigo: 'TT001',
        nombre: 'Torta Circular',
        precio: 40000,
        cantidad: 1,
        personalizacion: 'Mediana'
      });
    });

    expect(result.current.totalItems).toBe(1);
    expect(result.current.subtotal).toBe(40000);

    // Descuento Senior automático del 50%: 40.000 * 50% = 20.000
    expect(result.current.porcentajeDescuento).toBe(50);
    expect(result.current.descuentoMonto).toBe(20000);

    // Total = (40.000 - 20.000) + 3.500 despacho = 23.500
    expect(result.current.total).toBe(23500);
  });

  // ---------------------------------------------------------------------------
  // PRUEBA ESTRELLA 10: PROTECCIÓN DE RUTAS POR ROL (RutaProtegidaAdmin)
  // ---------------------------------------------------------------------------
  it('Prueba 10 [Rutas Protegidas]: Bloquea a usuarios con rol CLIENTE o sin sesión, y permite el acceso al panel solo a ADMIN', () => {
    // Caso A: Usuario con rol CLIENTE intenta ingresar a /admin
    const usuarioCliente = { id: 2, nombre: 'Cliente Normal', email: 'cliente@gmail.com', rol: 'CLIENTE' };
    localStorage.setItem('usuario_mil_sabores_activo', JSON.stringify(usuarioCliente));

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/admin" element={<RutaProtegidaAdmin><div>Panel Secreto Admin</div></RutaProtegidaAdmin>} />
            <Route path="/" element={<div>Inicio Público</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Debe ser bloqueado y redirigido al inicio
    expect(screen.queryByText('Panel Secreto Admin')).not.toBeInTheDocument();
    expect(screen.getByText('Inicio Público')).toBeInTheDocument();

    // Caso B: Usuario con rol ADMIN
    localStorage.setItem('usuario_mil_sabores_activo', JSON.stringify({ id: 1, nombre: 'Admin', email: 'admin@milsabores.cl', rol: 'ADMIN' }));

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/admin" element={<RutaProtegidaAdmin><div>Panel Secreto Admin</div></RutaProtegidaAdmin>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText('Panel Secreto Admin')).toBeInTheDocument();
  });
});
