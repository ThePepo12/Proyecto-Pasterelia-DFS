import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function RutaProtegidaAdmin({ children }) {
  const { usuario, isAuthenticated, isAdmin, isVendedor, cargando } = useAuth();
  const location = useLocation();

  if (cargando) {
    return (
      <div className="bg-dark text-light min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Verificando credenciales...</span>
        </div>
      </div>
    );
  }

  // Tanto ADMIN como VENDEDOR pueden ingresar a la zona de gestión
  const tieneAcceso = isAuthenticated && (isAdmin || isVendedor);

  // Si es Vendedor e intenta entrar a una sección prohibida para vendedor (Categorías, Usuarios o Reportes generales)
  if (isVendedor) {
    const rutaProhibida = location.pathname.includes('/admin/categorias') ||
                          location.pathname.includes('/admin/usuarios');
    if (rutaProhibida) {
      return (
        <div className="bg-dark text-light py-5 min-vh-100 d-flex align-items-center">
          <div className="container" style={{ maxWidth: '600px' }}>
            <div className="card bg-secondary bg-opacity-10 border-warning border-2 p-4 text-center shadow-lg rounded-4">
              <i className="bi bi-person-x-fill text-warning display-3 mb-3"></i>
              <h3 className="text-warning fw-bold mb-2">Acceso Restringido para Vendedores</h3>
              <p className="text-secondary mb-4">
                El perfil de Vendedor solo tiene autorización para visualizar Productos y Órdenes de Pedido.
              </p>
              <Link to="/admin/productos" className="btn btn-warning text-dark fw-bold">
                Ir a Catálogo de Productos
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  if (!tieneAcceso) {
    return (
      <div className="bg-dark text-light py-5 min-vh-100 d-flex align-items-center">
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="card bg-secondary bg-opacity-10 border-danger border-2 p-4 p-md-5 text-center shadow-lg rounded-4">
            <div className="mb-3">
              <i className="bi bi-shield-slash-fill text-danger display-1"></i>
            </div>
            <span className="badge bg-danger px-3 py-2 text-uppercase mb-3 tracking-wide">
              Acceso Restringido
            </span>
            <h2 className="text-danger fw-bold mb-3">Panel Exclusivo para Administradores</h2>
            <p className="text-secondary mb-4">
              {isAuthenticated
                ? `Hola ${usuario?.nombre || 'usuario'}, tu cuenta no posee privilegios para ingresar al panel interno.`
                : 'Debes iniciar sesión con una cuenta autorizada (ADMIN o VENDEDOR) para acceder al panel.'}
            </p>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <Link
                to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                className="btn btn-warning text-dark fw-bold px-4 py-2"
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Iniciar Sesión como Admin
              </Link>
              <Link to="/" className="btn btn-outline-light px-4 py-2">
                <i className="bi bi-house-door me-2"></i>
                Volver a la Tienda
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children ? children : <Outlet />;
}

export default RutaProtegidaAdmin;
