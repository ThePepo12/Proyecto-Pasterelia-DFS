# Guía de las 10 Pruebas Estrella para la Presentación Oral

> **Asignatura:** DSY1104 Desarrollo Fullstack II (Duoc UC)  
> **Evaluación:** Evaluación Parcial 2 (40% Entrega Grupal / 60% Presentación Individual)  
> **Archivo de pruebas:** `src/__tests__/pruebasEstrella.test.jsx`  
> **Comando de ejecución:** `npm test src/__tests__/pruebasEstrella.test.jsx`

---

## 1. Tabla de Mapeo contra la Rúbrica de Evaluación

| # | Nombre de la Prueba | Criterio de la Rúbrica | Vistas / Módulos Involucrados | Mocks / Aserciones Clave |
|---|---|---|---|---|
| **1** | Renderizado de Lista | Renderizado de colecciones | Vista Verde: Categorías (`Categorias.jsx`) | Espera carga asíncrona, verifica grid y productos de Categoría #1. |
| **2** | Renderizado Condicional | Mensajes de error vs éxito | Vista Verde: Pago Exitoso vs Pago con Error | `toBeInTheDocument()`, valida boleta fiscal vs alerta de fallo. |
| **3** | Props en Componentes | Paso de datos y funciones | Componente modular (`BotonAccion`) | Espía `vi.fn()` para validar callback ejecutado tras click. |
| **4** | Estado Reactivo | Manejo de forms y hooks | Vista Blanca: Detalle (`DetalleProducto.jsx`) | `fireEvent.change`, recálculo dinámico de precio y `userEvent.type`. |
| **5** | Eventos de Usuario | Disparo de acciones | Detalle de Producto & Carrito | `fireEvent.click` en botón "Añadir al Carrito" y feedback Toast. |
| **6** | Mocks de Backend | Aislamiento de red | Capa de Servicios (`ordenService.js`) | `vi.spyOn(ordenService, 'crear')` simula HTTP 201 Created. |
| **7** | Ciclo CRUD Completo | Métodos CRUD de punta a punta | Capa de Datos (`productoService.js`) | Valida secuencia: Crear (POST), Leer (GET), Editar (PUT), Borrar (DELETE). |
| **8** | Formularios CRUD | Validación de obligatorios | Vista Verde: Admin Productos (`AdminProductos.jsx`) | Validación de campos vacíos en modal accesible con mensajes en rojo. |
| **9** | Custom Hooks | Hooks avanzados con act | Hook del Carrito (`useCarrito.jsx`) | `renderHook` y `act`: cálculo financiero, cupones y Senior 50%. |
| **10**| Rutas Protegidas | Seguridad por rol de usuario | Seguridad (`RutaProtegidaAdmin.jsx`) | Bloqueo a usuarios `CLIENTE` o anónimos y acceso exclusivo a `ADMIN`. |

---

## 2. Guion de 1 Minuto para la Defensa Oral de Cada Prueba

### Prueba 1: Renderizado de Listas (`Categorias.jsx`)
* **Qué hace:** Carga de forma asíncrona las 8 categorías de pastelería desde la capa de servicios y renderiza las tarjetas visuales. Luego, valida que por defecto se seleccionen y muestren los productos pertenecientes a la Categoría #1 (Tortas Cuadradas).
* **Qué decir al profesor (1 min):**  
  > *"En esta prueba evaluamos el renderizado de datos dinámicos en una vista verde obligatoria. Usamos `waitFor` para esperar la resolución asíncrona del servicio y comprobamos que el componente mapea correctamente los datos generando las tarjetas de categorías y la lista de tortas cuadradas. Demuestra que no hay datos estáticos 'hardcodeados' y que la interfaz responde fielmente al modelo de datos."*

### Prueba 2: Renderizado Condicional (`PagoExitoso.jsx` vs `PagoError.jsx`)
* **Qué hace:** Renderiza condicionalmente dos vistas según el estado de la transacción: si la pasarela aprueba el pago, muestra el folio `MS-501991` y botones de boleta; si es rechazada, muestra el mensaje de error preservando los productos en el carrito.
* **Qué decir al profesor (1 min):**  
  > *"Esta prueba valida el renderizado condicional exigido en la rúbrica. Simulamos los dos desenlaces de una compra: cuando el pago es exitoso, React monta la boleta electrónica con número de folio fiscal; cuando el pago falla, la pantalla conmuta a un estado de error claro y amigable que le permite al usuario reintentar sin perder los productos de su carrito."*

### Prueba 3: Props y Funciones Espía (`BotonAccion`)
* **Qué hace:** Verifica que un componente funcional hijo recibe propiedades (`props`) de configuración visual y un callback ejecutado mediante un espía de Vitest (`vi.fn()`).
* **Qué decir al profesor (1 min):**  
  > *"Aquí demostramos el principio de responsabilidad única y paso de props en React. El botón recibe su texto y su función manejadora desde el componente padre. Usamos un mock espía `vi.fn()` para constatar que, al hacer clic, la función se ejecuta exactamente una sola vez, comprobando la comunicación entre componentes."*

