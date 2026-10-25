# Informe de Pruebas Unitarias y Cobertura

**Proyecto:** Pastelería Mil Sabores    
**Herramientas:** Vitest, React Testing Library y `@testing-library/jest-dom`  
**Enfoque:** Pruebas unitarias de componentes, hooks y flujos de negocio clave en el Frontend.  

---

## 1. Organización de las Pruebas

Para mantener una arquitectura modular y ordenada acorde a lo solicitado en la evaluación, las **10 pruebas unitarias requeridas** se dividieron en **4 archivos temáticos** dentro de `src/__tests__/`:

```
src/__tests__/
├── catalogo.test.jsx   (2 pruebas: renderizado y buscador en tiempo real)
├── carrito.test.jsx    (3 pruebas: cálculo de totales, cupón y límite reactivo de stock)
├── checkout.test.jsx   (3 pruebas: descuento senior, simulación de rechazo y boleta)
└── auth.test.jsx       (2 pruebas: login de usuarios y protección de rutas)
```

---

## 2. Inventario de las 10 Pruebas

| Archivo | N° | Nombre de la Prueba | Qué valida principalmente |
|---|:---:|---|---|
| [`catalogo.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/__tests__/catalogo.test.jsx) | **1** | Carga y renderizado inicial | Que al cargar la vista se muestren las categorías y las tarjetas de productos. |
| [`catalogo.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/__tests__/catalogo.test.jsx) | **2** | Buscador dinámico | Que al escribir en el buscador se filtren los productos reactivamente en pantalla. |
| [`carrito.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/__tests__/carrito.test.jsx) | **3** | Subtotales y Despacho | Que al agregar un producto se calculen cantidades, subtotal, envío ($3.500) y total. |
| [`carrito.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/__tests__/carrito.test.jsx) | **4** | Cupón de Descuento | Que el cupón `FELICES50` descuente el 10% del subtotal en el carrito. |
| [`carrito.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/__tests__/carrito.test.jsx) | **5** | Límite por Stock | Que el botón `+` se deshabilite y muestre mensaje cuando se alcanza el stock máximo del producto. |
| [`checkout.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/__tests__/checkout.test.jsx) | **6** | Descuento Senior (+50 años) | Que el sistema detecte la edad del cliente y aplique 50% de rebaja automática. |
| [`checkout.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/__tests__/checkout.test.jsx) | **7** | Simulación de Pago Rechazado | Que en caso de fondos insuficientes muestre el error `ERR-WEBPAY-904` y no borre el carrito. |
| [`checkout.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/__tests__/checkout.test.jsx) | **8** | Emisión de Boleta | Que al pagar con éxito muestre el número de folio (`MS-XXXXXX`) y datos del cliente en solo lectura. |
| [`auth.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/__tests__/auth.test.jsx) | **9** | Autenticación y Roles | Que `useAuth` inicie sesión, guarde el estado y exponga los roles (`isAdmin: true`). |
| [`auth.test.jsx`](file:///c:/Proyecto-Pasterelia-DFS/src/__tests__/auth.test.jsx) | **10** | Rutas Protegidas | Que un usuario con rol `CLIENTE` sea bloqueado al intentar entrar a `/admin`. |

**Total exacto:** 4 archivos de prueba, 10 pruebas unitarias pasando.

---

## 3. Comandos para Ejecutar las Pruebas

* **Ejecutar todas las 10 pruebas una vez:**
  ```bash
  npm test
  ```

* **Ejecutar un módulo específico (ejemplo, solo carrito):**
  ```bash
  npx vitest run src/__tests__/carrito.test.jsx
  ```

* **Modo observador (watch):**
  ```bash
  npm run test:watch
  ```
