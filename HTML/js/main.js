// =============================================================================
// ARCHIVO: main.js
// PROYECTO: Pastelería Mil Sabores - Evaluación 1 (DSY1104 Duoc UC)
// PROPÓSITO: Funcionalidades del sitio: Carrito, Detalle dinámico, Filtros y Contacto
// =============================================================================

// -----------------------------------------------------------------------------
// ARREGLO DE PRODUCTOS (16 Productos oficiales de la pastelería)
// -----------------------------------------------------------------------------
const LISTA_PRODUCTOS = [
  {
    codigo: 'TC001',
    categoria: 'Tortas Cuadradas',
    nombre: 'Torta Cuadrada de Chocolate',
    precio: 45000,
    descripcion: 'Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.',
    imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
  },
  {
    codigo: 'TC002',
    categoria: 'Tortas Cuadradas',
    nombre: 'Torta Cuadrada de Frutas',
    precio: 50000,
    descripcion: 'Una mezcla de frutas frescas de la estación y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones familiares.',
    imagen: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80'
  },
  {
    codigo: 'TT001',
    categoria: 'Tortas Circulares',
    nombre: 'Torta Circular de Vainilla',
    precio: 40000,
    descripcion: 'Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce tradicional, perfecto para cualquier ocasión.',
    imagen: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80'
  },
  {
    codigo: 'TT002',
    categoria: 'Tortas Circulares',
    nombre: 'Torta Circular de Manjar',
    precio: 42000,
    descripcion: 'Torta tradicional chilena con manjar artesanal y nueces seleccionadas, un deleite para los amantes de los sabores clásicos.',
    imagen: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?auto=format&fit=crop&w=800&q=80'
  },
  {
    codigo: 'PI001',
    categoria: 'Postres Individuales',
    nombre: 'Mousse de Chocolate',
    precio: 5000,
    descripcion: 'Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.',
    imagen: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80'
  },
  {
    codigo: 'PI002',
    categoria: 'Postres Individuales',
    nombre: 'Tiramisú Clásico',
    precio: 5500,
    descripcion: 'Un postre italiano individual con capas de café, queso mascarpone y cacao en polvo fino, perfecto para finalizar cualquier comida.',
    imagen: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80'
  },
  {
    codigo: 'PSA001',
    categoria: 'Productos Sin Azúcar',
    nombre: 'Torta Sin Azúcar de Naranja',
    precio: 48000,
    descripcion: 'Torta ligera y deliciosa, endulzada naturalmente con cítricos frescos, ideal para quienes buscan opciones más saludables.',
    imagen: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80'
  },
  {
    codigo: 'PSA002',
    categoria: 'Productos Sin Azúcar',
    nombre: 'Cheesecake Sin Azúcar',
    precio: 47000,
    descripcion: 'Suave y cremoso sobre base de frutos secos tostados, este cheesecake es una opción perfecta para disfrutar sin culpa.',
    imagen: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80'
  },
  {
    codigo: 'PT001',
    categoria: 'Pastelería Tradicional',
    nombre: 'Empanada de Manzana',
    precio: 3000,
    descripcion: 'Pastelería tradicional chilena rellena de manzanas del sur especiadas con canela, perfecta para un dulce desayuno o merienda.',
    imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
  },
  {
    codigo: 'PT002',
    categoria: 'Pastelería Tradicional',
    nombre: 'Tarta de Santiago',
    precio: 6000,
    descripcion: 'Tradicional tarta española hecha con almendras seleccionadas, azúcar y huevos, una delicia clásica insustituible.',
    imagen: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80'
  },
  {
    codigo: 'PG001',
    categoria: 'Productos Sin Gluten',
    nombre: 'Brownie Sin Gluten',
    precio: 4000,
    descripcion: 'Rico, denso y con intenso sabor a cacao, este brownie es perfecto para personas celíacas sin sacrificar el sabor.',
    imagen: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80'
  },
  {
    codigo: 'PG002',
    categoria: 'Productos Sin Gluten',
    nombre: 'Pan Sin Gluten',
    precio: 3500,
    descripcion: 'Suave y esponjoso, elaborado diariamente con harinas libres de gluten certificadas, ideal para sándwiches o acompañar comidas.',
    imagen: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80'
  },
  {
    codigo: 'PV001',
    categoria: 'Productos Veganos',
    nombre: 'Torta Vegana de Chocolate',
    precio: 50000,
    descripcion: 'Torta de chocolate húmeda y deliciosa, hecha 100% sin productos de origen animal, apta para veganos y vegetarianos.',
    imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
  },
  {
    codigo: 'PV002',
    categoria: 'Productos Veganos',
    nombre: 'Galletas Veganas de Avena',
    precio: 4500,
    descripcion: 'Crujientes y sabrosas, horneadas con avena integral y endulzadas saludablemente para una colación nutritiva.',
    imagen: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80'
  },
  {
    codigo: 'TE001',
    categoria: 'Tortas Especiales',
    nombre: 'Torta Especial de Cumpleaños',
    precio: 55000,
    descripcion: 'Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos para homenajear a tus seres queridos.',
    imagen: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80'
  },
  {
    codigo: 'TE002',
    categoria: 'Tortas Especiales',
    nombre: 'Torta Especial de Boda',
    precio: 60000,
    descripcion: 'Elegante y deliciosa, con finas terminaciones en fondant y flores de azúcar, diseñada para ser el centro de atención en cualquier matrimonio.',
    imagen: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80'
  }
];

