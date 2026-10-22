# ESPECIFICACIÓN DE REQUISITOS DE SOFTWARE (ERS) — VERSIÓN 2.0

> **Asignatura:** DSY1104 Desarrollo Fullstack II  
> **Institución:** Duoc UC — Escuela de Informática y Telecomunicaciones  
> **Evaluación:** Evaluación Parcial 2 (30% de la nota final)  
> **Proyecto:** Pastelería Mil Sabores — Plataforma Web Integrada E-Commerce & Gestión Administrativa  
> **Versión:** 2.0 (Migración a React, Conexión REST Spring Boot, Testing con Vitest)  
> **Fecha de Actualización:** Octubre 2026  

---

## 1. INTRODUCCIÓN Y ALCANCE

### 1.1 Propósito
El presente documento formaliza los requisitos funcionales, no funcionales, arquitectónicos y de integración para la versión 2.0 de la plataforma web **Pastelería Mil Sabores** (50 Años de Tradición). Esta versión evoluciona el prototipo inicial en HTML/CSS/JavaScript vanilla hacia una arquitectura moderna basada en un **Frontend reactivo en React**, un **Backend de microservicios REST en Spring Boot**, persistencia relacional embebida en **H2 Database** y aseguramiento de calidad mediante **pruebas unitarias automatizadas con Vitest y React Testing Library**.

### 1.2 Alcance del Sistema
La plataforma cubre dos grandes ecosistemas integrados:
1. **Tienda Pública (Clientes e Invitados):** Catálogo de repostería con 8 categorías, vista obligatoria de ofertas, personalización de tortas (tamaños, porciones, formas y dedicatoria en azúcar), carrito con cálculo reactivo de beneficios (Senior +50 años, Convenio Duoc UC, cupones `FELICES50`), pasarela de checkout con autocompletado y emisión de boleta tributaria con folio fiscal.
2. **Capa Administrativa (Panel de Gestión):** Acceso protegido para usuarios con rol `ADMIN`, panel de control (Dashboard con KPIs y alerta de productos críticos), operaciones CRUD completas sobre Productos, Categorías y Usuarios, gestión de órdenes con cambio de estado en tiempo real (En Preparación, En Reparto, Entregado) y reportes financieros exportables.

---

## 2. STACK TECNOLÓGICO Y VERSIONES

| Capa | Tecnología / Herramienta | Versión | Justificación Técnica |
|---|---|---|---|
| **Frontend Framework** | React | `^18.3.1` | Componentes funcionales desacoplados con hooks (`useState`, `useEffect`, `useMemo`, `useContext`). |
| **Empaquetador Frontend** | Vite | `^4.3.4` | Tiempos de arranque casi instantáneos (ESM nativo) y Hot Module Replacement (HMR). |
| **Diseño y Estilos** | Bootstrap 5 + Bootstrap Icons | `^5.3.3` / `^1.11.3` | Maquetación responsiva universal (móvil, tablet, escritorio) sin dependencias adicionales pesadas. |
| **Enrutamiento** | React Router DOM | `^6.28.0` | Navegación declarativa en Single Page Application (SPA) y rutas protegidas por rol. |
| **Testing Frontend** | Vitest + React Testing Library | `^2.1.8` / `^14.3.1` | Entorno de pruebas oficial solicitado en clases, ejecutado sobre `jsdom` con cobertura V8. |
| **Backend Framework** | Spring Boot | `4.1.1` (o 3.x/4.x compatible) | API REST escalable con Spring Data JPA y Bean Validation. |
| **Lenguaje Backend** | Java (Oracle OpenJDK) | `17+` (verificado 21/22) | Soporte de registros, tipos modernos y robustez empresarial. |
| **Base de Datos** | H2 Database | Embebida (`mem`) | Base de datos relacional SQL en memoria; levanta en cualquier máquina sin instalar software adicional. |
| **Herramienta Build Backend**| Maven Wrapper (`mvnw.cmd`) | `3.10.0` | Compilación portable multiplataforma sin requerir Maven instalado globalmente. |

---

## 3. ARQUITECTURA DE DATOS: ESTRATEGIA DE DOBLE FUENTE

Para satisfacer el requerimiento del PDF de evaluación (base de datos simulada en JavaScript) y al mismo tiempo el requerimiento de integración con el backend Spring Boot, se adoptó una **arquitectura de doble fuente transparente**:

