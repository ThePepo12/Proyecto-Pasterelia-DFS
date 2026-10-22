/**
 * LAYOUT DE ADMINISTRACIÓN (src/components/admin/AdminLayout.jsx)
 * 
 * Estructura contenedora para todas las vistas del panel administrativo:
 * - Sidebar lateral de navegación con enlaces a Dashboard, Productos, Categorías, Usuarios y Reportes
 * - Topbar con nombre de usuario, rol y botón de logout
 * - Área de contenido dinámico usando <Outlet />
 */
import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function AdminLayout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const handleCerrarSesion = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/admin',
      end: true,
      label: 'Dashboard',
      icon: 'bi-speedometer2'
    },
    {
      to: '/admin/productos',
      end: false,
      label: 'Productos',
      icon: 'bi-box-seam'
    },
    {
      to: '/admin/categorias',
      end: false,
      label: 'Categorías',
      icon: 'bi-grid-3x3-gap'
    },
    {
      to: '/admin/usuarios',
      end: false,
      label: 'Usuarios',
      icon: 'bi-people'
    },
    {
      to: '/admin/reportes',
      end: false,
      label: 'Pedidos y Reportes',
      icon: 'bi-graph-up-arrow'
    }
  ];

  return (
    <div className="d-flex min-vh-100 bg-dark text-light" data-testid="admin-layout">
      {/* Sidebar Lateral */}
      <aside
        className={`bg-black border-end border-secondary border-opacity-50 p-3 d-flex flex-column ${
          sidebarAbierto ? 'd-block position-fixed top-0 start-0 h-100 z-3' : 'd-none d-md-flex'
        }`}
        style={{ width: '260px', minHeight: '100vh', transition: 'all 0.3s ease' }}
        data-testid="admin-sidebar"
      >
        {/* Cabecera del Sidebar */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-secondary border-opacity-50">
          <Link to="/admin" className="text-decoration-none d-flex align-items-center gap-2">
            <i className="bi bi-cake2-fill text-warning fs-3"></i>
            <div>
              <span className="fw-bold text-light d-block" style={{ fontSize: '1rem', lineHeight: '1.2' }}>
                Mil Sabores
              </span>
              <span className="badge bg-warning text-dark text-uppercase" style={{ fontSize: '0.65rem' }}>
                Panel Admin
              </span>
            </div>
          </Link>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary d-md-none text-light"
            onClick={() => setSidebarAbierto(false)}
            aria-label="Cerrar menú"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Lista de Enlaces de Navegación */}
        <nav className="nav nav-pills flex-column gap-1 flex-grow-1">
          <small className="text-secondary text-uppercase fw-bold px-3 py-1" style={{ fontSize: '0.7rem' }}>
            Gestión de Tienda
          </small>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarAbierto(false)}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-light ${
                  isActive
                    ? 'bg-warning text-dark fw-bold shadow-sm'
                    : 'text-secondary hover-bg-dark'
                }`
              }
            >
              <i className={`bi ${item.icon} fs-5`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}

          <hr className="border-secondary border-opacity-50 my-3" />

          <small className="text-secondary text-uppercase fw-bold px-3 py-1" style={{ fontSize: '0.7rem' }}>
            Acceso Rápido
          </small>
          <Link
            to="/"
            className="nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-secondary hover-bg-dark"
          >
            <i className="bi bi-shop fs-5 text-warning"></i>
            <span>Ir a la Tienda Pública</span>
          </Link>
        </nav>

        {/* Pie del Sidebar: Datos del Admin y Cerrar Sesión */}
        <div className="pt-3 border-top border-secondary border-opacity-50">
          <div className="d-flex align-items-center gap-2 mb-3 px-2">
            <div
              className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{ width: '38px', height: '38px' }}
            >
              {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <span className="d-block text-truncate small fw-bold text-light">
                {usuario?.nombre || 'Administrador'}
              </span>
              <span className="d-block text-truncate text-secondary" style={{ fontSize: '0.75rem' }}>
                {usuario?.email || 'admin@milsabores.cl'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCerrarSesion}
            className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenedor Principal */}
      <div className="d-flex flex-column flex-grow-1 min-vw-0">
        {/* Topbar Superior */}
        <header className="bg-black bg-opacity-75 border-bottom border-secondary border-opacity-50 px-4 py-3 d-flex align-items-center justify-content-between sticky-top">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-outline-warning btn-sm d-md-none"
              onClick={() => setSidebarAbierto(true)}
              aria-label="Abrir menú de navegación"
            >
              <i className="bi bi-list fs-5"></i>
            </button>
            <h5 className="mb-0 text-light fw-bold font-serif d-none d-sm-block">
              Panel de Administración y Control
            </h5>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-success bg-opacity-25 text-success border border-success d-none d-sm-inline-flex align-items-center gap-1 px-3 py-2">
              <i className="bi bi-shield-check"></i>
              Sesión Segura (Rol: {usuario?.rol || 'ADMIN'})
            </span>
            <Link to="/" className="btn btn-outline-warning btn-sm d-flex align-items-center gap-2">
              <i className="bi bi-box-arrow-up-right"></i>
              <span className="d-none d-md-inline">Ver Tienda</span>
            </Link>
          </div>
        </header>

        {/* Área de Contenido Principal */}
        <main className="p-4 p-lg-5 flex-grow-1 overflow-auto bg-dark">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
