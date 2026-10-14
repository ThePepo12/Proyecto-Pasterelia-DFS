# Fase 0: Alineación, Inventario y Estrategia de Migración
**Asignatura:** DSY1104 Desarrollo Fullstack II (Duoc UC)  
**Evaluación:** Evaluación Parcial 2 (30% de la asignatura)  
**Rol:** Desarrollador FullStack Senior / Mentor Técnico  

---

## 1. Inventario Detallado del Workspace

### 1.1 Archivos HTML Existentes (12 vistas en `HTML/`)
| Archivo | Tamaño (bytes) | Propósito y Contenido Principal |
|---|---|---|
| `index.html` | ~13.7 KB | Landing / Home: Hero de 50 años, stats, promociones, productos destacados, footer. |
| `categoria.html` | ~27.3 KB | Catálogo con buscador en tiempo real, filtros por categoría (8 categorías) y filtros por forma. |
| `producto.html` | ~14.5 KB | Ficha de detalle de producto con selector de tamaño/forma, cálculo de precio y comentarios. |
| `carrito.html` | ~9.3 KB | Carrito de compras con resumen de precios, cupón de descuento, programación de entrega y beneficios. |
| `boleta.html` | ~13.0 KB | Comprobante fiscal / boleta electrónica detallada con desglose de IVA, folios y botón de impresión. |
| `seguimiento.html` | ~14.2 KB | Stepper de tracking de despacho (5 etapas), ficha del repartidor y simulación interactiva. |
| `perfil.html` | ~15.1 KB | Gestión de usuario: datos de contacto, preferencias de elaboración artesanal, historial y sugerencias. |
| `login.html` | ~7.5 KB | Formulario de autenticación con accesos rápidos de prueba (Adulto Mayor, Alumno Duoc). |
| `registro.html` | ~11.5 KB | Formulario de alta con validación de edad para beneficio senior y correo institucional `@duocuc.cl`. |
| `nosotros.html` | ~10.1 KB | Historia, hito Récord Guinness 1995, misión, visión y 4 valores corporativos. |
| `blogs.html` | ~16.8 KB | Artículos de repostería y formulario de aportes de recetas de la comunidad. |
| `contacto.html` | ~11.7 KB | Formulario de contacto con validación y tarjetas de información de sucursales/horarios. |

### 1.2 Hojas de Estilo CSS (8 archivos en `HTML/css/`)
- `estilos.css`: Variables CSS globales (`:root`), tipografías (Lato, Playfair Display, Pacifico), utilidades de botones (`.btn-primary`, `.btn-outline`), badges y resets.
- `cabecera.css`: Estilos de barra superior de anuncios, header principal sticky, logo, menú colapsable móvil y contador del carrito.
- `index.css`: Grid de hitos estadísticos, promociones conmemorativas y cards de productos destacados.
- `categoria.css`: Grid responsivo del catálogo (4 columnas a 1 columna), filtros pill y barra de búsqueda.
- `producto.css`: Layout de 2 columnas (galería + configuración de compra) y caja de opiniones.
- `carrito.css`: Tabla de ítems con controles de cantidad (+/-), card de resumen sticky y formulario de despacho.
- `nosotros.css`: Sección de historia, caja dorada de Récord Guinness, cards de misión/visión y grid de valores.
- `contacto.css`: Layout de 2 columnas (formulario de contacto y tarjetas informativas con iconos SVG).

### 1.3 Módulos JavaScript Vanilla (4 archivos en `HTML/js/`)
- `productos.js`: Base de 16 productos con código, categoría, nombre, precio, descripción e imagen; lógica de detalle y comentarios.
- `usuarios.js`: Lógica de sesión en `localStorage` (`usuario_mil_sabores_activo`), registro, cálculo de edad, beneficios y perfil.
- `carrito.js`: CRUD del carrito en `localStorage` (`carrito_mil_sabores`), cálculo de subtotales, cupón `FELICES50`, generación de pedido y boleta.
- `main.js`: Orquestador con `DOMContentLoaded`, menú móvil toggle, envío de contacto y recetas del blog.

### 1.4 Recursos Multimedia (19 imágenes en `HTML/img/`)
- Hero mockup (`hero_mockup.png`), imágenes optimizadas `.avif` y `.jpg` para todas las categorías (tortas circulares, cuadradas, postres individuales, sin gluten, sin azúcar, especiales).

---

## 2. Tabla de Migración Arquitectónica (HTML → React)

Clasificación según los requerimientos de la Evaluación Parcial 2 y el Anexo de Instrucciones:

