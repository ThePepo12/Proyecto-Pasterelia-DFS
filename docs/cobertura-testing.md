# Cobertura y Arquitectura de Pruebas Unitarias (Testing)

**Proyecto:** Pastelería Mil Sabores  
**Asignatura:** Desarrollo Fullstack II (DSY1104) — Duoc UC  
**Entorno de Pruebas:** Vitest + React Testing Library + jsdom  
**Total de Archivos de Prueba:** 10 suites temáticas  
**Total de Pruebas Unitarias:** 24 pruebas automatizadas  

---

## 1. Distribución de las 10 Suites de Pruebas en `src/test/`

Para asegurar la máxima calidad de software y una cobertura integral de los componentes y páginas de la aplicación, el proyecto cuenta con **10 archivos de prueba** que evalúan un total de **24 casos de prueba**:

| Archivo de Prueba | Componente / Vista Evaluada | N° Pruebas | Qué evalúa |
| :--- | :--- | :---: | :--- |
| [`navbar.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/test/navbar.test.jsx) | `Navbar.jsx` | 3 | Renderizado de marca y enlaces, contador reactivo del carrito y saludo dinámico a usuarios autenticados. |
| [`footer.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/test/footer.test.jsx) | `Footer.jsx` | 2 | Historia conmemorativa de 50 años, enlaces rápidos y resumen de beneficios institucionales. |
| [`nosotros.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/test/nosotros.test.jsx) | `Nosotros.jsx` | 2 | Título de 50 años de tradición, reseña histórica y mención del Récord Guinness Mundial de 1995. |
| [`catalogo.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/test/catalogo.test.jsx) | `Categorias.jsx` | 2 | Carga y renderizado de categorías, y filtrado en tiempo real con evento de teclado (`userEvent.type`). |
| [`contacto.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/test/contacto.test.jsx) | `Contacto.jsx` | 2 | Formulario controlado de contacto, inputs de mensaje y validación de envío con confirmación visual. |
| [`ofertas.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/test/ofertas.test.jsx) | `Ofertas.jsx` (Vista Verde) | 2 | Renderizado de encabezado de ofertas y productos con precio rebajado y badges de descuento. |
| [`carrito.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/test/carrito.test.jsx) | `CartContext.jsx` y `Carrito.jsx` | 3 | Cálculo de subtotal y despacho ($3.500), cupón conmemorativo `FELICES50` (10%) y bloqueo de botón `+` por stock máximo. |
| [`checkout.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/test/checkout.test.jsx) | `Checkout.jsx`, `PagoExitoso.jsx`, `PagoError.jsx` | 3 | Descuento Senior (+50 años = 50%), simulación de fallo de pasarela (`ERR-WEBPAY-904`) y emisión de boleta con folio. |
| [`login.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/test/login.test.jsx) | `Login.jsx` | 3 | Renderizado de formulario, validación de campos obligatorios y autocompletado con accesos demo. |
| [`auth.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/test/auth.test.jsx) | `AuthContext.jsx` y `RutaProtegidaAdmin.jsx` | 2 | Inicio de sesión con roles mediante `useAuth` y bloqueo de acceso a `/admin` para rol `CLIENTE`. |

---

## 2. Ejecución de las Pruebas

Para ejecutar la suite completa de 24 pruebas en la terminal:

```bash
npm test
```

Salida esperada en consola:
```text
 ✓ src/test/navbar.test.jsx (3)
 ✓ src/test/footer.test.jsx (2)
 ✓ src/test/nosotros.test.jsx (2)
 ✓ src/test/catalogo.test.jsx (2)
 ✓ src/test/contacto.test.jsx (2)
 ✓ src/test/ofertas.test.jsx (2)
 ✓ src/test/carrito.test.jsx (3)
 ✓ src/test/checkout.test.jsx (3)
 ✓ src/test/login.test.jsx (3)
 ✓ src/test/auth.test.jsx (2)

 Test Files  10 passed (10)
      Tests  24 passed (24)
```
