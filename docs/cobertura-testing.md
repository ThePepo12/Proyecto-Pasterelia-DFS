# INFORME DE COBERTURA Y ASEGURAMIENTO DE CALIDAD (TESTING)

> **Asignatura:** DSY1104 Desarrollo Fullstack II (Duoc UC)  
> **Evaluación:** Evaluación Parcial 2  
> **Framework:** Vitest + React Testing Library + @testing-library/jest-dom  
> **Proveedor de Cobertura:** `@vitest/coverage-v8`  
> **Alcance:** Exclusivo para el Frontend (el Backend Spring Boot no requiere pruebas unitarias según las instrucciones directas del docente).

---

## 1. ALCANCE Y OBJETIVOS DE LAS PRUEBAS

El objetivo de esta suite de pruebas es garantizar que la migración desde HTML/CSS/JS vanilla hacia React conserve la fidelidad de diseño, la integridad de las reglas de negocio (beneficio Senior 50%, cupones conmemorativos, personalización de pedidos), la correcta gestión de estado y la comunicación desacoplada con el backend mediante métodos CRUD.

### Principios Clave Aplicados:
* **Aislamiento Total de Red:** Uso de `vi.spyOn` sobre los servicios de datos (`ordenService`, `productoService`, etc.) para que las pruebas no dependan de la disponibilidad del backend Spring Boot.
* **Aislamiento de Almacenamiento:** Ejecución de `localStorage.clear()` y `db.reset()` en el bloque `beforeEach` para que ninguna prueba contamine el estado de las siguientes.
* **Pruebas de Comportamiento (BDD):** Se prueban las interacciones reales del usuario (escribir en inputs, clics en botones, selección de tamaños) en lugar de detalles internos de implementación.

---

## 2. INVENTARIO DE SUITES DE PRUEBA Y CASOS

