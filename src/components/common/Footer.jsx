/**
 * FOOTER COMÚN (src/components/common/Footer.jsx)
 * 
 * Pie de página institucional con historia, enlaces rápidos, horarios, sucursales y créditos.
 */
import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 border-top border-warning mt-auto">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Columna 1: Identidad */}
          <div className="col-12 col-md-4">
            <h5 className="text-warning fw-bold d-flex align-items-center">
              <i className="bi bi-cake2 me-2"></i> Pastelería Mil Sabores
            </h5>
            <p className="text-secondary small mt-2">
              50 Años endulzando los mejores momentos familiares de Chile. Especialistas en tortas artesanales,
              líneas sin azúcar, sin gluten y recetas con Récord Guinness (1995).
            </p>
            <div className="d-flex gap-3 text-warning fs-5">
              <span role="img" aria-label="Facebook"><i className="bi bi-facebook"></i></span>
              <span role="img" aria-label="Instagram"><i className="bi bi-instagram"></i></span>
              <span role="img" aria-label="WhatsApp"><i className="bi bi-whatsapp"></i></span>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="col-6 col-md-2">
            <h6 className="text-warning fw-bold text-uppercase small">Navegación</h6>
            <ul className="list-unstyled small mt-2 d-flex flex-column gap-1">
              <li><Link to="/" className="text-secondary text-decoration-none hover-warning">Inicio</Link></li>
              <li><Link to="/productos" className="text-secondary text-decoration-none">Catálogo</Link></li>
              <li><Link to="/ofertas" className="text-secondary text-decoration-none">Ofertas</Link></li>
              <li><Link to="/nosotros" className="text-secondary text-decoration-none">Nosotros</Link></li>
              <li><Link to="/blogs" className="text-secondary text-decoration-none">Recetas y Blog</Link></li>
              <li><Link to="/seguimiento" className="text-secondary text-decoration-none">Seguimiento</Link></li>
            </ul>
          </div>

          {/* Columna 3: Beneficios */}
          <div className="col-6 col-md-3">
            <h6 className="text-warning fw-bold text-uppercase small">Beneficios Activos</h6>
            <ul className="list-unstyled small mt-2 text-secondary d-flex flex-column gap-2">
              <li>
                <strong className="text-light">50% Adulto Mayor:</strong> Para clientes de 50 años o más de por vida.
              </li>
              <li>
                <strong className="text-light">Comunidad Duoc UC:</strong> Descuentos exclusivos y torta de cumpleaños gratis.
              </li>
              <li>
                <strong className="text-light">Cupón FELICES50:</strong> 10% de descuento conmemorativo.
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div className="col-12 col-md-3">
            <h6 className="text-warning fw-bold text-uppercase small">Casa Matriz</h6>
            <p className="text-secondary small mt-2 mb-1">
              <i className="bi bi-geo-alt-fill text-warning me-1"></i> Av. Concha y Toro #1234, Puente Alto, Santiago
            </p>
            <p className="text-secondary small mb-1">
              <i className="bi bi-telephone-fill text-warning me-1"></i> +56 9 8765 4321
            </p>
            <p className="text-secondary small mb-0">
              <i className="bi bi-clock-fill text-warning me-1"></i> Lunes a Domingo: 09:00 - 20:00 hrs
            </p>
          </div>
        </div>

        <hr className="border-secondary opacity-25" />

        <div className="d-flex flex-wrap justify-content-between align-items-center text-secondary small">
          <p className="mb-0">
            &copy; 2026 Pastelería Mil Sabores SpA. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
