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

// Capa Administrativa (Fases 7 y 8)
import { RutaProtegidaAdmin } from './components/admin/RutaProtegidaAdmin.jsx';
import { AdminLayout } from './components/admin/AdminLayout.jsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { AdminProductos } from './pages/admin/AdminProductos.jsx';
import { AdminCategorias } from './pages/admin/AdminCategorias.jsx';
import { AdminUsuarios } from './pages/admin/AdminUsuarios.jsx';
import { AdminReportes } from './pages/admin/AdminReportes.jsx';

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
            <Route path="categorias" element={<AdminCategorias />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="reportes" element={<AdminReportes />} />
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
