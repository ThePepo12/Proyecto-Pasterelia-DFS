# Guía de Explicación de las 10 Pruebas Unitarias

**Asignatura:** Desarrollo Fullstack II (Duoc UC)  
**Comando:** `npm test`  

Esta guía explica en lenguaje claro y de estudiante cómo responder y defender cada una de las 10 pruebas unitarias frente al profesor evaluador.

---

## Módulo 1: Catálogo y Productos ([`src/__tests__/catalogo.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/__tests__/catalogo.test.jsx))

### Prueba 1: Renderizado de Categorías y Productos
* **Qué valida:** Que el componente `Categorias.jsx` lea los datos desde el servicio y pinte las tarjetas dinámicamente en el DOM con `.map()`.
* **Cómo explicarlo:**  
  *"Aquí verificamos que la vista cargue correctamente de forma reactiva. Usamos `waitFor` para esperar a que el estado se actualice y corroboramos que aparezcan las categorías y los pasteles de la primera categoría por defecto."*

### Prueba 2: Buscador en Tiempo Real
* **Qué valida:** Que al ingresar texto en el campo de búsqueda se filtre la lista de pasteles al instante sin recargar la página.
* **Cómo explicarlo:**  
  *"Simulamos al usuario escribiendo 'Frutas' con `userEvent.type`. Verificamos que solo quede visible la Torta Cuadrada de Frutas y que las demás se oculten mediante el estado del filtro."*

---

## Módulo 2: Carrito de Compras ([`src/__tests__/carrito.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/__tests__/carrito.test.jsx))

### Prueba 3: Cálculo de Subtotales y Despacho
* **Qué valida:** La lógica matemática del hook `useCarrito`.
* **Cómo explicarlo:**  
  *"Probamos que al agregar 2 tortas de $45.000, el subtotal sume $90.000, se agreguen los $3.500 fijos de despacho en frío y el total final sea exactamente $93.500."*

### Prueba 4: Cupón de Descuento (FELICES50)
* **Qué valida:** Que la función `aplicarCupon` identifique el código promocional y descuente el porcentaje estipulado.
* **Cómo explicarlo:**  
  *"Ingresamos el cupón conmemorativo 'FELICES50'. El hook valida el texto, aplica un 10% de descuento ($5.000 sobre $50.000) y recalcula el total a pagar."*

### Prueba 5: Límite Reactivo por Stock
* **Qué valida:** Que no se puedan comprar más unidades de las disponibles físicamente en inventario.
* **Cómo explicarlo:**  
  *"Si un producto tiene un stock de 2 unidades y el usuario ya tiene 2 en su carrito, el botón '+' se desactiva con `disabled` y muestra un tooltip advirtiendo que solo hay 2 disponibles."*

---

## Módulo 3: Checkout y Pagos ([`src/__tests__/checkout.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/__tests__/checkout.test.jsx))

### Prueba 6: Descuento Automático para Adultos Mayores (+50 años)
* **Qué valida:** La regla de negocio del beneficio Senior.
* **Cómo explicarlo:**  
  *"El sistema revisa la edad del usuario autenticado. Al tener más de 50 años (ej: 61 años), se le descuenta automáticamente el 50% del valor de los productos en el carrito."*

### Prueba 7: Simulación de Pago Rechazado
* **Qué valida:** El flujo de error de pasarela de pago (`PagoError.jsx`).
* **Cómo explicarlo:**  
  *"Simulamos un fallo por fondos insuficientes (`ERR-WEBPAY-904`). Validamos que la aplicación muestre la pantalla de aviso de rechazo y que mantenga el carrito intacto para que el usuario pueda reintentar."*

### Prueba 8: Emisión de Boleta Electrónica
* **Qué valida:** La pantalla de confirmación exitosa (`PagoExitoso.jsx`).
* **Cómo explicarlo:**  
  *"Comprobamos que tras un pago exitoso se presente la boleta con su número de folio (`MS-XXXXXX`), el desglose de productos y los datos del comprador en modo de solo lectura."*

---

## Módulo 4: Autenticación y Seguridad ([`src/__tests__/auth.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/__tests__/auth.test.jsx))

### Prueba 9: Inicio de Sesión y Manejo de Roles
* **Qué valida:** El hook `useAuth` y el inicio de sesión.
* **Cómo explicarlo:**  
  *"Probamos que al loguear un usuario administrador, el hook actualice el estado global (`isAuthenticated: true`, `isAdmin: true`) y guarde la información de sesión."*

### Prueba 10: Rutas Protegidas (`RutaProtegidaAdmin.jsx`)
* **Qué valida:** La seguridad de acceso al panel administrativo.
* **Cómo explicarlo:**  
  *"Protegemos las rutas del administrador. Si un cliente normal con rol `CLIENTE` intenta escribir `/admin` en la barra de direcciones, el componente protector lo intercepta y le muestra un mensaje de acceso denegado."*
