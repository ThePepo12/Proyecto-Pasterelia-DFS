import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function HomePreview() {
  return (
    <div className="container py-5 text-center">
      <div className="card bg-dark text-light p-4 shadow-lg border-warning mx-auto" style={{ maxWidth: '650px' }}>
        <h1 className="display-5 text-warning mb-3">Pastelería Mil Sabores</h1>
        <p className="lead">50 Años de Tradición Pastelera</p>
        <p className="text-secondary">
          Proyecto migrado a <strong>React + Bootstrap 5</strong> para la Evaluación Parcial 2 (DSY1104).
        </p>
        <div className="alert alert-info text-start mt-3">
          <h6 className="fw-bold mb-1"><i className="bi bi-check2-circle me-1"></i> Estado de Fase 1:</h6>
          <ul className="mb-0 small">
            <li>Estructura base de React + Vite inicializada.</li>
            <li>Bootstrap 5 + Bootstrap Icons integrados.</li>
            <li>Entorno de pruebas unitarias Jasmine + Karma configurado.</li>
            <li>Código legacy preservado en <code>legacy/</code> con historial de Git.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePreview />} />
      </Routes>
    </BrowserRouter>
  );
}
