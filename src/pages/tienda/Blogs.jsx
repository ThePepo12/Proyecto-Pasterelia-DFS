/**
 * BLOGS Y NOTAS DE REPOSTERÍA (src/pages/tienda/Blogs.jsx)
 * 
 * Migrada de legacy/blogs.html.
 * Presenta artículos sobre técnicas culinarias, recetas históricas y formulario
 * interactivo para que la comunidad envíe sus propias recetas familiares.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../data/db.js';

export function Blogs() {
  const blogs = db.blogs.getAll();

  const [tituloReceta, setTituloReceta] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [pasos, setPasos] = useState('');
  const [autor, setAutor] = useState('');
  const [mensajeExito, setMensajeExito] = useState(false);

  const handleSubmitReceta = (e) => {
    e.preventDefault();
    if (!tituloReceta || !ingredientes || !pasos) return;
    setMensajeExito(true);
    setTituloReceta('');
    setIngredientes('');
    setPasos('');
    setAutor('');
    setTimeout(() => setMensajeExito(false), 5000);
  };

  return (
    <div className="bg-dark text-light py-5 min-vh-100">
      <div className="container">
        {/* Encabezado */}
        <div className="text-center mb-5">
          <span className="badge bg-warning text-dark px-3 py-2 text-uppercase fw-bold mb-2">
            El Rincón Dulce &bull; Notas & Recetas
          </span>
          <h1 className="display-5 fw-bold text-warning">Secretos de Maestros Pasteleros</h1>
          <p className="lead text-secondary mx-auto" style={{ maxWidth: '680px' }}>
            Aprende los secretos del horneado tradicional chileno, técnicas de vanguardia y recetas de nuestra comunidad.
          </p>
        </div>

        {/* Listado de Artículos */}
        <div className="row g-4 mb-5">
          {blogs.map((b) => (
            <div key={b.id} className="col-12 col-md-6">
              <div className="card h-100 bg-secondary bg-opacity-10 border-warning shadow-sm d-flex flex-column">
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <img
                    src={b.imagen}
                    alt={b.titulo}
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => { e.target.src = '/img/producto_PT001.avif'; }}
                  />
                </div>
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between text-secondary small mb-2">
                    <span><i className="bi bi-tag text-warning me-1"></i>{b.categoria}</span>
                    <span><i className="bi bi-calendar3 me-1"></i>{b.fecha}</span>
                  </div>
                  <h4 className="card-title text-light fw-bold mb-2">{b.titulo}</h4>
                  <p className="text-secondary small mb-3 flex-grow-1">{b.resumen}</p>
                  <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-25">
                    <small className="text-warning fw-bold">{b.autor}</small>
                    <Link to={`/blog/${b.id}`} className="btn btn-outline-warning btn-sm">
                      Leer Artículo &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