// -----------------------------------------------------------------------------
// INICIALIZACIÓN: Se ejecuta cuando el HTML termina de cargar
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  iniciarMenuMovil();
  actualizarContadorCarrito();
  activarBotonesAgregar();
  cargarDatosProducto();
  inicializarDetalleProducto();
  inicializarFiltrosCatalogo();
  inicializarCarrito();
  inicializarFormularioContacto();
});

// -----------------------------------------------------------------------------
// 1. MENÚ MÓVIL (Abrir y cerrar navegación en celulares)
// -----------------------------------------------------------------------------
function iniciarMenuMovil() {
  const botonMenu = document.querySelector('.menu-toggle');
  const menuNav = document.querySelector('nav');

  if (botonMenu && menuNav) {
    botonMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      menuNav.classList.toggle('nav-open');
    });

    // Cerrar el menú al hacer clic en cualquier enlace dentro de él
    const enlaces = menuNav.querySelectorAll('a');
    enlaces.forEach(enlace => {
      enlace.addEventListener('click', () => {
        menuNav.classList.remove('nav-open');
      });
    });

    // Cerrar el menú si se hace clic fuera del menú
    document.addEventListener('click', (e) => {
      if (!menuNav.contains(e.target) && !botonMenu.contains(e.target)) {
        menuNav.classList.remove('nav-open');
      }
    });
  }
}

// -----------------------------------------------------------------------------
// 2. FUNCIONES DEL CARRITO (LocalStorage)
// -----------------------------------------------------------------------------
function obtenerCarrito() {
  const datos = localStorage.getItem('carrito_mil_sabores');
  return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(lista) {
  localStorage.setItem('carrito_mil_sabores', JSON.stringify(lista));
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const contador = document.getElementById('num-cont-carrito');
  if (!contador) return;

  const carrito = obtenerCarrito();
  let total = 0;
  for (let i = 0; i < carrito.length; i++) {
    total += carrito[i].cantidad;
  }
  contador.textContent = total;
}

// -----------------------------------------------------------------------------
// 3. ACTIVAR BOTONES "+ AÑADIR" (En Index y Catálogo)
// -----------------------------------------------------------------------------
function activarBotonesAgregar() {
  const botones = document.querySelectorAll('.btn-add-cart');

  botones.forEach(boton => {
    boton.addEventListener('click', (evento) => {
      const tarjeta = evento.target.closest('.product-card');
      if (!tarjeta) return;

      const codigo = tarjeta.getAttribute('data-codigo');
      const nombre = tarjeta.getAttribute('data-nombre');
      const precio = parseInt(tarjeta.getAttribute('data-precio'), 10);

      const nuevoProducto = {
        codigo: codigo,
        nombre: nombre,
        precio: precio,
        cantidad: 1,
        personalizacion: 'Estándar'
      };

      agregarAlCarrito(nuevoProducto);
      alert(`🧁 ¡"${nombre}" fue agregado a tu carrito!`);
    });
  });
}

function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito();

  let existente = null;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].codigo === producto.codigo && carrito[i].personalizacion === producto.personalizacion) {
      existente = carrito[i];
      break;
    }
  }

  if (existente) {
    existente.cantidad += producto.cantidad || 1;
  } else {
    carrito.push(producto);
  }

  guardarCarrito(carrito);
}

