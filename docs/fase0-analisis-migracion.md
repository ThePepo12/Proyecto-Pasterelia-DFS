# FASE 0: REVISIÓN TÉCNICA E INVENTARIO DE MIGRACIÓN

> **Proyecto:** Pastelería Mil Sabores — Evaluación Parcial 2 (DSY1104 Desarrollo Fullstack II, Duoc UC)  
> **Fecha:** 2026-10-20  
> **Estado:** Fase 0 completada (Solo lectura y análisis arquitectónico)

---

## (a) Hallazgos Técnicos: Frontend y Backend

### 1. Frontend Actual
* **Ubicación:** `legacy/` (código HTML/CSS/JS original preservado intacto con historial Git) y `src/` (inicio de configuración de React con Vite y Bootstrap 5).
* **Vistas HTML identificadas (12 páginas):**
  1. `index.html`: Portada con banner aniversario 50 años, carrusel de productos destacados, historia y testimonios.
  2. `categoria.html`: Catálogo con filtros por categoría (Tortas Cuadradas, Circulares, Postres, etc.), filtro por forma y buscador textual.
  3. `producto.html`: Detalle de producto con selector de tamaño (Chica, Mediana, Grande, Familiar con cálculo de precio dinámico), selector de forma, campo de dedicatoria personalizada, galería de miniaturas y reseñas.
  4. `carrito.html`: Tabla dinámica de compras, control de cantidad (+ / -), cupón `FELICES50` (10%) y `DUOCUMPLE` (20%), cálculo de IVA (19%), despacho ($3.500) y descuentos.
  5. `boleta.html`: Visualización formal de orden de compra con desglose de ítems, totales, folio y botón de impresión.
  6. `seguimiento.html`: Barra de estados de despacho en 5 etapas (Confirmado, Horneado, Decoración, En Ruta, Entregado).
  7. `login.html`: Formulario de inicio de sesión de clientes.
  8. `registro.html`: Registro con cálculo automático de edad para beneficio Senior (+50 años = 50% descuento) y validación de correo `@duocuc.cl`.
  9. `perfil.html`: Edición de datos personales, preferencias de pastelería, insignias de beneficios e historial de pedidos.
  10. `nosotros.html`: Historia institucional de los 50 años, valores y equipo de maestros pasteleros.
  11. `blogs.html`: Artículos y recetas de pastelería con 2 notas completas ("Secretos del hojaldre", "Tendencias en repostería").
  12. `contacto.html`: Formulario de consultas y reclamos, mapa y sucursales.
* **Estilos (CSS):** 8 hojas de estilos modulares en `legacy/css/` con paleta institucional chocolate y dorado (`--accent-gold: #e5a93c`, `--bg-main: #1f140e`, `--color-chocolate: #4a2c11`, tipografías *Playfair Display*, *Pacifico* y *Lato*).
* **JavaScript:** 
  - `productos.js`: Base de 16 productos divididos en 8 categorías.
  - `usuarios.js`: Lógica de negocio (edad senior >= 50 años, correos duocuc.cl, cupones).
  - `carrito.js`: Almacenamiento en `localStorage` (`carrito_mil_sabores`, `historial_pedidos_mil_sabores`, `ultimo_pedido_mil_sabores`).

### 2. Backend Actual
* **Ubicación:** `c:\Proyecto-Pasterelia-DFS\tienda-pasteleria-backend`
* **Entorno Java:** Java version **22.0.2** (Oracle JDK 64-Bit), verificado y operativo.
* **Herramienta de construcción:** Apache Maven **3.10.0** a través de `mvnw.cmd`.
* **Framework:** Spring Boot 4.1.1 con dependencias activas:
  - `spring-boot-starter-webmvc` (REST APIs y controladores)
  - `spring-boot-starter-data-jpa` (Persistencia ORM Hibernate)
  - `spring-boot-starter-validation` (Validaciones Bean Validation: `@NotNull`, `@NotBlank`, `@Email`, `@Min`)
  - `h2` runtime + `spring-boot-h2console` (Base de datos embebida en memoria sin dependencias externas)
  - `lombok` (Reducción de boilerplate: `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`)
