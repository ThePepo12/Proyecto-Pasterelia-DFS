/**
 * VISTA OBLIGATORIA: CATEGORÍAS -> CATEGORÍA #1 (VERDE)
 * (src/pages/tienda/Categorias.jsx)
 * 
 * Muestra las tarjetas interactivas de todas las categorías disponibles y, debajo,
 * los productos correspondientes a la categoría seleccionada con filtros reactivos
 * de búsqueda por texto y por forma de la torta.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { categoriaService } from '../../services/categoriaService.js';
import { productoService } from '../../services/productoService.js';
import { useCarrito } from '../../context/CartContext.jsx';

export function Categorias() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();

  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [productos, setProductos] = useState([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  const [cargandoProductos, setCargandoProductos] = useState(false);

  // Filtros reactivos
  const [busqueda, setBusqueda] = useState('');
  const [filtroForma, setFiltroForma] = useState('todas');
  const [mensajeToast, setMensajeToast] = useState('');

  // 1. Cargar todas las categorías
  useEffect(() => {
    async function cargarCats() {
      setCargandoCategorias(true);
      try {
        const data = await categoriaService.obtenerTodas();
        setCategorias(data);

        // Determinar categoría activa por parámetro de URL o por defecto la primera (#1)
        if (data && data.length > 0) {
          const inicial = id
            ? data.find((c) => String(c.id) === String(id)) || data[0]
            : data[0];
          setCategoriaSeleccionada(inicial);
        }
      } catch (error) {
        console.error('Error cargando categorías:', error);
      } finally {
        setCargandoCategorias(false);
      }
    }
    cargarCats();
  }, [id]);

  // 2. Cargar productos de la categoría seleccionada
  useEffect(() => {
    if (!categoriaSeleccionada) return;

    async function cargarProds() {
      setCargandoProductos(true);
      try {
        const prods = await productoService.obtenerPorCategoria(categoriaSeleccionada.id);
        setProductos(prods || []);
      } catch (error) {
        console.error('Error cargando productos de categoría:', error);
      } finally {
        setCargandoProductos(false);
      }
    }
    cargarProds();
  }, [categoriaSeleccionada]);

  // Cambiar categoría y actualizar URL
  const handleSeleccionarCategoria = (cat) => {
    setCategoriaSeleccionada(cat);
    setBusqueda('');
    setFiltroForma('todas');
    navigate(`/categorias/${cat.id}`);
  };

  // Filtrado reactivo en memoria
  const productosFiltrados = useMemo(() => {
    return productos.filter((prod) => {
      const matchTexto =
        !busqueda ||
        prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        prod.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        prod.descripcion.toLowerCase().includes(busqueda.toLowerCase());

      let matchForma = true;
      if (filtroForma === 'circular') {
        matchForma = prod.nombre.toLowerCase().includes('circular');
      } else if (filtroForma === 'cuadrada') {
        matchForma = prod.nombre.toLowerCase().includes('cuadrada');
      }

      return matchTexto && matchForma;
    });
  }, [productos, busqueda, filtroForma]);

  const handleAgregar = (prod) => {
    agregarAlCarrito({
      codigo: prod.codigo,
      nombre: prod.nombre,
      precio: prod.precio,
      cantidad: 1,
      personalizacion: 'Estándar',
      imagen: prod.imagen
    });
    setMensajeToast(`¡"${prod.nombre}" se añadió al carrito!`);
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
            <i className="bi bi-check-circle-fill text-success me-2"></i>
            {mensajeToast}
          </div>
        )}

        {/* Encabezado */}
        <div className="text-center mb-5">
          <span className="badge bg-warning text-dark px-3 py-2 fw-bold text-uppercase mb-2">
            Catálogo por Especialidad
          </span>
          <h1 className="display-5 fw-bold text-warning font-serif">
            Nuestras Categorías de Pastelería
          </h1>
          <p className="lead text-secondary mx-auto" style={{ maxWidth: '750px' }}>
            Explora nuestras 8 líneas de recetas tradicionales elaboradas con maestría artesanal,
            ingredientes de origen y recetas con más de 50 años de tradición.
          </p>
        </div>

        {/* Grid de Tarjetas de Categorías */}
        {cargandoCategorias ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="text-secondary mt-2">Cargando categorías de la pastelería...</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3 mb-5" data-testid="grid-categorias">
            {categorias.map((cat) => {
              const esActiva = categoriaSeleccionada?.id === cat.id;
              return (
                <div key={cat.id} className="col">
                  <div
                    onClick={() => handleSeleccionarCategoria(cat)}
                    role="button"
                    tabIndex={0}
                    className={`card h-100 bg-secondary bg-opacity-10 border transition-all text-center p-3 cursor-pointer ${
                      esActiva
                        ? 'border-warning shadow-lg scale-active bg-opacity-25'
                        : 'border-secondary hover-gold'
                    }`}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.25s ease-in-out'
                    }}
                    data-testid={`categoria-card-${cat.id}`}
                  >
                    <div
                      className="mx-auto rounded-circle overflow-hidden mb-3 border border-warning"
                      style={{ width: '90px', height: '90px' }}
                    >
                      <img
                        src={cat.imagen || '/img/producto_TC001.avif'}
                        alt={cat.nombre}
                        className="w-100 h-100 object-fit-cover"
                        onError={(e) => {
                          e.target.src = '/img/producto_TC001.avif';
                        }}
                      />
                    </div>
                    <h5 className={`fw-bold mb-1 ${esActiva ? 'text-warning' : 'text-light'}`}>
                      {cat.nombre}
                    </h5>
                    <p className="small text-secondary mb-2" style={{ minHeight: '38px' }}>
                      {cat.descripcion}
                    </p>
                    {esActiva ? (
                      <span className="badge bg-warning text-dark fw-bold py-1">
                        <i className="bi bi-check-circle-fill me-1"></i> Seleccionada
                      </span>
                    ) : (
                      <span className="badge bg-dark text-secondary py-1 border border-secondary">
                        Ver Productos
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <hr className="border-warning opacity-25 my-5" />

        {/* Sección Reactiva de Productos de la Categoría */}
        {categoriaSeleccionada && (
          <section data-testid="seccion-productos-categoria">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
              <div>
                <span className="text-secondary small d-block">Mostrando especialidades de:</span>
                <h2 className="display-6 fw-bold text-warning mb-0" data-testid="titulo-categoria-activa">
                  {categoriaSeleccionada.nombre}
                </h2>
              </div>
              <div className="badge bg-secondary bg-opacity-25 border border-secondary p-2 text-warning fs-6">
                {productosFiltrados.length} producto(s) disponible(s)
              </div>
            </div>

            {/* Barra de Filtros y Búsqueda */}
            <div className="card bg-secondary bg-opacity-10 border-secondary p-3 mb-4 rounded-3">
              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-warning">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Buscar por nombre, código o ingrediente..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      aria-label="Buscar productos en categoría"
                    />
                    {busqueda && (
                      <button
                        className="btn btn-outline-secondary text-light"
                        type="button"
                        onClick={() => setBusqueda('')}
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <select
                    className="form-select bg-dark text-light border-secondary"
                    value={filtroForma}
                    onChange={(e) => setFiltroForma(e.target.value)}
                    aria-label="Filtrar por forma"
                  >
                    <option value="todas">Forma: Todas las presentaciones</option>
                    <option value="circular">Solo Circulares</option>
                    <option value="cuadrada">Solo Cuadradas</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid de Productos */}
            {cargandoProductos ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
                <p className="text-secondary mt-2">Cargando delicias...</p>
              </div>
            ) : productosFiltrados.length === 0 ? (
              <div className="card bg-secondary bg-opacity-10 border-secondary text-center p-5 my-4">
                <i className="bi bi-search text-secondary display-4 mb-3"></i>
                <h4 className="text-warning">Sin coincidencias para "{busqueda}"</h4>
                <p className="text-secondary">
                  No se encontraron productos con los filtros seleccionados en esta categoría.
                </p>
                <button
                  className="btn btn-outline-warning btn-sm mx-auto"
                  onClick={() => {
                    setBusqueda('');
                    setFiltroForma('todas');
                  }}
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" data-testid="lista-productos-categoria">
                {productosFiltrados.map((prod) => (
                  <div key={prod.id || prod.codigo} className="col">
                    <div className="card h-100 bg-secondary bg-opacity-10 border-secondary shadow hover-glow d-flex flex-column">
                      {/* Imagen y Badges */}
                      <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
                        <img
                          src={prod.imagen || '/img/producto_TC001.avif'}
                          alt={prod.nombre}
                          className="w-100 h-100 object-fit-cover"
                          onError={(e) => {
                            e.target.src = '/img/producto_TC001.avif';
                          }}
                        />
                        <span className="position-absolute top-0 start-0 m-2 badge bg-dark bg-opacity-75 text-warning border border-warning">
                          {prod.codigo}
                        </span>
                        {prod.enOferta && (
                          <span className="position-absolute top-0 end-0 m-2 badge bg-danger text-light fw-bold">
                            -{prod.porcentajeDescuento || 15}% OFF
                          </span>
                        )}
                        {prod.stock <= (prod.stockCritico || 5) && (
                          <span className="position-absolute bottom-0 start-0 m-2 badge bg-danger text-light">
                            ¡Últimas {prod.stock} un.!
                          </span>
                        )}
                      </div>

                      {/* Cuerpo de la Tarjeta */}
                      <div className="card-body d-flex flex-column p-4">
                        <span className="text-secondary small text-uppercase fw-bold mb-1">
                          {categoriaSeleccionada.nombre}
                        </span>
                        <h5 className="card-title text-warning fw-bold mb-2">
                          {prod.nombre}
                        </h5>
                        <p className="card-text text-secondary small flex-grow-1">
                          {prod.descripcion}
                        </p>

                        {/* Precios */}
                        <div className="my-3 d-flex align-items-baseline justify-content-between">
                          <div>
                            {prod.enOferta ? (
                              <>
                                <span className="text-secondary text-decoration-line-through small me-2">
                                  ${Math.round(prod.precio * (1 + (prod.porcentajeDescuento || 15) / 100)).toLocaleString('es-CL')}
                                </span>
                                <span className="fs-4 fw-bold text-warning">
                                  ${prod.precio.toLocaleString('es-CL')} CLP
                                </span>
                              </>
                            ) : (
                              <span className="fs-4 fw-bold text-warning">
                                ${prod.precio.toLocaleString('es-CL')} CLP
                              </span>
                            )}
                          </div>
                          <span className="badge bg-success bg-opacity-25 text-success border border-success">
                            Stock: {prod.stock}
                          </span>
                        </div>

                        {/* Botones de Acción */}
                        <div className="d-flex gap-2 mt-auto">
                          <Link
                            to={`/producto/${prod.codigo}`}
                            className="btn btn-outline-warning btn-sm flex-grow-1"
                          >
                            <i className="bi bi-eye me-1"></i> Detalle
                          </Link>
                          <button
                            type="button"
                            className="btn btn-warning text-dark fw-bold btn-sm flex-grow-1"
                            onClick={() => handleAgregar(prod)}
                          >
                            <i className="bi bi-cart-plus me-1"></i> Añadir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