| # | Vista / Requerimiento | Archivo Original | Componente / Página React | Tipo | Responsabilidad / Descripción |
|---|---|---|---|---|---|
| 1 | Navbar Común | `cabecera.css` + fragmentos | `components/common/Navbar.jsx` | **MIGRAR** | Navegación, buscador integrado, links auth, carrito en vivo y menú responsivo Bootstrap. |
| 2 | Footer Común | En todos los HTML | `components/common/Footer.jsx` | **MIGRAR** | Información corporativa, enlaces rápidos, categorías y datos de contacto. |
| 3 | Home / Inicio | `index.html` | `pages/tienda/Home.jsx` | **MIGRAR** | Hero con carrusel responsivo (1200x300), estadísticas, promociones y destacados. |
| 4 | Catálogo de Productos | `categoria.html` | `pages/tienda/Catalogo.jsx` | **MIGRAR** | Catálogo con filtros avanzados por texto, categoría, forma y rango de precio. |
| 5 | Categorías / Categoría #X | *Figura 4 del Anexo* | `pages/tienda/Categorias.jsx` | **NUEVA** | Tarjetas visuales de categorías (400x200) + listado dinámico de productos por categoría. |
| 6 | Ofertas | *Figura 8 del Anexo* | `pages/tienda/Ofertas.jsx` | **NUEVA** | Grid exclusivo de productos con `enOferta === true`, precio tachado y badge de descuento. |
| 7 | Detalle de Producto | `producto.html` | `pages/tienda/DetalleProducto.jsx` | **MIGRAR** | Vista dinámica con hook `useParams`, selector de porciones/forma, cálculo y reseñas. |
| 8 | Carrito de Compras | `carrito.html` | `pages/tienda/Carrito.jsx` | **MIGRAR** | Tabla interactiva: foto, nombre, precio, control de cantidad, subtotal, eliminar, limpiar y comprar. |
| 9 | Checkout (Paso de Pago) | *Figuras 5 y 6 del Anexo* | `pages/tienda/Checkout.jsx` | **NUEVA** | Datos cliente (autocompletado si hay sesión), dirección (región/comuna dependientes) y botón "Pagar". |
| 10 | Pago Correcto | `boleta.html` (*Fig. 7*) | `pages/tienda/PagoExitoso.jsx` | **MIGRAR** | Orden generada, folio, fecha, lectura de ítems pagados, simulación imprimir PDF / email. |
| 11 | Pago con Error | *Figura 8 del Anexo* | `pages/tienda/PagoFallido.jsx` | **NUEVA** | Notificación de error, detalle de orden no procesada y botón "Volver a realizar el pago". |
| 12 | Seguimiento / Tracking | `seguimiento.html` | `pages/tienda/Seguimiento.jsx` | **MIGRAR** | Stepper de 5 pasos en tiempo real, datos de transportista y simulación de estados. |
| 13 | Registro de Usuario | `registro.html` | `pages/auth/Registro.jsx` | **MIGRAR** | Validación controlada en tiempo real (edad ≥ 50 para descuento senior, `@duocuc.cl` para convenio). |
| 14 | Iniciar Sesión | `login.html` | `pages/auth/Login.jsx` | **MIGRAR** | Autenticación contra base de datos simulada y botones demo (Admin / Senior / Estudiante). |
| 15 | Perfil de Usuario | `perfil.html` | `pages/tienda/Perfil.jsx` | **MIGRAR** | Actualización de perfil, preferencias de elaboración artesanal e historial de compras. |
| 16 | Nosotros | `nosotros.html` | `pages/tienda/Nosotros.jsx` | **MIGRAR** | Historia, medalla Récord Guinness, misión, visión y valores numerados 01-04. |
| 17 | Blog / Detalle Blog | `blogs.html` | `pages/tienda/Blog.jsx` | **MIGRAR** | Artículos, detalle de notas y publicación interactiva de recetas de la comunidad. |
| 18 | Contacto | `contacto.html` | `pages/tienda/Contacto.jsx` | **MIGRAR** | Formulario controlado con validación Bootstrap y tarjetas de información de sucursales. |
| 19 | Página 404 Not Found | *Requerimiento Router* | `pages/common/NotFound.jsx` | **NUEVA** | Pantalla amigable cuando la ruta no existe, con botón de retorno al Home. |
| 20 | Layout Admin (Sidebar) | *Figura 9 y 10 del Anexo* | `layouts/AdminLayout.jsx` | **NUEVA** | Sidebar responsivo colapsable con accesos: Dashboard, Órdenes, Productos, Categorías, Usuarios, etc. |
| 21 | Admin Dashboard | *Figura 9 del Anexo* | `pages/admin/AdminDashboard.jsx` | **NUEVA** | Métricas en vivo (Ventas totales, Stock crítico, Clientes activos, Órdenes del día). |
| 22 | Admin CRUD Productos | *Figura 10 del Anexo* | `pages/admin/AdminProductos.jsx` | **NUEVA** | Listado, creación, edición, eliminación y alerta de stock crítico de productos. |
| 23 | Admin CRUD Categorías | *Figura 10 del Anexo* | `pages/admin/AdminCategorias.jsx` | **NUEVA** | Listado, creación y edición de categorías de catálogo. |
| 24 | Admin CRUD Usuarios | *Figura 10 del Anexo* | `pages/admin/AdminUsuarios.jsx` | **NUEVA** | Listado de clientes y administradores con historial de compras asociado. |
| 25 | Admin Gestión Órdenes | *Figura 10 del Anexo* | `pages/admin/AdminOrdenes.jsx` | **NUEVA** | Visualización de pedidos, cambio de estado (En preparación, Ruta, Entregado) y boleta. |
| 26 | Admin Reportes y Perfil | *Figura 10 del Anexo* | `pages/admin/AdminReportes.jsx` | **NUEVA** | Resumen de ventas, productos más vendidos y configuración de perfil administrativo. |

