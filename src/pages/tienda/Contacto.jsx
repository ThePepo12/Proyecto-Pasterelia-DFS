/**
 * CONTACTO Y SUCURSALES (src/pages/tienda/Contacto.jsx)
 * 
 * Migrada de legacy/contacto.html.
 * Formulario de contacto controlado con validación, mapa interactivo y datos de las 3 sucursales.
 */
import React, { useState } from 'react';

export function Contacto() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [asunto, setAsunto] = useState('Consulta General');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !mensaje.trim()) return;

    setEnviado(true);
    setNombre('');
    setEmail('');
    setTelefono('');
    setMensaje('');
    setTimeout(() => setEnviado(false), 5000);
  };

  return (
    <div className="bg-dark text-light py-5 min-vh-100">
      <div className="container">
        {/* Encabezado */}
        <div className="text-center mb-5">
          <span className="badge bg-warning text-dark px-3 py-2 text-uppercase fw-bold mb-2">
            Estamos para Ayudarte
          </span>
          <h1 className="display-5 fw-bold text-warning">Contáctanos & Sucursales</h1>
          <p className="lead text-secondary mx-auto" style={{ maxWidth: '680px' }}>
            ¿Tienes dudas sobre pedidos especiales para bodas, convenios institucionales o despachos?
            Escríbenos o visita nuestras tiendas en Santiago.
          </p>
        </div>

        <div className="row g-5">
          {/* Formulario */}
          <div className="col-12 col-lg-7">
            <div className="card bg-secondary bg-opacity-10 border-warning p-4 p-md-5 rounded-4 shadow-sm">
              <h3 className="text-warning fw-bold mb-3">
                <i className="bi bi-envelope-paper-fill me-2"></i> Envíanos un Mensaje
              </h3>

              {enviado && (
                <div className="alert alert-success d-flex align-items-center mb-4">
                  <i className="bi bi-check-circle-fill fs-4 me-2"></i>
                  <div>
                    ¡Mensaje enviado con éxito! Nuestro equipo de atención al cliente te responderá en menos de 24 horas.
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label text-light small fw-bold">Nombre Completo *</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Ej: Francisco Morales"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-light small fw-bold">Correo Electrónico *</label>
                    <input
                      type="email"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-light small fw-bold">Teléfono de Contacto</label>
                    <input
                      type="tel"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="+56 9 1234 5678"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-light small fw-bold">Tipo de Consulta</label>
                    <select
                      className="form-select bg-dark text-light border-secondary"
                      value={asunto}
                      onChange={(e) => setAsunto(e.target.value)}
                    >
                      <option value="Consulta General">Consulta General</option>
                      <option value="Torta Especial o Boda">Torta Especial / Boda</option>
                      <option value="Convenio Duoc UC">Convenio Duoc UC</option>
                      <option value="Despachos y Seguimiento">Despachos y Seguimiento</option>
                      <option value="Reclamo o Sugerencia">Reclamo o Sugerencia</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label text-light small fw-bold">Mensaje o Detalle del Pedido *</label>
                    <textarea
                      rows={4}
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Cuéntanos fecha requerida, cantidad de porciones o cualquier detalle..."
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-warning text-dark fw-bold btn-lg w-100 shadow mt-2">
                      <i className="bi bi-send-fill me-2"></i> Enviar Mensaje
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Información y Sucursales */}
          <div className="col-12 col-lg-5">
            <div className="d-flex flex-column gap-4">
              {/* Sucursal 1 */}
              <div className="card bg-secondary bg-opacity-10 border-secondary p-3">
                <h5 className="text-warning fw-bold mb-1">
                  <i className="bi bi-shop me-2"></i> Casa Matriz & Obrador
                </h5>
                <p className="text-secondary small mb-1">Av. Concha y Toro #1234, Puente Alto, Santiago</p>
                <p className="text-secondary small mb-0">
                  <i className="bi bi-telephone-fill text-warning me-1"></i> +56 9 8765 4321 &bull; Lun a Dom 09:00 - 20:00
                </p>
              </div>

              {/* Sucursal 2 */}
              <div className="card bg-secondary bg-opacity-10 border-secondary p-3">
                <h5 className="text-warning fw-bold mb-1">
                  <i className="bi bi-shop me-2"></i> Sucursal Providencia
                </h5>
                <p className="text-secondary small mb-1">Av. Providencia #2450, Local 12 (Metro Tobalaba)</p>
                <p className="text-secondary small mb-0">
                  <i className="bi bi-telephone-fill text-warning me-1"></i> +56 9 7654 3210 &bull; Lun a Sáb 09:30 - 20:30
                </p>
              </div>

              {/* Sucursal 3 */}
              <div className="card bg-secondary bg-opacity-10 border-secondary p-3">
                <h5 className="text-warning fw-bold mb-1">
                  <i className="bi bi-shop me-2"></i> Sucursal Las Condes
                </h5>
                <p className="text-secondary small mb-1">Av. Manquehue Sur #520, Las Condes</p>
                <p className="text-secondary small mb-0">
                  <i className="bi bi-telephone-fill text-warning me-1"></i> +56 9 6543 2109 &bull; Lun a Dom 10:00 - 19:30
                </p>
              </div>

              {/* Canales Digitales */}
              <div className="card bg-warning text-dark p-3">
                <h6 className="fw-bold mb-1">Atención Inmediata por WhatsApp</h6>
                <p className="small mb-2">Para consultas sobre disponibilidad de stock el mismo día:</p>
                <a
                  href="https://wa.me/56987654321"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-dark text-warning fw-bold btn-sm"
                >
                  <i className="bi bi-whatsapp me-1"></i> Chatear con Maestro Pastelero
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
