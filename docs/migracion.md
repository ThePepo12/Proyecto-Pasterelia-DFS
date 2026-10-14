# Bitácora de Migración: HTML/JS → React
**Proyecto:** Pastelería Mil Sabores  
**Asignatura:** DSY1104 Desarrollo Fullstack II (Duoc UC)  
**Evaluación:** Evaluación Parcial 2  

---

## 1. Tabla de Equivalencias (Fase 1: Setup y Entorno de Pruebas)

| Archivo Original | Ubicación Nueva / Componente | Estado | Qué Cambió / Justificación Técnica |
|---|---|---|---|
| `HTML/*` (43 archivos) | `legacy/*` | **PRESERVADO** | Se trasladaron todos los archivos mediante `git mv` para conservar el historial íntegro de Git sin pérdidas. |
| `HTML/img/*` | `public/img/*` | **COPIADO** | Assets estáticos disponibles para el servidor de desarrollo Vite y empaquetado de producción. |
| `HTML/css/*` | `src/assets/css/*` | **ADAPTADO** | Hojas de estilo preparadas para ser importadas modularmente en React. |
| - | `src/main.jsx` | **NUEVO** | Punto de entrada React 18, monta `<App />`, importa Bootstrap 5 JS/CSS y estilos globales. |
| - | `src/App.jsx` | **NUEVO** | Enrutador principal basado en React Router DOM v6 con vista de preview. |
| - | `index.html` (raíz) | **NUEVO** | Plantilla HTML de montaje con Google Fonts pre-cargadas (Lato, Playfair Display, Pacifico). |
| - | `package.json` | **NUEVO** | Declaración de dependencias React, Bootstrap 5, Vite, Webpack, Babel, Jasmine y Karma. |
| - | `karma.conf.cjs` | **NUEVO** | Configuración de Karma con `karma-jasmine`, `karma-webpack`, `karma-coverage` y lanzador `ChromeHeadlessNoSandbox`. |
| - | `babel.config.cjs` | **NUEVO** | Transpilador Babel para JSX y sintaxis moderna en entorno Karma. |
| - | `tests/setup.js` | **NUEVO** | Hook global de limpieza de `localStorage` para garantizar aislamiento de pruebas. |
| - | `tests/sanity.spec.js` | **NUEVO** | Primera prueba unitaria con Jasmine y `@testing-library/react` (2 casos pasando en verde). |

---

## 2. Decisiones de Arquitectura Registradas

1. **Entorno Dual (Vite para desarrollo + Karma/Webpack para testing)**:
   - Vite proporciona velocidad de arranque instantánea (`npm run dev`) y Hot Module Replacement (HMR).
   - Karma + Webpack ejecuta las pruebas en Jasmine sobre un navegador real sin cabecera (`ChromeHeadless`), cumpliendo estrictamente con el indicador **IE2.2.1** y **IE2.3.1** de la rúbrica de Duoc UC.
2. **Aislamiento de Pruebas**:
   - `tests/setup.js` borra el `localStorage` en `beforeEach` y `afterEach` para evitar colisiones entre suites de pruebas.