* **Estado del código:** Esqueleto inicial generado limpio (`TiendaPasteleriaBackendApplication.java` y `application.properties`). **No existen aún entidades, repositorios ni controladores REST.**
* **Cómo se levanta:**
  ```cmd
  cd c:\Proyecto-Pasterelia-DFS\tienda-pasteleria-backend
  mvnw.cmd spring-boot:run
  ```
  Levanta en el puerto `8080` (CORS configurado a `http://localhost:5173`). Consola H2 disponible en `http://localhost:8080/h2-console`.

---

## (b) Clasificación de Vistas (Mapa de Navegación)

| Sección | Vista | Prioridad | Clasificación | Observaciones |
|---|---|---|---|---|
| **Tienda** | Home | Blanca | Existe, se migra | Reutiliza diseño de `index.html`. |
| **Tienda** | Productos (Catálogo) | Blanca | Existe, se migra | Reutiliza `categoria.html`. |
| **Tienda** | Detalle de producto | Blanca | Existe, se migra | Reutiliza `producto.html` con dedicatoria y tamaños. |
| **Tienda** | Carrito | Blanca | Existe, se migra | Reutiliza `carrito.html` adaptado al contexto global de React. |
| **Tienda** | Registro de usuario | Blanca | Existe, se migra | Reutiliza `registro.html` conectándolo al backend. |
| **Tienda** | Iniciar sesión | Blanca | Existe, se migra | Reutiliza `login.html` conectándolo al endpoint de autenticación. |
| **Tienda** | Perfil de usuario | Blanca | Existe, se migra | Reutiliza `perfil.html` con datos del usuario conectado. |
| **Tienda** | Nosotros | Blanca | Existe, se migra | Reutiliza `nosotros.html`. |
| **Tienda** | Blogs y Detalle Blog | Blanca | Existe, se migra | Reutiliza `blogs.html` con parámetros por id. |
| **Tienda** | Contacto | Blanca | Existe, se migra | Reutiliza `contacto.html`. |
| **Tienda** | Seguimiento de orden | Blanca | Existe, se migra | Reutiliza `seguimiento.html` por folio de compra. |
| **Tienda** | **Categorías → Categoría #1** | **VERDE (Obligatoria)** | **Existe base, se refactoriza** | Vista con tarjetas visuales de categorías y renderizado reactivo inferior de productos filtrados. |
| **Tienda** | **Ofertas** | **VERDE (Obligatoria)** | **NUEVA** | Vista especializada con productos en promoción o descuento especial. |
| **Tienda** | **Comprar (Checkout)** | **VERDE (Obligatoria)** | **NUEVA** | Separación del carrito a pasarela de checkout con autocompletado si hay sesión activa, cálculo de despacho y selección de región/comuna. |
| **Tienda** | **Pago correcto** | **VERDE (Obligatoria)** | **Existe base, se adapta** | Adaptación de `boleta.html` con folio generado por el backend, datos de solo lectura, botones de imprimir PDF y enviar email simulados. |
| **Tienda** | **Pago con error** | **VERDE (Obligatoria)** | **NUEVA** | Vista de fallo con detalle del error, preservación del carrito y botón "Volver a intentar". |
| **Admin** | Dashboard (Home Admin) | Blanca | **NUEVA** | Métricas rápidas: ventas del mes, usuarios activos, total de productos y órdenes recientes. |
| **Admin** | Producto (Nuevo, Mostrar, Editar) | Blanca | **NUEVA** | Formularios CRUD completos para el catálogo de pastelería. |
| **Admin** | Categoría (Nueva, Editar) | Blanca | **NUEVA** | Formulario CRUD de categorías *(asumiendo que "Editar usuario" bajo Categoría era una errata del diagrama y corresponde a "Editar categoría")*. |
| **Admin** | Usuario (Nuevo, Mostrar, Editar) | Blanca | **NUEVA** | Gestión administrativa de clientes y administradores con roles. |
| **Admin** | **Órdenes/Boletas → Mostrar boleta** | **VERDE (Obligatoria)** | **NUEVA** | Tabla de órdenes emitidas, visualizador de boleta y acción de cambio de estado (En preparación, Despachado, Entregado, Cancelado). |
| **Admin** | **Listado de productos críticos** | **VERDE (Obligatoria)** | **NUEVA** | Vista filtrada de productos con stock bajo o igual al umbral crítico (≤ 5 unidades). |
| **Admin** | **Reportes de productos** | **VERDE (Obligatoria)** | **NUEVA** | Reporte de rotación, stock disponible y productos más vendidos. |
| **Admin** | **Reportes generales** | **VERDE (Obligatoria)** | **NUEVA** | Balance de ingresos totales, cantidad de órdenes por período y ticket promedio. |
| **Admin** | **Perfil del administrador** | **VERDE (Obligatoria)** | **NUEVA** | Visualización y edición de credenciales y datos del administrador logueado. |
| **Admin** | **Historial de compras de un usuario** | **VERDE (Obligatoria)** | **NUEVA** | Consulta detallada de todas las boletas y órdenes asociadas a un cliente específico. |

