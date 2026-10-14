import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Importar Bootstrap 5 y Bootstrap Icons
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Importar estilos base del proyecto legacy adaptados
import './assets/css/estilos.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
