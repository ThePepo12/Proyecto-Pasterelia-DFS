/**
 * Administración de cuentas de usuario y asignación de roles:
 * - Tabla con id, nombre, email, teléfono, dirección, edad, rol y beneficios
 * - Buscador por texto en tiempo real y filtro por rol (ADMIN / CLIENTE)
 * - Creación y edición reactiva mediante modal accesible
 * - Protección de auto-eliminación para la sesión administrativa activa
 */
import React, { useState, useEffect, useMemo } from 'react';
import { usuarioService } from '../../services/usuarioService.js';
import { useAuth } from '../../context/AuthContext.jsx';

const ESTADO_FORM_INICIAL = {
  id: null,
  nombre: '',
  email: '',
  password: '',
  telefono: '',
  direccion: '',
  edad: 25,
  rol: 'CLIENTE',
  esEstudianteDuoc: false
};

export function AdminUsuarios() {
  const { usuario: adminActivo } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('TODOS');

  // Modal Crear / Editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState(ESTADO_FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  // Modal Eliminación
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const lista = await usuarioService.obtenerTodos();
      setUsuarios(lista || []);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const mostrarMensaje = (msg) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(''), 3500);
  };

  // Filtrado reactivo en tiempo real
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const coincideTexto =
        u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.telefono?.includes(busqueda);

      const coincideRol =
        filtroRol === 'TODOS' || u.rol?.toUpperCase() === filtroRol.toUpperCase();

      return coincideTexto && coincideRol;
    });
  }, [usuarios, busqueda, filtroRol]);

  const handleAbrirCrear = () => {
    setModoEdicion(false);
    setFormData(ESTADO_FORM_INICIAL);
    setErrores({});
    setModalAbierto(true);
  };

  const handleAbrirEditar = (u) => {
    setModoEdicion(true);
    setFormData({
      id: u.id,
      nombre: u.nombre || '',
      email: u.email || '',
      password: '',
      telefono: u.telefono || '',
      direccion: u.direccion || '',
      edad: u.edad !== undefined ? u.edad : 25,
      rol: u.rol || 'CLIENTE',
      esEstudianteDuoc: Boolean(u.esEstudianteDuoc || u.email?.endsWith('@duocuc.cl'))
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
      err.nombre = 'El nombre completo es obligatorio';
    } else if (formData.nombre.trim().length < 3) {
      err.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email?.trim()) {
      err.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      err.email = 'El formato del correo es inválido';
    }

    if (!modoEdicion) {
      if (!formData.password || formData.password.length < 6) {
        err.password = 'La contraseña debe tener al menos 6 caracteres';
      }
    }

    if (formData.edad === '' || Number(formData.edad) < 14 || Number(formData.edad) > 120) {
      err.edad = 'Ingresa una edad válida (14 a 120 años)';
    }

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleGuardarUsuario = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setGuardando(true);
    try {
      const edadNum = Number(formData.edad);
      const payload = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim().toLowerCase(),
        telefono: formData.telefono.trim(),
        direccion: formData.direccion.trim(),
        edad: edadNum,
        rol: formData.rol,
        descuentoSenior: edadNum >= 50,
        esEstudianteDuoc: Boolean(formData.esEstudianteDuoc || formData.email.toLowerCase().endsWith('@duocuc.cl'))
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (modoEdicion) {
        const actualizado = await usuarioService.actualizar(formData.id, payload);
        setUsuarios((prev) =>
          prev.map((u) => (u.id === formData.id ? { ...u, ...actualizado } : u))
        );
        mostrarMensaje(`Usuario "${payload.nombre}" actualizado exitosamente.`);
      } else {
        const nuevo = await usuarioService.crear(payload);
        setUsuarios((prev) => [nuevo, ...prev]);
        mostrarMensaje(`Usuario "${payload.nombre}" registrado exitosamente.`);
      }

      handleCerrarModal();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      setErrores({ global: error.message || 'Error al guardar usuario' });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarUsuario = async () => {
    if (!usuarioAEliminar) return;

    // Validación preventiva: no auto-eliminar el usuario actual
    if (adminActivo && (adminActivo.id === usuarioAEliminar.id || adminActivo.email === usuarioAEliminar.email)) {
      alert('Operación no permitida: no puedes eliminar la cuenta de administrador con la que iniciaste sesión.');
      setUsuarioAEliminar(null);
      return;
    }

    try {
      await usuarioService.eliminar(usuarioAEliminar.id);
      setUsuarios((prev) => prev.filter((u) => u.id !== usuarioAEliminar.id));
      mostrarMensaje(`Usuario "${usuarioAEliminar.nombre}" eliminado exitosamente.`);
      setUsuarioAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error: ' + (error.message || 'No se pudo eliminar el usuario.'));
    }
  };

  return (
    <div className="container-fluid p-0" data-testid="admin-usuarios">
      {/* Toast de Éxito */}
      {mensajeExito && (
        <div
          className="alert alert-success bg-success bg-opacity-25 border-success text-light text-center position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg z-3"
          style={{ minWidth: '350px' }}
          role="alert"
          data-testid="toast-exito-usuario"
        >
          <i className="bi bi-check-circle-fill text-success me-2"></i>
          {mensajeExito}
        </div>
      )}

      {/* Encabezado y Botón Crear */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h2 text-warning fw-bold font-serif mb-1">
            Control de Usuarios y Roles
          </h1>
          <p className="text-secondary small mb-0">
            Gestiona cuentas de clientes, accesos administrativos y asignación de beneficios comerciales.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAbrirCrear}
          className="btn btn-warning text-dark fw-bold px-4 py-2 shadow"
          data-testid="btn-nuevo-usuario"
        >
          <i className="bi bi-person-plus-fill me-2"></i>
          Nuevo Usuario
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="card bg-secondary bg-opacity-10 border-secondary p-3 mb-4 rounded-3 shadow-sm">
        <div className="row g-3 align-items-center">
          {/* Buscador */}
          <div className="col-12 col-md-6 col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Buscar por nombre, correo o teléfono..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar usuario"
                data-testid="input-buscar-usuario"
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

          {/* Filtro por Rol */}
          <div className="col-12 col-md-4 col-lg-4">
            <select
              className="form-select bg-dark text-light border-secondary"
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              aria-label="Filtrar por rol"
              data-testid="select-filtro-rol"
            >
              <option value="TODOS">Todos los Roles ({usuarios.length})</option>
              <option value="ADMIN">Solo Administradores (ADMIN)</option>
              <option value="CLIENTE">Solo Clientes (CLIENTE)</option>
            </select>
          </div>

          {/* Contador */}
          <div className="col-12 col-md-2 col-lg-3 text-md-end text-secondary small">
            Mostrando <strong>{usuariosFiltrados.length}</strong> de {usuarios.length} usuarios
          </div>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="card bg-secondary bg-opacity-10 border-secondary shadow-sm rounded-3 overflow-hidden">
        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Cargando usuarios...</span>
            </div>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <i className="bi bi-people display-4 mb-3 d-block text-secondary"></i>
            <h5>No se encontraron usuarios coincidentes</h5>
            <p className="small">Modifica los filtros o registra un nuevo usuario en la plataforma.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0" data-testid="tabla-admin-usuarios">
              <thead className="table-dark text-secondary small text-uppercase border-bottom border-secondary">
                <tr>
                  <th scope="col" style={{ width: '60px' }}>ID</th>
                  <th scope="col">Nombre & Correo</th>
                  <th scope="col">Contacto & Dirección</th>
                  <th scope="col" className="text-center" style={{ width: '80px' }}>Edad</th>
                  <th scope="col" className="text-center" style={{ width: '120px' }}>Rol</th>
                  <th scope="col" className="text-center" style={{ width: '160px' }}>Beneficios</th>
                  <th scope="col" className="text-end" style={{ width: '130px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((u) => {
                  const esAdmin = u.rol === 'ADMIN';
                  const esSenior = Boolean(u.descuentoSenior || (u.edad && u.edad >= 50));
                  const esDuoc = Boolean(u.esEstudianteDuoc || u.email?.endsWith('@duocuc.cl'));

                  return (
                    <tr key={u.id || u.email} data-testid={`fila-usuario-${u.id}`}>
                      {/* ID */}
                      <td>
                        <span className="badge bg-dark border border-secondary text-secondary">
                          #{u.id}
                        </span>
                      </td>

                      {/* Nombre & Correo */}
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center fw-bold small ${
                              esAdmin ? 'bg-warning text-dark' : 'bg-secondary text-light'
                            }`}
                            style={{ width: '34px', height: '34px' }}
                          >
                            {u.nombre ? u.nombre.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <strong className="text-light d-block">{u.nombre}</strong>
                            <span className="small text-secondary">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Teléfono & Dirección */}
                      <td className="small text-secondary">
                        <div>
                          <i className="bi bi-telephone me-1 text-warning"></i>
                          {u.telefono || 'Sin teléfono'}
                        </div>
                        <div className="text-truncate" style={{ maxWidth: '240px' }}>
                          <i className="bi bi-geo-alt me-1 text-secondary"></i>
                          {u.direccion || 'Sin dirección registrada'}
                        </div>
                      </td>

                      {/* Edad */}
                      <td className="text-center fw-bold small text-light">
                        {u.edad || '—'} {u.edad ? 'años' : ''}
                      </td>

                      {/* Rol */}
                      <td className="text-center">
                        <span
                          className={`badge ${
                            esAdmin ? 'bg-warning text-dark' : 'bg-secondary bg-opacity-75 text-light'
                          } fw-bold px-3 py-2 text-uppercase`}
                          data-testid={`badge-rol-${u.id}`}
                        >
                          <i className={`bi ${esAdmin ? 'bi-shield-check' : 'bi-person'} me-1`}></i>
                          {u.rol || 'CLIENTE'}
                        </span>
                      </td>

                      {/* Beneficios */}
                      <td className="text-center">
                        <div className="d-flex flex-column gap-1 align-items-center">
                          {esSenior && (
                            <span className="badge bg-success bg-opacity-25 text-success border border-success" style={{ fontSize: '0.7rem' }}>
                              Senior 50%
                            </span>
                          )}
                          {esDuoc && (
                            <span className="badge bg-info bg-opacity-25 text-info border border-info" style={{ fontSize: '0.7rem' }}>
                              Duoc UC
                            </span>
                          )}
                          {!esSenior && !esDuoc && (
                            <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>
                              Estándar
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-warning"
                            onClick={() => handleAbrirEditar(u)}
                            title="Editar Usuario / Asignar Rol"
                            data-testid={`btn-editar-usuario-${u.id}`}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => setUsuarioAEliminar(u)}
                            title="Eliminar Cuenta"
                            data-testid={`btn-eliminar-usuario-${u.id}`}
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

      {/* MODAL CREAR / EDITAR USUARIO */}
      {modalAbierto && (
        <div
          className="modal show d-block bg-black bg-opacity-75 z-3"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="modal-usuario-titulo"
          data-testid="modal-usuario"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-light border-warning shadow-lg">
              <div className="modal-header border-secondary border-opacity-50">
                <h5 className="modal-title text-warning fw-bold font-serif" id="modal-usuario-titulo">
                  <i className={`bi ${modoEdicion ? 'bi-pencil-square' : 'bi-person-plus-fill'} me-2`}></i>
                  {modoEdicion ? `Editar Usuario (#${formData.id})` : 'Registrar Nuevo Usuario'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCerrarModal}
                  aria-label="Cerrar ventana"
                ></button>
              </div>

              <form onSubmit={handleGuardarUsuario} noValidate data-testid="form-admin-usuario">
                <div className="modal-body">
                  {errores.global && (
                    <div className="alert alert-danger p-2 small mb-3">
                      {errores.global}
                    </div>
                  )}

                  <div className="row g-3">
                    {/* Nombre */}
                    <div className="col-12 col-sm-6">
                      <label htmlFor="usr-nombre" className="form-label small fw-bold text-light">
                        Nombre Completo: <span className="text-danger">*</span>
                      </label>
                      <input
                        id="usr-nombre"
                        type="text"
                        className={`form-control bg-dark text-light border-secondary ${
                          errores.nombre ? 'is-invalid border-danger' : ''
                        }`}
                        placeholder="ej. Antonia Salazar"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        aria-label="Nombre completo"
                      />
                      {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                    </div>

                    {/* Email */}
                    <div className="col-12 col-sm-6">
                      <label htmlFor="usr-email" className="form-label small fw-bold text-light">
                        Correo Electrónico: <span className="text-danger">*</span>
                      </label>
                      <input
                        id="usr-email"
                        type="email"
                        className={`form-control bg-dark text-light border-secondary ${
                          errores.email ? 'is-invalid border-danger' : ''
                        }`}
                        placeholder="antonia@milsabores.cl"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        aria-label="Correo electrónico"
                      />
                      {errores.email && <div className="invalid-feedback">{errores.email}</div>}
                    </div>

                    {/* Contraseña */}
                    <div className="col-12 col-sm-6">
                      <label htmlFor="usr-password" className="form-label small fw-bold text-light">
                        Contraseña: {modoEdicion ? <span className="text-secondary">(Opcional en edición)</span> : <span className="text-danger">*</span>}
                      </label>
                      <input
                        id="usr-password"
                        type="password"
                        className={`form-control bg-dark text-light border-secondary ${
                          errores.password ? 'is-invalid border-danger' : ''
                        }`}
                        placeholder={modoEdicion ? 'Dejar en blanco para conservar actual' : 'Mínimo 6 caracteres'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        aria-label="Contraseña del usuario"
                      />
                      {errores.password && <div className="invalid-feedback">{errores.password}</div>}
                    </div>

                    {/* Teléfono */}
                    <div className="col-12 col-sm-6">
                      <label htmlFor="usr-telefono" className="form-label small fw-bold text-light">
                        Teléfono:
                      </label>
                      <input
                        id="usr-telefono"
                        type="tel"
                        className="form-control bg-dark text-light border-secondary"
                        placeholder="+56 9 8765 4321"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        aria-label="Teléfono del usuario"
                      />
                    </div>

                    {/* Dirección */}
                    <div className="col-12 col-sm-8">
                      <label htmlFor="usr-direccion" className="form-label small fw-bold text-light">
                        Dirección de Despacho:
                      </label>
                      <input
                        id="usr-direccion"
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        placeholder="Av. Manuel Montt 1500, Depto 402, Providencia"
                        value={formData.direccion}
                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                        aria-label="Dirección del usuario"
                      />
                    </div>

                    {/* Edad */}
                    <div className="col-12 col-sm-4">
                      <label htmlFor="usr-edad" className="form-label small fw-bold text-light">
                        Edad: <span className="text-danger">*</span>
                      </label>
                      <input
                        id="usr-edad"
                        type="number"
                        min="14"
                        max="120"
                        className={`form-control bg-dark text-light border-secondary ${
                          errores.edad ? 'is-invalid border-danger' : ''
                        }`}
                        placeholder="25"
                        value={formData.edad}
                        onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                        aria-label="Edad del usuario"
                      />
                      {errores.edad && <div className="invalid-feedback">{errores.edad}</div>}
                    </div>

                    {/* Rol Administrativo */}
                    <div className="col-12 col-sm-6">
                      <label htmlFor="usr-rol" className="form-label small fw-bold text-light">
                        Rol en la Plataforma: <span className="text-danger">*</span>
                      </label>
                      <select
                        id="usr-rol"
                        className="form-select bg-dark text-light border-secondary"
                        value={formData.rol}
                        onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                        aria-label="Rol del usuario"
                        data-testid="select-modal-rol"
                      >
                        <option value="CLIENTE">CLIENTE (Compras, carrito y perfil personal)</option>
                        <option value="ADMIN">ADMIN (Acceso total al panel de administración)</option>
                      </select>
                    </div>

                    {/* Checkbox Duoc */}
                    <div className="col-12 col-sm-6 d-flex align-items-center pt-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="usr-es-duoc"
                          checked={formData.esEstudianteDuoc}
                          onChange={(e) => setFormData({ ...formData, esEstudianteDuoc: e.target.checked })}
                          data-testid="check-es-duoc"
                        />
                        <label className="form-check-label small text-light" htmlFor="usr-es-duoc">
                          Comunidad Duoc UC (Aplica beneficios institucionales)
                        </label>
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
                    data-testid="btn-guardar-usuario"
                  >
                    {guardando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-2"></i>
                        {modoEdicion ? 'Actualizar Usuario' : 'Registrar Usuario'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACIÓN ELIMINACIÓN */}
      {usuarioAEliminar && (
        <div
          className="modal show d-block bg-black bg-opacity-75 z-3"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="modal-eliminar-usr-titulo"
          data-testid="modal-eliminar-usuario"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light border-danger shadow-lg">
              <div className="modal-header border-secondary border-opacity-50">
                <h5 className="modal-title text-danger fw-bold" id="modal-eliminar-usr-titulo">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Confirmar Eliminación de Usuario
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setUsuarioAEliminar(null)}
                  aria-label="Cancelar"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Estás seguro de que deseas eliminar permanentemente la cuenta de{' '}
                  <strong className="text-warning">{usuarioAEliminar.nombre}</strong> ({usuarioAEliminar.email})?
                </p>
                <p className="text-secondary small mb-0">
                  El usuario perderá el acceso a la plataforma y su historial de compras en Spring Boot.
                </p>
              </div>
              <div className="modal-footer border-secondary border-opacity-50">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setUsuarioAEliminar(null)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger fw-bold"
                  onClick={handleEliminarUsuario}
                  data-testid="btn-confirmar-eliminar-usuario"
                >
                  <i className="bi bi-trash-fill me-2"></i>
                  Eliminar Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsuarios;
