/**
 * DETALLE DE ARTÍCULO DE BLOG (src/pages/tienda/DetalleBlog.jsx)
 * 
 * Muestra el artículo completo seleccionado con sus párrafos explicativos,
 * metadatos y botón para volver al listado.
 */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../data/db.js';

export function DetalleBlog() {
  const { id } = useParams();
  const blog = db.blogs.getById(id || 1);

  if (!blog) {
    return (
      <div className="bg-dark text-light py-5 min-vh-100 text-center">
        <div className="container">
          <i className="bi bi-journal-x text-warning fs-1 mb-3"></i>
          <h2>Artículo no encontrado</h2>
          <p className="text-secondary">El artículo solicitado no existe o fue retirado.</p>
          <Link to="/blogs" className="btn btn-warning text-dark fw-bold">
            Volver a Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark text-light py-5 min-vh-100">
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" className="text-secondary text-decoration-none">Inicio</Link></li>
            <li className="breadcrumb-item"><Link to="/blogs" className="text-secondary text-decoration-none">Blog & Recetas</Link></li>
            <li className="breadcrumb-item active text-warning" aria-current="page">{blog.titulo}</li>
          </ol>
        </nav>

        {/* Encabezado del Artículo */}
        <div className="mb-4">
          <span className="badge bg-warning text-dark text-uppercase fw-bold mb-2">
            {blog.categoria}
          </span>
          <h1 className="display-5 fw-bold text-warning mb-3">{blog.titulo}</h1>
          <div className="d-flex align-items-center gap-3 text-secondary small">
            <span><i className="bi bi-person-fill text-warning me-1"></i> Por {blog.autor}</span>
            <span>&bull;</span>
            <span><i className="bi bi-calendar-event text-warning me-1"></i> {blog.fecha}</span>
          </div>
        </div>

        {/* Imagen Principal */}
        <div className="rounded-4 overflow-hidden mb-4 shadow" style={{ maxHeight: '420px' }}>
          <img
            src={blog.imagen}
            alt={blog.titulo}
            className="w-100 h-100 object-fit-cover"
            onError={(e) => { e.target.src = '/img/producto_PT001.avif'; }}
          />
        </div>

        {/* Contenido */}
        <div className="card bg-secondary bg-opacity-10 border-warning p-4 p-md-5 rounded-4 shadow-sm mb-4">
          <p className="lead text-light mb-4 fst-italic border-start border-warning border-4 ps-3">
            {blog.resumen}
          </p>

          <div className="d-flex flex-column gap-3 text-light" style={{ lineHeight: '1.8' }}>
            {blog.contenido && blog.contenido.map((parrafo, i) => (
              <p key={i} className="mb-0 text-secondary">
                {parrafo}
              </p>
            ))}
          </div>
        </div>

        {/* Navegación inferior */}
        <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-25">
          <Link to="/blogs" className="btn btn-outline-warning">
            &larr; Volver a Todos los Artículos
          </Link>
          <Link to="/productos" className="btn btn-warning text-dark fw-bold">
            Ver Productos Relacionados
          </Link>
        </div>
      </div>
    </div>
  );
}
