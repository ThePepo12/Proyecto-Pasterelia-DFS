/**
 * VISTA OBLIGATORIA: COMPRAR / CHECKOUT (VERDE)
 * (src/pages/tienda/Checkout.jsx)
 * 
 * Pasarela de pago y despacho:
 * - Autocompleta automáticamente los datos si el usuario inició sesión
 * - Permite elegir región, comuna y fecha de entrega
 * - Resumen detallado de productos, subtotales, descuentos e IVA
 * - Guarda la orden en el backend Spring Boot (POST /api/ordenes) o en db.js
 * - Permite simular pago aprobado o rechazado para evaluar Pago Correcto / Error
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCarrito } from '../../context/CartContext.jsx';
import { ordenService } from '../../services/ordenService.js';

// Comunas por Región de Chile
const COMUNAS_POR_REGION = {
  'Región Metropolitana': [
    'Puente Alto',
    'Santiago Centro',
    'Providencia',
    'Las Condes',
    'Ñuñoa',
    'La Florida',
    'Maipú',
    'San Bernardo',
    'Vitacura',
    'Peñalolén',
    'Macul',
    'San Miguel'
  ],
  'Región de Valparaíso': [
    'Viña del Mar',
    'Valparaíso',
    'Quilpué',
    'Villa Alemana',
    'Concón'
  ],
  'Región de O’Higgins': [
    'Rancagua',
    'Machalí',
    'Rengo',
    'San Fernando'
  ]
};

export function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isSenior } = useAuth();
  const {
    carrito,
    subtotal,
    descuentoMonto,
    porcentajeDescuento,
    motivoDescuento,
    costoEnvio,
    iva,
    total,
    limpiarCarrito
  } = useCarrito();

  // Estados del Formulario de Cliente y Despacho
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [region, setRegion] = useState('Región Metropolitana');
  const [comuna, setComuna] = useState('Santiago Centro');
  const [calle, setCalle] = useState('');
  const [depto, setDepto] = useState('');
  const [indicaciones, setIndicaciones] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState(() => {
    // Por defecto mañana
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    return manana.toISOString().split('T')[0];
  });
  const [horarioEntrega, setHorarioEntrega] = useState('10:00 a 14:00 hrs');
  const [metodoPago, setMetodoPago] = useState('webpay');

  // Switch de simulación de pago para demostración y testing
  const [simularError, setSimularError] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});

  // Autocompletar datos del usuario si ha iniciado sesión
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.nombre) {
        const partes = user.nombre.split(' ');
        setNombre(partes[0] || '');
        setApellidos(partes.slice(1).join(' ') || '');
      }
      if (user.email) setEmail(user.email);
      if (user.telefono) setTelefono(user.telefono);
      if (user.direccion) setCalle(user.direccion);
    }
  }, [isAuthenticated, user]);

  // Actualizar comuna al cambiar de región
  const handleRegionChange = (e) => {
    const nuevaRegion = e.target.value;
    setRegion(nuevaRegion);
    const lista = COMUNAS_POR_REGION[nuevaRegion] || [];
    setComuna(lista[0] || '');
  };

  const validarFormulario = () => {
    const err = {};
    if (!nombre.trim()) err.nombre = 'El nombre es obligatorio';
    if (!email.trim()) {
      err.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      err.email = 'Formato de correo inválido';
    }
    if (!telefono.trim()) err.telefono = 'El teléfono de contacto es obligatorio';
    if (!calle.trim()) err.calle = 'La calle y número son obligatorios';
    if (!comuna.trim()) err.comuna = 'Debes seleccionar una comuna';
    if (!fechaEntrega) err.fechaEntrega = 'Debes seleccionar una fecha de entrega';

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handlePagar = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    if (carrito.length === 0) {
      alert('Tu carrito está vacío. Agrega productos antes de pagar.');
      navigate('/productos');
      return;
    }

    setCargando(true);

    try {
      // 1. Si está activo el modo de simulación de fallo
      if (simularError) {
        // Preservamos el carrito intacto para que no pierda sus productos
        setCargando(false);
        navigate('/pago-error', {
          state: {
            motivo: 'Transacción rechazada por el emisor bancario: Fondos insuficientes o límite de tarjeta excedido.',
            codigoError: 'ERR-WEBPAY-904',
            datosIntento: {
              cliente: `${nombre} ${apellidos}`.trim(),
              email,
              telefono,
              direccion: `${calle} ${depto ? ', Depto ' + depto : ''}, ${comuna}`,
              total,
              subtotal,
              descuentoMonto,
              costoEnvio,
              iva,
              items: carrito
            }
          }
        });
        return;
      }

      // 2. Pago Exitoso: Construir objeto de orden para el backend
      const aleatorio = Math.floor(100000 + Math.random() * 900000);
      const folioOrden = `MS-${aleatorio}`;
      const fechaActual = new Date().toLocaleDateString('es-CL');
      const horaActual = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

      const itemsOrden = carrito.map((item) => ({
        codigoProducto: item.codigo,
        nombreProducto: item.nombre,
        precioUnitario: item.precio,
        cantidad: item.cantidad,
        subtotal: item.precio * item.cantidad,
        personalizacion: item.personalizacion || 'Estándar'
      }));

      const payloadOrden = {
        folio: folioOrden,
        fecha: fechaActual,
        hora: horaActual,
        subtotal,
        porcentajeDescuento,
        montoDescuento: descuentoMonto,
        motivoDescuento: motivoDescuento || 'Sin descuento',
        envio: costoEnvio,
        iva,
        total,
        estado: 'Confirmado',
        clienteNombre: `${nombre} ${apellidos}`.trim(),
        clienteEmail: email.trim().toLowerCase(),
        telefono: telefono.trim(),
        direccionEntrega: `${calle} ${depto ? ', Depto ' + depto : ''}`.trim(),
        region,
        comuna,
        indicaciones: indicaciones.trim(),
        fechaEntrega,
        horarioEntrega,
        repartidor: 'Carlos Valenzuela - Repartos Mil Sabores (Furgón Refrigerado)',
        items: itemsOrden,
        usuario: user && user.id ? { id: user.id } : null
      };

      // Guardar orden a través de la capa de servicios (Spring Boot con fallback a db.js)
      const ordenGuardada = await ordenService.crear(payloadOrden);

      // Guardar también como último pedido local para respaldo de boleta
      localStorage.setItem('ultimo_pedido_mil_sabores', JSON.stringify(ordenGuardada));

      // Limpiar el carrito de compras tras compra exitosa
      limpiarCarrito();

      setCargando(false);
      navigate('/pago-exitoso', { state: { orden: ordenGuardada } });
    } catch (error) {
      console.error('Error al procesar orden de compra:', error);
      setCargando(false);
      navigate('/pago-error', {
        state: {
          motivo: 'Ocurrió un error de conexión al registrar la compra con el servidor.',
          codigoError: 'ERR-SRV-500',
          datosIntento: {
            cliente: `${nombre} ${apellidos}`.trim(),
            email,
            total,
            items: carrito
          }
        }
      });
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="bg-dark text-light py-5 min-vh-100 text-center d-flex align-items-center">
        <div className="container" style={{ maxWidth: '550px' }}>
          <div className="card bg-secondary bg-opacity-10 border-secondary p-5 shadow">
            <i className="bi bi-cart-x text-warning display-3 mb-3"></i>
            <h3 className="text-warning fw-bold">Tu carrito está vacío</h3>
            <p className="text-secondary mb-4">
              Agrega productos de nuestro catálogo antes de realizar el checkout.
            </p>
            <Link to="/productos" className="btn btn-warning text-dark fw-bold">
              Ir al Catálogo de Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark text-light py-5 min-vh-100">
      <div className="container">
        {/* Encabezado */}
        <div className="mb-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/" className="text-secondary text-decoration-none">Inicio</Link></li>
              <li className="breadcrumb-item"><Link to="/carrito" className="text-secondary text-decoration-none">Carrito</Link></li>
              <li className="breadcrumb-item active text-warning" aria-current="page">Checkout</li>
            </ol>
          </nav>
          <h1 className="display-5 fw-bold text-warning font-serif">
            Finalizar Compra & Despacho
          </h1>
          <p className="text-secondary">
            Completa los datos de envío y pago para preparar tu pedido con dedicación artesanal.
          </p>
        </div>

        {/* Notificación de Autocompletado si hay sesión */}
        {isAuthenticated ? (
          <div className="alert alert-success bg-success bg-opacity-25 border-success text-light d-flex align-items-center mb-4 p-3 rounded-3" data-testid="alerta-autocompletado">
            <i className="bi bi-person-check-fill text-success fs-3 me-3"></i>
            <div>
              <strong className="text-success d-block">Sesión Activa: Datos de contacto autocompletados</strong>
              <span className="small text-light">
                Comprando como <strong>{user?.nombre}</strong> ({user?.email}).
                {isSenior && ' Beneficio Senior del 50% de descuento aplicado en el total.'}
              </span>
            </div>
          </div>
        ) : (
          <div className="alert alert-warning bg-warning bg-opacity-10 border-warning text-light d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4 p-3 rounded-3">
            <div className="d-flex align-items-center">
              <i className="bi bi-info-circle-fill text-warning fs-4 me-2"></i>
              <span className="small">
                ¿Tienes cuenta en Pastelería Mil Sabores? Inicia sesión para autocompletar tus datos y aplicar tus beneficios.
              </span>
            </div>
            <Link to="/login" className="btn btn-outline-warning btn-sm">
              Iniciar Sesión
            </Link>
          </div>
        )}

        <div className="row g-5">
          {/* Columna Izquierda: Formulario de Despacho y Pago */}
          <div className="col-12 col-lg-7">
            <form onSubmit={handlePagar} noValidate data-testid="form-checkout">
              {/* Sección 1: Datos Personales */}
              <div className="card bg-secondary bg-opacity-10 border-secondary p-4 mb-4 shadow-sm rounded-3">
                <h4 className="text-warning fw-bold mb-3">
                  <i className="bi bi-person-lines-fill me-2"></i> 1. Datos del Cliente
                </h4>
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <label htmlFor="chk-nombre" className="form-label text-light small fw-bold">
                      Nombre: <span className="text-danger">*</span>
                    </label>
                    <input
                      id="chk-nombre"
                      type="text"
                      className={`form-control bg-dark text-light border-secondary ${errores.nombre ? 'is-invalid border-danger' : ''}`}
                      placeholder="Tu nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      aria-label="Nombre del cliente"
                    />
                    {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="chk-apellidos" className="form-label text-light small fw-bold">
                      Apellidos:
                    </label>
                    <input
                      id="chk-apellidos"
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Tus apellidos"
                      value={apellidos}
                      onChange={(e) => setApellidos(e.target.value)}
                      aria-label="Apellidos del cliente"
                    />
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="chk-email" className="form-label text-light small fw-bold">
                      Correo Electrónico: <span className="text-danger">*</span>
                    </label>
                    <input
                      id="chk-email"
                      type="email"
                      className={`form-control bg-dark text-light border-secondary ${errores.email ? 'is-invalid border-danger' : ''}`}
                      placeholder="tu.correo@ejemplo.cl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-label="Correo electrónico del cliente"
                    />
                    {errores.email && <div className="invalid-feedback">{errores.email}</div>}
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="chk-telefono" className="form-label text-light small fw-bold">
                      Teléfono de Contacto: <span className="text-danger">*</span>
                    </label>
                    <input
                      id="chk-telefono"
                      type="tel"
                      className={`form-control bg-dark text-light border-secondary ${errores.telefono ? 'is-invalid border-danger' : ''}`}
                      placeholder="+56 9 1234 5678"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      aria-label="Teléfono de contacto"
                    />
                    {errores.telefono && <div className="invalid-feedback">{errores.telefono}</div>}
                  </div>
                </div>
              </div>

              {/* Sección 2: Dirección y Entrega */}
              <div className="card bg-secondary bg-opacity-10 border-secondary p-4 mb-4 shadow-sm rounded-3">
                <h4 className="text-warning fw-bold mb-3">
                  <i className="bi bi-truck me-2"></i> 2. Dirección de Entrega y Despacho
                </h4>
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <label htmlFor="chk-region" className="form-label text-light small fw-bold">
                      Región:
                    </label>
                    <select
                      id="chk-region"
                      className="form-select bg-dark text-light border-secondary"
                      value={region}
                      onChange={handleRegionChange}
                      aria-label="Seleccionar región"
                    >
                      {Object.keys(COMUNAS_POR_REGION).map((reg) => (
                        <option key={reg} value={reg}>{reg}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="chk-comuna" className="form-label text-light small fw-bold">
                      Comuna: <span className="text-danger">*</span>
                    </label>
                    <select
                      id="chk-comuna"
                      className="form-select bg-dark text-light border-secondary"
                      value={comuna}
                      onChange={(e) => setComuna(e.target.value)}
                      aria-label="Seleccionar comuna"
                    >
                      {(COMUNAS_POR_REGION[region] || []).map((com) => (
                        <option key={com} value={com}>{com}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-sm-8">
                    <label htmlFor="chk-calle" className="form-label text-light small fw-bold">
                      Calle, Pasaje y Número: <span className="text-danger">*</span>
                    </label>
                    <input
                      id="chk-calle"
                      type="text"
                      className={`form-control bg-dark text-light border-secondary ${errores.calle ? 'is-invalid border-danger' : ''}`}
                      placeholder="Ej: Av. Concha y Toro #1234"
                      value={calle}
                      onChange={(e) => setCalle(e.target.value)}
                      aria-label="Calle y número de entrega"
                    />
                    {errores.calle && <div className="invalid-feedback">{errores.calle}</div>}
                  </div>

                  <div className="col-12 col-sm-4">
                    <label htmlFor="chk-depto" className="form-label text-light small fw-bold">
                      Depto / Casa / Block (Opcional):
                    </label>
                    <input
                      id="chk-depto"
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Ej: Depto 402"
                      value={depto}
                      onChange={(e) => setDepto(e.target.value)}
                      aria-label="Departamento o casa opcional"
                    />
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="chk-fecha" className="form-label text-light small fw-bold">
                      Fecha de Entrega: <span className="text-danger">*</span>
                    </label>
                    <input
                      id="chk-fecha"
                      type="date"
                      className={`form-control bg-dark text-light border-secondary ${errores.fechaEntrega ? 'is-invalid border-danger' : ''}`}
                      value={fechaEntrega}
                      onChange={(e) => setFechaEntrega(e.target.value)}
                      aria-label="Fecha de entrega"
                    />
                    {errores.fechaEntrega && <div className="invalid-feedback">{errores.fechaEntrega}</div>}
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="chk-horario" className="form-label text-light small fw-bold">
                      Horario Preferente:
                    </label>
                    <select
                      id="chk-horario"
                      className="form-select bg-dark text-light border-secondary"
                      value={horarioEntrega}
                      onChange={(e) => setHorarioEntrega(e.target.value)}
                      aria-label="Horario preferente de entrega"
                    >
                      <option value="10:00 a 14:00 hrs">Mañana (10:00 a 14:00 hrs)</option>
                      <option value="14:00 a 18:00 hrs">Tarde (14:00 a 18:00 hrs)</option>
                      <option value="18:00 a 21:00 hrs">Vespertino (18:00 a 21:00 hrs)</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label htmlFor="chk-indicaciones" className="form-label text-light small fw-bold">
                      Indicaciones de Despacho (Opcional):
                    </label>
                    <textarea
                      id="chk-indicaciones"
                      className="form-control bg-dark text-light border-secondary"
                      rows="2"
                      placeholder="Ej: Dejar con conserje en portería o tocar timbre 4B."
                      value={indicaciones}
                      onChange={(e) => setIndicaciones(e.target.value)}
                      aria-label="Indicaciones de despacho"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Sección 3: Método de Pago y Simulador */}
              <div className="card bg-secondary bg-opacity-10 border-secondary p-4 mb-4 shadow-sm rounded-3">
                <h4 className="text-warning fw-bold mb-3">
                  <i className="bi bi-credit-card me-2"></i> 3. Método de Pago Seguro
                </h4>

                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-4">
                    <div
                      onClick={() => setMetodoPago('webpay')}
                      className={`card p-3 text-center border cursor-pointer h-100 ${metodoPago === 'webpay' ? 'border-warning bg-warning bg-opacity-10' : 'border-secondary bg-dark'}`}
                      role="button"
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="bi bi-credit-card-2-front text-warning fs-3 mb-1"></i>
                      <strong className="text-light small">Webpay Plus</strong>
                      <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Débito y Crédito</span>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div
                      onClick={() => setMetodoPago('transferencia')}
                      className={`card p-3 text-center border cursor-pointer h-100 ${metodoPago === 'transferencia' ? 'border-warning bg-warning bg-opacity-10' : 'border-secondary bg-dark'}`}
                      role="button"
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="bi bi-bank text-warning fs-3 mb-1"></i>
                      <strong className="text-light small">Transferencia</strong>
                      <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Banco de Chile / BCI</span>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div
                      onClick={() => setMetodoPago('mercadopago')}
                      className={`card p-3 text-center border cursor-pointer h-100 ${metodoPago === 'mercadopago' ? 'border-warning bg-warning bg-opacity-10' : 'border-secondary bg-dark'}`}
                      role="button"
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="bi bi-wallet2 text-warning fs-3 mb-1"></i>
                      <strong className="text-light small">Mercado Pago</strong>
                      <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Dinero en cuenta</span>
                    </div>
                  </div>
                </div>

                {/* Simulador de Fallo para Pruebas */}
                <div className="p-3 bg-dark border border-warning border-opacity-25 rounded-3">
                  <div className="form-check form-switch mb-1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="switch-simular-error"
                      checked={simularError}
                      onChange={(e) => setSimularError(e.target.checked)}
                      data-testid="switch-simular-error"
                    />
                    <label className="form-check-label text-warning fw-bold small" htmlFor="switch-simular-error">
                      Simular rechazo de pago (Demostración de Pago con Error)
                    </label>
                  </div>
                  <small className="text-secondary d-block ps-4">
                    Activa este selector si deseas probar el flujo de error de transacción.
                  </small>
                </div>
              </div>

              {/* Botón Pagar Ahora */}
              <button
                type="submit"
                disabled={cargando}
                className="btn btn-warning btn-lg text-dark fw-bold w-100 py-3 shadow-lg fs-5"
                data-testid="btn-pagar-ahora"
              >
                {cargando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Procesando Pago Seguro...
                  </>
                ) : (
                  <>
                    <i className="bi bi-lock-fill me-2"></i> Pagar ahora ${total.toLocaleString('es-CL')} CLP
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Columna Derecha: Resumen de la Orden */}
          <div className="col-12 col-lg-5">
            <div className="card bg-secondary bg-opacity-10 border-warning p-4 shadow-lg rounded-3 sticky-top" style={{ top: '90px' }}>
              <h4 className="text-warning fw-bold mb-3 border-bottom border-warning pb-2">
                Resumen de tu Orden ({carrito.length} ítems)
              </h4>

              {/* Lista de productos resumida */}
              <div className="mb-4" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {carrito.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-3 py-2 border-bottom border-secondary border-opacity-50">
                    <div style={{ width: '50px', height: '50px' }} className="rounded-2 overflow-hidden flex-shrink-0 border border-secondary">
                      <img
                        src={item.imagen || '/img/producto_TC001.avif'}
                        alt={item.nombre}
                        className="w-100 h-100 object-fit-cover"
                        onError={(e) => { e.target.src = '/img/producto_TC001.avif'; }}
                      />
                    </div>
                    <div className="flex-grow-1 small">
                      <strong className="text-light d-block">{item.nombre}</strong>
                      <span className="text-secondary d-block">{item.personalizacion || 'Estándar'}</span>
                      <span className="text-warning">{item.cantidad} x ${item.precio.toLocaleString('es-CL')}</span>
                    </div>
                    <span className="fw-bold text-light small">
                      ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Desglose Financiero */}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Subtotal Productos:</span>
                <span className="text-light">${subtotal.toLocaleString('es-CL')} CLP</span>
              </div>

              {descuentoMonto > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success fw-bold" data-testid="descuento-checkout">
                  <span>{motivoDescuento || `Descuento (${porcentajeDescuento}%):`}</span>
                  <span>-${descuentoMonto.toLocaleString('es-CL')} CLP</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Envío Refrigerado:</span>
                <span className="text-light">${costoEnvio.toLocaleString('es-CL')} CLP</span>
              </div>

              <div className="d-flex justify-content-between mb-3 text-secondary small">
                <span>IVA Incluido (19%):</span>
                <span>${iva.toLocaleString('es-CL')} CLP</span>
              </div>

              <hr className="border-warning opacity-25" />

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fs-5 fw-bold text-light">Total a Pagar:</span>
                <span className="fs-3 fw-bold text-warning" data-testid="total-checkout">
                  ${total.toLocaleString('es-CL')} CLP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