```
+-------------------------------------------------------------------------+
|                              VISTAS REACT                               |
|        (Catalogo, Detalle, Carrito, Checkout, AdminProductos, etc.)     |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                        CAPA DE SERVICIOS REACT                          |
|  (productoService, categoriaService, usuarioService, ordenService, etc.)|
+-------------------------------------------------------------------------+
                                     |
        +----------------------------+----------------------------+
        | (Modo Principal: HTTP REST)                             | (Modo Respaldo / Testing)
        v                                                         v
+----------------------------------+            +----------------------------------+
|      BACKEND SPRING BOOT         |            |        FUENTE LOCAL (db.js)      |
|    Controladores REST + JPA      |            |  Persistencia en localStorage    |
|   Base de Datos H2 en Memoria    |            |   Mismo esquema y firmas CRUD    |
+----------------------------------+            +----------------------------------+
```

1. **Fuente Primaria (Integración):** El frontend consume las rutas REST `/api/*` del backend Spring Boot.
2. **Fuente Secundaria de Respaldo y Mocks (`src/data/db.js`):** Si el backend no se encuentra activo o durante las pruebas unitarias de Vitest, la capa de servicios conmuta automáticamente hacia `db.js`. Ambas fuentes exponen exactamente las mismas firmas CRUD, logrando:
   - Cero acoplamiento entre los componentes y la red.
   - Pruebas unitarias 100% deterministas que nunca fallan por caídas del servidor.
   - Cumplimiento estricto con ambas exigencias del profesor.

---

## 4. INTEGRACIÓN FRONTEND - BACKEND, H2 Y CORS

### 4.1 Configuración de CORS (`WebConfig.java`)
Para permitir que la aplicación cliente en React se comunique con el backend sin bloqueos de navegador por política de mismo origen (Cross-Origin Resource Sharing):
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 4.2 Base de Datos H2 y Consola Web
* **Cadena de Conexión:** `jdbc:h2:mem:pasteleriadb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE`
* **Hibernate DDL Auto:** `create-drop` (recrea las tablas al arrancar y ejecuta la semilla `DataInitializer.java`).
* **Consola de Administración H2:** Disponible en `http://localhost:8080/h2-console` con usuario `sa` y sin contraseña.

---

## 5. MAPA DE VISTAS Y CLASIFICACIÓN (BLANCAS VS VERDES)

### 5.1 Vistas Públicas de la Tienda
| Código | Vista | Tipo | Clasificación | Propósito y Comportamiento |
|---|---|---|---|---|
| **V-01** | Portada (Home) | Blanca | Existe, migrada | Hero conmemorativo 50 años, tarjetas de hitos y productos destacados. |
| **V-02** | Catálogo General | Blanca | Existe, migrada | Listado con buscador reactivo, filtros por categoría y ordenamiento. |
| **V-03** | Detalle de Producto | Blanca | Existe, migrada | Parámetro `codigo`, selector de tamaño con ajuste dinámico de precio y dedicatoria. |
| **V-04** | Carrito de Compras | Blanca | Existe, migrada | Tabla de compras, control de cantidad (+/-), cupones de descuento y desglose financiero. |
| **V-05** | Inicio de Sesión | Blanca | Existe, migrada | Autenticación contra `/api/auth/login` y botones de acceso demo rápido. |
| **V-06** | Registro de Usuario | Blanca | Existe, migrada | Formulario con cálculo dinámico de edad para beneficio Senior (+50 años). |
| **V-07** | Mi Perfil | Blanca | Existe, migrada | Edición de datos personales e historial de órdenes previas del usuario. |
| **V-08** | Nosotros | Blanca | Existe, migrada | Historia de los 50 años, Récord Guinness 1995, misión, visión y 4 valores. |
| **V-09** | Blog & Recetas | Blanca | Existe, migrada | Artículos de repostería y formulario de aportes de recetas familiares. |
| **V-10** | Contacto | Blanca | Existe, migrada | Formulario con validación visual, mapa y tarjetas de sucursales. |
| **V-11** | Seguimiento | Blanca | Existe, migrada | Stepper de tracking de despacho en 5 etapas con buscador por folio fiscal. |
| **V-12** | **Categorías → Cat #1** | **VERDE** | **Obligatoria** | Tarjetas superiores de categorías y catálogo inferior filtrado reactivamente. |
| **V-13** | **Ofertas Especiales** | **VERDE** | **Obligatoria** | Catálogo exclusivo de productos con `enOferta === true` y precio tachado. |
| **V-14** | **Checkout (Comprar)** | **VERDE** | **Obligatoria** | Pasarela de despacho con autocompletado si hay sesión y selector región/comuna. |
| **V-15** | **Pago Exitoso (Boleta)**| **VERDE** | **Obligatoria** | Comprobante fiscal con folio, datos solo lectura y botones PDF/Email simulados. |
| **V-16** | **Pago con Error** | **VERDE** | **Obligatoria** | Notificación de fallo con código de rechazo, preservación de carrito y reintento. |

