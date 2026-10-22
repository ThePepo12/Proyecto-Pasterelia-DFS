/**
 * DASHBOARD ADMINISTRATIVO (src/pages/admin/AdminDashboard.jsx)
 * 
 * Vista principal del panel de administración:
 * - Indicadores clave de desempeño (KPIs): Total de productos, inventario, ventas, pedidos y stock crítico
 * - Lista de productos críticos con advertencia visual
 * - Accesos directos a los flujos de gestión (crear producto, catálogo, reportes)
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reporteService } from '../../services/reporteService.js';
import { productoService } from '../../services/productoService.js';

export function AdminDashboard() {
  const [metricasProductos, setMetricasProductos] = useState({
    totalProductos: 0,
    stockTotalUnidades: 0,
    valorTotalInventarioClp: 0,
    productosCriticosCount: 0,
    productosEnOfertaCount: 0
  });

  const [metricasGenerales, setMetricasGenerales] = useState({
    ventasTotalesClp: 0,
    cantidadOrdenes: 0,
    usuariosRegistrados: 0,
    ticketPromedioClp: 0
  });

  const [productosCriticos, setProductosCriticos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDatosDashboard() {
      try {
        const [repProds, repGen, criticos] = await Promise.all([
          reporteService.reporteProductos(),
          reporteService.reporteGenerales(),
          productoService.obtenerCriticos(6)
        ]);

        if (repProds) setMetricasProductos(repProds);
        if (repGen) setMetricasGenerales(repGen);
        if (criticos) setProductosCriticos(criticos);
      } catch (error) {
        console.error('Error cargando indicadores del dashboard:', error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatosDashboard();
  }, []);

  if (cargando) {
    return (
      <div className="text-center py-5" data-testid="dashboard-loading">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Cargando métricas...</span>
        </div>
        <p className="text-secondary mt-3">Calculando indicadores financieros y de stock...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0" data-testid="admin-dashboard">
      {/* Título y Acciones Rápidas */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h2 text-warning fw-bold font-serif mb-1">
            Resumen General del Negocio
          </h1>
          <p className="text-secondary small mb-0">
            Monitoreo en tiempo real de inventario, ventas y estado de la pastelería.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/productos" className="btn btn-warning text-dark fw-bold btn-sm px-3 py-2">
            <i className="bi bi-box-seam me-2"></i>
            Gestionar Productos
          </Link>
          <Link to="/admin/reportes" className="btn btn-outline-light btn-sm px-3 py-2">
            <i className="bi bi-file-earmark-bar-graph me-2"></i>
            Ver Reportes
          </Link>
        </div>
      </div>

      {/* Grid de KPIs Principales */}
      <div className="row g-3 mb-4">
        {/* KPI: Productos Totales */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card bg-secondary bg-opacity-10 border-secondary h-100 p-3 shadow-sm rounded-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-secondary small text-uppercase fw-bold">Catálogo Activo</span>
                <h3 className="text-light fw-bold mb-0 mt-1" data-testid="kpi-total-productos">
                  {metricasProductos.totalProductos}
                </h3>
                <small className="text-secondary">Variedades de repostería</small>
              </div>
              <div className="p-2 bg-warning bg-opacity-10 rounded text-warning fs-3">
                <i className="bi bi-cake2"></i>
              </div>
            </div>
          </div>
        </div>

        {/* KPI: Stock Total */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card bg-secondary bg-opacity-10 border-secondary h-100 p-3 shadow-sm rounded-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-secondary small text-uppercase fw-bold">Unidades en Stock</span>
                <h3 className="text-light fw-bold mb-0 mt-1" data-testid="kpi-stock-total">
                  {metricasProductos.stockTotalUnidades}
                </h3>
                <small className="text-secondary">Unidades disponibles</small>
              </div>
              <div className="p-2 bg-info bg-opacity-10 rounded text-info fs-3">
                <i className="bi bi-boxes"></i>
              </div>
            </div>
          </div>
        </div>

        {/* KPI: Ventas Totales CLP */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card bg-secondary bg-opacity-10 border-secondary h-100 p-3 shadow-sm rounded-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-secondary small text-uppercase fw-bold">Ventas Totales</span>
                <h3 className="text-warning fw-bold mb-0 mt-1" data-testid="kpi-ventas-totales">
                  ${Number(metricasGenerales.ventasTotalesClp || 0).toLocaleString('es-CL')}
                </h3>
                <small className="text-secondary">
                  {metricasGenerales.cantidadOrdenes} pedidos procesados
                </small>
              </div>
              <div className="p-2 bg-success bg-opacity-10 rounded text-success fs-3">
                <i className="bi bi-cash-stack"></i>
              </div>
            </div>
          </div>
        </div>

        {/* KPI: Stock Crítico / Alerta */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card bg-secondary bg-opacity-10 border-danger border-opacity-50 h-100 p-3 shadow-sm rounded-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-danger small text-uppercase fw-bold">Stock Crítico</span>
                <h3 className="text-danger fw-bold mb-0 mt-1" data-testid="kpi-stock-critico">
                  {metricasProductos.productosCriticosCount}
                </h3>
                <small className="text-secondary">&le; 5 unidades restantes</small>
              </div>
              <div className="p-2 bg-danger bg-opacity-10 rounded text-danger fs-3">
                <i className="bi bi-exclamation-triangle"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fila Secundaria: Productos Críticos & Resumen Operativo */}
      <div className="row g-4">
        {/* Tabla de Productos con Stock Crítico */}
        <div className="col-12 col-lg-8">
          <div className="card bg-secondary bg-opacity-10 border-secondary p-4 h-100 shadow-sm rounded-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-warning fw-bold mb-0">
                <i className="bi bi-shield-exclamation text-danger me-2"></i>
                Productos con Stock Crítico (&le; 5 unidades)
              </h5>
              <Link to="/admin/productos" className="btn btn-outline-warning btn-sm">
                Ver Todo el Inventario
              </Link>
            </div>

            {productosCriticos.length === 0 ? (
              <div className="text-center py-4 text-secondary">
                <i className="bi bi-check-circle text-success fs-2 mb-2 d-block"></i>
                ¡Excelente! No hay productos con stock crítico en este momento.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0">
                  <thead className="table-dark text-secondary small text-uppercase border-bottom border-secondary">
                    <tr>
                      <th>Código</th>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th className="text-center">Stock Actual</th>
                      <th className="text-end">Precio CLP</th>
                      <th className="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosCriticos.map((prod) => (
                      <tr key={prod.id || prod.codigo}>
                        <td className="text-warning fw-bold small">{prod.codigo}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={prod.imagen || '/img/producto_TC001.avif'}
                              alt={prod.nombre}
                              className="rounded"
                              style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                              onError={(e) => { e.target.src = '/img/producto_TC001.avif'; }}
                            />
                            <span className="text-light fw-medium small">{prod.nombre}</span>
                          </div>
                        </td>
                        <td className="small text-secondary">{prod.categoria || 'Repostería'}</td>
                        <td className="text-center">
                          <span className={`badge ${prod.stock === 0 ? 'bg-danger' : 'bg-warning text-dark'} fw-bold`}>
                            {prod.stock} un.
                          </span>
                        </td>
                        <td className="text-end text-light small fw-bold">
                          ${Number(prod.precio).toLocaleString('es-CL')}
                        </td>
                        <td className="text-center">
                          <Link
                            to="/admin/productos"
                            className="btn btn-sm btn-outline-warning py-0 px-2 small"
                            title="Actualizar Stock"
                          >
                            Editar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Panel Lateral: Accesos Directos y Estado del Sistema */}
        <div className="col-12 col-lg-4">
          <div className="card bg-secondary bg-opacity-10 border-secondary p-4 h-100 shadow-sm rounded-3">
            <h5 className="text-warning fw-bold mb-3">
              <i className="bi bi-lightning-charge me-2"></i>
              Acciones Rápidas
            </h5>
            <div className="d-grid gap-2 mb-4">
              <Link to="/admin/productos" className="btn btn-warning text-dark fw-bold text-start py-2">
                <i className="bi bi-plus-circle me-2"></i>
                Agregar Nuevo Producto
              </Link>
              <Link to="/admin/categorias" className="btn btn-outline-light text-start py-2">
                <i className="bi bi-tags me-2"></i>
                Administrar Categorías
              </Link>
              <Link to="/admin/usuarios" className="btn btn-outline-light text-start py-2">
                <i className="bi bi-people me-2"></i>
                Control de Usuarios y Roles
              </Link>
              <Link to="/ofertas" className="btn btn-outline-light text-start py-2" target="_blank">
                <i className="bi bi-percent me-2 text-warning"></i>
                Revisar Vista Pública de Ofertas
              </Link>
            </div>

            <div className="p-3 bg-dark bg-opacity-50 rounded border border-secondary border-opacity-50">
              <h6 className="text-light fw-bold small mb-2">
                <i className="bi bi-info-circle text-warning me-2"></i>
                Información del Sistema
              </h6>
              <ul className="list-unstyled text-secondary small mb-0">
                <li className="d-flex justify-content-between py-1 border-bottom border-secondary border-opacity-25">
                  <span>Backend:</span>
                  <span className="text-success fw-bold">Spring Boot 4 / H2</span>
                </li>
                <li className="d-flex justify-content-between py-1 border-bottom border-secondary border-opacity-25">
                  <span>Frontend:</span>
                  <span className="text-light">React 18 + Vite</span>
                </li>
                <li className="d-flex justify-content-between py-1">
                  <span>Persistencia:</span>
                  <span className="text-warning">Dual (API + db.js)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
