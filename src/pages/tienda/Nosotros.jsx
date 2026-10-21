/**
 * NOSOTROS (src/pages/tienda/Nosotros.jsx)
 * 
 * Migrada de legacy/nosotros.html.
 * Expone la historia de los 50 años (1976-2026), el hito del Récord Guinness (1995),
 * la misión, visión y los cuatro pilares fundamentales de la empresa.
 */
import React from 'react';
import { Link } from 'react-router-dom';

export function Nosotros() {
  return (
    <div className="bg-dark text-light py-5 min-vh-100">
      <div className="container">
        {/* Hero Institucional */}
        <div className="text-center mb-5">
          <span className="badge bg-warning text-dark px-3 py-2 text-uppercase fw-bold mb-2">
            Nuestra Historia (1976 - 2026)
          </span>
          <h1 className="display-5 fw-bold text-warning">50 Años de Tradición y Excelencia</h1>
          <p className="lead text-secondary mx-auto" style={{ maxWidth: '720px' }}>
            Nacimos como un pequeño obrador familiar en Santiago y hoy somos un referente nacional en repostería fina,
            comprometidos con la calidad artesanal, la inclusión alimentaria y los momentos más dulces de tu vida.
          </p>
        </div>

        {/* Hito Récord Guinness 1995 */}
        <div className="card bg-warning text-dark p-4 p-md-5 rounded-4 shadow-lg mb-5 border-0">
          <div className="row align-items-center g-4">
            <div className="col-12 col-md-3 text-center">
              <i className="bi bi-trophy-fill display-1"></i>
            </div>
            <div className="col-12 col-md-9">
              <span className="badge bg-dark text-warning text-uppercase px-2 py-1 mb-2">Hito Histórico</span>
              <h3 className="fw-bold mb-2">Récord Guinness Mundial en 1995</h3>
              <p className="mb-0 fs-6">
                En nuestro 19° aniversario reunimos a más de 30 maestros pasteleros para hornear la torta de milhojas
                más grande del mundo, certificada oficialmente por Guinness World Records. Esta hazaña simboliza nuestro
                espíritu pionero, la pasión por el detalle y la generosidad compartida con miles de familias chilenas.
              </p>
            </div>
          </div>
        </div>

        {/* Misión y Visión */}
        <div className="row g-4 mb-5">
          <div className="col-12 col-md-6">
            <div className="card h-100 bg-secondary bg-opacity-10 border-warning p-4 shadow-sm">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-compass-fill text-warning fs-2 me-3"></i>
                <h4 className="text-warning fw-bold mb-0">Nuestra Misión</h4>
              </div>
              <p className="text-secondary mb-0">
                Endulzar la vida de nuestros clientes creando productos de repostería de la más alta calidad,
                fusionando técnicas artesanales con materias primas nobles y ofreciendo alternativas saludables para que nadie
                se quede sin celebrar.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card h-100 bg-secondary bg-opacity-10 border-warning p-4 shadow-sm">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-eye-fill text-warning fs-2 me-3"></i>
                <h4 className="text-warning fw-bold mb-0">Nuestra Visión</h4>
              </div>
              <p className="text-secondary mb-0">
                Ser la pastelería más querida de Chile, reconocida por preservar la herencia dulce de nuestra gastronomía,
                liderar la innovación en preparaciones sin azúcar y sin gluten, y mantener una cercanía genuina con cada comunidad.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Valores Corporativos */}
        <div className="mb-5">
          <h3 className="text-warning fw-bold text-center mb-4">Nuestros Pilares</h3>
          <div className="row g-4">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card bg-secondary bg-opacity-10 border-secondary p-3 text-center h-100">
                <div className="text-warning display-6 fw-bold mb-2">01</div>
                <h5 className="text-light fw-bold">Tradición Artesanal</h5>
                <p className="text-secondary small mb-0">Recetas con masa de hojaldre estirada a mano y manjar cocido a fuego lento.</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card bg-secondary bg-opacity-10 border-secondary p-3 text-center h-100">
                <div className="text-warning display-6 fw-bold mb-2">02</div>
                <h5 className="text-light fw-bold">Inclusión Dulce</h5>
                <p className="text-secondary small mb-0">Líneas especiales sin gluten certificadas, sin azúcar y 100% veganas.</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card bg-secondary bg-opacity-10 border-secondary p-3 text-center h-100">
                <div className="text-warning display-6 fw-bold mb-2">03</div>
                <h5 className="text-light fw-bold">Compromiso Senior</h5>
                <p className="text-secondary small mb-0">Beneficio permanente del 50% para adultos mayores de 50 años.</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card bg-secondary bg-opacity-10 border-secondary p-3 text-center h-100">
                <div className="text-warning display-6 fw-bold mb-2">04</div>
                <h5 className="text-light fw-bold">Comunidad Duoc UC</h5>
                <p className="text-secondary small mb-0">Alianza con estudiantes y docentes para apoyar la formación profesional.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Llamado a la acción */}
        <div className="text-center pt-4 border-top border-secondary border-opacity-25">
          <h4 className="text-light mb-3">Celebra con nosotros este medio siglo</h4>
          <Link to="/productos" className="btn btn-warning text-dark fw-bold btn-lg px-4 shadow">
            Ver Catálogo de Productos
          </Link>
        </div>
      </div>
    </div>
  );
}
