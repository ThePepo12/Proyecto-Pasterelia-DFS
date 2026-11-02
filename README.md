# Pastelería Mil Sabores — Plataforma Web Integrada

> **Arquitectura:** Frontend React (Vite + Bootstrap 5)   

---

## 1. DESCRIPCIÓN DEL PROYECTO

Plataforma de comercio electrónico y gestión empresarial para **Pastelería Mil Sabores** (50 Años de Tradición). Integra la tienda pública para clientes con catálogo de 8 categorías, personalización de pedidos (tamaños, porciones y dedicatorias), pasarela de checkout con cálculo automático de beneficios (50% descuento Senior para mayores de 50 años, Convenio Duoc UC, cupones conmemorativos), emisión de boleta fiscal y una capa administrativa completa protegida por rol `ADMIN` con métricas, gestión CRUD y reportes financieros.

---

## 2. REQUISITOS PREVIOS Y VERSIONES

* **Node.js:** Versión `18.x` o superior (verificado con Node 20 y Node 24).
* **Java JDK:** Versión `17` o superior (verificado con Oracle JDK 21 / 22).
* **Navegador Web:** Google Chrome, Microsoft Edge o Mozilla Firefox actualizado.

---

## 3. USUARIOS Y CREDENCIALES DE PRUEBA

El sistema arranca automáticamente con cuentas precargadas en la base de datos:

| Rol | Correo Electrónico | Contraseña | Beneficio / Privilegio Asociado |
|---|---|---|---|
| **ADMIN** | `admin@pasteleriamilsabores.cl` | `admin123` | Acceso completo al **Panel Administrativo** (`/admin`), gestión CRUD y reportes. |
| **CLIENTE** | `rosa.carrasco@gmail.com` | `rosa123` | **Beneficio Senior (50% de por vida)** por tener 61 años (+50). |
| **CLIENTE** | `estudiante@duocuc.cl` | `duoc123` | **Convenio Duoc UC** con cupón `DUOCUMPLE` (20% de descuento). |

> 💡 *En la pantalla de inicio de sesión (`/login`) existen botones de acceso rápido para pruebas con cuentas preconfiguradas.*

---

## 4. INSTRUCCIONES DE EJECUCIÓN

### 4.1 Frontend (React + Vite + Bootstrap 5)
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo Vite
npm run dev
```
* **Puerto de la tienda:** `http://localhost:3000` (o `http://localhost:5173`)

---

## 5. EJECUCIÓN DE PRUEBAS UNITARIAS (VITEST)

Las pruebas unitarias fueron desarrolladas para el frontend utilizando **Vitest** y **React Testing Library** (ejecutadas sobre el entorno simulado `jsdom`), garantizando total desacoplamiento del backend gracias a la estrategia de mocks (`vi.spyOn`) y la base de datos local de respaldo (`src/data/db.js`).

```bash
# Ejecutar las pruebas
npm test

# Generar reporte de cobertura de código:
npm run test:coverage
```
El reporte gráfico de cobertura queda generado en:  
`coverage/index.html`.

---

## 6. MAPA DE VISTAS 

| Sección | Módulo / Vista | Ruta en el Frontend | Endpoint Consumido |
|---|---|---|---|
| **Tienda** | Categorías | `/categorias` | `GET /api/categorias` y `/api/productos/categoria/{id}` |
| **Tienda** | Ofertas Especiales | `/ofertas` | `GET /api/productos/ofertas` |
| **Tienda** | Comprar (Checkout) | `/checkout` | `POST /api/ordenes` |
| **Tienda** | Pago Correcto (Boleta) | `/pago-exitoso` | `GET /api/ordenes/{id}` |
| **Tienda** | Pago con Error | `/pago-error` | Manejo reactivo local preservando el carrito |
| **Admin** | Órdenes → Mostrar Boleta | `/admin/reportes` | `GET /api/ordenes` y `PATCH /api/ordenes/{id}/estado` |
| **Admin** | Productos Críticos ($\le 5$) | `/admin/productos` | `GET /api/productos/criticos?limite=5` |
| **Admin** | Reportes de Productos | `/admin/reportes` | `GET /api/reportes/productos` |
| **Admin** | Reportes Generales | `/admin/reportes` | `GET /api/reportes/generales` |
| **Admin** | Perfil Administrador | `/admin/usuarios` | `GET /api/usuarios/{id}` y `PUT /api/usuarios/{id}` |
| **Admin** | Historial de Usuario | `/admin/reportes` | `GET /api/ordenes/usuario/{id}` |
