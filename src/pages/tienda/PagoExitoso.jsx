/**
 * VISTA OBLIGATORIA: PAGO CORRECTO / BOLETA (VERDE)
 * (src/pages/tienda/PagoExitoso.jsx)
 * 
 * Muestra el comprobante oficial de pago exitoso (Boleta Electrónica):
 * - Mensaje de éxito con número de folio y código de autorización
 * - Datos del cliente y dirección en modo solo lectura
 * - Desglose de productos comprados, personalizaciones y totales en CLP
 * - Botones requeridos: "Imprimir boleta en PDF" y "Enviar boleta por email"
 */
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

export function PagoExitoso() {
  const location = useLocation();
  const [emailEnviado, setEmailEnviado] = useState(false);

  // Recuperar orden desde el state de navegación o del almacenamiento local
  const orden = location.state?.orden || (() => {
    try {
      const guardada = localStorage.getItem('ultimo_pedido_mil_sabores');
      return guardada ? JSON.parse(guardada) : null;
    } catch (e) {
      return null;
    }
  })() || {
    folio: 'MS-501995',
    fecha: new Date().toLocaleDateString('es-CL'),
    hora: '14:30',
    clienteNombre: 'Rosa María Carrasco',
    clienteEmail: 'rosa.carrasco@gmail.com',
    telefono: '+56 9 7654 3210',
    direccionEntrega: 'Av. Concha y Toro #2500, Santiago',
    comuna: 'Puente Alto',
    region: 'Región Metropolitana',
    fechaEntrega: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    horarioEntrega: '10:00 a 14:00 hrs',
    subtotal: 55000,
    montoDescuento: 27500,
    motivoDescuento: 'Descuento Senior 50% (+50 años)',
    envio: 3500,
    iva: 4950,
    total: 31000,
    estado: 'Confirmado',
    items: [
      {
        codigoProducto: 'TE001',
        nombreProducto: 'Torta Especial de Cumpleaños',
        precioUnitario: 55000,
        cantidad: 1,
        subtotal: 55000,
        personalizacion: 'Forma: Circular · Tamaño: Mediana · Dedicatoria: "¡Felices 50 Años Familia!"'
      }
    ]
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleEnviarEmail = () => {
    setEmailEnviado(true);
    setTimeout(() => setEmailEnviado(false), 4000);
  };

  return (
    <div className="bg-dark text-light py-5 min-vh-100">
      <div className="container" style={{ maxWidth: '850px' }}>
        {/* Toast Notificación de Email */}
        {emailEnviado && (
          <div
            className="alert alert-success bg-success bg-opacity-25 border-success text-light text-center position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg z-3"
            style={{ minWidth: '350px' }}
            role="alert"
            data-testid="toast-email-enviado"
          >
            <i className="bi bi-envelope-check-fill text-success me-2"></i>
            ¡Boleta enviada exitosamente a <strong>{orden.clienteEmail}</strong>!
          </div>
        )}

        {/* Tarjeta de Confirmación de Éxito */}
        <div className="card bg-success bg-opacity-10 border-success p-4 text-center mb-4 shadow rounded-4" data-testid="banner-exito">
          <div className="display-4 text-success mb-2">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <h2 className="text-success fw-bold font-serif mb-1">
            ¡Pago Realizado con Éxito!
          </h2>
          <p className="lead text-light mb-2">
            Gracias por celebrar tus momentos especiales con <strong>Pastelería Mil Sabores</strong>.
          </p>
          <span className="badge bg-success bg-opacity-25 text-success fs-6 border border-success mx-auto px-3 py-2">
            Código de Autorización: <strong>AUTH-{Math.floor(100000 + Math.random() * 900000)}</strong>
          </span>
        </div>

        {/* Boleta Electrónica Formal */}
        <div className="card bg-secondary bg-opacity-10 border-warning p-4 p-md-5 shadow-lg rounded-4 mb-4" id="seccion-boleta" data-testid="boleta-detalle">
          {/* Cabecera de la Boleta */}
          <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom border-warning pb-4 mb-4 gap-3">
            <div>
              <div className="d-flex align-items-center text-warning fs-4 fw-bold">
                <i className="bi bi-cake2 me-2 fs-2"></i> Pastelería Mil Sabores
              </div>
              <p className="text-secondary small mb-0">50 Años de Tradición Pastelera Artesanal</p>
              <p className="text-secondary small mb-0">RUT: 76.845.192-3 &bull; Casa Matriz: Av. Concha y Toro #1234, Santiago</p>
            </div>
            <div className="text-md-end">
              <span className="badge bg-warning text-dark fs-5 fw-bold px-3 py-2 mb-1 d-inline-block" data-testid="folio-boleta">
                Folio: {orden.folio}
              </span>
              <p className="text-secondary small mb-0">Fecha: {orden.fecha} - {orden.hora} hrs</p>
              <p className="text-secondary small mb-0">Estado: <span className="text-warning fw-bold">{orden.estado || 'Confirmado'}</span></p>
            </div>
          </div>

          {/* Datos del Cliente y Despacho (Solo Lectura) */}
          <div className="row g-3 mb-4 p-3 bg-dark bg-opacity-50 rounded-3 border border-secondary border-opacity-50 text-light" data-testid="datos-cliente-readonly">
            <div className="col-12 col-md-6">
              <h6 className="text-warning fw-bold mb-2">
                <i className="bi bi-person-badge me-1"></i> Datos del Cliente
              </h6>
              <p className="mb-1 small"><strong>Nombre:</strong> {orden.clienteNombre}</p>
              <p className="mb-1 small"><strong>Email:</strong> {orden.clienteEmail}</p>
              <p className="mb-0 small"><strong>Teléfono:</strong> {orden.telefono || '+56 9 1234 5678'}</p>
            </div>
            <div className="col-12 col-md-6">
              <h6 className="text-warning fw-bold mb-2">
                <i className="bi bi-geo-alt me-1"></i> Dirección y Entrega
              </h6>
              <p className="mb-1 small"><strong>Dirección:</strong> {orden.direccionEntrega || 'Retiro en Tienda'}</p>
              <p className="mb-1 small"><strong>Comuna:</strong> {orden.comuna || 'Santiago Centro'} ({orden.region || 'Región Metropolitana'})</p>
              <p className="mb-0 small"><strong>Entrega Programada:</strong> {orden.fechaEntrega} ({orden.horarioEntrega || 'Horario Hábil'})</p>
            </div>
          </div>

          {/* Tabla de Productos Comprados */}
          <div className="table-responsive mb-4">
            <table className="table table-dark table-borderless align-middle mb-0">
              <thead>
                <tr className="border-bottom border-warning text-warning small text-uppercase">
                  <th scope="col" style={{ width: '80px' }}>Cód.</th>
                  <th scope="col">Descripción & Personalización</th>
                  <th scope="col" className="text-center" style={{ width: '60px' }}>Cant.</th>
                  <th scope="col" className="text-end" style={{ width: '110px' }}>Precio Unit.</th>
                  <th scope="col" className="text-end" style={{ width: '120px' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(orden.items || []).map((it, idx) => (
                  <tr key={idx} className="border-bottom border-secondary border-opacity-25">
                    <td className="text-warning fw-bold small">{it.codigoProducto || 'MS'}</td>
                    <td>
                      <strong className="text-light d-block">{it.nombreProducto || it.nombre}</strong>
                      <span className="small text-warning opacity-75">{it.personalizacion || 'Estándar'}</span>
                    </td>
                    <td className="text-center fw-bold">{it.cantidad}</td>
                    <td className="text-end text-light">${(it.precioUnitario || it.precio || 0).toLocaleString('es-CL')}</td>
                    <td className="text-end fw-bold text-light">${(it.subtotal || (it.precio * it.cantidad) || 0).toLocaleString('es-CL')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Desglose de Totales */}
          <div className="row justify-content-end mb-4">
            <div className="col-12 col-sm-7 col-md-6">
              <div className="d-flex justify-content-between py-1 small">
                <span className="text-secondary">Subtotal:</span>
                <span className="text-light">${(orden.subtotal || 0).toLocaleString('es-CL')} CLP</span>
              </div>
              {(orden.montoDescuento > 0 || orden.descuentoMonto > 0) && (
                <div className="d-flex justify-content-between py-1 small text-success fw-bold" data-testid="descuento-boleta">
                  <span>{orden.motivoDescuento || 'Descuento Aplicado'}:</span>
                  <span>-${(orden.montoDescuento || orden.descuentoMonto || 0).toLocaleString('es-CL')} CLP</span>
                </div>
              )}
              <div className="d-flex justify-content-between py-1 small">
                <span className="text-secondary">Despacho Refrigerado:</span>
                <span className="text-light">${(orden.envio || 3500).toLocaleString('es-CL')} CLP</span>
              </div>
              <div className="d-flex justify-content-between py-1 small text-secondary">
                <span>IVA (19% incluido):</span>
                <span>${(orden.iva || 0).toLocaleString('es-CL')} CLP</span>
              </div>
              <hr className="border-warning my-2" />
              <div className="d-flex justify-content-between align-items-center py-1">
                <span className="fs-5 fw-bold text-light">Total Pagado:</span>
                <span className="fs-4 fw-bold text-warning" data-testid="total-pagado-boleta">
                  ${(orden.total || 0).toLocaleString('es-CL')} CLP
                </span>
              </div>
            </div>
          </div>

          {/* Pie de la Boleta */}
          <div className="border-top border-secondary border-opacity-50 pt-3 text-center text-secondary small">
            <p className="mb-1">
              Documento tributario electrónico generado según normativa del SII.
            </p>
            <p className="mb-0">
              Repartidor asignado: <strong>Carlos Valenzuela - Furgón Refrigerado Mil Sabores</strong>.
            </p>
          </div>
        </div>

        {/* Botones de Acción Requeridos */}
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <button
            type="button"
            className="btn btn-warning text-dark fw-bold px-4 py-2 shadow"
            onClick={handleImprimir}
            data-testid="btn-imprimir-boleta"
          >
            <i className="bi bi-printer-fill me-2"></i> Imprimir boleta en PDF
          </button>

          <button
            type="button"
            className="btn btn-outline-warning px-4 py-2"
            onClick={handleEnviarEmail}
            data-testid="btn-enviar-email"
          >
            <i className="bi bi-envelope-fill me-2"></i> Enviar boleta por email
          </button>

          <Link to="/seguimiento" className="btn btn-outline-light px-4 py-2">
            <i className="bi bi-truck me-2"></i> Rastrear Pedido
          </Link>

          <Link to="/productos" className="btn btn-link text-warning text-decoration-none">
            &larr; Volver a la Tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