// -----------------------------------------------------------------------------
// 4. DETALLE DINÁMICO DE PRODUCTO (producto.html)
// Lee el ?id=CODIGO de la URL y actualiza los datos en pantalla
// -----------------------------------------------------------------------------
function cargarDatosProducto() {
  const elementoTitulo = document.getElementById('product-name');
  if (!elementoTitulo) return; // Si no estamos en producto.html, no hace nada

  const parametros = new URLSearchParams(window.location.search);
  const idProducto = parametros.get('id') || 'TE001';

  // Buscamos el producto en la lista
  const producto = LISTA_PRODUCTOS.find(p => p.codigo === idProducto) || LISTA_PRODUCTOS[0];

  document.title = `${producto.nombre} | Pastelería Mil Sabores`;
  elementoTitulo.textContent = producto.nombre;

  const migaCat = document.getElementById('breadcrumb-categoria');
  if (migaCat) migaCat.textContent = producto.categoria;

  const migaProd = document.getElementById('breadcrumb-producto');
  if (migaProd) migaProd.textContent = producto.nombre;

  const tag = document.getElementById('product-tag');
  if (tag) tag.textContent = `${producto.categoria} · Código: ${producto.codigo}`;

  const desc = document.getElementById('product-desc');
  if (desc) desc.textContent = producto.descripcion;

  const precio = document.getElementById('precio-torta');
  if (precio) precio.textContent = `$${producto.precio.toLocaleString('es-CL')} CLP`;

  const imgPrincipal = document.getElementById('img-principal');
  if (imgPrincipal) {
    imgPrincipal.src = producto.imagen;
    imgPrincipal.alt = producto.nombre;
  }

  // Tamaños y precios proporcionales
  const selectTamano = document.getElementById('select-tamano');
  if (selectTamano) {
    const base = producto.precio;
    const precioChica = Math.round(base * 0.75);
    const precioMediana = base;
    const precioGrande = Math.round(base * 1.3);
    const precioFamiliar = Math.round(base * 1.6);

    selectTamano.innerHTML = `
      <option value="Chica" data-precio="${precioChica}">Chica (6 a 8 porciones) - $${precioChica.toLocaleString('es-CL')} CLP</option>
      <option value="Mediana" data-precio="${precioMediana}" selected>Mediana (12 a 15 porciones) - $${precioMediana.toLocaleString('es-CL')} CLP</option>
      <option value="Grande" data-precio="${precioGrande}">Grande (20 a 25 porciones) - $${precioGrande.toLocaleString('es-CL')} CLP</option>
      <option value="Familiar" data-precio="${precioFamiliar}">Familiar (30 a 35 porciones) - $${precioFamiliar.toLocaleString('es-CL')} CLP</option>
    `;
  }
}

