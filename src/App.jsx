import React from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-dark border-bottom border-warning py-3">
      <div className="container d-flex flex-wrap align-items-center justify-content-between">
        <Link to="/" className="d-flex align-items-center text-warning text-decoration-none fs-4 fw-bold">
          <i className="bi bi-cake2 me-2"></i> Pastelería Mil Sabores
        </Link>
        <nav className="d-flex gap-3">
          <NavLink to="/" className={({ isActive }) => `text-decoration-none ${isActive ? 'text-warning fw-bold' : 'text-light'}`}>
            Inicio
          </NavLink>
          <NavLink to="/productos" className={({ isActive }) => `text-decoration-none ${isActive ? 'text-warning fw-bold' : 'text-light'}`}>
            Catálogo
          </NavLink>
          <NavLink to="/ofertas" className={({ isActive }) => `text-decoration-none ${isActive ? 'text-warning fw-bold' : 'text-light'}`}>
            Ofertas
          </NavLink>
          <NavLink to="/carrito" className={({ isActive }) => `text-decoration-none ${isActive ? 'text-warning fw-bold' : 'text-light'}`}>
            Carrito
          </NavLink>
          <NavLink to="/login" className={({ isActive }) => `text-decoration-none ${isActive ? 'text-warning fw-bold' : 'text-light'}`}>
            Ingresar
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-dark text-secondary py-4 border-top border-warning mt-auto">
      <div className="container text-center">
        <p className="mb-1 text-light">Pastelería Mil Sabores &copy; 2026 - 50 Años de Tradición Pastelera</p>
        <p className="mb-0 small">Evaluación Parcial 2 - DSY1104 Desarrollo Fullstack II (Duoc UC)</p>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <div className="container py-5 text-center">
      <div className="card bg-dark text-light p-4 shadow-lg border-warning mx-auto" style={{ maxWidth: '720px' }}>
        <h1 className="display-6 text-warning mb-3">Pastelería Mil Sabores</h1>
        <p className="lead">50 Años endulzando tus mejores momentos familiares.</p>
        <hr className="border-warning opacity-25" />
        <div className="alert alert-success text-start mt-3 mb-4">
          <h6 className="fw-bold mb-2">
            <i className="bi bi-check-circle-fill me-2 text-success"></i> Fase 1 Completada con Éxito:
          </h6>
          <ul className="mb-0 small ps-3">
            <li>Proyecto React inicializado con Vite y Bootstrap 5.</li>
            <li>Enrutamiento configurado con React Router DOM v6.</li>
            <li>Entorno de pruebas unitarias configurado con <strong>Vitest</strong> y <strong>React Testing Library</strong>.</li>
            <li>Código legacy preservado en <code>legacy/</code> con historial de Git intacto.</li>
            <li>Backend Spring Boot 4.1.1 con Java 22 compilado y verificado.</li>
          </ul>
        </div>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/productos" className="btn btn-warning fw-bold text-dark">
            <i className="bi bi-grid-3x3-gap me-1"></i> Ver Catálogo
          </Link>
          <Link to="/ofertas" className="btn btn-outline-warning">
            <i className="bi bi-tag-fill me-1"></i> Ver Ofertas
          </Link>
        </div>
      </div>
    </div>
  );
}

function CatalogoPlaceholder() {
  return (
    <div className="container py-5 text-center">
      <div className="card bg-dark text-light p-4 mx-auto border-secondary" style={{ maxWidth: '600px' }}>
        <h3 className="text-warning mb-2">Catálogo de Productos</h3>
        <p className="text-secondary">Estructura base lista para migrar en Fase 4 y 5 con conexión al backend.</p>
        <Link to="/" className="btn btn-outline-warning btn-sm mx-auto">Volver al inicio</Link>
      </div>
    </div>
  );
}

function OfertasPlaceholder() {
  return (
    <div className="container py-5 text-center">
      <div className="card bg-dark text-light p-4 mx-auto border-secondary" style={{ maxWidth: '600px' }}>
        <h3 className="text-warning mb-2">Sección de Ofertas (Vista Verde)</h3>
        <p className="text-secondary">Se conectará con el endpoint <code>/api/productos/ofertas</code> en Fase 5.</p>
        <Link to="/" className="btn btn-outline-warning btn-sm mx-auto">Volver al inicio</Link>
      </div>
    </div>
  );
}

function CarritoPlaceholder() {
  return (
    <div className="container py-5 text-center">
      <div className="card bg-dark text-light p-4 mx-auto border-secondary" style={{ maxWidth: '600px' }}>
        <h3 className="text-warning mb-2">Carrito de Compras</h3>
        <p className="text-secondary">Se migrará con <code>CarritoContext</code> y <code>useCarrito</code> en Fase 3.</p>
        <Link to="/" className="btn btn-outline-warning btn-sm mx-auto">Volver al inicio</Link>
      </div>
    </div>
  );
}

function LoginPlaceholder() {
  return (
    <div className="container py-5 text-center">
      <div className="card bg-dark text-light p-4 mx-auto border-secondary" style={{ maxWidth: '600px' }}>
        <h3 className="text-warning mb-2">Iniciar Sesión</h3>
        <p className="text-secondary">Se conectará con <code>POST /api/auth/login</code> en Fase 3.</p>
        <Link to="/" className="btn btn-outline-warning btn-sm mx-auto">Volver al inicio</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100 bg-dark text-light">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<CatalogoPlaceholder />} />
            <Route path="/ofertas" element={<OfertasPlaceholder />} />
            <Route path="/carrito" element={<CarritoPlaceholder />} />
            <Route path="/login" element={<LoginPlaceholder />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
