/**
 * SEGUIMIENTO DE DESPACHO (src/pages/tienda/Seguimiento.jsx)
 * 
 * Migrada de legacy/seguimiento.html.
 * Permite buscar pedidos por Folio (ej: MS-501991), visualizar el stepper
 * interactivo de 5 etapas (Confirmado, Horneado, Decoración, En Ruta, Entregado)
 * y simular el avance de estado para la demostración.
 */
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ordenService } from '../../services/ordenService.js';

const ETAPAS = [
  { id: 1, nombre: 'Confirmado', icono: 'bi-check2-circle', desc: 'Orden recibida en el obrador' },
  { id: 2, nombre: 'Horneado', icono: 'bi-fire', desc: 'Bizcocho en horno de piedra' },
  { id: 3, nombre: 'Decoración', icono: 'bi-brush', desc: 'Relleno y glaseado artesanal' },
  { id: 4, nombre: 'En ruta', icono: 'bi-truck', desc: 'Móvil refrigerado en camino' },
  { id: 5, nombre: 'Entregado', icono: 'bi-house-check', desc: 'Recibido en tu puerta' }
];

export function Seguimiento() {
  const [searchParams] = useSearchParams();
  const [folioInput, setFolioInput] = useState(searchParams.get('folio') || 'MS-501992');
  const [orden, setOrden] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');

  const buscarOrden = async (folioABuscar) => {
    const f = (folioABuscar || folioInput).trim().toUpperCase();
    if (!f) return;

    setCargando(true);
    setErrorBusqueda('');
    try {
      const encontrada = await ordenService.obtenerPorFolio(f);
      if (encontrada) {
        setOrden(encontrada);
      } else {
        setErrorBusqueda(`No se encontró ninguna orden con el folio "${f}". Prueba con MS-501991 o MS-501992.`);
        setOrden(null);
      }
    } catch (e) {
      setErrorBusqueda('Error consultando el folio en el servidor.');
      setOrden(null);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const paramFolio = searchParams.get('folio');
    if (paramFolio) {
      setFolioInput(paramFolio);
      buscarOrden(paramFolio);
    } else {
      buscarOrden('MS-501992');
    }
  }, [searchParams]);

  // Determinar etapa activa
  const etapaActualIndex = () => {
    if (!orden) return 1;
    const est = (orden.estado || '').toLowerCase();
    if (est.includes('entreg')) return 5;
    if (est.includes('ruta')) return 4;
    if (est.includes('decor')) return 3;
    if (est.includes('horn') || est.includes('preparac')) return 2;
    return 1;
  };

  const pasoActivo = etapaActualIndex();

  return (
    <div className="bg-dark text-light py-5 min-vh-100">
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Encabezado */}
        <div className="text-center mb-5">
          <span className="badge bg-warning text-dark px-3 py-2 text-uppercase fw-bold mb-2">
            Despacho en Frío &bull; Tracking en Vivo
          </span>
          <h1 className="display-5 fw-bold text-warning">Seguimiento de tu Orden</h1>
          <p className="lead text-secondary mx-auto">
            Ingresa el folio de tu boleta para ver en qué etapa de preparación y despacho se encuentra tu pastel.
          </p>
        </div>

        {/* Buscador de Folio */}
        <div className="card bg-secondary bg-opacity-10 border-warning p-4 shadow-sm mb-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              buscarOrden();
            }}
            className="row g-2 align-items-center"
          >
            <div className="col-12 col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-warning">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Ej: MS-501991, MS-501992"
                  value={folioInput}
                  onChange={(e) => setFolioInput(e.target.value)}
                  aria-label="Folio de orden"
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <button type="submit" disabled={cargando} className="btn btn-warning text-dark fw-bold w-100">
                {cargando ? 'Consultando...' : 'Buscar Pedido'}
              </button>
            </div>
          </form>

          {errorBusqueda && (
            <div className="alert alert-danger py-2 small mt-3 mb-0" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorBusqueda}
            </div>
          )}
        </div>

        {/* Tarjeta de Progreso */}
        {orden && (
          <div className="card bg-secondary bg-opacity-10 border-secondary p-4 p-md-5 rounded-4 shadow-lg mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2 pb-3 border-bottom border-secondary border-opacity-25">
              <div>
                <span className="text-secondary small">Folio Consultador:</span>
                <h3 className="text-warning fw-bold mb-0">{orden.folio}</h3>
              </div>
              <div className="text-md-end">
                <span className="text-secondary small">Fecha y Hora:</span>
                <div className="text-light fw-bold">{orden.fecha} &bull; {orden.hora || '12:00'}</div>
              </div>
            </div>

            {/* Stepper de 5 Etapas */}
            <div className="my-4">
              <div className="d-flex justify-content-between position-relative mb-4">
                {/* Línea conectora de fondo */}
                <div
                  className="position-absolute top-50 start-0 translate-middle-y w-100 bg-secondary"
                  style={{ height: '4px', zIndex: 1 }}
                ></div>
                {/* Línea conectora activa */}
                <div
                  className="position-absolute top-50 start-0 translate-middle-y bg-warning"
                  style={{
                    height: '4px',
                    width: `${((pasoActivo - 1) / (ETAPAS.length - 1)) * 100}%`,
                    zIndex: 2,
                    transition: 'width 0.4s ease'
                  }}
                ></div>

                {ETAPAS.map((etapa) => {
                  const alcanzada = etapa.id <= pasoActivo;
                  const actual = etapa.id === pasoActivo;
                  return (
                    <div
                      key={etapa.id}
                      className="text-center position-relative"
                      style={{ zIndex: 3 }}
                    >
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center mx-auto shadow ${
                          actual
                            ? 'bg-warning text-dark border border-3 border-light'
                            : alcanzada
                            ? 'bg-success text-white'
                            : 'bg-dark text-secondary border border-secondary'
                        }`}
                        style={{ width: '48px', height: '48px' }}
                      >
                        <i className={`bi ${etapa.icono} fs-5`}></i>
                      </div>
                      <span className={`small fw-bold d-block mt-2 ${actual ? 'text-warning' : alcanzada ? 'text-light' : 'text-secondary'}`}>
                        {etapa.nombre}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Detalle del estado actual */}
              <div className="alert alert-warning bg-warning bg-opacity-10 border-warning text-light text-center py-3">
                <i className="bi bi-info-circle-fill text-warning me-2 fs-5"></i>
                Estado actual: <strong>{orden.estado}</strong> &bull; {ETAPAS[pasoActivo - 1]?.desc}
              </div>
            </div>

            {/* Datos del Cliente y Productos */}
            <div className="row g-4 pt-3 border-top border-secondary border-opacity-25">
              <div className="col-12 col-md-6">
                <h6 className="text-warning fw-bold text-uppercase small">Destino de Entrega</h6>
                <p className="text-light mb-1 fw-bold">{orden.clienteNombre || 'Cliente'}</p>
                <p className="text-secondary small mb-1">{orden.direccionEntrega}</p>
                <p className="text-secondary small mb-0">{orden.clienteEmail}</p>
              </div>

              <div className="col-12 col-md-6">
                <h6 className="text-warning fw-bold text-uppercase small">Detalle del Pedido</h6>
                {orden.items && (
                  <ul className="list-unstyled small text-secondary mb-2">
                    {orden.items.map((item, idx) => (
                      <li key={idx} className="mb-1 text-light">
                        <strong>{item.cantidad}x</strong> {item.nombreProducto} (${Number(item.subtotal || item.precioUnitario).toLocaleString('es-CL')} CLP)
                      </li>
                    ))}
                  </ul>
                )}
                <div className="fw-bold text-warning fs-5">
                  Total Pagado: ${Number(orden.total).toLocaleString('es-CL')} CLP
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
