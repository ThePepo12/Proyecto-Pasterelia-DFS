/**
 * ENRUTADOR PRINCIPAL (src/App.jsx)
 * 
 * Configura los proveedores globales (AuthProvider y CartProvider),
 * la barra de navegación superior (Navbar), el pie de página (Footer)
 * y todas las rutas públicas y migras de la tienda.
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { Navbar } from './components/common/Navbar.jsx';
import { Footer } from './components/common/Footer.jsx';

// Vistas Blancas de la Tienda (Fase 4)
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

// Placeholders para Vistas Verdes (Fases 5, 6, 7 y 8)
function OfertasPlaceholder() {
  return (
    <div className="bg-dark text-light py-5 min-vh-100 text-center d-flex align-items-center">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="card bg-secondary bg-opacity-10 border-warning p-4 shadow-lg">
          <i className="bi bi-tag-fill text-warning display-4 mb-3"></i>
          <h2 className="text-warning fw-bold">Sección de Ofertas (Vista Verde)</h2>
          <p className="text-secondary">
            Esta vista obligatoria se conectará al endpoint <code>/api/productos/ofertas</code> en la <strong>Fase 5</strong>.
          </p>
          <Link to="/productos" className="btn btn-warning text-dark fw-bold">
            Ver Catálogo General
          </Link>
        </div>
      </div>
    </div>
  );
}

function CheckoutPlaceholder() {
  return (
    <div className="bg-dark text-light py-5 min-vh-100 text-center d-flex align-items-center">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="card bg-secondary bg-opacity-10 border-warning p-4 shadow-lg">
          <i className="bi bi-credit-card-2-front-fill text-warning display-4 mb-3"></i>
          <h2 className="text-warning fw-bold">Checkout / Comprar (Vista Verde)</h2>
          <p className="text-secondary">
            Pasarela de pago y validación de dirección que se conectará con <code>POST /api/ordenes</code> en la <strong>Fase 6</strong>.
          </p>
          <Link to="/carrito" className="btn btn-outline-warning">
            Volver al Carrito
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminPlaceholder() {
  return (
    <div className="bg-dark text-light py-5 min-vh-100 text-center d-flex align-items-center">
      <div className="container" style={{ maxWidth: '650px' }}>
        <div className="card bg-secondary bg-opacity-10 border-warning p-4 shadow-lg">
          <i className="bi bi-shield-lock-fill text-warning display-4 mb-3"></i>
          <h2 className="text-warning fw-bold">Capa Administrativa (Fases 7 y 8)</h2>
          <p className="text-secondary">
            Panel administrativo con sidebar, rutas protegidas por rol <code>ADMIN</code>, gestión CRUD completa de Productos, Categorías, Usuarios y Reportes.
          </p>
          <Link to="/" className="btn btn-warning text-dark fw-bold">
            Volver a la Tienda
          </Link>
        </div>
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

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="d-flex flex-column min-vh-100 bg-dark text-light">
            <Navbar />
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

                {/* Vistas Verdes (Fases 5, 6, 7 y 8) */}
                <Route path="/ofertas" element={<OfertasPlaceholder />} />
                <Route path="/checkout" element={<CheckoutPlaceholder />} />
                <Route path="/admin/*" element={<AdminPlaceholder />} />

                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
