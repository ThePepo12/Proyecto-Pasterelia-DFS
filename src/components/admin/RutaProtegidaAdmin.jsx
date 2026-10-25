/**
 * RUTA PROTEGIDA DE ADMINISTRACIÓN 
 * 
 * Verifica que el usuario tenga una sesión activa y cuente con rol 'ADMIN'.
 * Si no está autenticado o carece de permisos, muestra una pantalla de bloqueo
 * institucional con botón para iniciar sesión como Administrador.
 */
import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function RutaProtegidaAdmin({ children }) {
  const { usuario, isAuthenticated, isAdmin, cargando } = useAuth();
  const location = useLocation();

  if (cargando) {
    return (
      <div className="bg-dark text-light min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Verificando credenciales administrativas...</span>
        </div>
      </div>
    );
  }

  // Si no está autenticado o no es rol ADMIN
  if (!isAuthenticated || !isAdmin) {
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
                ? `Hola ${usuario?.nombre || 'usuario'}, tu cuenta no posee privilegios de administrador para gestionar el catálogo y configuración de la tienda.`
                : 'Debes iniciar sesión con una cuenta de rol ADMIN para acceder al panel de control.'}
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

  // Si tiene permisos de admin, renderiza las rutas hijas
  return children ? children : <Outlet />;
}

export default RutaProtegidaAdmin;
