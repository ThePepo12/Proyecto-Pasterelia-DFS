
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [cargandoLocal, setCargandoLocal] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destino = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    setCargandoLocal(true);
    const resultado = await login(email.trim(), password);
    setCargandoLocal(false);

    if (resultado.success) {
      if (resultado.usuario?.rol === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(destino);
      }
    } else {
      setErrorMsg(resultado.error || 'Correo o contraseña incorrectos.');
    }
  };

  // Botón rápido de prueba
  const cargarDemo = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setErrorMsg('');
  };

  return (
    <div className="bg-dark text-light py-5 min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card bg-secondary bg-opacity-10 border-warning p-4 p-md-5 shadow-lg rounded-4">
              <div className="text-center mb-4">
                <i className="bi bi-person-circle text-warning display-4 mb-2"></i>
                <h2 className="fw-bold text-warning mb-1">Iniciar Sesión</h2>
                <p className="text-secondary small">
                  Accede a tu cuenta de Pastelería Mil Sabores para disfrutar de tus beneficios exclusivos.
                </p>
              </div>

              {errorMsg && (
                <div className="alert alert-danger py-2 small d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                  <div>{errorMsg}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label text-light small fw-bold">Correo Electrónico:</label>
                  <input
                    type="email"
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="nombre@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Correo electrónico"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-light small fw-bold">Contraseña:</label>
                  <input
                    type="password"
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-label="Contraseña"
                  />
                </div>

                <button
                  type="submit"
                  disabled={cargandoLocal}
                  className="btn btn-warning btn-lg text-dark fw-bold w-100 shadow mb-3"
                >
                  {cargandoLocal ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Verificando credenciales...
                    </span>
                  ) : (
                    'Ingresar a mi Cuenta'
                  )}
                </button>
              </form>

              {/* Botones de Acceso Rápido */}
              <div className="p-3 bg-dark bg-opacity-50 border border-secondary rounded-3 my-3">
                <small className="text-warning fw-bold d-block mb-2">
                  <i className="bi bi-lightning-charge-fill me-1"></i> Accesos de Prueba:
                </small>
                <div className="d-flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => cargarDemo('admin@pasteleriamilsabores.cl', 'admin123')}
                    className="btn btn-outline-warning btn-sm"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => cargarDemo('rosa.carrasco@gmail.com', 'rosa123')}
                    className="btn btn-outline-info btn-sm"
                  >
                    Senior (+50 años)
                  </button>
                  <button
                    type="button"
                    onClick={() => cargarDemo('estudiante@duocuc.cl', 'duoc123')}
                    className="btn btn-outline-light btn-sm"
                  >
                    Duoc UC
                  </button>
                </div>
              </div>

              <div className="text-center pt-2 border-top border-secondary border-opacity-25 small text-secondary">
                ¿No tienes cuenta aún?{' '}
                <Link to="/registro" className="text-warning fw-bold text-decoration-none">
                  Regístrate aquí
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