---

## 3. Estructura de Carpetas Propuesta

```text
Proyecto-Pasterelia-DFS/
├── legacy/                             # Código HTML/CSS/JS original preservado (vía git mv)
│   ├── css/
│   ├── img/
│   ├── js/
│   └── *.html
├── docs/                               # Documentación técnica y académica para entrega
│   ├── ERS_V2.md                       # Especificación de Requisitos de Software actualizada
│   ├── cobertura-testing.md            # Análisis exhaustivo de cobertura (≥ 70%)
│   ├── migracion.md                    # Bitácora continua de equivalencias HTML → React
│   ├── pruebas-estrella.md             # Las 10 pruebas unitarias para la presentación en vivo
│   └── presentacion.md                 # Guion de 15 minutos + 15 preguntas y respuestas
├── public/                             # Assets estáticos y favicon
│   └── img/                            # Imágenes de productos preservadas
├── src/
│   ├── assets/                         # Estilos globales y fuentes
│   │   ├── css/                        # Estilos CSS originales adaptados
│   │   └── fonts/
│   ├── components/                     # Componentes reutilizables (Principio SRP)
│   │   ├── common/                     # Navbar, Footer, Breadcrumbs, ProtectedRoute
│   │   ├── tienda/                     # ProductCard, CategoryCard, CartItem, OrderTimeline
│   │   ├── admin/                      # SidebarAdmin, StatCard, AdminTable, ModalConfirm
│   │   └── ui/                         # Botones, Inputs controlados, Badges, AlertNotice
│   ├── context/                        # Context API para estado global limpio
│   │   ├── CarritoContext.jsx          # Estado del carrito, totales, cupones, persistencia
│   │   └── AuthContext.jsx             # Sesión de usuario activo (cliente / admin)
│   ├── hooks/                          # Custom hooks reutilizables
│   │   ├── useCarrito.js               # Hook consumidor de CarritoContext
│   │   ├── useAuth.js                  # Hook consumidor de AuthContext
│   │   └── useForm.js                  # Manejo de formularios controlados y validación
│   ├── data/
│   │   └── db.js                       # Base de datos simulada (Colecciones: productos, categorias, usuarios, ordenes, blogs)
│   ├── services/                       # Capa de abstracción de datos (permite mocks limpios)
│   │   ├── storageService.js           # Envoltorio seguro sobre localStorage con try/catch
│   │   ├── productoService.js          # CRUD y filtros de productos
│   │   ├── categoriaService.js         # CRUD de categorías
│   │   ├── usuarioService.js           # CRUD y autenticación de usuarios
│   │   └── ordenService.js             # CRUD de pedidos y folios
│   ├── layouts/
│   │   ├── TiendaLayout.jsx            # Layout público con Navbar y Footer
│   │   └── AdminLayout.jsx             # Layout privado con Sidebar y Header admin
│   ├── pages/                          # Vistas enrutadas
│   │   ├── tienda/                     # Home, Catalogo, Categorias, Ofertas, DetalleProducto, Carrito, Checkout, Pago...
│   │   ├── auth/                       # Login, Registro
│   │   ├── admin/                      # Dashboard, Productos, Categorías, Usuarios, Órdenes, Reportes
│   │   └── common/                     # NotFound (404)
│   ├── App.jsx                         # Definición de rutas (React Router v6)
│   └── main.jsx                        # Entry point de React con Bootstrap 5
├── tests/                              # Suite de pruebas unitarias (Jasmine + Karma)
│   ├── setup.js                        # Polyfills y configuración global de tests
│   ├── services/                       # Pruebas unitarias de db.js y servicios (CRUD + mocks)
│   ├── components/                     # Pruebas de renderizado, props, eventos y DOM
│   └── context/                        # Pruebas de lógica de estado (CarritoContext, AuthContext)
├── karma.conf.cjs                      # Configuración de Karma + Webpack + Jasmine + Coverage
├── babel.config.cjs                    # Configuración Babel para JSX en Karma
├── vite.config.js                      # Configuración de Vite para desarrollo ultrarrápido
└── package.json                        # Scripts y dependencias fijadas compatibles
```

