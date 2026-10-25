
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCarrito } from '../../context/CartContext.jsx';

export function Navbar() {
  const { user, isAuthenticated, isSenior, isAdmin, logout } = useAuth();
  const { totalItems } = useCarrito();
  const navigate = useNavigate();

  const handleCerrarSesion = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  const primerNombre = user?.nombre ? user.nombre.split(' ')[0] : 'Usuario';

  return (
    <div className="d-flex flex-column">
      {/* Barra Superior de Beneficios / Anuncio Institucional */}
      <div className="bg-warning text-dark py-1 text-center small fw-bold">
        <span>
          🎉 ¡Celebramos 50 Años de Tradición! 10% OFF con código <strong>FELICES50</strong> | 50% Senior (+50 años)
        </span>
      </div>

      {/* Navbar Principal */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-warning sticky-top shadow-sm">
        <div className="container">
          {/* Logo y Marca */}
          <Link to="/" className="navbar-brand d-flex align-items-center text-warning fw-bold fs-4">
            <i className="bi bi-cake2 me-2 fs-3 text-warning"></i>
            <span>Mil Sabores</span>
          </Link>

          {/* Botón Hamburguesa para Móvil */}
          <button
            className="navbar-toggler border-warning text-warning"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContenido"
            aria-controls="navbarContenido"
            aria-expanded="false"
            aria-label="Abrir navegación"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menú Colapsable */}
          <div className="collapse navbar-collapse" id="navbarContenido">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `nav-link ${isActive ? 'active text-warning fw-bold' : 'text-light'}`}
                >
                  Inicio
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/productos"
                  className={({ isActive }) => `nav-link ${isActive ? 'active text-warning fw-bold' : 'text-light'}`}
                >
                  Catálogo
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/categorias"
                  className={({ isActive }) => `nav-link ${isActive ? 'active text-warning fw-bold' : 'text-light'}`}
                >
                  Categorías
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/ofertas"
                  className={({ isActive }) => `nav-link ${isActive ? 'active text-warning fw-bold' : 'text-light'}`}
                >
                  <span className="badge bg-danger me-1">Hot</span>Ofertas
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/nosotros"
                  className={({ isActive }) => `nav-link ${isActive ? 'active text-warning fw-bold' : 'text-light'}`}
                >
                  Nosotros
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/blogs"
                  className={({ isActive }) => `nav-link ${isActive ? 'active text-warning fw-bold' : 'text-light'}`}
                >
                  Blog & Recetas
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/contacto"
                  className={({ isActive }) => `nav-link ${isActive ? 'active text-warning fw-bold' : 'text-light'}`}
                >
                  Contacto
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/seguimiento"
                  className={({ isActive }) => `nav-link ${isActive ? 'active text-warning fw-bold' : 'text-light'}`}
                >
                  Seguimiento
                </NavLink>
              </li>
            </ul>

            {/* Acciones de la Derecha: Carrito y Autenticación */}
            <div className="d-flex align-items-center gap-3 flex-wrap">
              {/* Carrito */}
              <Link to="/carrito" className="btn btn-outline-warning position-relative btn-sm" aria-label="Ver carrito">
                <i className="bi bi-cart3 me-1"></i>
                <span>Carrito</span>
                {totalItems > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    data-testid="contador-carrito"
                  >
                    {totalItems}
                    <span className="visually-hidden">productos en carrito</span>
                  </span>
                )}
              </Link>

              {/* Sesión de Usuario */}
              {isAuthenticated ? (
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <div className="text-light small">
                    <span>Hola, <strong className="text-warning">{primerNombre}</strong></span>
                    {isSenior && (
                      <span className="badge bg-warning text-dark ms-1" title="Beneficio Senior 50% de por vida">
                        50% Senior
                      </span>
                    )}
                    {user?.esEstudianteDuoc && (
                      <span className="badge bg-primary text-light ms-1" title="Convenio Alumno Duoc UC">
                        Duoc UC
                      </span>
                    )}
                    {isAdmin && (
                      <span className="badge bg-danger text-light ms-1">
                        Admin
                      </span>
                    )}
                  </div>
                  <Link to="/perfil" className="btn btn-outline-warning btn-sm">
                    <i className="bi bi-person-circle me-1"></i> Mi Perfil
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="btn btn-danger btn-sm text-light fw-bold">
                      <i className="bi bi-speedometer2 me-1"></i> Admin
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleCerrarSesion}
                    className="btn btn-outline-secondary btn-sm text-light"
                    title="Cerrar sesión"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Link to="/login" className="btn btn-outline-light btn-sm">
                    <i className="bi bi-box-arrow-in-right me-1"></i> Ingresar
                  </Link>
                  <Link to="/registro" className="btn btn-warning text-dark btn-sm fw-bold">
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