### 5.2 Vistas Administrativas (Solo Rol `ADMIN`)
| Código | Vista | Tipo | Clasificación | Propósito y Comportamiento |
|---|---|---|---|---|
| **V-17** | Dashboard Principal | Blanca | Nueva | KPIs en vivo (ventas, stock, clientes) y resumen de productos críticos. |
| **V-18** | CRUD Productos | Blanca/Verde| Nueva / Oblig. | Tabla reactiva, modal accesible de creación y edición, y eliminación segura. |
| **V-19** | CRUD Categorías | Blanca/Verde| Nueva / Oblig. | Gestión de categorías con conteo dinámico de productos vinculados. |
| **V-20** | CRUD Usuarios | Blanca/Verde| Nueva / Oblig. | Asignación de roles (`ADMIN` / `CLIENTE`) con protección de auto-eliminación. |
| **V-21** | **Órdenes y Boletas** | **VERDE** | **Obligatoria** | Tabla de órdenes, visualización de boleta y cambio de estado (`PATCH`). |
| **V-22** | **Productos Críticos** | **VERDE** | **Obligatoria** | Listado filtrado de productos con stock $\le 5$ unidades con alertas visuales. |
| **V-23** | **Reportes Productos** | **VERDE** | **Obligatoria** | Valorización de inventario, stock total y conteo de ofertas. |
| **V-24** | **Reportes Generales** | **VERDE** | **Obligatoria** | Facturación acumulada, cantidad de órdenes y ticket promedio financiero. |
| **V-25** | **Perfil Administrador**| **VERDE** | **Obligatoria** | Consulta y actualización de credenciales del usuario administrativo. |
| **V-26** | **Historial Usuario** | **VERDE** | **Obligatoria** | Consulta de pedidos y boletas asociadas a un cliente específico. |

---

## 6. MATRIZ DE TRAZABILIDAD CRUD COMPLETA

| Entidad | Operación | Endpoint Spring Boot | Método HTTP | Función en Servicios React | Vista Consumidora |
|---|---|---|---|---|---|
| **Productos** | Crear | `/api/productos` | `POST` | `productoService.crear(data)` | Admin: Nuevo Producto |
| **Productos** | Leer (Todos) | `/api/productos` | `GET` | `productoService.obtenerTodos()` | Catálogo y Admin Productos |
| **Productos** | Leer (Detalle) | `/api/productos/{id}` | `GET` | `productoService.obtenerPorId(id)` | Detalle y Editar Producto |
| **Productos** | Leer (Ofertas) | `/api/productos/ofertas` | `GET` | `productoService.obtenerOfertas()` | Vista Verde: Ofertas |
| **Productos** | Leer (Críticos) | `/api/productos/criticos` | `GET` | `productoService.obtenerCriticos(limite)` | Vista Verde: Prod. Críticos |
| **Productos** | Leer (Categoría)| `/api/productos/categoria/{id}`| `GET` | `productoService.obtenerPorCategoria(id)` | Vista Verde: Categorías #1 |
| **Productos** | Actualizar | `/api/productos/{id}` | `PUT` | `productoService.actualizar(id, data)` | Admin: Editar Producto |
| **Productos** | Eliminar | `/api/productos/{id}` | `DELETE` | `productoService.eliminar(id)` | Admin: Eliminar Producto |
| **Categorías** | Crear | `/api/categorias` | `POST` | `categoriaService.crear(data)` | Admin: Nueva Categoría |
| **Categorías** | Leer (Todas) | `/api/categorias` | `GET` | `categoriaService.obtenerTodas()` | Menú, Catálogo, Admin |
| **Categorías** | Actualizar | `/api/categorias/{id}` | `PUT` | `categoriaService.actualizar(id, data)` | Admin: Editar Categoría |
| **Categorías** | Eliminar | `/api/categorias/{id}` | `DELETE` | `categoriaService.eliminar(id)` | Admin: Eliminar Categoría |
| **Usuarios** | Registro / Crear| `/api/usuarios` | `POST` | `usuarioService.crear(data)` | Registro y Admin Usuarios |
| **Usuarios** | Login | `/api/auth/login` | `POST` | `authService.login(email, pass)` | Tienda: Iniciar Sesión |
| **Usuarios** | Leer (Todos) | `/api/usuarios` | `GET` | `usuarioService.obtenerTodos()` | Admin: Lista Usuarios |
| **Usuarios** | Leer (Perfil) | `/api/usuarios/{id}` | `GET` | `usuarioService.obtenerPorId(id)` | Mi Perfil y Admin Perfil |
| **Usuarios** | Actualizar | `/api/usuarios/{id}` | `PUT` | `usuarioService.actualizar(id, data)` | Mi Perfil y Admin Editar |
| **Usuarios** | Eliminar | `/api/usuarios/{id}` | `DELETE` | `usuarioService.eliminar(id)` | Admin: Eliminar Usuario |
| **Órdenes** | Crear (Checkout)| `/api/ordenes` | `POST` | `ordenService.crear(data)` | Vista Verde: Checkout |
| **Órdenes** | Leer (Todas) | `/api/ordenes` | `GET` | `ordenService.obtenerTodas()` | Admin: Lista de Órdenes |
| **Órdenes** | Leer (Boleta) | `/api/ordenes/{id}` | `GET` | `ordenService.obtenerPorId(id)` | Vista Verde: Boleta Éxito |
| **Órdenes** | Leer (Usuario) | `/api/ordenes/usuario/{id}` | `GET` | `ordenService.obtenerPorUsuario(id)` | Vista Verde: Historial Compras|
| **Órdenes** | Actualizar Estado| `/api/ordenes/{id}/estado` | `PATCH` | `ordenService.cambiarEstado(id, est)` | Admin: Gestión de Pedidos |
| **Órdenes** | Anular / Borrar| `/api/ordenes/{id}` | `DELETE` | `ordenService.eliminar(id)` | Admin: Anular Pedido |