---

## (c) Vistas Verdes y Endpoints del Backend

| Vista Verde | Prioridad | Endpoint Necesario | Método HTTP | Estado Actual | Propósito |
|---|---|---|---|---|---|
| **Categorías → Categoría #1** | Alta | `/api/categorias` y `/api/productos/categoria/{catId}` | GET | Falta (crear en Fase 2) | Listar categorías y productos filtrados por id de categoría. |
| **Ofertas** | Alta | `/api/productos/ofertas` | GET | Falta (crear en Fase 2) | Obtener productos con flag `enOferta == true` o descuento activo. |
| **Comprar (Checkout)** | Alta | `/api/ordenes` | POST | Falta (crear en Fase 2) | Registrar la orden de compra con los datos del cliente, dirección e ítems. |
| **Pago correcto** | Alta | `/api/ordenes/{id}` | GET | Falta (crear en Fase 2) | Recuperar el detalle de la orden generada para la boleta de confirmación. |
| **Pago con error** | Alta | N/A (Estado local / Simulación) | N/A | N/A (Frontend) | Presenta mensaje de rechazo y permite reintentar el pago. |
| **Admin: Órdenes → Boleta** | Alta | `/api/ordenes` y `/api/ordenes/{id}/estado` | GET / PATCH | Falta (crear en Fase 2) | Listar todas las órdenes y actualizar estado (Preparación / Entregado). |
| **Admin: Productos Críticos** | Alta | `/api/productos/criticos` | GET | Falta (crear en Fase 2) | Retornar productos con `stock <= stockCritico` (por defecto <= 5). |
| **Admin: Reportes de Productos**| Alta | `/api/reportes/productos` | GET | Falta (crear en Fase 2) | Métricas de ventas acumuladas por producto y categorías más populares. |
| **Admin: Reportes Generales** | Alta | `/api/reportes/generales` | GET | Falta (crear en Fase 2) | Total facturado, cantidad de transacciones e indicadores clave. |
| **Admin: Perfil Administrador** | Alta | `/api/usuarios/{id}` | GET / PUT | Falta (crear en Fase 2) | Consultar y actualizar perfil del usuario admin autenticado. |
| **Admin: Historial Usuario** | Alta | `/api/ordenes/usuario/{usuarioId}` | GET | Falta (crear en Fase 2) | Listar compras históricas de un cliente particular. |

---

## (d) Matriz CRUD Completa