function inicializarDetalleProducto() {
  const btnRestar = document.getElementById('btn-restar');
  const btnSumar = document.getElementById('btn-sumar');
  const inputCantidad = document.getElementById('input-cantidad');
  const btnComprar = document.getElementById('btn-comprar-detalle');
  const selectTamano = document.getElementById('select-tamano');
  const elementoPrecio = document.getElementById('precio-torta');

  if (!btnComprar || !inputCantidad) return;

  // Actualizar precio al cambiar tamaño
  if (selectTamano && elementoPrecio) {
    selectTamano.addEventListener('change', () => {
      const opcion = selectTamano.options[selectTamano.selectedIndex];
      const nuevoPrecio = opcion.getAttribute('data-precio');
      elementoPrecio.textContent = `$${parseInt(nuevoPrecio, 10).toLocaleString('es-CL')} CLP`;
    });
  }

  // Botón restar (-)
  if (btnRestar) {
    btnRestar.addEventListener('click', () => {
      let valor = parseInt(inputCantidad.value, 10) || 1;
      if (valor > 1) inputCantidad.value = valor - 1;
    });
  }

  // Botón sumar (+)
  if (btnSumar) {
    btnSumar.addEventListener('click', () => {
      let valor = parseInt(inputCantidad.value, 10) || 1;
      inputCantidad.value = valor + 1;
    });
  }

  // Botón Agregar al Carrito en detalle
  btnComprar.addEventListener('click', () => {
    const cantidad = parseInt(inputCantidad.value, 10) || 1;
    const forma = document.getElementById('select-forma') ? document.getElementById('select-forma').value : 'Circular';

    const parametros = new URLSearchParams(window.location.search);
    const idProducto = parametros.get('id') || 'TE001';
    const productoActual = LISTA_PRODUCTOS.find(p => p.codigo === idProducto) || LISTA_PRODUCTOS[0];

    let tamano = 'Mediana';
    let precio = productoActual.precio;
    if (selectTamano) {
      const opcion = selectTamano.options[selectTamano.selectedIndex];
      tamano = opcion.value;
      precio = parseInt(opcion.getAttribute('data-precio'), 10) || productoActual.precio;
    }

    const mensaje = document.getElementById('input-dedicatoria') ? document.getElementById('input-dedicatoria').value.trim() : '';

    const item = {
      codigo: productoActual.codigo,
      nombre: `${productoActual.nombre} (${forma}, ${tamano})`,
      precio: precio,
      cantidad: cantidad,
      personalizacion: mensaje ? `Mensaje: "${mensaje}"` : 'Sin dedicatoria'
    };

    agregarAlCarrito(item);
    alert(`🧁 ¡Se agregaron ${cantidad} unidad(es) de "${item.nombre}" a tu carrito!`);
  });
}

