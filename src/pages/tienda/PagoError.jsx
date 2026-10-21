/**
 * VISTA OBLIGATORIA: PAGO CON ERROR (VERDE)
 * (src/pages/tienda/PagoError.jsx)
 * 
 * Pantalla informativa ante un fallo de pasarela de pago o transacción rechazada:
 * - Informa claramente el motivo del rechazo y el código de error
 * - Garantiza al usuario que el carrito se mantiene intacto y no hubo cobro
 * - Ofrece acciones inmediatas: reintentar el pago, revisar el carrito o contactar a soporte
 * - Diseño profesional y responsive con Bootstrap 5
 */
import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../../context/CartContext.jsx';

export function PagoError() {
  const location = useLocation();
  const navigate = useNavigate();
  const { carrito, total } = useCarrito();

  // Obtener datos pasados por navegación o valores por defecto
  const state = location.state || {};
  const motivo = state.motivo || 'La entidad bancaria rechazó la transacción o expiró el tiempo de espera de la pasarela.';
  const codigoError = state.codigoError || 'ERR-WEBPAY-RECHAZO';
  const datosIntento = state.datosIntento || null;

  const montoMostrar = datosIntento?.total || total || 0;

  return (
    <div className="bg-dark text-light py-5 min-vh-100">
      <div className="container" style={{ maxWidth: '850px' }}>
        
        {/* Encabezado de Error */}
        <div className="card bg-secondary bg-opacity-10 border-danger border-2 shadow-lg mb-4">
          <div className="card-body p-4 p-md-5 text-center">
            <div className="mb-3">
              <i className="bi bi-x-circle-fill text-danger display-1"></i>
            </div>
            <span className="badge bg-danger px-3 py-2 text-uppercase mb-3 tracking-wide">
              Código de Error: {codigoError}
            </span>
            <h1 className="h2 text-danger fw-bold mb-2">Pago No Procesado</h1>
            <p className="text-secondary fs-5 mb-4">
              La transacción no pudo completarse y tu cuenta bancaria no ha recibido ningún cargo.
            </p>

            {/* Motivo del rechazo */}
            <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25 text-start p-3 mb-4">
              <div className="d-flex align-items-start gap-2">
                <i className="bi bi-exclamation-triangle-fill text-danger fs-5 mt-1 flex-shrink-0"></i>
                <div>
                  <strong className="text-danger d-block">Detalle reportado por la pasarela:</strong>
                  <span className="text-light">{motivo}</span>
                </div>
              </div>
            </div>

            {/* Garantía de carrito preservado */}
            <div className="p-3 bg-secondary bg-opacity-10 rounded border border-secondary border-opacity-25 text-start mb-4">
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-cart-check text-warning fs-2 flex-shrink-0"></i>
                <div>
                  <h6 className="text-warning mb-1 fw-bold">Tu carrito de compras está a salvo</h6>
                  <p className="text-secondary small mb-0">
                    Mantuvimos los {carrito.length} {carrito.length === 1 ? 'producto' : 'productos'} en tu carrito para que no tengas que seleccionarlos nuevamente.
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de Acción Inmediata */}
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 pt-2">
              <button
                type="button"
                className="btn btn-warning text-dark fw-bold px-4 py-2"
                onClick={() => navigate('/checkout')}
              >
                <i className="bi bi-arrow-repeat me-2"></i>
                Reintentar Pago
              </button>
              <Link to="/carrito" className="btn btn-outline-light px-4 py-2">
                <i className="bi bi-cart3 me-2"></i>
                Modificar Carrito
              </Link>
              <Link to="/contacto" className="btn btn-outline-secondary px-4 py-2">
                <i className="bi bi-headset me-2"></i>
                Ayuda y Soporte
              </Link>
            </div>
          </div>
        </div>

        {/* Resumen del Intento y Consejos de Solución */}
        <div className="row g-4">
          {/* Tarjeta de Resumen del Intento */}
          <div className="col-md-6">
            <div className="card bg-secondary bg-opacity-10 border-secondary h-100 p-4">
              <h5 className="text-warning fw-bold mb-3">
                <i className="bi bi-file-earmark-text me-2"></i>
                Datos del Intento
              </h5>
              <ul className="list-unstyled text-secondary small mb-0">
                <li className="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-25">
                  <span>Monto de la orden:</span>
                  <strong className="text-light fs-6">
                    ${Number(montoMostrar).toLocaleString('es-CL')}
                  </strong>
                </li>
                {datosIntento?.cliente && (
                  <li className="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-25">
                    <span>Titular / Cliente:</span>
                    <strong className="text-light">{datosIntento.cliente}</strong>
                  </li>
                )}
                {datosIntento?.email && (
                  <li className="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-25">
                    <span>Correo registrado:</span>
                    <strong className="text-light">{datosIntento.email}</strong>
                  </li>
                )}
                <li className="d-flex justify-content-between py-2">
                  <span>Estado de la operación:</span>
                  <span className="badge bg-danger bg-opacity-75">Rechazada / Cancelada</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tarjeta de Sugerencias para el Cliente */}
          <div className="col-md-6">
            <div className="card bg-secondary bg-opacity-10 border-secondary h-100 p-4">
              <h5 className="text-warning fw-bold mb-3">
                <i className="bi bi-lightbulb me-2"></i>
                ¿Cómo resolverlo?
              </h5>
              <ul className="text-secondary small mb-0 ps-3">
                <li className="mb-2">
                  Verifica que tu tarjeta cuente con saldo suficiente o cupo disponible para compras en línea.
                </li>
                <li className="mb-2">
                  Revisa que hayas ingresado correctamente la clave dinámica o coordenada de seguridad de tu banco.
                </li>
                <li className="mb-2">
                  Intenta pagar con otro medio (Redcompra Débito, Tarjeta de Crédito en cuotas o Transferencia).
                </li>
                <li>
                  Si el problema persiste, contáctanos a <a href="mailto:soporte@milsabores.cl" className="text-warning text-decoration-none">soporte@milsabores.cl</a> indicando el código <code>{codigoError}</code>.
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PagoError;