| Entidad | Operación | Endpoint Propuesto | Método HTTP | Estado Actual | Vistas que lo Consumen |
|---|---|---|---|---|---|
| **Productos** | Crear | `/api/productos` | POST | Falta | Admin: Nuevo Producto |
| **Productos** | Leer (Todos) | `/api/productos` | GET | Falta | Tienda: Catálogo, Admin: Lista Productos |
| **Productos** | Leer (Detalle) | `/api/productos/{id}` | GET | Falta | Tienda: Detalle Producto, Admin: Editar Producto |
| **Productos** | Leer (Filtros: Ofertas, Críticos, Cat) | `/api/productos/ofertas`, `/criticos`, `/categoria/{id}` | GET | Falta | Tienda: Ofertas, Cat #1; Admin: Críticos, Reportes |
| **Productos** | Actualizar | `/api/productos/{id}` | PUT | Falta | Admin: Editar Producto |
| **Productos** | Eliminar | `/api/productos/{id}` | DELETE | Falta | Admin: Lista Productos (con confirmación) |
| **Categorías** | Crear | `/api/categorias` | POST | Falta | Admin: Nueva Categoría |
| **Categorías** | Leer (Todas) | `/api/categorias` | GET | Falta | Tienda: Menú, Categorías; Admin: Lista Categorías |
| **Categorías** | Leer (Detalle) | `/api/categorias/{id}` | GET | Falta | Admin: Editar Categoría |
| **Categorías** | Actualizar | `/api/categorias/{id}` | PUT | Falta | Admin: Editar Categoría |
| **Categorías** | Eliminar | `/api/categorias/{id}` | DELETE | Falta | Admin: Lista Categorías |
| **Usuarios** | Crear (Registro / Admin) | `/api/usuarios` | POST | Falta | Tienda: Registro; Admin: Nuevo Usuario |
| **Usuarios** | Login | `/api/auth/login` | POST | Falta | Tienda: Login (retorna usuario + rol) |
| **Usuarios** | Leer (Todos) | `/api/usuarios` | GET | Falta | Admin: Lista Usuarios |
| **Usuarios** | Leer (Detalle / Perfil) | `/api/usuarios/{id}` | GET | Falta | Tienda: Perfil; Admin: Perfil, Editar Usuario |
| **Usuarios** | Actualizar | `/api/usuarios/{id}` | PUT | Falta | Tienda: Perfil; Admin: Editar Usuario |
| **Usuarios** | Eliminar | `/api/usuarios/{id}` | DELETE | Falta | Admin: Lista Usuarios |
| **Órdenes** | Crear (Checkout) | `/api/ordenes` | POST | Falta | Tienda: Comprar / Checkout |
| **Órdenes** | Leer (Todas) | `/api/ordenes` | GET | Falta | Admin: Lista de Órdenes |
| **Órdenes** | Leer (Boleta / Detalle) | `/api/ordenes/{id}` | GET | Falta | Tienda: Pago Correcto; Admin: Mostrar Boleta |
| **Órdenes** | Leer (Por Usuario) | `/api/ordenes/usuario/{usuarioId}` | GET | Falta | Tienda: Mi Perfil; Admin: Historial de Compras |
| **Órdenes** | Actualizar (Cambiar Estado) | `/api/ordenes/{id}/estado` | PATCH | Falta | Admin: Mostrar Boleta (Gestión de Estado) |
| **Órdenes** | Anular / Eliminar | `/api/ordenes/{id}` | DELETE | Falta | Admin: Lista de Órdenes |

---

## (e) Plan del Backend para la Fase 2 (Propuesta para Aprobación)

Para cumplir con los requerimientos sin añadir complejidad innecesaria (sin Spring Security por ahora, con base de datos H2 embebida y carga automática de datos iniciales):

1. **Configuración de `application.properties`:**
   - Base de datos H2 en memoria: `jdbc:h2:mem:pasteleriadb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE`
   - Consola H2 habilitada en `/h2-console`
   - Hibernate DDL: `spring.jpa.hibernate.ddl-auto=create-drop`
   - Puerto del servidor: `server.port=8080`

2. **Configuración de CORS (`WebConfig.java`):**
   - Habilitar orígenes cruzados para `http://localhost:5173` y `http://localhost:3000` con métodos `GET, POST, PUT, DELETE, PATCH, OPTIONS`.

