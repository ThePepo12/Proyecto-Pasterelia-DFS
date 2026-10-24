/**
 * VISTA OBLIGATORIA: GESTIÓN DE CATEGORÍAS (VERDE)
 * (src/pages/admin/AdminCategorias.jsx)
 * 
 * Administración completa de categorías de pastelería:
 * - Listado en tabla y cuadrícula con conteo de productos asociados en tiempo real
 * - Búsqueda por texto y ordenamiento
 * - Creación y edición reactiva mediante modal accesible
 * - Eliminación preventiva con control de productos asociados
 * - Conectado con Spring Boot (categoriaService) y conmutación a db.js
 */
import React, { useState, useEffect, useMemo } from 'react';
import { categoriaService } from '../../services/categoriaService.js';
import { productoService } from '../../services/productoService.js';

const ESTADO_FORM_INICIAL = {
  id: null,
  nombre: '',
  descripcion: '',
  imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'
};

export function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // Modal de Crear / Editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState(ESTADO_FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  // Modal de Confirmación de Eliminación
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [listaCats, listaProds] = await Promise.all([
        categoriaService.obtenerTodas(),
        productoService.obtenerTodos()
      ]);
      setCategorias(listaCats || []);
      setProductos(listaProds || []);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const mostrarMensaje = (msg) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(''), 3500);
  };

  // Contar productos asociados a cada categoría
  const conteoPorCategoria = useMemo(() => {
    const conteo = {};
    productos.forEach((p) => {
      const cat = (p.categoriaNombre || p.categoria || '').trim().toLowerCase();
      if (cat) {
        conteo[cat] = (conteo[cat] || 0) + 1;
      }
    });
    return conteo;
  }, [productos]);

  // Filtrado reactivo por texto
  const categoriasFiltradas = useMemo(() => {
    return categorias.filter((c) => {
      const texto = `${c.nombre || ''} ${c.descripcion || ''}`.toLowerCase();
      return texto.includes(busqueda.toLowerCase());
    });
  }, [categorias, busqueda]);

  const handleAbrirCrear = () => {
    setModoEdicion(false);
    setFormData(ESTADO_FORM_INICIAL);
    setErrores({});
    setModalAbierto(true);
  };

  const handleAbrirEditar = (cat) => {
    setModoEdicion(true);
    setFormData({
      id: cat.id,
      nombre: cat.nombre || '',
      descripcion: cat.descripcion || '',
      imagen: cat.imagen || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'
    });
    setErrores({});
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setFormData(ESTADO_FORM_INICIAL);
    setErrores({});
  };

  const validarFormulario = () => {
    const err = {};
    if (!formData.nombre?.trim()) {
      err.nombre = 'El nombre de la categoría es obligatorio';
    } else if (formData.nombre.trim().length < 3) {
      err.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleGuardarCategoria = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setGuardando(true);
    try {
      const payload = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        imagen: formData.imagen.trim()
      };

      if (modoEdicion) {
        const actualizada = await categoriaService.actualizar(formData.id, payload);
        setCategorias((prev) =>
          prev.map((c) => (c.id === formData.id ? { ...c, ...actualizada } : c))
        );
        mostrarMensaje(`Categoría "${payload.nombre}" actualizada exitosamente.`);
      } else {
        const nueva = await categoriaService.crear(payload);
        setCategorias((prev) => [nueva, ...prev]);
        mostrarMensaje(`Categoría "${payload.nombre}" creada exitosamente.`);
      }

      handleCerrarModal();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      setErrores({ global: error.message || 'Error al guardar categoría' });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarCategoria = async () => {
    if (!categoriaAEliminar) return;

    try {
      await categoriaService.eliminar(categoriaAEliminar.id);
      setCategorias((prev) => prev.filter((c) => c.id !== categoriaAEliminar.id));
      mostrarMensaje(`Categoría "${categoriaAEliminar.nombre}" eliminada exitosamente.`);
      setCategoriaAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      alert('Error: ' + (error.message || 'No se pudo eliminar la categoría.'));
    }
  };

  return (
    <div className="container-fluid p-0" data-testid="admin-categorias">
      {/* Toast de Éxito */}
      {mensajeExito && (
        <div
          className="alert alert-success bg-success bg-opacity-25 border-success text-light text-center position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg z-3"
          style={{ minWidth: '350px' }}
          role="alert"
          data-testid="toast-exito-categoria"
        >
          <i className="bi bi-check-circle-fill text-success me-2"></i>
          {mensajeExito}
        </div>
      )}

      {/* Encabezado y Botón Crear */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h2 text-warning fw-bold font-serif mb-1">
            Gestión de Categorías
          </h1>
          <p className="text-secondary small mb-0">
            Organiza las líneas de productos, descripciones e imágenes de la pastelería.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAbrirCrear}
          className="btn btn-warning text-dark fw-bold px-4 py-2 shadow"
          data-testid="btn-nueva-categoria"
        >
          <i className="bi bi-plus-circle-fill me-2"></i>
          Nueva Categoría
        </button>
      </div>

      {/* Filtro y Búsqueda */}
      <div className="card bg-secondary bg-opacity-10 border-secondary p-3 mb-4 rounded-3 shadow-sm">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Buscar categoría por nombre o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar categoría"
                data-testid="input-buscar-categoria"
              />
              {busqueda && (
                <button
                  type="button"
                  className="btn btn-dark border-secondary text-secondary"
                  onClick={() => setBusqueda('')}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-12 col-md-6 text-md-end text-secondary small">
            Mostrando <strong>{categoriasFiltradas.length}</strong> de {categorias.length} categorías registradas
          </div>
        </div>
      </div>

      {/* Tabla de Categorías */}
      <div className="card bg-secondary bg-opacity-10 border-secondary shadow-sm rounded-3 overflow-hidden">
        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Cargando categorías...</span>
            </div>
          </div>
        ) : categoriasFiltradas.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <i className="bi bi-tags display-4 mb-3 d-block text-secondary"></i>
            <h5>No se encontraron categorías coincidentes</h5>
            <p className="small">Prueba con otro término de búsqueda o crea una nueva categoría.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0" data-testid="tabla-admin-categorias">
              <thead className="table-dark text-secondary small text-uppercase border-bottom border-secondary">
                <tr>
                  <th scope="col" style={{ width: '80px' }}>Imagen</th>
                  <th scope="col" style={{ width: '70px' }}>ID</th>
                  <th scope="col">Nombre & Descripción</th>
                  <th scope="col" className="text-center" style={{ width: '160px' }}>Productos Asociados</th>
                  <th scope="col" className="text-end" style={{ width: '130px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categoriasFiltradas.map((cat) => {
                  const cantProds = conteoPorCategoria[(cat.nombre || '').trim().toLowerCase()] || 0;

                  return (
                    <tr key={cat.id || cat.nombre} data-testid={`fila-categoria-${cat.id}`}>
                      {/* Imagen */}
                      <td>
                        <img
                          src={cat.imagen || '/img/producto_TC001.avif'}
                          alt={cat.nombre}
                          className="rounded border border-secondary"
                          style={{ width: '52px', height: '42px', objectFit: 'cover' }}
                          onError={(e) => { e.target.onerror = null; e.target.src = '/img/producto_TC001.avif'; }}
                        />
                      </td>

                      {/* ID */}
                      <td>
                        <span className="badge bg-dark border border-secondary text-secondary">
                          #{cat.id}
                        </span>
                      </td>

                      {/* Nombre y Descripción */}
                      <td>
                        <strong className="text-warning d-block">{cat.nombre}</strong>
                        <span className="small text-secondary text-truncate d-inline-block" style={{ maxWidth: '400px' }}>
                          {cat.descripcion || 'Sin descripción detallada'}
                        </span>
                      </td>

                      {/* Conteo de Productos */}
                      <td className="text-center">
                        <span className={`badge ${cantProds > 0 ? 'bg-warning text-dark' : 'bg-secondary bg-opacity-50 text-light'} fw-bold px-3 py-2`}>
                          <i className="bi bi-box-seam me-1"></i>
                          {cantProds} {cantProds === 1 ? 'producto' : 'productos'}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-warning"
                            onClick={() => handleAbrirEditar(cat)}
                            title="Editar Categoría"
                            data-testid={`btn-editar-cat-${cat.id}`}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => setCategoriaAEliminar(cat)}
                            title="Eliminar Categoría"
                            data-testid={`btn-eliminar-cat-${cat.id}`}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CREAR / EDITAR CATEGORÍA */}
      {modalAbierto && (
        <div
          className="modal show d-block bg-black bg-opacity-75 z-3"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="modal-cat-titulo"
          data-testid="modal-categoria"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light border-warning shadow-lg">
              <div className="modal-header border-secondary border-opacity-50">
                <h5 className="modal-title text-warning fw-bold font-serif" id="modal-cat-titulo">
                  <i className={`bi ${modoEdicion ? 'bi-pencil-square' : 'bi-plus-circle-fill'} me-2`}></i>
                  {modoEdicion ? `Editar Categoría (#${formData.id})` : 'Nueva Categoría de Pastelería'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCerrarModal}
                  aria-label="Cerrar ventana"
                ></button>
              </div>

              <form onSubmit={handleGuardarCategoria} noValidate data-testid="form-admin-categoria">
                <div className="modal-body">
                  {errores.global && (
                    <div className="alert alert-danger p-2 small mb-3">
                      {errores.global}
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="cat-nombre" className="form-label small fw-bold text-light">
                      Nombre de la Categoría: <span className="text-danger">*</span>
                    </label>
                    <input
                      id="cat-nombre"
                      type="text"
                      className={`form-control bg-dark text-light border-secondary ${
                        errores.nombre ? 'is-invalid border-danger' : ''
                      }`}
                      placeholder="ej. Tortas Temáticas Especiales"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      aria-label="Nombre de la categoría"
                    />
                    {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="cat-desc" className="form-label small fw-bold text-light">
                      Descripción:
                    </label>
                    <textarea
                      id="cat-desc"
                      rows="3"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Describe la temática, técnica o tipo de repostería de esta categoría..."
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      aria-label="Descripción de la categoría"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="cat-img" className="form-label small fw-bold text-light">
                      URL de Imagen Representativa:
                    </label>
                    <input
                      id="cat-img"
                      type="url"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formData.imagen}
                      onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                      aria-label="URL de imagen de la categoría"
                    />
                  </div>
                </div>

                <div className="modal-footer border-secondary border-opacity-50">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCerrarModal}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning text-dark fw-bold px-4"
                    disabled={guardando}
                    data-testid="btn-guardar-categoria"
                  >
                    {guardando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-2"></i>
                        {modoEdicion ? 'Actualizar Categoría' : 'Crear Categoría'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {categoriaAEliminar && (
        <div
          className="modal show d-block bg-black bg-opacity-75 z-3"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="modal-eliminar-cat-titulo"
          data-testid="modal-eliminar-categoria"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light border-danger shadow-lg">
              <div className="modal-header border-secondary border-opacity-50">
                <h5 className="modal-title text-danger fw-bold" id="modal-eliminar-cat-titulo">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Confirmar Eliminación de Categoría
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setCategoriaAEliminar(null)}
                  aria-label="Cancelar"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Estás seguro de que deseas eliminar permanentemente la categoría{' '}
                  <strong className="text-warning">{categoriaAEliminar.nombre}</strong>?
                </p>

                {(conteoPorCategoria[(categoriaAEliminar.nombre || '').trim().toLowerCase()] || 0) > 0 && (
                  <div className="alert alert-warning p-2 small mb-3">
                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                    <strong>Advertencia:</strong> Esta categoría tiene actualmente{' '}
                    <strong>
                      {conteoPorCategoria[(categoriaAEliminar.nombre || '').trim().toLowerCase()]} productos asociados
                    </strong>
                    .
                  </div>
                )}
                <p className="text-secondary small mb-0">
                  Esta acción actualizará el catálogo del backend Spring Boot.
                </p>
              </div>
              <div className="modal-footer border-secondary border-opacity-50">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setCategoriaAEliminar(null)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger fw-bold"
                  onClick={handleEliminarCategoria}
                  data-testid="btn-confirmar-eliminar-cat"
                >
                  <i className="bi bi-trash-fill me-2"></i>
                  Eliminar Categoría
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategorias;
