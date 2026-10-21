/**
 * PERFIL DE USUARIO (src/pages/tienda/Perfil.jsx)
 * 
 * Migrada de legacy/perfil.html.
 * Muestra información del usuario activo, permite actualizar sus datos personales,
 * visualiza sus insignias de beneficios (Senior/Duoc) y carga su historial de compras reales.
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ordenService } from '../../services/ordenService.js';

export function Perfil() {
  const { usuario, isAuthenticated, isSenior, isEstudiante, isAdmin, actualizarPerfil, logout } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [guardando, setGuardando] = useState(false);
  const [ordenes, setOrdenes] = useState([]);
  const [cargandoOrdenes, setCargandoOrdenes] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (usuario) {
      setNombre(usuario.nombre || '');
      setTelefono(usuario.telefono || '');
      setDireccion(usuario.direccion || '');

      // Cargar historial de compras de este usuario
      async function cargarHistorial() {
        try {
          const misOrdenes = await ordenService.obtenerPorUsuario(usuario.id);
          setOrdenes(misOrdenes);
        } catch (e) {
          console.error('Error cargando historial de órdenes:', e);
        } finally {
          setCargandoOrdenes(false);
        }
      }
      cargarHistorial();
    }
  }, [usuario, isAuthenticated, navigate]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje({ tipo: '', texto: '' });

    const res = await actualizarPerfil({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim()
    });
    setGuardando(false);

    if (res.success) {
      setMensaje({ tipo: 'success', texto: '¡Datos de perfil actualizados con éxito!' });
    } else {
      setMensaje({ tipo: 'danger', texto: res.error || 'No se pudieron actualizar los datos.' });
    }
  };

  if (!usuario) return null;

  return (
    <div className="bg-dark text-light py-5 min-vh-100">
      <div className="container">
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h1 className="display-6 fw-bold text-warning mb-1">
              <i className="bi bi-person-badge-fill me-2"></i> Mi Perfil
            </h1>
            <p className="text-secondary mb-0">Administra tus datos personales y revisa tus compras.</p>
          </div>
          <div className="d-flex gap-2">
            {isAdmin && (
              <Link to="/admin" className="btn btn-warning text-dark fw-bold btn-sm">
                <i className="bi bi-speedometer2 me-1"></i> Ir al Panel Admin
              </Link>
            )}
            <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline-danger btn-sm">
              <i className="bi bi-box-arrow-right me-1"></i> Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="row g-4">
          {/* Columna Izquierda: Tarjeta de Insignias y Edición */}
          <div className="col-12 col-lg-5">
            {/* Tarjeta de Resumen */}
            <div className="card bg-secondary bg-opacity-10 border-warning p-4 shadow-sm mb-4">
              <div className="text-center mb-3">
                <div className="avatar bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-2 mb-2" style={{ width: '80px', height: '80px' }}>
                  {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'}
                </div>
                <h5 className="text-light fw-bold mb-0">{usuario.nombre}</h5>
                <small className="text-secondary">{usuario.email}</small>
              </div>

              {/* Insignias de Beneficios */}
              <div className="d-flex flex-wrap gap-2 justify-content-center mb-3">
                <span className="badge bg-secondary border border-light">Rol: {usuario.rol}</span>
                {isSenior && (
                  <span className="badge bg-warning text-dark fw-bold">
                    <i className="bi bi-award-fill me-1"></i> 50% Senior (+50 años)
                  </span>
                )}
                {isEstudiante && (
                  <span className="badge bg-info text-dark fw-bold">
                    <i className="bi bi-mortarboard-fill me-1"></i> Comunidad Duoc UC
                  </span>
                )}
              </div>

              {usuario.edad && (
                <div className="text-center text-secondary small">
                  Edad registrada: <strong className="text-light">{usuario.edad} años</strong>
                </div>
              )}
            </div>

            {/* Formulario de Actualización */}
            <div className="card bg-secondary bg-opacity-10 border-secondary p-4 shadow-sm">
              <h5 className="text-warning fw-bold mb-3">
                <i className="bi bi-pencil-square me-2"></i> Editar Mis Datos
              </h5>

              {mensaje.texto && (
                <div className={`alert alert-${mensaje.tipo} py-2 small mb-3`} role="alert">
                  {mensaje.texto}
                </div>
              )}

              <form onSubmit={handleGuardar}>
                <div className="mb-3">
                  <label className="form-label text-light small fw-bold">Nombre Completo:</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-light small fw-bold">Teléfono:</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-light small fw-bold">Dirección de Despacho:</label>
                  <textarea
                    rows={2}
                    className="form-control bg-dark text-light border-secondary"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={guardando}
                  className="btn btn-warning text-dark fw-bold w-100 shadow-sm"
                >
                  {guardando ? 'Guardando cambios...' : 'Guardar Datos'}
                </button>
              </form>
            </div>
          </div>

          {/* Columna Derecha: Historial de Compras */}
          <div className="col-12 col-lg-7">
            <div className="card bg-secondary bg-opacity-10 border-secondary shadow-sm">
              <div className="card-header bg-dark border-bottom border-secondary py-3 d-flex justify-content-between align-items-center">
                <h5 className="text-warning fw-bold mb-0">
                  <i className="bi bi-clock-history me-2"></i> Historial de Pedidos
                </h5>
                <span className="badge bg-dark border border-secondary text-secondary">
                  {ordenes.length} compras
                </span>
              </div>

              <div className="card-body p-3">
                {cargandoOrdenes ? (
                  <div className="text-center py-4 text-secondary">
                    <div className="spinner-border spinner-border-sm text-warning me-2"></div>
                    Cargando compras...
                  </div>
                ) : ordenes.length === 0 ? (
                  <div className="text-center py-4 text-secondary">
                    <i className="bi bi-bag-x fs-1 text-secondary d-block mb-2"></i>
                    Aún no has realizado pedidos con esta cuenta.
                    <div className="mt-2">
                      <Link to="/productos" className="btn btn-outline-warning btn-sm">
                        Explorar Catálogo
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {ordenes.map((ord) => (
                      <div key={ord.id} className="card bg-dark border-secondary p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-1">
                          <div>
                            <span className="fw-bold text-warning fs-5">Folio: {ord.folio}</span>
                            <span className="text-secondary small d-block">
                              Fecha: {ord.fecha} &bull; {ord.hora || ''}
                            </span>
                          </div>
                          <span className={`badge ${ord.estado === 'Entregado' ? 'bg-success' : ord.estado === 'En preparación' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                            {ord.estado}
                          </span>
                        </div>

                        {ord.items && (
                          <ul className="list-unstyled small text-secondary my-2 ps-2 border-start border-warning">
                            {ord.items.map((it, idx) => (
                              <li key={idx} className="mb-1">
                                <strong className="text-light">{it.cantidad}x</strong> {it.nombreProducto} — ${Number(it.subtotal || it.precioUnitario).toLocaleString('es-CL')} CLP
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25 mt-2">
                          <span className="small text-secondary">Dirección: {ord.direccionEntrega || 'Retiro'}</span>
                          <span className="fw-bold text-warning fs-6">
                            Total: ${Number(ord.total).toLocaleString('es-CL')} CLP
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