3. **Entidades JPA (`cl.duoc.tienda_pasteleria_backend.model`):**
   - `Categoria`: id, nombre, descripcion, imagen.
   - `Producto`: id, codigo, nombre, descripcion, precio, stock, stockCritico, enOferta, porcentajeDescuento, imagen, categoria (ManyToOne).
   - `Usuario`: id, nombre, email, password, telefono, direccion, fechaNacimiento, edad, rol (`ADMIN` / `CLIENTE`), descuentoSenior, esEstudianteDuoc.
   - `Orden`: id, folio, fecha, hora, subtotal, descuento, envio, iva, total, estado, clienteNombre, clienteEmail, direccionEntrega, usuario (ManyToOne opcional).
   - `DetalleOrden`: id, orden (ManyToOne), producto (ManyToOne), nombreProducto, precioUnitario, cantidad, subtotal, personalizacion.

4. **Repositorios Spring Data JPA (`cl.duoc.tienda_pasteleria_backend.repository`):**
   - `CategoriaRepository`
   - `ProductoRepository` (con métodos `findByCategoriaId`, `findByEnOfertaTrue`, `findByStockLessThanEqual`)
   - `UsuarioRepository` (con `findByEmail`, `findByEmailAndPassword`)
   - `OrdenRepository` (con `findByUsuarioIdOrderByFechaDesc`, `findByFolio`)
   - `DetalleOrdenRepository`

5. **Controladores REST (`cl.duoc.tienda_pasteleria_backend.controller`):**
   - `AuthController`: login simple (`POST /api/auth/login`).
   - `ProductoController`: CRUD + `/ofertas` + `/criticos` + `/categoria/{id}`.
   - `CategoriaController`: CRUD.
   - `UsuarioController`: CRUD.
   - `OrdenController`: CRUD + `/usuario/{id}` + `/{id}/estado`.
   - `ReporteController`: `/api/reportes/productos` y `/api/reportes/generales`.

6. **Poblado Automático de Datos Iniciales (`DataInitializer.java`):**
   - Al arrancar (`CommandLineRunner`), sembrará:
     - 8 categorías de repostería.
     - 16 productos reales extraídos de `productos.js` (incluyendo ofertas y productos con stock crítico <= 5 para demostración).
     - Usuario administrador: `admin@pasteleriamilsabores.cl` / `admin123` (Rol: `ADMIN`).
     - Usuario cliente prueba: `rosa.carrasco@gmail.com` / `rosa123` (Senior 61 años, Rol: `CLIENTE`).
     - Usuario estudiante: `estudiante@duocuc.cl` / `duoc123` (Rol: `CLIENTE`).
     - 3 órdenes de ejemplo con historial y folios `MS-501991`, `MS-501992`, `MS-501993`.

---

## (f) Confirmación de Arquitectura de Capa de Datos (Doble Fuente)

Se confirma la estrategia solicitada:
1. **Fuente Primaria (Producción / Integración):** Spring Boot Backend vía REST API (`src/services/api.js`, `productoService.js`, etc.).
2. **Fuente Secundaria (Respaldo y Mocks de Testing):** `src/data/db.js` con las mismas colecciones, CRUD idéntico y persistencia en `localStorage`. Si el backend no está encendido o en las pruebas unitarias de Vitest, la capa conmuta limpiamente o se alimenta de estos datos simulados sin alterar los componentes.
3. **Datos Iniciales Extraídos:** Los 16 productos del catálogo, 8 categorías, lógica de descuento senior (+50 años), código `FELICES50` (10%) y perfiles preconfigurados quedan mapeados en ambas fuentes.

---

## Preguntas al Equipo / Usuario (Máximo 3)

1. **Nombres de los integrantes del equipo:** ¿Cuáles son los nombres de los hasta 3 integrantes del grupo para incluirlos formalmente en la documentación ERS, README y guion de presentación?
2. **Uso de Bootstrap:** Confirmamos el uso exclusivo de clases CSS nativas de **Bootstrap 5** (sin `react-bootstrap`), garantizando que la migración preserve 100% la estética y diseño original. ¿De acuerdo?
3. **Confirmación del Plan del Backend:** ¿Apruebas el plan propuesto en la sección (e) para implementarlo en la Fase 2 una vez concluida la preparación de la Fase 1?
