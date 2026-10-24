/**
 * HOME / INICIO (src/pages/tienda/Home.jsx)
 * 
 * Migrada de legacy/index.html.
 * Presenta el Hero de 50 años, hitos, productos destacados con botón de compra rápida,
 * historia institucional y testimonios.
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productoService } from '../../services/productoService.js';
import { useCarrito } from '../../context/CartContext.jsx';

export function Home() {
  const [destacados, setDestacados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensajeToast, setMensajeToast] = useState('');
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    async function cargar() {
      try {
        const prods = await productoService.obtenerTodos();
        // Tomar primeros 4 productos como destacados
        setDestacados(prods.slice(0, 4));
      } catch (e) {
        console.error('Error cargando destacados:', e);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  const handleAgregar = (prod) => {
    agregarAlCarrito({
      codigo: prod.codigo,
      nombre: prod.nombre,
      precio: prod.precio,
      cantidad: 1,
      personalizacion: 'Estándar',
      imagen: prod.imagen,
      stock: prod.stock
    });
    setMensajeToast(`¡"${prod.nombre}" agregado al carrito!`);
    setTimeout(() => setMensajeToast(''), 3000);
  };

  return (
    <div>
      {/* Toast Notificación */}
      {mensajeToast && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1090 }}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast show bg-success text-white border-0 shadow">
            <div className="d-flex align-items-center p-3">
              <i className="bi bi-check-circle-fill fs-4 me-2"></i>
              <div className="flex-grow-1">{mensajeToast}</div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-dark text-light py-5 border-bottom border-warning position-relative overflow-hidden">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-7">
              <span className="badge bg-warning text-dark px-3 py-2 fw-bold text-uppercase mb-3">
                1976 - 2026 &bull; 50 Años de Historia
              </span>
              <h1 className="display-4 fw-bold text-warning lh-tight mb-3">
                Tradición, Pasión y Sabor en Cada Creación
              </h1>
              <p className="lead text-secondary mb-4">
                Elaboramos pastelería fina con recetas artesanales de más de medio siglo.
                Desde nuestras icónicas tortas circulares y cuadradas hasta opciones sin azúcar, veganas y libres de gluten.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/productos" className="btn btn-warning btn-lg fw-bold text-dark px-4 shadow">
                  <i className="bi bi-grid-3x3-gap-fill me-2"></i> Ver Catálogo Completo
                </Link>
                <Link to="/ofertas" className="btn btn-outline-warning btn-lg px-4">
                  <i className="bi bi-tag-fill me-2"></i> Ver Ofertas Especiales
                </Link>
              </div>
            </div>

            <div className="col-12 col-lg-5 text-center">
              <div className="p-3 bg-secondary bg-opacity-10 rounded-4 border border-warning shadow-lg">
                <img
                  src="/img/hero_mockup.png"
                  alt="Pastelería Mil Sabores 50 Años"
                  className="img-fluid rounded-3 shadow"
                  style={{ maxHeight: '360px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/img/producto_TE001.avif';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Hitos y Beneficios Clave */}
      <section className="py-5 bg-dark text-light border-bottom border-secondary border-opacity-25">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="card h-100 bg-secondary bg-opacity-10 border-warning p-3">
                <i className="bi bi-trophy-fill text-warning fs-1 mb-2"></i>
                <h6 className="fw-bold text-warning mb-1">Récord Guinness</h6>
                <p className="small text-secondary mb-0">Hito histórico de 1995 con la torta de milhojas más grande.</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card h-100 bg-secondary bg-opacity-10 border-warning p-3">
                <i className="bi bi-heart-pulse-fill text-warning fs-1 mb-2"></i>
                <h6 className="fw-bold text-warning mb-1">50% Adulto Mayor</h6>
                <p className="small text-secondary mb-0">Descuento de por vida para personas de 50 años o más.</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card h-100 bg-secondary bg-opacity-10 border-warning p-3">
                <i className="bi bi-mortarboard-fill text-warning fs-1 mb-2"></i>
                <h6 className="fw-bold text-warning mb-1">Comunidad Duoc UC</h6>
                <p className="small text-secondary mb-0">Convenio exclusivo para estudiantes, docentes y colaboradores.</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card h-100 bg-secondary bg-opacity-10 border-warning p-3">
                <i className="bi bi-truck text-warning fs-1 mb-2"></i>
                <h6 className="fw-bold text-warning mb-1">Despacho Seguro</h6>
                <p className="small text-secondary mb-0">Transporte refrigerado y seguimiento en 5 etapas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-5 bg-dark text-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
            <div>
              <span className="text-warning text-uppercase small fw-bold">Selección Especial</span>
              <h2 className="fw-bold mb-0">Nuestros Favoritos de la Tradición</h2>
            </div>
            <Link to="/productos" className="btn btn-outline-warning btn-sm">
              Ver Catálogo Completo &rarr;
            </Link>
          </div>

          {cargando ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Cargando delicias...</span>
              </div>
              <p className="text-secondary mt-2">Cargando productos...</p>
            </div>
          ) : (
            <div className="row g-4">
              {destacados.map((prod) => (
                <div key={prod.id || prod.codigo} className="col-12 col-sm-6 col-lg-3">
                  <div className="card h-100 bg-secondary bg-opacity-10 border-secondary border-opacity-50 text-light shadow-sm d-flex flex-column">
                    <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
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
                    </div>

                    <div className="card-body d-flex flex-column p-3">
                      <span className="badge bg-dark text-warning border border-warning align-self-start small mb-2">
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
      </section>

      {/* Banner Promocional Cupones */}
      <section className="py-5 bg-warning text-dark text-center">
        <div className="container">
          <h3 className="fw-bold mb-2">¿Ya conoces nuestros descuentos de aniversario?</h3>
          <p className="lead mb-3">
            Usa el cupón <strong>FELICES50</strong> al pagar para un 10% de descuento o <strong>DUOCUMPLE</strong> si estudias en Duoc UC.
          </p>
          <Link to="/productos" className="btn btn-dark btn-lg fw-bold px-5">
            ¡Comprar Ahora!
          </Link>
        </div>
      </section>
    </div>
  );
}
