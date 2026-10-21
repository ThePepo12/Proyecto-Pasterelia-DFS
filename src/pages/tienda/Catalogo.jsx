/**
 * CATÁLOGO GENERAL DE PRODUCTOS (src/pages/tienda/Catalogo.jsx)
 * 
 * Migrada de legacy/categoria.html.
 * Ofrece listado completo de productos, buscador en tiempo real,
 * filtros por categoría y ordenamiento con maquetación responsiva en Bootstrap.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productoService } from '../../services/productoService.js';
import { categoriaService } from '../../services/categoriaService.js';
import { useCarrito } from '../../context/CartContext.jsx';

export function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [orden, setOrden] = useState('destacados');
  const [mensajeToast, setMensajeToast] = useState('');

  const [searchParams] = useSearchParams();
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    async function inicializar() {
      try {
        const [prodsData, catsData] = await Promise.all([
          productoService.obtenerTodos(),
          categoriaService.obtenerTodas()
        ]);
        setProductos(prodsData);
        setCategorias(catsData);

        const catParam = searchParams.get('categoria');
        if (catParam) {
          setCategoriaSeleccionada(catParam);
        }
      } catch (e) {
        console.error('Error cargando catálogo:', e);
      } finally {
        setCargando(false);
      }
    }
    inicializar();
  }, [searchParams]);

  // Filtrado y ordenamiento en memoria
  const productosFiltrados = useMemo(() => {
    return productos
      .filter((p) => {
        const coincideTexto =
          p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.codigo?.toLowerCase().includes(busqueda.toLowerCase());

        let coincideCat = true;
        if (categoriaSeleccionada !== 'todas') {
          const catId = p.categoriaId || p.categoria?.id;
          const catNombre = p.categoriaNombre || p.categoria?.nombre;
          coincideCat =
            String(catId) === String(categoriaSeleccionada) ||
            catNombre?.toLowerCase() === categoriaSeleccionada.toLowerCase();
        }

        return coincideTexto && coincideCat;
      })
      .sort((a, b) => {
        if (orden === 'precio-menor') return a.precio - b.precio;
        if (orden === 'precio-mayor') return b.precio - a.precio;
        if (orden === 'nombre') return a.nombre.localeCompare(b.nombre);
        return 0; // destacados / defecto
      });
  }, [productos, busqueda, categoriaSeleccionada, orden]);

  const handleAgregar = (prod) => {
    agregarAlCarrito({
      codigo: prod.codigo,
      nombre: prod.nombre,
      precio: prod.precio,
      cantidad: 1,
      personalizacion: 'Estándar',
      imagen: prod.imagen
    });
    setMensajeToast(`¡"${prod.nombre}" agregado al carrito!`);
    setTimeout(() => setMensajeToast(''), 3000);
  };

  return (
    <div className="bg-dark text-light py-5 min-vh-100">
      <div className="container">
        {/* Notificación Toast */}
        {mensajeToast && (
          <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1090 }}>
            <div className="toast show bg-success text-white border-0 shadow">
              <div className="d-flex align-items-center p-3">
                <i className="bi bi-check-circle-fill fs-4 me-2"></i>
                <div>{mensajeToast}</div>
              </div>
            </div>
          </div>
        )}

        {/* Encabezado */}
        <div className="text-center mb-5">
          <span className="badge bg-warning text-dark px-3 py-2 text-uppercase fw-bold mb-2">
            Catálogo Completo
          </span>
          <h1 className="display-5 fw-bold text-warning">Nuestras Creaciones Artesanales</h1>
          <p className="lead text-secondary mx-auto" style={{ maxWidth: '680px' }}>
            Explora las 8 categorías de pastelería fina, tradicionales recetas chilenas y opciones para todos los gustos y requerimientos nutricionales.
          </p>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="card bg-secondary bg-opacity-10 border-warning p-4 mb-5 shadow-sm">
          <div className="row g-3 align-items-center">
            {/* Buscador */}
            <div className="col-12 col-md-5">
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
                  aria-label="Buscar producto"
                />
              </div>
            </div>

            {/* Selector de Categoría */}
            <div className="col-12 col-sm-6 col-md-4">
              <select
                className="form-select bg-dark text-light border-secondary"
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                aria-label="Filtrar por categoría"
              >
                <option value="todas">Todas las Categorías (8)</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenamiento */}
            <div className="col-12 col-sm-6 col-md-3">
              <select
                className="form-select bg-dark text-light border-secondary"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                aria-label="Ordenar productos"
              >
                <option value="destacados">Ordenar: Destacados</option>
                <option value="precio-menor">Precio: Menor a Mayor</option>
                <option value="precio-mayor">Precio: Mayor a Menor</option>
                <option value="nombre">Alfabético: A - Z</option>
              </select>
            </div>
          </div>

          {/* Pastillas de Categorías Rápidas */}
          <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25">
            <button
              onClick={() => setCategoriaSeleccionada('todas')}
              className={`btn btn-sm ${categoriaSeleccionada === 'todas' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
            >
              Todas
            </button>
            {categorias.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoriaSeleccionada(String(c.id))}
                className={`btn btn-sm ${String(categoriaSeleccionada) === String(c.id) ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
              >
                {c.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Listado de Productos */}
        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-secondary mt-2">Preparando catálogo...</p>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-5 card bg-dark border-secondary p-5">
            <i className="bi bi-emoji-frown text-warning fs-1 mb-2"></i>
            <h4 className="text-light">No encontramos productos con ese filtro</h4>
            <p className="text-secondary">Prueba con otra palabra clave o limpia el filtro de categoría.</p>
            <button
              onClick={() => {
                setBusqueda('');
                setCategoriaSeleccionada('todas');
              }}
              className="btn btn-outline-warning btn-sm mx-auto"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {productosFiltrados.map((prod) => (
              <div key={prod.id || prod.codigo} className="col-12 col-sm-6 col-lg-3">
                <div className="card h-100 bg-secondary bg-opacity-10 border-secondary border-opacity-50 text-light shadow-sm d-flex flex-column">
                  <div className="position-relative" style={{ height: '210px', overflow: 'hidden' }}>
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      className="w-100 h-100 object-fit-cover"
                      onError={(e) => {
                        e.target.src = '/img/producto_TC001.avif';
                      }}
                    />
                    {prod.enOferta && (
                      <span className="position-absolute top-0 start-0 m-2 badge bg-danger">
                        -{prod.porcentajeDescuento || 10}% Oferta
                      </span>
                    )}
                    <span className="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75 text-warning border border-warning">
                      {prod.codigo}
                    </span>
                  </div>

                  <div className="card-body d-flex flex-column p-3">
                    <span className="text-warning small text-uppercase fw-bold mb-1">
                      {prod.categoriaNombre || prod.categoria?.nombre || 'Pastelería'}
                    </span>
                    <h6 className="card-title fw-bold text-light mb-1">{prod.nombre}</h6>
                    <p className="card-text text-secondary small flex-grow-1 line-clamp-2">
                      {prod.descripcion}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary border-opacity-25">
                      <span className="fs-5 fw-bold text-warning">
                        ${Number(prod.precio).toLocaleString('es-CL')} CLP
                      </span>
                      <small className="text-secondary">
                        Stock: <span className={prod.stock <= 5 ? 'text-danger fw-bold' : 'text-light'}>{prod.stock}</span>
                      </small>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <Link
                        to={`/producto/${prod.codigo}`}
                        className="btn btn-outline-light btn-sm flex-grow-1"
                      >
                        Ver Detalle
                      </Link>
                      <button
                        onClick={() => handleAgregar(prod)}
                        className="btn btn-warning btn-sm text-dark fw-bold px-3"
                        title="Añadir al carrito"
                      >
                        <i className="bi bi-cart-plus-fill"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
