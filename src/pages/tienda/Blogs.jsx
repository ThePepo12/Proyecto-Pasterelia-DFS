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

        {/* Formulario de Aportes de la Comunidad */}
        <div className="card bg-secondary bg-opacity-10 border-secondary p-4 p-md-5 rounded-4 shadow-sm">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-5">
              <span className="badge bg-warning text-dark px-3 py-1 fw-bold text-uppercase mb-2">
                Comunidad Mil Sabores
              </span>
              <h3 className="text-warning fw-bold mb-3">¿Tienes una Receta Familiar?</h3>
              <p className="text-secondary mb-3">
                Para conmemorar nuestros 50 años, estamos publicando recetas tradicionales de nuestras clientas y familias amigas.
                ¡Compártenos la tuya y nuestros maestros pasteleros la probarán en el obrador!
              </p>
              <div className="text-secondary small">
                <i className="bi bi-check-circle-fill text-warning me-2"></i> Recibirás una caja de postres si tu receta es seleccionada.
              </div>
            </div>

            <div className="col-12 col-lg-7">
              {mensajeExito && (
                <div className="alert alert-success d-flex align-items-center mb-3">
                  <i className="bi bi-check-circle-fill fs-4 me-2"></i>
                  <div>¡Gracias por tu receta! Ha sido enviada con éxito para revisión de nuestros maestros.</div>
                </div>
              )}

              <form onSubmit={handleSubmitReceta}>
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label text-light small fw-bold">Tu Nombre:</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Ej: Carmen Gloria"
                      value={autor}
                      onChange={(e) => setAutor(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label text-light small fw-bold">Nombre de la Receta:</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Ej: Calzones Rotos de la Abuela"
                      value={tituloReceta}
                      onChange={(e) => setTituloReceta(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-light small fw-bold">Ingredientes Principales:</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Harina, huevos, ralladura de naranja, azúcar flor..."
                      value={ingredientes}
                      onChange={(e) => setIngredientes(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-light small fw-bold">Paso a Paso o Secreto:</label>
                    <textarea
                      rows={3}
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Explica brevemente la preparación y tu toque especial..."
                      value={pasos}
                      onChange={(e) => setPasos(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12 text-end">
                    <button type="submit" className="btn btn-warning text-dark fw-bold px-4">
                      Enviar mi Receta
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
