/**
 * ENRUTADOR PRINCIPAL (src/App.jsx)
 * 
 * Configura los proveedores globales (AuthProvider y CartProvider),
 * la navegación de la tienda pública (Navbar y Footer) y las rutas
 * protegidas del panel administrativo (RutaProtegidaAdmin y AdminLayout).
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { Navbar } from './components/common/Navbar.jsx';
import { Footer } from './components/common/Footer.jsx';

// Vistas de la Tienda (Fases 4, 5 y 6)
import { Home } from './pages/tienda/Home.jsx';
import { Catalogo } from './pages/tienda/Catalogo.jsx';
import { DetalleProducto } from './pages/tienda/DetalleProducto.jsx';
import { Carrito } from './pages/tienda/Carrito.jsx';
import { Login } from './pages/auth/Login.jsx';
import { Registro } from './pages/auth/Registro.jsx';
import { Perfil } from './pages/tienda/Perfil.jsx';
import { Nosotros } from './pages/tienda/Nosotros.jsx';
import { Blogs } from './pages/tienda/Blogs.jsx';
import { DetalleBlog } from './pages/tienda/DetalleBlog.jsx';
import { Contacto } from './pages/tienda/Contacto.jsx';
import { Seguimiento } from './pages/tienda/Seguimiento.jsx';
import { Categorias } from './pages/tienda/Categorias.jsx';
import { Ofertas } from './pages/tienda/Ofertas.jsx';
import { Checkout } from './pages/tienda/Checkout.jsx';
import { PagoExitoso } from './pages/tienda/PagoExitoso.jsx';
import { PagoError } from './pages/tienda/PagoError.jsx';

// Capa Administrativa (Fase 7)
import { RutaProtegidaAdmin } from './components/admin/RutaProtegidaAdmin.jsx';
import { AdminLayout } from './components/admin/AdminLayout.jsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { AdminProductos } from './pages/admin/AdminProductos.jsx';

// Placeholders para Módulos de la Fase 8
function ModuloAdminFase8({ titulo, descripcion }) {
  return (
    <div className="card bg-secondary bg-opacity-10 border-warning p-4 p-md-5 text-center shadow-lg rounded-4">
      <div className="mb-3">
        <i className="bi bi-tools text-warning display-4"></i>
      </div>
      <span className="badge bg-warning text-dark text-uppercase px-3 py-2 mb-3">
        Fase 8 en Desarrollo
      </span>
      <h2 className="text-warning fw-bold mb-2">{titulo}</h2>
      <p className="text-secondary mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {descripcion || 'Este módulo administrativo se habilitará en la Fase 8 según el plan de migración.'}
      </p>
      <div className="d-flex justify-content-center gap-3">
        <Link to="/admin" className="btn btn-warning text-dark fw-bold px-4 py-2">
          <i className="bi bi-speedometer2 me-2"></i>
          Volver al Dashboard
        </Link>
        <Link to="/admin/productos" className="btn btn-outline-light px-4 py-2">
          <i className="bi bi-box-seam me-2"></i>
          Ir a Gestión de Productos
        </Link>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="bg-dark text-light py-5 min-vh-100 text-center d-flex align-items-center">
      <div className="container" style={{ maxWidth: '500px' }}>
        <div className="card bg-secondary bg-opacity-10 border-secondary p-5 shadow">
          <i className="bi bi-emoji-dizzy text-warning display-1 mb-3"></i>
          <h1 className="display-5 fw-bold text-warning">404</h1>
          <h4 className="text-light mb-3">Página no encontrada</h4>
          <p className="text-secondary small mb-4">
            La ruta a la que intentas ingresar no existe en Pastelería Mil Sabores.
          </p>
          <Link to="/" className="btn btn-warning text-dark fw-bold">
            Volver a la Portada
          </Link>
        </div>
      </div>
    </div>
  );
}

function AppContenido() {
  const location = useLocation();
  const esRutaAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light">
      {/* Navbar de la tienda pública (se oculta dentro de /admin) */}
      {!esRutaAdmin && <Navbar />}

      <main className="flex-grow-1">
        <Routes>
          {/* Vistas Públicas y Blancas (Fases 3 y 4) */}
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Catalogo />} />
          <Route path="/producto/:codigo" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<DetalleBlog />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/seguimiento" element={<Seguimiento />} />

          {/* Vistas Verdes de la Tienda (Fases 5 y 6) */}
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categorias/:id" element={<Categorias />} />
          <Route path="/categoria/:id" element={<Categorias />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/pago-error" element={<PagoError />} />

          {/* Capa Administrativa Protegida (Fases 7 y 8) */}
          <Route
            path="/admin"
            element={
              <RutaProtegidaAdmin>
                <AdminLayout />
              </RutaProtegidaAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route
              path="categorias"
              element={
                <ModuloAdminFase8
                  titulo="Gestión de Categorías"
                  descripcion="CRUD de categorías con conteo de productos asociados e imágenes temáticas."
                />
              }
            />
            <Route
              path="usuarios"
              element={
                <ModuloAdminFase8
                  titulo="Control de Usuarios y Roles"
                  descripcion="Administración de cuentas con asignación de roles ADMIN y CLIENTE."
                />
              }
            />
            <Route
              path="reportes"
              element={
                <ModuloAdminFase8
                  titulo="Pedidos y Reportes Financieros"
                  descripcion="Seguimiento de pedidos, exportación de boletas electrónicas y métricas financieras."
                />
              }
            />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer de la tienda pública (se oculta dentro de /admin) */}
      {!esRutaAdmin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContenido />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
