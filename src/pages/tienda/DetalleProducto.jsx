/**
 * DETALLE DE PRODUCTO (src/pages/tienda/DetalleProducto.jsx)
 * 
 * Migrada de legacy/producto.html.
 * Maneja parámetros de ruta con useParams, cálculo dinámico de precio por porciones/tamaño,
 * personalización con dedicatoria, selector de cantidad y comentarios.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productoService } from '../../services/productoService.js';
import { useCarrito } from '../../context/CartContext.jsx';

export function DetalleProducto() {
  const { codigo } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Estados de personalización
  const [tamano, setTamano] = useState('Mediana');
  const [forma, setForma] = useState('Circular');
  const [dedicatoria, setDedicatoria] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [imagenSeleccionada, setImagenSeleccionada] = useState('');
  const [mensajeToast, setMensajeToast] = useState('');

  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      try {
        const prod = await productoService.obtenerPorCodigo(codigo || 'TE001');
        if (prod) {
          setProducto(prod);
          setImagenSeleccionada(prod.imagen);
        } else {
          // Intentar por ID
          const porId = await productoService.obtenerPorId(codigo);
          setProducto(porId);
          if (porId) setImagenSeleccionada(porId.imagen);
        }
      } catch (e) {
        console.error('Error cargando producto:', e);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [codigo]);

  // Cálculo de precio según tamaño
  const precioUnitarioCalculado = useMemo(() => {
    if (!producto) return 0;
    const base = producto.precio;
    if (tamano === 'Chica') return Math.round(base * 0.75);
    if (tamano === 'Mediana') return base;
    if (tamano === 'Grande') return Math.round(base * 1.3);
    if (tamano === 'Familiar') return Math.round(base * 1.6);
    return base;
  }, [producto, tamano]);

  const handleAgregar = () => {
    if (!producto) return;

    const itemAComprar = {
      codigo: producto.codigo,
      nombre: `${producto.nombre} (${forma}, ${tamano})`,
      precio: precioUnitarioCalculado,
      cantidad: cantidad,
      personalizacion: dedicatoria.trim() ? `Mensaje: "${dedicatoria.trim()}"` : 'Sin dedicatoria',
      imagen: producto.imagen,
      stock: producto.stock
    };

    agregarAlCarrito(itemAComprar);
    setMensajeToast(`¡Se agregaron ${cantidad} unidad(es) al carrito con éxito!`);
    setTimeout(() => setMensajeToast(''), 3500);
  };

  if (cargando) {
    return (
      <div className="bg-dark text-light min-vh-100 py-5 text-center">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-3 text-secondary">Cargando detalles de la receta...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="bg-dark text-light min-vh-100 py-5 text-center">
        <div className="container">
          <i className="bi bi-exclamation-triangle text-warning fs-1 mb-3"></i>
          <h2>Producto no encontrado</h2>
          <p className="text-secondary">El producto solicitado no existe o fue retirado del catálogo.</p>
          <Link to="/productos" className="btn btn-warning text-dark fw-bold">
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark text-light py-5 min-vh-100">
      <div className="container">
        {/* Notificación Toast */}
        {mensajeToast && (
          <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1090 }}>
            <div className="toast show bg-success text-white border-0 shadow">
              <div className="d-flex align-items-center p-3">
                <i className="bi bi-cart-check-fill fs-4 me-2"></i>
                <div>{mensajeToast}</div>
              </div>
            </div>
          </div>
        )}

        {/* Migas de Pan (Breadcrumb) */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" className="text-secondary text-decoration-none">Inicio</Link></li>
            <li className="breadcrumb-item"><Link to="/productos" className="text-secondary text-decoration-none">Catálogo</Link></li>
            <li className="breadcrumb-item active text-warning" aria-current="page">{producto.nombre}</li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* Columna Izquierda: Galería e Imagen Principal */}
          <div className="col-12 col-lg-6">
            <div className="card bg-secondary bg-opacity-10 border-warning p-3 shadow-lg rounded-4">
              <div style={{ height: '400px', overflow: 'hidden' }} className="rounded-3 mb-3 bg-dark text-center">
                <img
                  src={imagenSeleccionada || producto.imagen}
                  alt={producto.nombre}
                  className="w-100 h-100 object-fit-cover rounded-3"
                  onError={(e) => {
                    e.target.src = '/img/producto_TC001.avif';
                  }}
                />
              </div>

              {/* Miniaturas */}
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className={`btn p-1 border ${imagenSeleccionada === producto.imagen ? 'border-warning' : 'border-secondary'}`}
                  onClick={() => setImagenSeleccionada(producto.imagen)}
                  style={{ width: '80px', height: '65px' }}
                >
                  <img src={producto.imagen} alt="Vista 1" className="w-100 h-100 object-fit-cover rounded" />
                </button>
                <button
                  type="button"
                  className="btn p-1 border border-secondary"
                  onClick={() => setImagenSeleccionada('/img/producto_TE001_chocolate.jpg')}
                  style={{ width: '80px', height: '65px' }}
                >
                  <img src="/img/producto_TE001_chocolate.jpg" alt="Vista 2" className="w-100 h-100 object-fit-cover rounded" onError={(e) => { e.target.src = producto.imagen; }} />
                </button>
                <button
                  type="button"
                  className="btn p-1 border border-secondary"
                  onClick={() => setImagenSeleccionada('/img/producto_TE001_velas.jpg')}
                  style={{ width: '80px', height: '65px' }}
                >
                  <img src="/img/producto_TE001_velas.jpg" alt="Vista 3" className="w-100 h-100 object-fit-cover rounded" onError={(e) => { e.target.src = producto.imagen; }} />
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Información y Configuración de Compra */}
          <div className="col-12 col-lg-6">
            <span className="badge bg-warning text-dark px-3 py-1 fw-bold text-uppercase mb-2">
              {producto.categoriaNombre || producto.categoria?.nombre || 'Pastelería'} &bull; Cód: {producto.codigo}
            </span>
            <h1 className="display-6 fw-bold text-warning mb-2">{producto.nombre}</h1>
            <p className="lead text-secondary mb-3">{producto.descripcion}</p>

            {/* Precio Dinámico */}
            <div className="p-3 bg-secondary bg-opacity-10 border border-secondary rounded-3 mb-4 d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small d-block">Precio según porciones seleccionadas:</span>
                <span className="display-6 fw-bold text-warning" data-testid="precio-dinamico">
                  ${precioUnitarioCalculado.toLocaleString('es-CL')} CLP
                </span>
              </div>
              <span className={`badge ${producto.stock <= 5 ? 'bg-danger' : 'bg-success'} fs-6`}>
                Stock: {producto.stock} disponibles
              </span>
            </div>

            {/* Selectores de Personalización */}
            <div className="card bg-secondary bg-opacity-10 border-secondary p-4 mb-4">
              <h5 className="text-warning fw-bold mb-3">
                <i className="bi bi-sliders me-2"></i> Personaliza tu Pedido
              </h5>

              {/* Tamaño */}
              <div className="mb-3">
                <label className="form-label text-light small fw-bold">Tamaño y Porciones:</label>
                <select
                  className="form-select bg-dark text-light border-secondary"
                  value={tamano}
                  onChange={(e) => setTamano(e.target.value)}
                  aria-label="Seleccionar tamaño"
                >
                  <option value="Chica">Chica (6 a 8 porciones) - ${Math.round(producto.precio * 0.75).toLocaleString('es-CL')} CLP</option>
                  <option value="Mediana">Mediana (12 a 15 porciones) - ${producto.precio.toLocaleString('es-CL')} CLP</option>
                  <option value="Grande">Grande (20 a 25 porciones) - ${Math.round(producto.precio * 1.3).toLocaleString('es-CL')} CLP</option>
                  <option value="Familiar">Familiar (30 a 35 porciones) - ${Math.round(producto.precio * 1.6).toLocaleString('es-CL')} CLP</option>
                </select>
              </div>

              {/* Forma */}
              <div className="mb-3">
                <label className="form-label text-light small fw-bold">Forma de la Torta:</label>
                <select
                  className="form-select bg-dark text-light border-secondary"
                  value={forma}
                  onChange={(e) => setForma(e.target.value)}
                  aria-label="Seleccionar forma"
                >
                  <option value="Circular">Circular (Tradicional)</option>
                  <option value="Cuadrada">Cuadrada (Presentación Moderna)</option>
                  <option value="Corazón">Corazón (Especial Aniversario)</option>
                </select>
              </div>

              {/* Dedicatoria personalizada */}
              <div className="mb-3">
                <label className="form-label text-light small fw-bold">
                  Dedicatoria o Mensaje en Placa de Azúcar (Opcional):
                </label>
                <input
                  type="text"
                  maxLength={50}
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Ej: ¡Feliz Aniversario Mamá!"
                  value={dedicatoria}
                  onChange={(e) => setDedicatoria(e.target.value)}
                  aria-label="Dedicatoria personalizada"
                />
                <small className="text-secondary">{50 - dedicatoria.length} caracteres restantes</small>
              </div>

              {/* Control de Cantidad y Botón Comprar */}
              <div className="row g-3 align-items-center mt-2">
                <div className="col-12 col-sm-4">
                  <div className="input-group">
                    <button
                      className="btn btn-outline-warning"
                      type="button"
                      onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      readOnly
                      className="form-control text-center bg-dark text-light border-secondary fw-bold"
                      value={cantidad}
                      aria-label="Cantidad de productos"
                    />
                    <button
                      className="btn btn-outline-warning"
                      type="button"
                      onClick={() => setCantidad((c) => c + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="col-12 col-sm-8">
                  <button
                    onClick={handleAgregar}
                    className="btn btn-warning btn-lg text-dark fw-bold w-100 shadow"
                  >
                    <i className="bi bi-cart-plus-fill me-2"></i> Añadir al Carrito
                  </button>
                </div>
              </div>
            </div>

            {/* Aviso Beneficio Senior */}
            <div className="alert alert-warning bg-warning bg-opacity-10 border-warning text-light small mb-0">
              <i className="bi bi-info-circle-fill text-warning me-2"></i>
              <strong>Recuerda:</strong> Si eres mayor de 50 años o estudiante de Duoc UC, inicia sesión para que se aplique tu descuento especial en el resumen de tu compra.
            </div>
          </div>
        </div>

        {/* Reseñas y Opiniones */}
        <div className="mt-5 pt-4 border-top border-secondary border-opacity-25">
          <h4 className="text-warning fw-bold mb-4">Opiniones de Nuestros Clientes</h4>
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="card bg-secondary bg-opacity-10 border-secondary p-3">
                <div className="d-flex justify-content-between mb-2">
                  <strong className="text-light">Marcela Sotomayor</strong>
                  <span className="text-warning">★★★★★</span>
                </div>
                <p className="small text-secondary mb-0">
                  "Pedí esta torta para el cumpleaños de mi mamá y fue todo un éxito. La dedicatoria quedó preciosa y el bizcocho súper húmedo."
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card bg-secondary bg-opacity-10 border-secondary p-3">
                <div className="d-flex justify-content-between mb-2">
                  <strong className="text-light">Carlos Valenzuela</strong>
                  <span className="text-warning">★★★★★</span>
                </div>
                <p className="small text-secondary mb-0">
                  "Excelente presentación. El despacho llegó a la hora exacta en caja refrigerada. Mil Sabores nunca falla en nuestras celebraciones."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