---

## 4. Matriz de Trazabilidad Rúbrica → Evidencia

| Criterio / Indicador | Ponderación | Nivel Esperado (100%) | Evidencia Concreta en el Proyecto |
|---|---|---|---|
| **IE2.1.1** Estructura con Framework JS | 10% (Encargo) | Estructura sólida, arquitectura modular y funcionalidades completas sin partes inconclusas. | Proyecto React funcional con Vite, React Router v6, división en componentes, layouts y servicios. |
| **IE2.1.2** Componentes React + Bootstrap | 10% (Encargo) | Gestión perfecta de `props`, `state`, componentes controlados y responsividad Bootstrap 5 integrada. | Componentes con tipado implícito y PropTypes, hooks `useState`/`useEffect`, rejilla Bootstrap (`container`, `row`, `col-*-*`). |
| **IE2.2.1** 10 Pruebas Unitarias Jasmine/Karma | 12% (Encargo) | 10 pruebas unitarias completas, verificando lógica, eventos, render y comportamiento sin errores. | 10 pruebas estrella cubriendo: render de lista, render condicional, props de botón, estado de input, evento click, DOM, CRUD crear/leer/eliminar y mock storage. |
| **IE2.3.1** Entorno de Testing y Cobertura | 8% (Encargo) | Entorno configurado, uso efectivo de mocks (`spyOn`), reporte de cobertura HTML ≥ 70%. | `karma.conf.cjs` con `karma-coverage`, reporter spec, mocks de `localStorage` y análisis en `docs/cobertura-testing.md`. |
| **IE2.1.3** Exposición Diseño Frontend | 15% (Presentación) | Explicación solvente de la arquitectura, patrones de diseño y flujo de datos en React. | Guion de presentación en `docs/presentacion.md` con respuestas justificadas de arquitectura. |
| **IE2.1.4** Demostración Componentes y Bootstrap | 20% (Presentación) | Demostración en vivo de gestión de estados, props, hooks y adaptación móvil/tablet/desktop. | Componentes demostrables en vivo con DevTools y responsive design mode de Chrome. |
| **IE2.2.2** Demostración 10 Pruebas Unitarias | 15% (Presentación) | Ejecución en vivo de las 10 pruebas en consola Karma pasando en verde y explicación de su lógica. | Fichas en `docs/pruebas-estrella.md` con guía de explicación de 1 minuto por prueba. |
| **IE2.3.2** Explicación Entorno, Mocks y Cobertura | 10% (Presentación) | Explicar con precisión qué es un mock, cómo aísla el test y cómo se interpreta la cobertura. | Sección dedicada en `docs/presentacion.md` con las 15 preguntas típicas del docente resueltas. |

---

## 5. Decisiones Técnicas y Justificación de Arquitectura

1. **Vite para desarrollo + Karma/Webpack para testing**:
   - *Por qué*: Vite ofrece Hot Module Replacement (HMR) casi instantáneo para el desarrollo diario (`npm run dev`), mientras que Karma con `karma-webpack` y `babel-loader` ejecuta las pruebas en Jasmine exactamente como lo exige la rúbrica oficial de Duoc UC.
2. **Bootstrap 5 vía NPM + CSS Original**:
   - *Por qué*: Mantiene el 100% de la identidad gráfica artesanal de la pastelería (paleta café/oro/chocolate), pero habilita la grilla responsiva, modales y utilidades de Bootstrap 5 requeridas en la evaluación.
3. **Capa de Servicios desacoplada (`src/services/`)**:
   - *Por qué*: Los componentes nunca deben invocar `localStorage` directamente. Centralizar en servicios permite que las pruebas unitarias con Jasmine puedan aplicar `spyOn` sin efectos colaterales.
4. **Context API para Carrito y Autenticación**:
   - *Por qué*: Evita el "prop drilling", permite que el total del carrito en el Navbar se actualice instantáneamente tras cualquier compra y habilita rutas protegidas para el perfil de cliente y el panel de administración.
