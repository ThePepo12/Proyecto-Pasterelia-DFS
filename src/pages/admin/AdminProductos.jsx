/**
 * Administración completa del catálogo de pastelería:
 * - Tabla interactiva con miniatura, código, nombre, categoría, precio, stock y estado
 * - Filtro en tiempo real por buscador y por categoría
 * - Creación y edición reactiva mediante modal accesible
 * - Eliminación de productos con confirmación
 */
import React, { useState, useEffect, useMemo } from 'react';
import { productoService } from '../../services/productoService.js';
import { categoriaService } from '../../services/categoriaService.js';

const ESTADO_FORM_INICIAL = {
  id: null,
  codigo: '',
  nombre: '',
  descripcion: '',
  precio: '',
  categoria: 'Tortas Cuadradas',
  stock: 10,
  stockCritico: 5,
  enOferta: false,
  porcentajeDescuento: 0,
  imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'
};

export function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODAS');

  // Estado del Modal de Crear / Editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState(ESTADO_FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  // Estado del Modal de Confirmación de Eliminación
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  // Cargar productos y categorías desde los servicios
  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [listaProds, listaCats] = await Promise.all([
        productoService.obtenerTodos(),
        categoriaService.obtenerTodas()
      ]);
      setProductos(listaProds || []);
      setCategorias(listaCats || []);
    } catch (error) {
      console.error('Error cargando datos de productos:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Notificación de éxito temporal
  const mostrarMensaje = (msg) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(''), 3500);
  };

  // Filtrado reactivo en tiempo real
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const nombreCat = p.categoriaNombre || p.categoria || '';

      const coincideTexto =
        p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.codigo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
        nombreCat.toLowerCase().includes(busqueda.toLowerCase());

      const coincideCategoria =
        categoriaFiltro === 'TODAS' ||
        nombreCat.toLowerCase() === categoriaFiltro.toLowerCase();

      return coincideTexto && coincideCategoria;
    });
  }, [productos, busqueda, categoriaFiltro]);

  // Apertura de modal en modo creación
  const handleAbrirCrear = () => {
    setModoEdicion(false);
    setFormData(ESTADO_FORM_INICIAL);
    setErrores({});
    setModalAbierto(true);
  };

  // Apertura de modal en modo edición
  const handleAbrirEditar = (prod) => {
    setModoEdicion(true);
    setFormData({
      id: prod.id,
      codigo: prod.codigo || '',
      nombre: prod.nombre || '',
      descripcion: prod.descripcion || '',
      precio: prod.precio || '',
      categoria: prod.categoria || (categorias[0]?.nombre || 'Tortas Cuadradas'),
      stock: prod.stock !== undefined ? prod.stock : 10,
      stockCritico: prod.stockCritico !== undefined ? prod.stockCritico : 5,
      enOferta: Boolean(prod.enOferta),
      porcentajeDescuento: prod.porcentajeDescuento || 0,
      imagen: prod.imagen || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'
    });
    setErrores({});
    setModalAbierto(true);
  };

  // Cerrar modal
  const handleCerrarModal = () => {
    setModalAbierto(false);
    setFormData(ESTADO_FORM_INICIAL);
    setErrores({});
  };

  // Validación de formulario
  const validarFormulario = () => {
    const err = {};
    if (!formData.codigo?.trim()) {
      err.codigo = 'El código del producto es obligatorio';
    } else if (!/^[A-Za-z0-9_-]{3,10}$/.test(formData.codigo.trim())) {
      err.codigo = 'El código debe tener entre 3 y 10 caracteres alfanuméricos';
    }

    if (!formData.nombre?.trim()) {
      err.nombre = 'El nombre del producto es obligatorio';
    } else if (formData.nombre.trim().length < 3) {
      err.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.precio || Number(formData.precio) <= 0) {
      err.precio = 'El precio debe ser un número mayor a $0';
    }

    if (formData.stock === '' || Number(formData.stock) < 0) {
      err.stock = 'El stock no puede ser un valor negativo';
    }

    if (formData.enOferta) {
      const desc = Number(formData.porcentajeDescuento);
      if (isNaN(desc) || desc <= 0 || desc > 90) {
        err.porcentajeDescuento = 'El descuento debe ser entre 1% y 90%';
      }
    }

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  // Guardar (Crear o Actualizar)
  const handleGuardarProducto = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setGuardando(true);
    try {
      const payload = {
        codigo: formData.codigo.trim().toUpperCase(),
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: Number(formData.precio),
        categoria: formData.categoria,
        categoriaNombre: formData.categoria,
        stock: Number(formData.stock),
        stockCritico: Number(formData.stockCritico) || 5,
        enOferta: Boolean(formData.enOferta),
        porcentajeDescuento: formData.enOferta ? Number(formData.porcentajeDescuento) : 0,
        imagen: formData.imagen.trim()
      };

      if (modoEdicion) {
        const actualizado = await productoService.actualizar(formData.id, payload);
        setProductos((prev) =>
          prev.map((p) => (p.id === formData.id ? { ...p, ...actualizado } : p))
        );
        mostrarMensaje(`Producto "${payload.nombre}" actualizado exitosamente.`);
      } else {
        const nuevo = await productoService.crear(payload);
        setProductos((prev) => [nuevo, ...prev]);
        mostrarMensaje(`Producto "${payload.nombre}" creado exitosamente.`);
      }

      handleCerrarModal();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setErrores({ global: error.message || 'Error al guardar el producto' });
    } finally {
      setGuardando(false);
    }
  };

  // Confirmar eliminación
  const handleEliminarProducto = async () => {
    if (!productoAEliminar) return;

    try {
      await productoService.eliminar(productoAEliminar.id);
      setProductos((prev) => prev.filter((p) => p.id !== productoAEliminar.id));
      mostrarMensaje(`Producto "${productoAEliminar.nombre}" eliminado del catálogo.`);
      setProductoAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar: ' + (error.message || 'No se pudo completar la operación.'));
    }
  };

  return (
    <div className="container-fluid p-0" data-testid="admin-productos">
      {/* Alerta flotante de éxito */}
      {mensajeExito && (
        <div
          className="alert alert-success bg-success bg-opacity-25 border-success text-light text-center position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg z-3"
          style={{ minWidth: '350px' }}
          role="alert"
          data-testid="toast-exito-producto"
        >
          <i className="bi bi-check-circle-fill text-success me-2"></i>
          {mensajeExito}
        </div>
      )}

      {/* Encabezado y Botón Crear */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h2 text-warning fw-bold font-serif mb-1">
            Gestión y Catálogo de Productos
          </h1>
          <p className="text-secondary small mb-0">
            Administra variedades de pastelería, precios en CLP, stock e inventario crítico.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAbrirCrear}
          className="btn btn-warning text-dark fw-bold px-4 py-2 shadow"
          data-testid="btn-nuevo-producto"
        >
          <i className="bi bi-plus-circle-fill me-2"></i>
          Nuevo Producto
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="card bg-secondary bg-opacity-10 border-secondary p-3 mb-4 rounded-3 shadow-sm">
        <div className="row g-3 align-items-center">
          {/* Buscador de Texto */}
          <div className="col-12 col-md-6 col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Buscar por código, nombre o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar producto en tabla"
                data-testid="input-buscar-admin-producto"
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

          {/* Filtro por Categoría */}
          <div className="col-12 col-md-4 col-lg-4">
            <select
              className="form-select bg-dark text-light border-secondary"
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              aria-label="Filtrar por categoría"
              data-testid="select-categoria-admin"
            >
              <option value="TODAS">Todas las Categorías ({productos.length})</option>
              {categorias.map((cat) => (
                <option key={cat.id || cat.nombre} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Contador de Resultados */}
          <div className="col-12 col-md-2 col-lg-3 text-md-end text-secondary small">
            Mostrando <strong>{productosFiltrados.length}</strong> de {productos.length} productos
          </div>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="card bg-secondary bg-opacity-10 border-secondary shadow-sm rounded-3 overflow-hidden">
        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Cargando inventario...</span>
            </div>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <i className="bi bi-box-seam display-4 mb-3 d-block text-secondary"></i>
            <h5>No se encontraron productos coincidentes</h5>
            <p className="small">Prueba cambiando los términos de búsqueda o agrega un nuevo producto.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0" data-testid="tabla-admin-productos">
              <thead className="table-dark text-secondary small text-uppercase border-bottom border-secondary">
                <tr>
                  <th scope="col" style={{ width: '70px' }}>Foto</th>
                  <th scope="col" style={{ width: '100px' }}>Código</th>
                  <th scope="col">Nombre & Descripción</th>
                  <th scope="col">Categoría</th>
                  <th scope="col" className="text-end">Precio Normal</th>
                  <th scope="col" className="text-center">Stock</th>
                  <th scope="col" className="text-center">Estado</th>
                  <th scope="col" className="text-end" style={{ width: '130px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((prod) => {
                  const esCritico = (prod.stock || 0) <= (prod.stockCritico || 5);
                  const precioConDescuento = prod.enOferta && prod.porcentajeDescuento > 0
                    ? Math.round(prod.precio * (1 - prod.porcentajeDescuento / 100))
                    : prod.precio;

                  return (
                    <tr key={prod.id || prod.codigo} data-testid={`fila-producto-${prod.codigo}`}>
                      {/* Miniatura */}
                      <td>
                        <img
                          src={prod.imagen || '/img/producto_TC001.avif'}
                          alt={prod.nombre}
                          className="rounded border border-secondary"
                          style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = '/img/producto_TC001.avif'; }}
                        />
                      </td>

                      {/* Código */}
                      <td>
                        <span className="badge bg-dark border border-warning text-warning font-monospace">
                          {prod.codigo}
                        </span>
                      </td>

                      {/* Nombre y descripción */}
                      <td>
                        <strong className="text-light d-block">{prod.nombre}</strong>
                        <span className="small text-secondary text-truncate d-inline-block" style={{ maxWidth: '300px' }}>
                          {prod.descripcion || 'Sin descripción'}
                        </span>
                      </td>

                      {/* Categoría */}
                      <td className="small text-secondary">{prod.categoriaNombre || prod.categoria || 'General'}</td>

                      {/* Precio */}
                      <td className="text-end fw-bold">
                        {prod.enOferta && prod.porcentajeDescuento > 0 ? (
                          <div>
                            <span className="text-warning d-block">${Number(precioConDescuento).toLocaleString('es-CL')}</span>
                            <span className="text-secondary small text-decoration-line-through">
                              ${Number(prod.precio).toLocaleString('es-CL')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-light">${Number(prod.precio).toLocaleString('es-CL')}</span>
                        )}
                      </td>

                      {/* Stock con alerta */}
                      <td className="text-center">
                        <span
                          className={`badge ${
                            prod.stock === 0
                              ? 'bg-danger'
                              : esCritico
                              ? 'bg-danger text-light'
                              : 'bg-success bg-opacity-75'
                          } fw-bold`}
                          title={esCritico ? '¡Stock Crítico!' : 'Stock normal'}
                        >
                          {prod.stock} un.
                        </span>
                      </td>

                      {/* Estado / Oferta */}
                      <td className="text-center">
                        {prod.enOferta ? (
                          <span className="badge bg-danger text-light">
                            Oferta -{prod.porcentajeDescuento}%
                          </span>
                        ) : (
                          <span className="badge bg-secondary bg-opacity-50 text-light">
                            Activo
                          </span>
                        )}
                      </td>

                      {/* Botones de Acción */}
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-warning"
                            onClick={() => handleAbrirEditar(prod)}
                            title="Editar Producto"
                            data-testid={`btn-editar-${prod.codigo}`}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => setProductoAEliminar(prod)}
                            title="Eliminar Producto"
                            data-testid={`btn-eliminar-${prod.codigo}`}
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

      {/* MODAL FORMULARIO DE PRODUCTO (CREAR / EDITAR) */}
      {modalAbierto && (
        <div
          className="modal show d-block bg-black bg-opacity-75 z-3"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="modal-producto-titulo"
          data-testid="modal-producto"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-light border-warning shadow-lg">
              <div className="modal-header border-secondary border-opacity-50">
                <h5 className="modal-title text-warning fw-bold font-serif" id="modal-producto-titulo">
                  <i className={`bi ${modoEdicion ? 'bi-pencil-square' : 'bi-plus-circle-fill'} me-2`}></i>
                  {modoEdicion ? `Editar Producto (${formData.codigo})` : 'Agregar Nuevo Producto'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCerrarModal}
                  aria-label="Cerrar ventana"
                ></button>
              </div>

              <form onSubmit={handleGuardarProducto} noValidate data-testid="form-admin-producto">
                <div className="modal-body">
                  {errores.global && (
                    <div className="alert alert-danger p-2 small mb-3">
                      {errores.global}
                    </div>
                  )}

                  <div className="row g-3">
                    {/* Código */}
                    <div className="col-12 col-sm-4">
                      <label htmlFor="prod-codigo" className="form-label small fw-bold text-light">
                        Código Único: <span className="text-danger">*</span>
                      </label>
                      <input
                        id="prod-codigo"
                        type="text"
                        disabled={modoEdicion}
                        className={`form-control bg-dark text-light border-secondary font-monospace ${
                          errores.codigo ? 'is-invalid border-danger' : ''
                        }`}
                        placeholder="ej. TC003"
                        value={formData.codigo}
                        onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                        aria-label="Código del producto"
                      />
                      {errores.codigo && <div className="invalid-feedback">{errores.codigo}</div>}
                    </div>

                    {/* Nombre */}
                    <div className="col-12 col-sm-8">
                      <label htmlFor="prod-nombre" className="form-label small fw-bold text-light">
                        Nombre del Producto: <span className="text-danger">*</span>
                      </label>
                      <input
                        id="prod-nombre"
                        type="text"
                        className={`form-control bg-dark text-light border-secondary ${
                          errores.nombre ? 'is-invalid border-danger' : ''
                        }`}
                        placeholder="ej. Torta Cuadrada Selva Negra"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        aria-label="Nombre del producto"
                      />
                      {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                    </div>

                    {/* Categoría */}
                    <div className="col-12 col-sm-6">
                      <label htmlFor="prod-categoria" className="form-label small fw-bold text-light">
                        Categoría: <span className="text-danger">*</span>
                      </label>
                      <select
                        id="prod-categoria"
                        className="form-select bg-dark text-light border-secondary"
                        value={formData.categoria}
                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                        aria-label="Categoría del producto"
                      >
                        {categorias.map((cat) => (
                          <option key={cat.id || cat.nombre} value={cat.nombre}>
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Precio CLP */}
                    <div className="col-12 col-sm-6">
                      <label htmlFor="prod-precio" className="form-label small fw-bold text-light">
                        Precio Normal (CLP): <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-dark border-secondary text-secondary">$</span>
                        <input
                          id="prod-precio"
                          type="number"
                          min="1"
                          className={`form-control bg-dark text-light border-secondary ${
                            errores.precio ? 'is-invalid border-danger' : ''
                          }`}
                          placeholder="45000"
                          value={formData.precio}
                          onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                          aria-label="Precio del producto"
                        />
                      </div>
                      {errores.precio && <div className="text-danger small mt-1">{errores.precio}</div>}
                    </div>

                    {/* Stock y Stock Crítico */}
                    <div className="col-12 col-sm-6">
                      <label htmlFor="prod-stock" className="form-label small fw-bold text-light">
                        Stock Disponible: <span className="text-danger">*</span>
                      </label>
                      <input
                        id="prod-stock"
                        type="number"
                        min="0"
                        className={`form-control bg-dark text-light border-secondary ${
                          errores.stock ? 'is-invalid border-danger' : ''
                        }`}
                        placeholder="10"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        aria-label="Stock del producto"
                      />
                      {errores.stock && <div className="invalid-feedback">{errores.stock}</div>}
                    </div>

                    <div className="col-12 col-sm-6">
                      <label htmlFor="prod-stock-critico" className="form-label small fw-bold text-light">
                        Umbral de Stock Crítico:
                      </label>
                      <input
                        id="prod-stock-critico"
                        type="number"
                        min="1"
                        className="form-control bg-dark text-light border-secondary"
                        placeholder="5"
                        value={formData.stockCritico}
                        onChange={(e) => setFormData({ ...formData, stockCritico: e.target.value })}
                        aria-label="Umbral de stock crítico"
                      />
                      <small className="text-secondary" style={{ fontSize: '0.75rem' }}>
                        Alerta visual cuando el stock sea &le; a este valor.
                      </small>
                    </div>

                    {/* Descripción */}
                    <div className="col-12">
                      <label htmlFor="prod-desc" className="form-label small fw-bold text-light">
                        Descripción Artesanal:
                      </label>
                      <textarea
                        id="prod-desc"
                        rows="2"
                        className="form-control bg-dark text-light border-secondary"
                        placeholder="Capas de bizcocho húmedo, ganache de chocolate belga..."
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        aria-label="Descripción del producto"
                      ></textarea>
                    </div>

                    {/* URL Imagen */}
                    <div className="col-12">
                      <label htmlFor="prod-img" className="form-label small fw-bold text-light">
                        URL de la Imagen:
                      </label>
                      <input
                        id="prod-img"
                        type="url"
                        className="form-control bg-dark text-light border-secondary"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={formData.imagen}
                        onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                        aria-label="URL de imagen del producto"
                      />
                    </div>

                    {/* En Oferta y Porcentaje */}
                    <div className="col-12">
                      <div className="card bg-secondary bg-opacity-10 border-secondary p-3 rounded-3">
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="prod-en-oferta"
                            checked={formData.enOferta}
                            onChange={(e) => setFormData({ ...formData, enOferta: e.target.checked })}
                            data-testid="switch-en-oferta"
                          />
                          <label className="form-check-label text-warning fw-bold small" htmlFor="prod-en-oferta">
                            Marcar como Producto en Promoción / Oferta
                          </label>
                        </div>

                        {formData.enOferta && (
                          <div className="row g-2 align-items-center mt-1">
                            <div className="col-auto">
                              <label htmlFor="prod-desc-porcentaje" className="small text-light">
                                Descuento aplicado:
                              </label>
                            </div>
                            <div className="col-auto" style={{ width: '120px' }}>
                              <div className="input-group input-group-sm">
                                <input
                                  id="prod-desc-porcentaje"
                                  type="number"
                                  min="1"
                                  max="90"
                                  className={`form-control bg-dark text-light border-secondary ${
                                    errores.porcentajeDescuento ? 'is-invalid' : ''
                                  }`}
                                  value={formData.porcentajeDescuento}
                                  onChange={(e) =>
                                    setFormData({ ...formData, porcentajeDescuento: e.target.value })
                                  }
                                  aria-label="Porcentaje de descuento"
                                />
                                <span className="input-group-text bg-dark border-secondary text-secondary">%</span>
                              </div>
                            </div>
                            <div className="col-auto">
                              <span className="small text-success fw-bold">
                                Precio final:{' '}
                                ${Math.round(
                                  (Number(formData.precio) || 0) *
                                    (1 - (Number(formData.porcentajeDescuento) || 0) / 100)
                                ).toLocaleString('es-CL')}{' '}
                                CLP
                              </span>
                            </div>
                            {errores.porcentajeDescuento && (
                              <div className="col-12 text-danger small">{errores.porcentajeDescuento}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
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
                    data-testid="btn-guardar-producto"
                  >
                    {guardando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-2"></i>
                        {modoEdicion ? 'Actualizar Producto' : 'Crear Producto'}
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
      {productoAEliminar && (
        <div
          className="modal show d-block bg-black bg-opacity-75 z-3"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="modal-eliminar-titulo"
          data-testid="modal-eliminar-producto"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light border-danger shadow-lg">
              <div className="modal-header border-secondary border-opacity-50">
                <h5 className="modal-title text-danger fw-bold" id="modal-eliminar-titulo">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Confirmar Eliminación
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setProductoAEliminar(null)}
                  aria-label="Cancelar"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Estás seguro de que deseas eliminar permanentemente el producto{' '}
                  <strong className="text-warning">{productoAEliminar.nombre}</strong> (Código:{' '}
                  <code>{productoAEliminar.codigo}</code>)?
                </p>
                <p className="text-secondary small mb-0">
                  Esta acción actualizará el catálogo del backend Spring Boot y no se puede deshacer.
                </p>
              </div>
              <div className="modal-footer border-secondary border-opacity-50">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setProductoAEliminar(null)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger fw-bold"
                  onClick={handleEliminarProducto}
                  data-testid="btn-confirmar-eliminar"
                >
                  <i className="bi bi-trash-fill me-2"></i>
                  Eliminar Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductos;
