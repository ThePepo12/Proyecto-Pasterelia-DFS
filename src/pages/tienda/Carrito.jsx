/**
 * VISTA DEL CARRITO DE COMPRAS (src/pages/tienda/Carrito.jsx)
 * 
 * Migrada de legacy/carrito.html.
 * Muestra la tabla dinámica de productos, controles de cantidad (+/-),
 * eliminación de ítems, cupones conmemorativos (FELICES50, DUOCUMPLE),
 * desglose financiero (subtotal, descuentos, despacho $3.500, IVA 19%, total)
 * y enlace al Checkout.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export function Carrito() {
  const {
    carrito,
    actualizarCantidad,
    eliminarDelCarrito,
    limpiarCarrito,
    aplicarCupon,
    subtotal,
    totalItems,
    descuentoMonto,
    porcentajeDescuento,
    motivoDescuento,
    costoEnvio,
    iva,
    total
  } = useCarrito();

  const { usuario, isSenior, isEstudiante } = useAuth();
  const [inputCupon, setInputCupon] = useState('');
  const [feedbackCupon, setFeedbackCupon] = useState(null);
  const navigate = useNavigate();

  const handleAplicarCupon = (e) => {
    e.preventDefault();
    const res = aplicarCupon(inputCupon);
    setFeedbackCupon(res);
  };

  const handleVaciar = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar todos los productos del carrito?')) {
      limpiarCarrito();
      setFeedbackCupon(null);
    }
  };

  return (
    <div className="bg-dark text-light py-5 min-vh-100">
      <div className="container">
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h1 className="display-6 fw-bold text-warning mb-1">
              <i className="bi bi-cart3 me-2"></i> Carrito de Compras
            </h1>
            <p className="text-secondary mb-0">
              Revisa los productos seleccionados y procede con el despacho a domicilio.
            </p>
          </div>
          {carrito.length > 0 && (
            <button onClick={handleVaciar} className="btn btn-outline-danger btn-sm">
              <i className="bi bi-trash3 me-1"></i> Vaciar Carrito
            </button>
          )}
        </div>

        {carrito.length === 0 ? (
          /* Carrito Vacío */
          <div className="card bg-secondary bg-opacity-10 border-secondary p-5 text-center my-4">
            <i className="bi bi-cart-x text-warning display-1 mb-3"></i>
            <h3 className="text-light">Tu carrito está actualmente vacío</h3>
            <p className="text-secondary lead mx-auto" style={{ maxWidth: '500px' }}>
              No tienes ningún pastel o postre agregado. Revisa nuestro catálogo con 50 años de tradición y elige tu favorito.
            </p>
            <div className="mt-3">
              <Link to="/productos" className="btn btn-warning btn-lg text-dark fw-bold px-4">
                <i className="bi bi-grid-3x3-gap-fill me-2"></i> Ir al Catálogo de Productos
              </Link>
            </div>
          </div>
        ) : (
          /* Carrito con Productos */
          <div className="row g-4">
            {/* Tabla / Lista de Ítems */}
            <div className="col-12 col-lg-8">
              <div className="card bg-secondary bg-opacity-10 border-secondary shadow-sm">
                <div className="card-header bg-dark border-bottom border-secondary d-flex justify-content-between align-items-center py-3">
                  <h5 className="mb-0 text-warning fw-bold">Productos ({totalItems})</h5>
                  <span className="small text-secondary">Despacho garantizado en frío</span>
                </div>

                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle mb-0">
                      <thead className="text-secondary small text-uppercase">
                        <tr>
                          <th style={{ width: '80px' }}>Foto</th>
                          <th>Producto</th>
                          <th className="text-center" style={{ width: '130px' }}>Cantidad</th>
                          <th className="text-end">Subtotal</th>
                          <th style={{ width: '50px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {carrito.map((item, index) => {
                          const subtotalFila = item.precio * item.cantidad;
                          return (
                            <tr key={`${item.codigo}-${item.personalizacion}-${index}`}>
                              <td>
                                <img
                                  src={item.imagen}
                                  alt={item.nombre}
                                  className="rounded object-fit-cover"
                                  style={{ width: '60px', height: '60px' }}
                                  onError={(e) => {
                                    e.target.src = '/img/producto_TC001.avif';
                                  }}
                                />
                              </td>
                              <td>
                                <h6 className="mb-1 text-light fw-bold">{item.nombre}</h6>
                                <p className="mb-0 small text-warning opacity-75">{item.personalizacion}</p>
                                <span className="small text-secondary">
                                  ${Number(item.precio).toLocaleString('es-CL')} CLP c/u
                                </span>
                              </td>
                              <td className="text-center">
                                <div className="input-group input-group-sm">
                                  <button
                                    className="btn btn-outline-warning"
                                    type="button"
                                    onClick={() => actualizarCantidad(index, item.cantidad - 1)}
                                    title="Disminuir"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="text"
                                    readOnly
                                    className="form-control text-center bg-dark text-light border-secondary"
                                    value={item.cantidad}
                                    style={{ maxWidth: '42px' }}
                                  />
                                  <button
                                    className="btn btn-outline-warning"
                                    type="button"
                                    onClick={() => {
                                      const limite = item.stock ?? 99;
                                      if (item.cantidad >= limite) return;
                                      actualizarCantidad(index, item.cantidad + 1);
                                    }}
                                    disabled={item.stock != null && item.cantidad >= item.stock}
                                    title={item.stock != null && item.cantidad >= item.stock
                                      ? `Solo hay ${item.stock} unidades disponibles`
                                      : "Aumentar"}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="text-end fw-bold text-light">
                                ${subtotalFila.toLocaleString('es-CL')} CLP
                              </td>
                              <td className="text-center">
                                <button
                                  onClick={() => eliminarDelCarrito(index)}
                                  className="btn btn-link text-danger p-0 text-decoration-none"
                                  title="Eliminar producto"
                                >
                                  <i className="bi bi-x-circle fs-5"></i>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cupón de Descuento */}
                <div className="card-footer bg-dark border-top border-secondary p-3">
                  <form onSubmit={handleAplicarCupon} className="row g-2 align-items-center">
                    <div className="col-12 col-sm-7">
                      <input
                        type="text"
                        className="form-control form-control-sm bg-dark text-light border-secondary"
                        placeholder="Ingresa cupón (Ej: FELICES50, DUOCUMPLE)"
                        value={inputCupon}
                        onChange={(e) => setInputCupon(e.target.value)}
                        aria-label="Cupón de descuento"
                      />
                    </div>
                    <div className="col-12 col-sm-5">
                      <button type="submit" className="btn btn-outline-warning btn-sm w-100 fw-bold">
                        Aplicar Cupón
                      </button>
                    </div>
                  </form>

                  {feedbackCupon && (
                    <div className={`mt-2 small ${feedbackCupon.success ? 'text-success' : 'text-danger'}`}>
                      {feedbackCupon.mensaje}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resumen de Compra (Sticky) */}
            <div className="col-12 col-lg-4">
              <div className="card bg-secondary bg-opacity-10 border-warning p-4 shadow-lg sticky-top" style={{ top: '90px' }}>
                <h5 className="text-warning fw-bold mb-3">
                  <i className="bi bi-receipt me-2"></i> Resumen del Pedido
                </h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Subtotal Productos:</span>
                  <span className="text-light fw-bold">${subtotal.toLocaleString('es-CL')} CLP</span>
                </div>

                {porcentajeDescuento > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>
                      <i className="bi bi-tag-fill me-1"></i> Descuento ({porcentajeDescuento}%):
                    </span>
                    <span className="fw-bold">-${descuentoMonto.toLocaleString('es-CL')} CLP</span>
                  </div>
                )}

                {motivoDescuento && (
                  <div className="small text-warning bg-warning bg-opacity-10 p-2 rounded mb-2">
                    <i className="bi bi-check-circle me-1"></i> {motivoDescuento}
                  </div>
                )}

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Costo de Envío:</span>
                  <span className="text-light">${costoEnvio.toLocaleString('es-CL')} CLP</span>
                </div>

                <div className="d-flex justify-content-between mb-3 text-secondary small">
                  <span>IVA Incluido (19%):</span>
                  <span>${iva.toLocaleString('es-CL')} CLP</span>
                </div>

                <hr className="border-warning opacity-25" />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fs-5 fw-bold text-light">Total a Pagar:</span>
                  <span className="fs-4 fw-bold text-warning" data-testid="total-carrito">
                    ${total.toLocaleString('es-CL')} CLP
                  </span>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="btn btn-warning btn-lg text-dark fw-bold w-100 shadow mb-3"
                >
                  <i className="bi bi-credit-card-2-front-fill me-2"></i> Proceder al Pago
                </button>

                <Link to="/productos" className="btn btn-outline-light btn-sm text-center">
                  &larr; Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
