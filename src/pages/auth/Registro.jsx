
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [esEstudianteManual, setEsEstudianteManual] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cargandoLocal, setCargandoLocal] = useState(false);

  const { registro } = useAuth();
  const navigate = useNavigate();

  // Cálculo reactivo de edad
  const edadCalculada = useMemo(() => {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const cumple = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const m = hoy.getMonth() - cumple.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
      edad--;
    }
    return isNaN(edad) || edad < 0 ? 0 : edad;
  }, [fechaNacimiento]);

  const esSenior = edadCalculada >= 50;
  const esDuoc = email.trim().toLowerCase().endsWith('@duocuc.cl') || esEstudianteManual;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nombre.trim() || !email.trim() || !password || !fechaNacimiento) {
      setErrorMsg('Por favor completa todos los campos requeridos (*).');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setCargandoLocal(true);
    const nuevoUsuario = {
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      password,
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      fechaNacimiento,
      edad: edadCalculada,
      rol: 'CLIENTE',
      descuentoSenior: esSenior,
      esEstudianteDuoc: esDuoc
    };

    const res = await registro(nuevoUsuario);
    setCargandoLocal(false);

    if (res.success) {
      navigate('/perfil');
    } else {
      setErrorMsg(res.error || 'No se pudo completar el registro. Intenta con otro correo.');
    }
  };

  return (
    <div className="bg-dark text-light py-5 min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-7">
            <div className="card bg-secondary bg-opacity-10 border-warning p-4 p-md-5 shadow-lg rounded-4">
              <div className="text-center mb-4">
                <i className="bi bi-person-plus-fill text-warning display-4 mb-2"></i>
                <h2 className="fw-bold text-warning mb-1">Crea tu Cuenta</h2>
                <p className="text-secondary small">
                  Únete a Pastelería Mil Sabores y accede a promociones exclusivas y beneficios de aniversario.
                </p>
              </div>

              {errorMsg && (
                <div className="alert alert-danger py-2 small d-flex align-items-center mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                  <div>{errorMsg}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  {/* Nombre */}
                  <div className="col-12">
                    <label className="form-label text-light small fw-bold">Nombre Completo *</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Ej: Rosa María Carrasco"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      aria-label="Nombre completo"
                    />
                  </div>

                  {/* Correo */}
                  <div className="col-12 col-md-6">
                    <label className="form-label text-light small fw-bold">Correo Electrónico *</label>
                    <input
                      type="email"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="usuario@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      aria-label="Correo electrónico"
                    />
                  </div>

                  {/* Contraseña */}
                  <div className="col-12 col-md-6">
                    <label className="form-label text-light small fw-bold">Contraseña *</label>
                    <input
                      type="password"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      aria-label="Contraseña"
                    />
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div className="col-12 col-md-6">
                    <label className="form-label text-light small fw-bold">Fecha de Nacimiento *</label>
                    <input
                      type="date"
                      className="form-control bg-dark text-light border-secondary"
                      value={fechaNacimiento}
                      onChange={(e) => setFechaNacimiento(e.target.value)}
                      required
                      aria-label="Fecha de nacimiento"
                    />
                    {fechaNacimiento && (
                      <small className="text-secondary d-block mt-1">
                        Edad calculada: <strong className="text-warning">{edadCalculada} años</strong>
                      </small>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="col-12 col-md-6">
                    <label className="form-label text-light small fw-bold">Teléfono de Contacto</label>
                    <input
                      type="tel"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="+56 9 1234 5678"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      aria-label="Teléfono"
                    />
                  </div>

                  {/* Dirección */}
                  <div className="col-12">
                    <label className="form-label text-light small fw-bold">Dirección de Entrega Predeterminada</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Calle, número, departamento, comuna"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      aria-label="Dirección"
                    />
                  </div>

                  {/* Convenio Duoc Checkbox */}
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input bg-dark border-secondary"
                        type="checkbox"
                        id="checkDuoc"
                        checked={esDuoc}
                        onChange={(e) => setEsEstudianteManual(e.target.checked)}
                      />
                      <label className="form-check-label text-light small" htmlFor="checkDuoc">
                        Pertenezco a la comunidad educativa <strong>Duoc UC</strong> (estudiante, docente o colaborador).
                      </label>
                    </div>
                  </div>
                </div>

                {/* Banners Reactivos de Beneficios */}
                {esSenior && (
                  <div className="alert alert-warning bg-warning bg-opacity-25 border-warning text-light my-3" data-testid="alerta-senior">
                    <i className="bi bi-award-fill text-warning fs-4 me-2"></i>
                    <strong>¡Beneficio Senior Desbloqueado!</strong>
                    <div className="small mt-1">
                      Por tener 50 años o más ({edadCalculada} años), recibes automáticamente un <strong>50% de descuento de por vida</strong> en todas tus compras.
                    </div>
                  </div>
                )}

                {esDuoc && (
                  <div className="alert alert-info bg-info bg-opacity-25 border-info text-light my-3">
                    <i className="bi bi-mortarboard-fill text-info fs-4 me-2"></i>
                    <strong>¡Convenio Duoc UC Activado!</strong>
                    <div className="small mt-1">
                      Acceso a promociones especiales de aniversario y beneficio de cumpleaños.
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={cargandoLocal}
                  className="btn btn-warning btn-lg text-dark fw-bold w-100 shadow mt-4 mb-3"
                >
                  {cargandoLocal ? 'Creando cuenta...' : 'Crear mi Cuenta'}
                </button>
              </form>

              <div className="text-center pt-2 border-top border-secondary border-opacity-25 small text-secondary">
                ¿Ya tienes una cuenta registrada?{' '}
                <Link to="/login" className="text-warning fw-bold text-decoration-none">
                  Inicia sesión aquí
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
