# Documento de Requisitos y Arquitectura del Sistema

**Proyecto:** Pastelería Mil Sabores  
**Carrera:** Ingeniería / Analista Programador — Duoc UC  
**Ramo:** Desarrollo Fullstack II  
**Versión del Proyecto:** 2.0 (React + Spring Boot)  

---

## 1. ¿De qué se trata el proyecto?
Pastelería Mil Sabores es una tienda web para una pastelería tradicional con 50 años de historia. 

El proyecto se divide en dos partes principales:
1. **Tienda pública:** Donde los clientes pueden ver el catálogo de tortas, ver productos en oferta, personalizar su torta (tamaño, forma y dedicatoria), agregar cosas al carrito con descuentos (como el beneficio para adultos mayores de 50 años o convenio Duoc UC) y completar la compra en el checkout recibiendo su comprobante/boleta.
2. **Panel de administración:** Donde un usuario con rol `ADMIN` puede gestionar productos (CRUD completo), categorías, ver usuarios y revisar reportes y pedidos.

---

## 2. Tecnologías que usamos

* **Frontend:**
  * **React 18:** Para construir la interfaz con componentes limpios y funcionales usando hooks (`useState`, `useEffect`, `useMemo`, `useContext`).
  * **Vite:** Herramienta de compilación rápida para levantar el proyecto en desarrollo y empaquetar para producción.
  * **Bootstrap 5 + Bootstrap Icons:** Para que todo el diseño sea responsivo y se adapte bien a celulares, tablets y computadores.
  * **React Router DOM 6:** Para la navegación tipo SPA (Single Page Application) sin recargar la página y proteger las rutas del administrador.
  * **Vitest + React Testing Library:** Para realizar las pruebas unitarias en el navegador simulado (`jsdom`).

* **Backend:**
  * **Spring Boot (Java 17+):** API REST para manejar los datos del negocio y endpoints CRUD.
  * **Base de datos H2 en memoria:** Permite que el backend levante de inmediato en cualquier equipo sin configurar servidores externos de bases de datos.

---

## 3. Arquitectura y cómo se comunican los datos

Para que la aplicación sea fácil de probar y no se caiga si el backend no está corriendo, organizamos el frontend en capas:

1. **Vistas / Componentes (UI):** Solo se encargan de mostrar la interfaz y capturar lo que hace el usuario. No hacen llamadas `fetch` directamente.
2. **Capa de Servicios (`src/services/`):** Aquí se centralizan las llamadas a la API (`productoService`, `categoriaService`, `ordenService`, etc.).
3. **Estrategia de Doble Fuente:**
   * **Modo Principal:** La capa de servicios intenta comunicarse con los endpoints REST de Spring Boot (`http://localhost:8080/api`).
   * **Modo Respaldo / Pruebas (`src/data/db.js`):** Si el backend está apagado o estamos corriendo los tests en Vitest, los servicios usan automáticamente los datos locales de `db.js` con persistencia en `localStorage`.

---

## 4. Módulos y Funcionalidades Principales

### 4.1 Tienda Pública
* **Catálogo y Categorías:** Filtrado dinámico de tortas por categoría (cuadradas, circulares, individuales, etc.) y buscador por nombre o ingrediente.
* **Sección de Ofertas:** Lista de productos que tienen descuento activo, mostrando el precio original tachado y el precio final rebajado.
* **Detalle y Personalización:** Selector interactivo de porciones (Chica, Mediana, Grande, Familiar) que recalcula el precio en tiempo real, selector de forma y campo de dedicatoria para escribir mensajes en placa de azúcar.
* **Carrito y Beneficios:** Guarda productos en memoria del navegador (`CartContext`), calcula totales y aplica automáticamente descuentos como el 50% para adultos mayores de 50 años o el cupón `FELICES50`.
* **Checkout y Pago:** Formulario con autocompletado si el usuario está logueado, validación de campos obligatorios y pantalla de confirmación (boleta electrónica) o de error si la pasarela rechaza la tarjeta.

### 4.2 Panel Administrativo
* **Ruta Protegida:** Un componente guardia (`RutaProtegidaAdmin`) revisa si el usuario tiene rol `ADMIN`. Si es un cliente común o no ha iniciado sesión, no lo deja pasar y le muestra pantalla de acceso restringido.
* **Gestión de Productos (CRUD):** Modal para crear nuevos productos, editar existentes, listar con buscador y eliminar con confirmación.
* **Gestión de Categorías y Usuarios:** Mantenimiento de categorías y listado de cuentas registradas con sus roles.
* **Reportes y Órdenes:** Resumen de pedidos realizados y cambio de estado de despacho.