// -----------------------------------------------------------------------------
// 5. FILTROS Y BUSCADOR DEL CATÁLOGO (categoria.html)
// -----------------------------------------------------------------------------
function inicializarFiltrosCatalogo() {
  const botonesFiltro = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.catalog-item');
  const buscador = document.getElementById('buscador-productos');
  const textoContador = document.getElementById('total-mostrados');

  if (items.length === 0) return;

  function contarVisibles() {
    let visibles = 0;
    items.forEach(item => {
      if (item.style.display !== 'none') visibles++;
    });
    if (textoContador) textoContador.textContent = `${visibles} producto(s) en catálogo`;
  }

  // Filtro por botones de categoría
  botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
      botonesFiltro.forEach(b => b.classList.remove('active'));
      boton.classList.add('active');

      const categoria = boton.getAttribute('data-categoria');
      if (buscador) buscador.value = '';

      items.forEach(item => {
        const cat = item.getAttribute('data-categoria');
        if (categoria === 'todos' || cat === categoria) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
      contarVisibles();
    });
  });

  // Filtro por buscador en vivo
  if (buscador) {
    buscador.addEventListener('input', () => {
      const texto = buscador.value.toLowerCase().trim();

      items.forEach(item => {
        const nombre = (item.getAttribute('data-nombre') || '').toLowerCase();
        const codigo = (item.getAttribute('data-codigo') || '').toLowerCase();

        if (nombre.includes(texto) || codigo.includes(texto)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
      contarVisibles();
    });
  }
}

// -----------------------------------------------------------------------------
// 6. PÁGINA DEL CARRITO (carrito.html)
// Dibuja los productos, calcula totales y aplica código FELICES50
// -----------------------------------------------------------------------------
function inicializarCarrito() {
  const contenedor = document.getElementById('lista-items-carrito');
  if (!contenedor) return;

  let porcentajeDescuento = 0;

  function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const divVacio = document.getElementById('carrito-vacio');
    contenedor.innerHTML = '';

    if (carrito.length === 0) {
      if (divVacio) divVacio.style.display = 'block';
      actualizarResumen(0);
      return;
    }

    if (divVacio) divVacio.style.display = 'none';

    let subtotal = 0;
    for (let i = 0; i < carrito.length; i++) {
      subtotal += carrito[i].precio * carrito[i].cantidad;
    }

    for (let i = 0; i < carrito.length; i++) {
      const item = carrito[i];
      const precioItem = item.precio * item.cantidad;

      const fila = document.createElement('div');
      fila.className = 'cart-item';
      fila.innerHTML = `
        <div class="cart-item-img">🧁</div>
        <div class="cart-item-info">
          <p class="cart-item-name">${item.nombre}</p>
          <p class="cart-item-personalizacion">${item.personalizacion}</p>
          <p class="cart-item-cantidad">Cantidad: ${item.cantidad}</p>
        </div>
        <span class="cart-item-precio">$${precioItem.toLocaleString('es-CL')} CLP</span>
        <button class="cart-item-eliminar" data-indice="${i}" aria-label="Eliminar producto">✕</button>
      `;
      contenedor.appendChild(fila);
    }

    // Botones eliminar
    contenedor.querySelectorAll('.cart-item-eliminar').forEach(boton => {
      boton.addEventListener('click', () => {
        const indice = parseInt(boton.getAttribute('data-indice'), 10);
        const carritoActual = obtenerCarrito();
        carritoActual.splice(indice, 1);
        guardarCarrito(carritoActual);
        renderizarCarrito();
      });
    });

    actualizarResumen(subtotal);
  }

  function actualizarResumen(subtotal) {
    const ENVIO = subtotal > 0 ? 3500 : 0;
    const montoDescuento = Math.round(subtotal * (porcentajeDescuento / 100));
    const total = subtotal - montoDescuento + ENVIO;

    const elemSubtotal = document.getElementById('resumen-subtotal');
    if (elemSubtotal) elemSubtotal.textContent = `$${subtotal.toLocaleString('es-CL')} CLP`;

    const elemTotal = document.getElementById('resumen-total');
    if (elemTotal) elemTotal.textContent = `$${total.toLocaleString('es-CL')} CLP`;

    const filaDescuento = document.getElementById('fila-descuento');
    const elemDescuento = document.getElementById('resumen-descuento');
    if (porcentajeDescuento > 0 && filaDescuento && elemDescuento) {
      filaDescuento.style.display = 'flex';
      elemDescuento.textContent = `-$${montoDescuento.toLocaleString('es-CL')} CLP`;
    } else if (filaDescuento) {
      filaDescuento.style.display = 'none';
    }
  }

  // Código de descuento FELICES50
  const btnAplicar = document.getElementById('btn-aplicar-codigo');
  if (btnAplicar) {
    btnAplicar.addEventListener('click', () => {
      const input = document.getElementById('input-codigo');
      const msg = document.getElementById('msg-codigo');
      const codigo = input ? input.value.trim().toUpperCase() : '';

      if (codigo === 'FELICES50') {
        porcentajeDescuento = 10;
        if (msg) {
          msg.style.display = 'block';
          msg.style.color = '#6fcf6f';
          msg.textContent = '✓ Código aplicado: 10% de descuento';
        }
      } else {
        porcentajeDescuento = 0;
        if (msg) {
          msg.style.display = 'block';
          msg.style.color = '#ff8080';
          msg.textContent = '✗ Código no válido (Prueba FELICES50)';
        }
      }

      const carrito = obtenerCarrito();
      let subtotal = 0;
      for (let i = 0; i < carrito.length; i++) {
        subtotal += carrito[i].precio * carrito[i].cantidad;
      }
      actualizarResumen(subtotal);
    });
  }

  // Botón Confirmar
  const btnConfirmar = document.getElementById('btn-confirmar');
  if (btnConfirmar) {
    btnConfirmar.addEventListener('click', () => {
      const carrito = obtenerCarrito();
      if (carrito.length === 0) {
        alert('Tu carrito está vacío.');
        return;
      }
      guardarCarrito([]);
      alert('🎉 ¡Pedido confirmado con éxito! Gracias por preferirnos.');
      window.location.href = 'index.html';
    });
  }

  renderizarCarrito();
}

// -----------------------------------------------------------------------------
// 7. FORMULARIO DE CONTACTO (contacto.html)
// -----------------------------------------------------------------------------
function inicializarFormularioContacto() {
  const formulario = document.getElementById('form-contacto');
  if (!formulario) return;

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const nombre = document.getElementById('contacto-nombre').value.trim();
    alert(`🧁 ¡Gracias ${nombre}! Tu mensaje ha sido enviado correctamente.`);
    formulario.reset();
  });
}