---

## 7. EQUIVALENCIAS: VITEST / TESTING LIBRARY ↔ JASMINE / KARMA

> **Nota para la Comisión Evaluadora:** La pauta institucional menciona Jasmine y Karma debido al descriptor histórico del programa; sin embargo, en clases y de común acuerdo con la cátedra se confirmó el uso de **Vitest y React Testing Library**, por tratarse del estándar actual de la industria para aplicaciones basadas en Vite. A continuación se presenta la tabla de equivalencias técnicas formales:

| Concepto de Testing | Jasmine / Karma | Vitest + React Testing Library | Equivalencia y Beneficio |
|---|---|---|---|
| **Estructura de Bloques** | `describe('suite', () => {})` | `describe('suite', () => {})` | Idéntica sintaxis BDD estándar. |
| **Definición de Casos** | `it('debe...', () => {})` | `it('debe...', () => {})` | Idéntica sintaxis. |
| **Aserciones Básicas** | `expect(a).toBe(b)` | `expect(a).toBe(b)` | Idéntica API de aserciones. |
| **Aserciones del DOM** | `jasmine-matchers` | `@testing-library/jest-dom` | `toBeInTheDocument()`, `toBeVisible()`, `toHaveValue()`. |
| **Funciones Espía** | `jasmine.createSpy()` | `vi.fn()` | Crea mocks espía para verificar llamadas y argumentos. |
| **Espías sobre Métodos** | `spyOn(servicio, 'metodo')` | `vi.spyOn(servicio, 'metodo')` | Intercepta métodos de servicios retornando promesas simuladas. |
| **Entorno de Ejecución** | Navegador real vía `ChromeHeadless` en Karma | `jsdom` en Vitest | Emulación del estándar DOM de W3C en Node.js, 10 veces más rápido. |
| **Pruebas de Hooks** | Requiere montaje en wrapper manual | `renderHook(() => useHook())` | Permite probar hooks aislados (`useCarrito`) con llamadas `act()`. |
| **Motor de Cobertura** | `karma-coverage` (Istanbul) | `@vitest/coverage-v8` (V8 nativo) | Inspección de AST nativa con reportes en consola y HTML. |

---

## 8. REGLAS DE NEGOCIO Y BENEFICIOS IMPLEMENTADOS

1. **Beneficio Senior (Adulto Mayor):** Si el cliente registra una fecha de nacimiento que resulta en **50 años o más**, el sistema le otorga de por vida un **50% de descuento automático** en todos los productos.
2. **Convenio Comunidad Duoc UC:** Identificación mediante correo `@duocuc.cl` o casilla de verificación, activando el cupón conmemorativo **`DUOCUMPLE`** (20% de descuento).
3. **Cupón Aniversario 50 Años:** El código **`FELICES50`** otorga un 10% de descuento. Si el usuario ya cuenta con un beneficio superior (ej: 50% Senior), el sistema siempre preserva el descuento más favorable para el cliente.
4. **Cálculo Tributario y Despacho:**
   - Despacho estándar en frío: **$3.500 CLP** (se cobra una única vez si el carrito contiene ítems).
   - IVA: **19%** desglosado en la boleta fiscal para cumplimiento contable.
