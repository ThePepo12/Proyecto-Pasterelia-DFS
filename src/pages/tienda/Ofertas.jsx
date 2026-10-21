/**
 * VISTA OBLIGATORIA: OFERTAS (VERDE)
 * (src/pages/tienda/Ofertas.jsx)
 * 
 * Muestra el catálogo de todos los productos en oferta de Pastelería Mil Sabores.
 * Conecta al endpoint /api/productos/ofertas con fallback a db.js.
 * Incluye badges de descuento, precios originales tachados, precio final CLP,
 * filtros por categoría y búsqueda en tiempo real.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { productoService } from '../../services/productoService.js';
import { useCarrito } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export function Ofertas() {
  const [ofertas, setOfertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [orden, setOrden] = useState('descuento');
  const [mensajeToast, setMensajeToast] = useState('');

  const { agregarAlCarrito } = useCarrito();
  const { user, isSenior } = useAuth();

  useEffect(() => {
    async function cargarOfertas() {
      setCargando(true);
      try {
        const data = await productoService.obtenerOfertas();
        setOfertas(data || []);
      } catch (error) {
        console.error('Error cargando ofertas:', error);
      } finally {
        setCargando(false);
      }
    }
    cargarOfertas();
  }, []);

  // Lista única de categorías presentes en las ofertas
  const categoriasPresentes = useMemo(() => {
    const cats = new Set();
    ofertas.forEach((p) => {
      const nombre = p.categoria?.nombre || p.categoriaNombre;
      if (nombre) cats.add(nombre);
    });
    return Array.from(cats);
  }, [ofertas]);

  // Filtrado y ordenamiento reactivo
  const ofertasFiltradas = useMemo(() => {
    let result = ofertas.filter((prod) => {
      const matchTexto =
        !busqueda ||
        prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        prod.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        prod.descripcion?.toLowerCase().includes(busqueda.toLowerCase());

      const catNombre = prod.categoria?.nombre || prod.categoriaNombre;
      const matchCategoria =
        categoriaFiltro === 'todas' || catNombre === categoriaFiltro;

      return matchTexto && matchCategoria;
    });

    if (orden === 'descuento') {
      result.sort((a, b) => (b.porcentajeDescuento || 0) - (a.porcentajeDescuento || 0));
    } else if (orden === 'precio-asc') {
      result.sort((a, b) => a.precio - b.precio);
    } else if (orden === 'precio-desc') {
      result.sort((a, b) => b.precio - a.precio);
    }

    return result;
  }, [ofertas, busqueda, categoriaFiltro, orden]);

  const handleAgregar = (prod) => {
    agregarAlCarrito({
      codigo: prod.codigo,
      nombre: prod.nombre,
      precio: prod.precio,
      cantidad: 1,
      personalizacion: 'Estándar',
      imagen: prod.imagen
    });
    setMensajeToast(`¡Añadiste "${prod.nombre}" en oferta al carrito!`);
    setTimeout(() => setMensajeToast(''), 3000);
  };

  return (
    <div className="bg-dark text-light py-5 min-vh-100">
      <div className="container">
        {/* Toast Notificación */}
        {mensajeToast && (
          <div
            className="alert alert-success bg-success bg-opacity-25 border-success text-light text-center position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg z-3"
            style={{ minWidth: '320px' }}
            role="alert"
          >
            <i className="bi bi-tag-fill text-success me-2"></i>
            {mensajeToast}
          </div>
        )}

        {/* Banner Promocional 50 Años */}
        <div className="card bg-warning text-dark p-4 p-md-5 mb-5 border-0 shadow-lg position-relative overflow-hidden">
          <div className="row align-items-center">
            <div className="col-12 col-md-8">
              <span className="badge bg-dark text-warning px-3 py-2 fw-bold text-uppercase mb-2">
                Especial 50 Años
              </span>
              <h1 className="display-5 fw-bold mb-2">
                Festival de Ofertas & Descuentos
              </h1>
              <p className="lead mb-3">
                Disfruta de nuestros pasteles y postres icónicos con rebajas de hasta un <strong>20% de descuento directo</strong>.
                {isSenior ? (
                  <span className="d-block fw-bold mt-1 text-danger">
                    <i className="bi bi-award-fill me-1"></i> Beneficio Senior Activo: Tienes un 50% de descuento adicional aplicado en tu checkout.
                  </span>
                ) : (
                  <span className="d-block small text-dark opacity-75 mt-1">
                    ¿Mayor de 50 años o estudiante Duoc UC? Inicia sesión para sumar tus beneficios exclusivos.
                  </span>
                )}
              </p>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-dark text-light p-2">
                  <i className="bi bi-check2-circle text-warning me-1"></i> Envío refrigerado a todo Santiago
                </span>
                <span className="badge bg-dark text-light p-2">
                  <i className="bi bi-percent text-warning me-1"></i> Cupón FELICES50 acumulable
                </span>
              </div>
            </div>
            <div className="col-12 col-md-4 text-center mt-4 mt-md-0">
              <div className="display-1 text-dark fw-bold opacity-25">
                <i className="bi bi-tags-fill"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="card bg-secondary bg-opacity-10 border-secondary p-4 mb-4 rounded-3 shadow-sm">
          <div className="row g-3 align-items-center">
            {/* Buscador */}
            <div className="col-12 col-md-5">
              <label htmlFor="input-buscar-ofertas" className="form-label text-light small fw-bold mb-1">
                Buscar en Ofertas:
              </label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-warning">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  id="input-buscar-ofertas"
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Ej: Chocolate, Tiramisú, Naranja..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  aria-label="Buscar en ofertas"
                />
              </div>
            </div>

            {/* Categoría */}
            <div className="col-12 col-sm-6 col-md-4">
              <label htmlFor="select-categoria-ofertas" className="form-label text-light small fw-bold mb-1">
                Filtrar por Categoría:
              </label>
              <select
                id="select-categoria-ofertas"
                className="form-select bg-dark text-light border-secondary"
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                aria-label="Filtrar por categoría"
              >
                <option value="todas">Todas las categorías en oferta</option>
                {categoriasPresentes.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenar */}
            <div className="col-12 col-sm-6 col-md-3">
              <label htmlFor="select-orden-ofertas" className="form-label text-light small fw-bold mb-1">
                Ordenar por:
              </label>
              <select
                id="select-orden-ofertas"
                className="form-select bg-dark text-light border-secondary"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                aria-label="Ordenar ofertas"
              >
                <option value="descuento">Mayor % Descuento</option>
                <option value="precio-asc">Menor Precio</option>
                <option value="precio-desc">Mayor Precio</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resumen del catálogo de ofertas */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="text-secondary small">
            Se encontraron <strong className="text-warning">{ofertasFiltradas.length}</strong> productos con descuento activo
          </span>
          {busqueda && (
            <button
              className="btn btn-sm btn-outline-secondary text-light"
              onClick={() => {
                setBusqueda('');
                setCategoriaFiltro('todas');
              }}
            >
              <i className="bi bi-x-circle me-1"></i> Quitar filtros
            </button>
          )}
        </div>

        {/* Lista de Productos en Oferta */}
        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="text-secondary mt-2">Cargando ofertas irresistibles...</p>
          </div>
        ) : ofertasFiltradas.length === 0 ? (
          <div className="card bg-secondary bg-opacity-10 border-secondary text-center p-5 my-4">
            <i className="bi bi-tag text-secondary display-4 mb-3"></i>
            <h4 className="text-warning">No hay ofertas que coincidan con tu búsqueda</h4>
            <p className="text-secondary">
              Prueba buscando por otro término o restablece los filtros para ver todas las promociones.
            </p>
            <button
              className="btn btn-outline-warning btn-sm mx-auto"
              onClick={() => {
                setBusqueda('');
                setCategoriaFiltro('todas');
              }}
            >
              Ver todas las ofertas
            </button>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" data-testid="lista-ofertas">
            {ofertasFiltradas.map((prod) => {
              const descuentoPct = prod.porcentajeDescuento || 15;
              const precioOriginal = Math.round(prod.precio * (1 + descuentoPct / 100));

              return (
                <div key={prod.id || prod.codigo} className="col">
                  <div className="card h-100 bg-secondary bg-opacity-10 border-warning border-opacity-50 shadow-lg hover-glow d-flex flex-column position-relative">
                    {/* Badge Promocional */}
                    <div className="position-relative overflow-hidden" style={{ height: '230px' }}>
                      <img
                        src={prod.imagen || '/img/producto_TC001.avif'}
                        alt={prod.nombre}
                        className="w-100 h-100 object-fit-cover"
                        onError={(e) => {
                          e.target.src = '/img/producto_TC001.avif';
                        }}
                      />
                      <span className="position-absolute top-0 start-0 m-2 badge bg-danger fs-6 fw-bold shadow">
                        <i className="bi bi-lightning-charge-fill me-1"></i> -{descuentoPct}% OFF
                      </span>
                      <span className="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75 text-warning border border-warning">
                        {prod.codigo}
                      </span>
                      {prod.stock <= (prod.stockCritico || 5) && (
                        <span className="position-absolute bottom-0 start-0 m-2 badge bg-warning text-dark fw-bold">
                          ¡Últimas {prod.stock} unidades!
                        </span>
                      )}
                    </div>

                    {/* Cuerpo de la Tarjeta */}
                    <div className="card-body d-flex flex-column p-4">
                      <span className="text-secondary small text-uppercase fw-bold mb-1">
                        {prod.categoria?.nombre || prod.categoriaNombre || 'Pastelería Selecta'}
                      </span>
                      <h4 className="card-title text-warning fw-bold mb-2">
                        {prod.nombre}
                      </h4>
                      <p className="card-text text-secondary small flex-grow-1">
                        {prod.descripcion}
                      </p>

                      {/* Desglose de Precios */}
                      <div className="p-3 bg-dark bg-opacity-50 rounded-3 my-3 border border-secondary border-opacity-50">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="text-secondary small">Precio regular:</span>
                          <span className="text-secondary text-decoration-line-through small" data-testid={`precio-original-${prod.codigo}`}>
                            ${precioOriginal.toLocaleString('es-CL')} CLP
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-baseline">
                          <span className="text-warning fw-bold small">En Oferta:</span>
                          <span className="display-6 fs-3 fw-bold text-warning" data-testid={`precio-oferta-${prod.codigo}`}>
                            ${prod.precio.toLocaleString('es-CL')} CLP
                          </span>
                        </div>
                        <div className="text-end text-success small mt-1">
                          <i className="bi bi-arrow-down-circle-fill me-1"></i>
                          Ahorras ${(precioOriginal - prod.precio).toLocaleString('es-CL')} CLP
                        </div>
                      </div>

                      {/* Botones de Acción */}
                      <div className="d-flex gap-2 mt-auto">
                        <Link
                          to={`/producto/${prod.codigo}`}
                          className="btn btn-outline-warning btn-sm flex-grow-1"
                        >
                          <i className="bi bi-eye me-1"></i> Ver Detalle
                        </Link>
                        <button
                          type="button"
                          className="btn btn-warning text-dark fw-bold btn-sm flex-grow-1 shadow"
                          onClick={() => handleAgregar(prod)}
                        >
                          <i className="bi bi-cart-plus-fill me-1"></i> Añadir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
