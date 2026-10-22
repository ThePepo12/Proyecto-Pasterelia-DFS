/**
 * VISTA OBLIGATORIA: PEDIDOS Y REPORTES FINANCIEROS (VERDE)
 * (src/pages/admin/AdminReportes.jsx)
 * 
 * Gestión del ciclo de vida de pedidos y analítica financiera:
 * - Historial completo de órdenes con cambio reactivo de estado
 * - Detalle modal de boleta tributaria e ítems adquiridos
 * - Indicadores financieros: Total de ventas, Ticket Promedio y conteo por estado
 * - Exportación de reporte a archivo CSV y vista imprimible
 * - Conectado con Spring Boot (ordenService, reporteService) y db.js
 */
import React, { useState, useEffect, useMemo } from 'react';
import { ordenService } from '../../services/ordenService.js';
import { reporteService } from '../../services/reporteService.js';

const ESTADOS_DISPONIBLES = [
  'Confirmado',
  'En Preparación',
  'En Reparto',
  'Entregado',
  'Cancelado'
];

export function AdminReportes() {
  const [ordenes, setOrdenes] = useState([]);
  const [metricasGenerales, setMetricasGenerales] = useState({
    ventasTotalesClp: 0,
    cantidadOrdenes: 0,
    usuariosRegistrados: 0,
    ticketPromedioClp: 0
  });

  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [ordenDetalle, setOrdenDetalle] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');
  const [actualizandoId, setActualizandoId] = useState(null);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [listaOrdenes, repGen] = await Promise.all([
        ordenService.obtenerTodas(),
        reporteService.reporteGenerales()
      ]);
      setOrdenes(listaOrdenes || []);
      if (repGen) setMetricasGenerales(repGen);
    } catch (error) {
      console.error('Error cargando pedidos y reportes:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const mostrarMensaje = (msg) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(''), 3500);
  };

  // Filtrado de órdenes
  const ordenesFiltradas = useMemo(() => {
    return ordenes.filter((o) => {
      const coincideTexto =
        o.folio?.toLowerCase().includes(busqueda.toLowerCase()) ||
        o.clienteNombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        o.clienteEmail?.toLowerCase().includes(busqueda.toLowerCase()) ||
        o.comuna?.toLowerCase().includes(busqueda.toLowerCase());

      const coincideEstado =
        filtroEstado === 'TODOS' ||
        (o.estado || 'Confirmado').toLowerCase() === filtroEstado.toLowerCase();

      return coincideTexto && coincideEstado;
    });
  }, [ordenes, busqueda, filtroEstado]);

  // Totales acumulados recalculados
  const totalRecaudadoFiltrado = useMemo(() => {
    return ordenesFiltradas.reduce((sum, o) => sum + (o.total || 0), 0);
  }, [ordenesFiltradas]);

  // Cambiar estado de una orden
  const handleCambiarEstado = async (id, nuevoEstado) => {
    setActualizandoId(id);
    try {
      await ordenService.cambiarEstado(id, nuevoEstado);
      setOrdenes((prev) =>
        prev.map((o) => (o.id === id ? { ...o, estado: nuevoEstado } : o))
      );
      mostrarMensaje(`Estado de orden #${id} actualizado a "${nuevoEstado}".`);
    } catch (error) {
      console.error('Error actualizando estado de orden:', error);
      alert('Error: ' + (error.message || 'No se pudo actualizar el estado de la orden.'));
    } finally {
      setActualizandoId(null);
    }
  };

  // Exportar a CSV
  const handleExportarCsv = () => {
    if (ordenes.length === 0) {
      alert('No hay órdenes para exportar.');
      return;
    }

    const encabezados = ['Folio', 'Fecha', 'Hora', 'Cliente', 'Email', 'Telefono', 'Comuna', 'Estado', 'Total CLP'];
    const filas = ordenes.map((o) => [
      `"${o.folio || ''}"`,
      `"${o.fecha || ''}"`,
      `"${o.hora || ''}"`,
      `"${(o.clienteNombre || '').replace(/"/g, '""')}"`,
      `"${o.clienteEmail || ''}"`,
      `"${o.telefono || ''}"`,
      `"${o.comuna || ''}"`,
      `"${o.estado || 'Confirmado'}"`,
      o.total || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [encabezados.join(';'), ...filas.map((f) => f.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_ventas_milsabores_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    mostrarMensaje('Reporte CSV descargado con éxito.');
  };

  return (
    <div className="container-fluid p-0" data-testid="admin-reportes">
      {/* Toast de Éxito */}
      {mensajeExito && (
        <div
          className="alert alert-success bg-success bg-opacity-25 border-success text-light text-center position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg z-3"
          style={{ minWidth: '350px' }}
          role="alert"
          data-testid="toast-exito-reporte"
        >
          <i className="bi bi-check-circle-fill text-success me-2"></i>
          {mensajeExito}
        </div>
      )}

      {/* Encabezado y Acciones */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h2 text-warning fw-bold font-serif mb-1">
            Pedidos & Reportes Financieros
          </h1>
          <p className="text-secondary small mb-0">
            Seguimiento de compras, actualización de despachos y consolidado de ventas en moneda nacional.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            onClick={handleExportarCsv}
            className="btn btn-outline-warning btn-sm px-3 py-2"
            data-testid="btn-exportar-csv"
          >
            <i className="bi bi-file-earmark-spreadsheet me-2"></i>
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-warning text-dark fw-bold btn-sm px-3 py-2 shadow"
            data-testid="btn-imprimir-reporte"
          >
            <i className="bi bi-printer me-2"></i>
            Imprimir Reporte
          </button>
        </div>
      </div>

      {/* Grid de Métricas Financieras */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card bg-secondary bg-opacity-10 border-secondary p-3 rounded-3 shadow-sm h-100">
            <span className="text-secondary small text-uppercase fw-bold">Ventas Totales</span>
            <h3 className="text-warning fw-bold mb-0 mt-1" data-testid="metric-ventas-totales">
              ${Number(metricasGenerales.ventasTotalesClp || totalRecaudadoFiltrado).toLocaleString('es-CL')}
            </h3>
            <small className="text-secondary">Ingresos brutos acumulados</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card bg-secondary bg-opacity-10 border-secondary p-3 rounded-3 shadow-sm h-100">
            <span className="text-secondary small text-uppercase fw-bold">Total Pedidos</span>
            <h3 className="text-light fw-bold mb-0 mt-1" data-testid="metric-total-pedidos">
              {ordenes.length}
            </h3>
            <small className="text-secondary">Órdenes procesadas en tienda</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card bg-secondary bg-opacity-10 border-secondary p-3 rounded-3 shadow-sm h-100">
            <span className="text-secondary small text-uppercase fw-bold">Ticket Promedio</span>
            <h3 className="text-info fw-bold mb-0 mt-1" data-testid="metric-ticket-promedio">
              ${Number(metricasGenerales.ticketPromedioClp || (ordenes.length > 0 ? Math.round(totalRecaudadoFiltrado / ordenes.length) : 0)).toLocaleString('es-CL')}
            </h3>
            <small className="text-secondary">Gasto promedio por compra</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card bg-secondary bg-opacity-10 border-secondary p-3 rounded-3 shadow-sm h-100">
            <span className="text-secondary small text-uppercase fw-bold">Filtro Actual</span>
            <h3 className="text-success fw-bold mb-0 mt-1">
              ${totalRecaudadoFiltrado.toLocaleString('es-CL')}
            </h3>
            <small className="text-secondary">{ordenesFiltradas.length} órdenes coincidentes</small>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="card bg-secondary bg-opacity-10 border-secondary p-3 mb-4 rounded-3 shadow-sm">
        <div className="row g-3 align-items-center">
          {/* Buscador */}
          <div className="col-12 col-md-6 col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Buscar por folio (MS-...), cliente, correo o comuna..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar orden"
                data-testid="input-buscar-orden"
              />
              {busqueda && (
                <button
                  type="button"
                  className="btn btn-dark border-secondary text-secondary"
                  onClick={() => setBusqueda('')}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>

          {/* Filtro por Estado */}
          <div className="col-12 col-md-4 col-lg-4">
            <select
              className="form-select bg-dark text-light border-secondary"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              aria-label="Filtrar por estado de pedido"
              data-testid="select-filtro-estado"
            >
              <option value="TODOS">Todos los Estados ({ordenes.length})</option>
              {ESTADOS_DISPONIBLES.map((est) => (
                <option key={est} value={est}>
                  {est}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-2 col-lg-3 text-md-end text-secondary small">
            Listando <strong>{ordenesFiltradas.length}</strong> órdenes
          </div>
        </div>
      </div>

      {/* Tabla de Órdenes */}
      <div className="card bg-secondary bg-opacity-10 border-secondary shadow-sm rounded-3 overflow-hidden">
        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Cargando pedidos...</span>
            </div>
          </div>
        ) : ordenesFiltradas.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <i className="bi bi-receipt display-4 mb-3 d-block text-secondary"></i>
            <h5>No se encontraron órdenes registradas</h5>
            <p className="small">Las compras realizadas en el checkout se reflejarán automáticamente aquí.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0" data-testid="tabla-admin-ordenes">
              <thead className="table-dark text-secondary small text-uppercase border-bottom border-secondary">
                <tr>
                  <th scope="col" style={{ width: '130px' }}>Folio</th>
                  <th scope="col" style={{ width: '110px' }}>Fecha</th>
                  <th scope="col">Cliente & Despacho</th>
                  <th scope="col" className="text-end" style={{ width: '120px' }}>Total CLP</th>
                  <th scope="col" className="text-center" style={{ width: '180px' }}>Estado Operativo</th>
                  <th scope="col" className="text-end" style={{ width: '110px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenesFiltradas.map((ord) => {
                  const estadoActual = ord.estado || 'Confirmado';
                  return (
                    <tr key={ord.id || ord.folio} data-testid={`fila-orden-${ord.id || ord.folio}`}>
                      {/* Folio */}
                      <td>
                        <span className="badge bg-dark border border-warning text-warning font-monospace" data-testid={`badge-folio-${ord.id || ord.folio}`}>
                          {ord.folio}
                        </span>
                      </td>

                      {/* Fecha */}
                      <td className="small text-secondary">
                        <span className="text-light d-block">{ord.fecha}</span>
                        <span style={{ fontSize: '0.75rem' }}>{ord.hora || '12:00'} hrs</span>
                      </td>

                      {/* Cliente & Despacho */}
                      <td>
                        <strong className="text-light d-block">{ord.clienteNombre}</strong>
                        <span className="small text-secondary">
                          <i className="bi bi-geo-alt me-1"></i>
                          {ord.comuna || 'Santiago'} ({ord.region || 'RM'}) &bull; {ord.telefono}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="text-end fw-bold text-warning">
                        ${Number(ord.total || 0).toLocaleString('es-CL')}
                      </td>

                      {/* Selector de Estado */}
                      <td className="text-center">
                        <select
                          className={`form-select form-select-sm bg-dark text-light border-${
                            estadoActual === 'Entregado'
                              ? 'success'
                              : estadoActual === 'Cancelado'
                              ? 'danger'
                              : 'warning'
                          }`}
                          value={estadoActual}
                          disabled={actualizandoId === ord.id}
                          onChange={(e) => handleCambiarEstado(ord.id, e.target.value)}
                          aria-label={`Cambiar estado de orden ${ord.folio}`}
                          data-testid={`select-estado-${ord.id || ord.folio}`}
                        >
                          {ESTADOS_DISPONIBLES.map((est) => (
                            <option key={est} value={est}>
                              {est}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Acciones */}
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => setOrdenDetalle(ord)}
                          title="Ver Boleta y Detalle de Productos"
                          data-testid={`btn-ver-orden-${ord.id || ord.folio}`}
                        >
                          <i className="bi bi-file-earmark-text me-1"></i>
                          Boleta
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DETALLE DE ORDEN / BOLETA ELECTRÓNICA */}
      {ordenDetalle && (
        <div
          className="modal show d-block bg-black bg-opacity-75 z-3"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="modal-orden-titulo"
          data-testid="modal-detalle-orden"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-light border-warning shadow-lg">
              <div className="modal-header border-secondary border-opacity-50">
                <h5 className="modal-title text-warning fw-bold font-serif" id="modal-orden-titulo">
                  <i className="bi bi-receipt me-2"></i>
                  Boleta Electrónica &bull; Folio {ordenDetalle.folio}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setOrdenDetalle(null)}
                  aria-label="Cerrar ventana"
                ></button>
              </div>

              <div className="modal-body p-4">
                {/* Cabecera del pedido */}
                <div className="row g-3 mb-4 p-3 bg-secondary bg-opacity-10 rounded-3 border border-secondary border-opacity-25">
                  <div className="col-12 col-md-6">
                    <h6 className="text-warning fw-bold small text-uppercase mb-2">Datos del Cliente</h6>
                    <p className="mb-1 small"><strong>Nombre:</strong> {ordenDetalle.clienteNombre}</p>
                    <p className="mb-1 small"><strong>Correo:</strong> {ordenDetalle.clienteEmail}</p>
                    <p className="mb-0 small"><strong>Teléfono:</strong> {ordenDetalle.telefono}</p>
                  </div>
                  <div className="col-12 col-md-6">
                    <h6 className="text-warning fw-bold small text-uppercase mb-2">Datos de Entrega</h6>
                    <p className="mb-1 small"><strong>Dirección:</strong> {ordenDetalle.direccionEntrega || 'Retiro en tienda'}</p>
                    <p className="mb-1 small"><strong>Comuna:</strong> {ordenDetalle.comuna} ({ordenDetalle.region})</p>
                    <p className="mb-0 small"><strong>Fecha Programada:</strong> {ordenDetalle.fechaEntrega} ({ordenDetalle.horarioEntrega || 'Hábil'})</p>
                  </div>
                </div>

                {/* Tabla de Productos Comprados */}
                <h6 className="text-warning fw-bold small text-uppercase mb-2">Productos Comprados</h6>
                <div className="table-responsive mb-4">
                  <table className="table table-dark table-borderless align-middle mb-0">
                    <thead className="border-bottom border-secondary text-secondary small text-uppercase">
                      <tr>
                        <th>Producto</th>
                        <th className="text-center">Cant.</th>
                        <th className="text-end">Precio</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(ordenDetalle.items || []).map((it, idx) => (
                        <tr key={idx} className="border-bottom border-secondary border-opacity-25">
                          <td>
                            <strong className="text-light d-block">{it.nombreProducto || it.nombre}</strong>
                            <span className="small text-secondary">{it.personalizacion || 'Estándar'}</span>
                          </td>
                          <td className="text-center fw-bold">{it.cantidad}</td>
                          <td className="text-end text-secondary">${(it.precioUnitario || it.precio || 0).toLocaleString('es-CL')}</td>
                          <td className="text-end fw-bold text-light">${(it.subtotal || (it.precio * it.cantidad) || 0).toLocaleString('es-CL')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totales */}
                <div className="row justify-content-end">
                  <div className="col-12 col-sm-6">
                    <div className="d-flex justify-content-between small py-1 text-secondary">
                      <span>Subtotal:</span>
                      <span className="text-light">${(ordenDetalle.subtotal || 0).toLocaleString('es-CL')} CLP</span>
                    </div>
                    {ordenDetalle.montoDescuento > 0 && (
                      <div className="d-flex justify-content-between small py-1 text-success fw-bold">
                        <span>Descuento Aplicado:</span>
                        <span>-${Number(ordenDetalle.montoDescuento).toLocaleString('es-CL')} CLP</span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between small py-1 text-secondary">
                      <span>Despacho Refrigerado:</span>
                      <span className="text-light">${(ordenDetalle.envio || 3500).toLocaleString('es-CL')} CLP</span>
                    </div>
                    <div className="d-flex justify-content-between small py-1 text-secondary">
                      <span>IVA (19% incluido):</span>
                      <span>${(ordenDetalle.iva || 0).toLocaleString('es-CL')} CLP</span>
                    </div>
                    <hr className="border-warning my-2" />
                    <div className="d-flex justify-content-between align-items-center py-1">
                      <strong className="text-light fs-5">Total Pagado:</strong>
                      <strong className="text-warning fs-4" data-testid="total-boleta-modal">
                        ${Number(ordenDetalle.total || 0).toLocaleString('es-CL')} CLP
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-secondary border-opacity-50">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setOrdenDetalle(null)}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  className="btn btn-warning text-dark fw-bold"
                  onClick={() => window.print()}
                >
                  <i className="bi bi-printer-fill me-2"></i>
                  Imprimir Boleta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReportes;