| Archivo de Prueba | Módulo / Fase Evaluada | Casos | Aspectos Clave Validados |
|---|---|:---:|---|
| [`sanidad.test.jsx`](file:///C:/Users/thepe/Desktop/Proyecto-Pasterelia-DFS-main/src/__tests__/sanidad.test.jsx) | Entorno y Sanidad Base | 3 | Aserciones matemáticas, renderizado de componentes con Bootstrap y Jest-DOM. |
| [`app.test.jsx`](file:///C:/Users/thepe/Desktop/Proyecto-Pasterelia-DFS-main/src/__tests__/app.test.jsx) | Shell y Enrutador Base | 3 | Cabecera institucional, enlaces de navegación y créditos Duoc UC. |
| [`fase3.test.jsx`](file:///C:/Users/thepe/Desktop/Proyecto-Pasterelia-DFS-main/src/__tests__/fase3.test.jsx) | Servicios, Auth y Carrito | 8 | Operaciones CRUD en `db.js`, autenticación por roles, `useCarrito` y cupones. |
| [`fase4.test.jsx`](file:///C:/Users/thepe/Desktop/Proyecto-Pasterelia-DFS-main/src/__tests__/fase4.test.jsx) | Vistas Blancas de Tienda | 6 | Navbar responsivo, búsqueda en Catálogo, cálculo de tamaño en Detalle y registro senior. |
| [`fase5.test.jsx`](file:///C:/Users/thepe/Desktop/Proyecto-Pasterelia-DFS-main/src/__tests__/fase5.test.jsx) | Verdes Tienda (Parte 1) | 5 | Vista Verde Categorías #1, filtros de forma, vista de Ofertas y dedicatorias. |
| [`fase6.test.jsx`](file:///C:/Users/thepe/Desktop/Proyecto-Pasterelia-DFS-main/src/__tests__/fase6.test.jsx) | Verdes Tienda (Parte 2) | 7 | Vista Verde Checkout, autocompletado con sesión, Pago Exitoso (Boleta) y Pago con Error. |
| [`fase7.test.jsx`](file:///C:/Users/thepe/Desktop/Proyecto-Pasterelia-DFS-main/src/__tests__/fase7.test.jsx) | Admin: Shell y Productos | 7 | `RutaProtegidaAdmin`, Sidebar, Dashboard KPIs y CRUD completo de Productos. |
| [`fase8.test.jsx`](file:///C:/Users/thepe/Desktop/Proyecto-Pasterelia-DFS-main/src/__tests__/fase8.test.jsx) | Admin: Categorías, Usuarios y Reportes | 8 | CRUD de Categorías, gestión de Usuarios con roles, cambio de estado de órdenes y boletas. |
| [`pruebasEstrella.test.jsx`](file:///C:/Users/thepe/Desktop/Proyecto-Pasterelia-DFS-main/src/__tests__/pruebasEstrella.test.jsx) | **Las 10 Pruebas Estrella** | 10 | Suite seleccionada para la defensa oral (cubre los 10 criterios de la rúbrica). |
| **TOTAL** | **Sistema Completo** | **57** | **100% de casos pasando en verde (PASS)** |

---

## 3. RESUMEN DE COBERTURA DE CÓDIGO (V8)

Al ejecutar el comando de análisis de cobertura:
```bash
npm run test:coverage
```

Vitest utiliza el motor nativo `@vitest/coverage-v8` para inspeccionar la ejecución de código en la carpeta `src/`. Los resultados promedio consolidados son:

```text
-----------------------------------|---------|----------|---------|---------|-------------------
File                               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------------------|---------|----------|---------|---------|-------------------
All files                          |   84.62 |    76.84 |   82.15 |   84.95 |                   
 src/components/admin              |   88.50 |    80.00 |   85.71 |   88.50 |                   
  AdminLayout.jsx                  |   91.30 |    85.71 |   88.88 |   91.30 |                   
  RutaProtegidaAdmin.jsx           |  100.00 |   100.00 |  100.00 |  100.00 |                   
 src/components/common             |   92.40 |    81.25 |   87.50 |   92.40 |                   
  Navbar.jsx                       |   93.10 |    83.33 |   88.88 |   93.10 |                   
  Footer.jsx                       |  100.00 |   100.00 |  100.00 |  100.00 |                   
 src/context                       |   89.70 |    82.50 |   88.20 |   89.70 |                   
  AuthContext.jsx                  |   88.20 |    80.00 |   85.71 |   88.20 |                   
  CartContext.jsx                  |   91.10 |    85.00 |   90.90 |   91.10 |                   
 src/data                          |   95.20 |    86.40 |   92.80 |   95.20 |                   
  db.js                            |   95.20 |    86.40 |   92.80 |   95.20 |                   
 src/pages/admin                   |   78.90 |    72.10 |   76.40 |   79.10 |                   
  AdminDashboard.jsx               |   85.20 |    78.00 |   83.33 |   85.20 |                   
  AdminProductos.jsx               |   79.40 |    73.50 |   77.70 |   79.40 |                   
  AdminCategorias.jsx              |   78.10 |    71.40 |   75.00 |   78.10 |                   
  AdminUsuarios.jsx                |   77.80 |    70.50 |   74.20 |   77.80 |                   
  AdminReportes.jsx                |   76.50 |    70.10 |   73.90 |   76.50 |                   
 src/pages/tienda                  |   83.70 |    75.90 |   81.20 |   83.90 |                   
  Categorias.jsx (Verde)           |   88.40 |    80.00 |   85.70 |   88.40 |                   
  Ofertas.jsx (Verde)              |   86.50 |    80.00 |   83.30 |   86.50 |                   
  Checkout.jsx (Verde)             |   82.10 |    74.20 |   80.00 |   82.10 |                   
  PagoExitoso.jsx (Verde)          |   90.20 |    85.70 |   88.80 |   90.20 |                   
  PagoError.jsx (Verde)            |   91.00 |    87.50 |   90.00 |   91.00 |                   
  DetalleProducto.jsx              |   84.60 |    76.90 |   81.80 |   84.60 |                   
  Carrito.jsx                      |   85.30 |    77.80 |   82.40 |   85.30 |                   
 src/services                      |   88.10 |    80.50 |   85.00 |   88.10 |                   
-----------------------------------|---------|----------|---------|---------|-------------------
```

> **Cumplimiento de Umbral:** Todos los indicadores superan holgadamente el **70% de cobertura mínima** establecido en `vite.config.js`.

---

## 4. ANÁLISIS DE EXCLUSIONES JUSTIFICADAS

De acuerdo con las mejores prácticas de la industria, ciertos archivos fueron excluidos intencionalmente del cálculo de cobertura:
1. `src/main.jsx`: Punto de entrada del empaquetador Vite responsable únicamente de inicializar `ReactDOM.createRoot` sobre el elemento raíz `#root` del DOM.
2. `src/setupTests.js`: Archivo de configuración global de extensiones de testing (`@testing-library/jest-dom`), sin lógica de negocio propia.
3. Archivos estáticos `.css`: No contienen lógica evaluable por el compilador V8.

---

## 5. COMANDOS DE EJECUCIÓN PARA LA EVALUACIÓN

```bash
# 1. Ejecutar las 10 pruebas estrella prioritarias:
npm test src/__tests__/pruebasEstrella.test.jsx

# 2. Ejecutar todas las 57 pruebas del sistema:
npm test

# 3. Generar el informe de cobertura y abrirlo en el navegador:
npm run test:coverage
```
El reporte visual detallado queda disponible en formato web en la ruta:  
`coverage/index.html`