### Prueba 4: Estado Reactivo en Formularios (`DetalleProducto.jsx`)
* **Qué hace:** Modifica los selectores de tamaño de porciones (Chica, Mediana, Grande, Familiar) y comprueba cómo el estado local recalcula el precio en pantalla inmediatamente (de $55.000 a $41.250 para tamaño Chica), además de almacenar la dedicatoria en el input.
* **Qué decir al profesor (1 min):**  
  > *"Esta prueba demuestra el manejo del estado local con el hook `useState`. Al cambiar el selector de porciones a tamaño 'Chica', el estado se actualiza y la interfaz recalcula dinámicamente el precio al 75% del valor base en tiempo real, formateándolo en pesos chilenos sin recargar la página."*

### Prueba 5: Eventos de Usuario (`DetalleProducto.jsx` → Carrito)
* **Qué hace:** Simula la interacción del usuario haciendo clic en el botón "Añadir al Carrito", verificando el despacho del evento y la aparición de la alerta flotante (Toast) de confirmación.
* **Qué decir al profesor (1 min):**  
  > *"Aquí evaluamos el manejo de eventos sintéticos en React. Al interactuar con el botón de añadir, se dispara el manejador `onClick`, el cual envía el producto configurado al `CartContext` y levanta una notificación visual accesible que confirma la adición al cliente."*

### Prueba 6: Mocks del Backend con `vi.spyOn` (`ordenService.js`)
* **Qué hace:** Intercepta la llamada de red hacia Spring Boot simulando una respuesta HTTP 201 exitosa con un folio generado (`MS-888999`), aislando completamente la prueba de la conectividad al servidor.
* **Qué decir al profesor (1 min):**  
  > *"Esta es una prueba fundamental de arquitectura: usamos `vi.spyOn` para mockear la capa de servicios. De este modo, simulamos la respuesta del backend Spring Boot sin necesidad de que el servidor Java esté encendido durante los tests. Esto asegura pruebas deterministas, rápidas y totalmente desacopladas de la infraestructura."*

### Prueba 7: Ciclo CRUD Completo en la Capa de Servicios
* **Qué hace:** Ejecuta secuencialmente las cuatro operaciones fundamentales: Crear un producto nuevo (`POST`), Leer su detalle (`GET`), Actualizar su precio (`PUT`) y Eliminarlo (`DELETE`), verificando que retorne `null` tras el borrado.
* **Qué decir al profesor (1 min):**  
  > *"En esta prueba demostramos que los métodos CRUD exigidos funcionan de punta a punta. Creamos una torta de prueba, comprobamos su persistencia, modificamos sus valores, la eliminamos y confirmamos que ya no existe en la base de datos, garantizando la integridad de datos del catálogo."*

### Prueba 8: Validación de Formularios CRUD (`AdminProductos.jsx`)
* **Qué hace:** Abre el modal de creación de productos en la vista de administración, pulsa "Guardar" con el formulario vacío y comprueba que se desplieguen los mensajes de validación en los campos obligatorios (código, nombre y precio).
* **Qué decir al profesor (1 min):**  
  > *"Esta prueba cubre la validación de formularios interactivos con Bootstrap. Demuestra que el sistema no permite ingresar datos corruptos o incompletos al catálogo: al pulsar guardar sin datos, la lógica valida los campos y despliega alertas visuales en español informando qué campo debe ser corregido."*

### Prueba 9: Custom Hook `useCarrito` con `renderHook` y `act`
* **Qué hace:** Evalúa la lógica financiera del hook del carrito en un entorno aislado usando `renderHook`. Comprueba que al detectar un usuario de 61 años en la sesión, aplique automáticamente el beneficio Senior del 50% de descuento.
* **Qué decir al profesor (1 min):**  
  > *"Para probar nuestros custom hooks usamos las utilidades `renderHook` y `act` de React Testing Library. En este caso probamos `useCarrito`: agregamos un pastel de $40.000, el hook detecta la edad del usuario autenticado (+50 años) y aplica de forma reactiva el 50% de descuento, sumando el costo de despacho estándar de $3.500 para un total exacto de $23.500."*

### Prueba 10: Seguridad y Rutas Protegidas (`RutaProtegidaAdmin.jsx`)
* **Qué hace:** Evalúa el control de acceso basado en roles (RBAC). Si un usuario con rol `CLIENTE` intenta acceder a la ruta `/admin`, el guardián de rutas lo expulsa y redirige al inicio; si entra un usuario con rol `ADMIN`, se le permite el acceso.
* **Qué decir al profesor (1 min):**  
  > *"Esta prueba demuestra la seguridad de la capa administrativa. La ruta protegida inspecciona el token o sesión en el contexto de autenticación: si el usuario no tiene el rol de administrador, es inmediatamente bloqueado y enviado a la tienda pública. Solo las credenciales con rol 'ADMIN' pueden renderizar los módulos de gestión y reportes."*

---

## 3. Estrategia de Mocks y Cobertura (V8)

1. **Aislamiento de Almacenamiento:** Antes de cada prueba (`beforeEach`), se limpia el `localStorage` y se reinicia `db.reset()` para evitar efectos colaterales entre tests.
2. **Aislamiento de Red:** Las llamadas a `fetch` y a los servicios son interceptadas con `vi.spyOn`, evitando falsos negativos por fallos de red.
3. **Métrica de Cobertura:** Ejecutar `npm run test:coverage` genera el reporte HTML en `coverage/index.html` con una cobertura superior al 75% en componentes críticos, superando el umbral del 70% fijado en `vite.config.js`.
