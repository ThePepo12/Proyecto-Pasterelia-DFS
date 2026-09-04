// =============================================================================
// ARCHIVO: main.js
// PROYECTO: Pastelería Mil Sabores - Evaluación 1
// PROPÓSITO: Funcionalidades interactivas, carrito, detalle dinámico y filtros
// =============================================================================

// -----------------------------------------------------------------------------
// ARREGLO DE PRODUCTOS 
// Contiene las 16 delicias del caso oficial con código, categoría y precio
// -----------------------------------------------------------------------------
const LISTA_PRODUCTOS = [
  {
    codigo: 'TC001',
    categoria: 'Tortas Cuadradas',
    categoriaId: 'cuadradas',
    nombre: 'Torta Cuadrada de Chocolate',
    precio: 45000,
    descripcion: 'Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.',
    imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'TC002',
    categoria: 'Tortas Cuadradas',
    categoriaId: 'cuadradas',
    nombre: 'Torta Cuadrada de Frutas',
    precio: 50000,
    descripcion: 'Una mezcla de frutas frescas de la estación y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones familiares.',
    imagen: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'TT001',
    categoria: 'Tortas Circulares',
    categoriaId: 'circulares',
    nombre: 'Torta Circular de Vainilla',
    precio: 40000,
    descripcion: 'Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce tradicional, perfecto para cualquier ocasión.',
    imagen: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'TT002',
    categoria: 'Tortas Circulares',
    categoriaId: 'circulares',
    nombre: 'Torta Circular de Manjar',
    precio: 42000,
    descripcion: 'Torta tradicional chilena con manjar artesanal y nueces seleccionadas, un deleite para los amantes de los sabores clásicos.',
    imagen: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'PI001',
    categoria: 'Postres Individuales',
    categoriaId: 'individuales',
    nombre: 'Mousse de Chocolate',
    precio: 5000,
    descripcion: 'Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.',
    imagen: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'PI002',
    categoria: 'Postres Individuales',
    categoriaId: 'individuales',
    nombre: 'Tiramisú Clásico',
    precio: 5500,
    descripcion: 'Un postre italiano individual con capas de café, queso mascarpone y cacao en polvo fino, perfecto para finalizar cualquier comida.',
    imagen: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'PSA001',
    categoria: 'Productos Sin Azúcar',
    categoriaId: 'sin-azucar',
    nombre: 'Torta Sin Azúcar de Naranja',
    precio: 48000,
    descripcion: 'Torta ligera y deliciosa, endulzada naturalmente con cítricos frescos, ideal para quienes buscan opciones más saludables.',
    imagen: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'PSA002',
    categoria: 'Productos Sin Azúcar',
    categoriaId: 'sin-azucar',
    nombre: 'Cheesecake Sin Azúcar',
    precio: 47000,
    descripcion: 'Suave y cremoso sobre base de frutos secos tostados, este cheesecake es una opción perfecta para disfrutar sin culpa.',
    imagen: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'PT001',
    categoria: 'Pastelería Tradicional',
    categoriaId: 'tradicional',
    nombre: 'Empanada de Manzana',
    precio: 3000,
    descripcion: 'Pastelería tradicional chilena rellena de manzanas del sur especiadas con canela, perfecta para un dulce desayuno o merienda.',
    imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'PT002',
    categoria: 'Pastelería Tradicional',
    categoriaId: 'tradicional',
    nombre: 'Tarta de Santiago',
    precio: 6000,
    descripcion: 'Tradicional tarta española hecha con almendras seleccionadas, azúcar y huevos, una delicia clásica insustituible.',
    imagen: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'PG001',
    categoria: 'Productos Sin Gluten',
    categoriaId: 'sin-gluten',
    nombre: 'Brownie Sin Gluten',
    precio: 4000,
    descripcion: 'Rico, denso y con intenso sabor a cacao, este brownie es perfecto para personas celíacas sin sacrificar el sabor.',
    imagen: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'PG002',
    categoria: 'Productos Sin Gluten',
    categoriaId: 'sin-gluten',
    nombre: 'Pan Sin Gluten',
    precio: 3500,
    descripcion: 'Suave y esponjoso, elaborado diariamente con harinas libres de gluten certificadas, ideal para sándwiches o acompañar comidas.',
    imagen: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'PV001',
    categoria: 'Productos Vegana',
    categoriaId: 'vegana',
    nombre: 'Torta Vegana de Chocolate',
    precio: 50000,
    descripcion: 'Torta de chocolate húmeda y deliciosa, hecha 100% sin productos de origen animal, apta para veganos y vegetarianos.',
    imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'PV002',
    categoria: 'Productos Vegana',
    categoriaId: 'vegana',
    nombre: 'Galletas Veganas de Avena',
    precio: 4500,
    descripcion: 'Crujientes y sabrosas, horneadas con avena integral y endulzadas saludablemente para una colación nutritiva.',
    imagen: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'TE001',
    categoria: 'Tortas Especiales',
    categoriaId: 'especiales',
    nombre: 'Torta Especial de Cumpleaños',
    precio: 55000,
    descripcion: 'Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos para homenajear a tus seres queridos.',
    imagen: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'TE002',
    categoria: 'Tortas Especiales',
    categoriaId: 'especiales',
    nombre: 'Torta Especial de Boda',
    precio: 60000,
    descripcion: 'Elegante y deliciosa, con finas terminaciones en fondant y flores de azúcar, diseñada para ser el centro de atención en cualquier matrimonio.',
    imagen: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

// Esperamos a que todo el HTML se termine de cargar en el navegador antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
  console.log('Página cargada correctamente.');

  // Llamamos a las funciones principales al iniciar
  iniciarMenuMovil();
  actualizarContadorCarrito();
  activarBotonesAgregar();
  cargarDatosProducto();
  inicializarDetalleProducto();
  inicializarFiltrosCatalogo();
  inicializarCarrito(); // Carga los items del carrito en carrito.html
});

// -----------------------------------------------------------------------------
// 1. FUNCIÓN: MENÚ RESPONSIVE (Para celulares y tablets)
// -----------------------------------------------------------------------------
function iniciarMenuMovil() {
  const botonMenu = document.querySelector('.menu-toggle');
  const menuNav = document.querySelector('nav');

  if (botonMenu && menuNav) {
    botonMenu.addEventListener('click', () => {
      menuNav.classList.toggle('nav-open');
    });
  }
}

// -----------------------------------------------------------------------------
// 2. FUNCIÓN: LEER PRODUCTOS DEL CARRITO (Desde LocalStorage)
// -----------------------------------------------------------------------------
function obtenerCarrito() {
  const datosGuardados = localStorage.getItem('carrito_mil_sabores');
  if (datosGuardados) {
    return JSON.parse(datosGuardados);
  } else {
    return [];
  }
}

// -----------------------------------------------------------------------------
// 3. FUNCIÓN: GUARDAR EL CARRITO EN LOCALSTORAGE
// -----------------------------------------------------------------------------
function guardarCarrito(listaProductos) {
  localStorage.setItem('carrito_mil_sabores', JSON.stringify(listaProductos));
  actualizarContadorCarrito();
}

// -----------------------------------------------------------------------------
// 4. FUNCIÓN: ACTUALIZAR EL CONTADOR DEL BOTÓN "CARRITO"
// -----------------------------------------------------------------------------
function actualizarContadorCarrito() {
  const contadorElemento = document.getElementById('num-cont-carrito');
  if (!contadorElemento) return;

  const carrito = obtenerCarrito();
  let totalProductos = 0;
  for (let i = 0; i < carrito.length; i++) {
    totalProductos += carrito[i].cantidad;
  }

  contadorElemento.textContent = totalProductos;
}

// -----------------------------------------------------------------------------
// 5. FUNCIÓN: ACTIVAR LOS BOTONES "+ AÑADIR" DE CADA PRODUCTO
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

// -----------------------------------------------------------------------------
// 6. FUNCIÓN: AGREGAR O SUMAR CANTIDAD DE UN PRODUCTO EN EL CARRITO
// -----------------------------------------------------------------------------
function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito();

  let productoExistente = null;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].codigo === producto.codigo && carrito[i].personalizacion === producto.personalizacion) {
      productoExistente = carrito[i];
      break;
    }
  }

  if (productoExistente) {
    productoExistente.cantidad += producto.cantidad || 1;
  } else {
    carrito.push(producto);
  }

  guardarCarrito(carrito);
}

// -----------------------------------------------------------------------------
// 7. FUNCIÓN: CARGAR DATOS DINÁMICOS DE PRODUCTO (PRODUCTO.HTML)
// Lee el parámetro ?id=TC001 de la URL y muestra el producto correspondiente
// -----------------------------------------------------------------------------
function cargarDatosProducto() {
  const elementoTitulo = document.getElementById('product-name');
  if (!elementoTitulo) return; // Si no estamos en producto.html, salimos

  // Leemos el id de la URL (?id=TC001)
  const parametros = new URLSearchParams(window.location.search);
  const idProducto = parametros.get('id') || 'TE001';

  // Buscamos el producto en nuestro arreglo
  const producto = LISTA_PRODUCTOS.find(p => p.codigo === idProducto) || LISTA_PRODUCTOS[0];

  // Rellenamos el título y etiquetas
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

  // Miniaturas de fotos
  const contenedorMiniaturas = document.getElementById('thumbnails-row');
  if (contenedorMiniaturas && producto.imagenes) {
    contenedorMiniaturas.innerHTML = '';
    producto.imagenes.forEach((url, index) => {
      const miniatura = document.createElement('div');
      miniatura.className = `thumbnail-item ${index === 0 ? 'active' : ''}`;
      miniatura.onclick = function() { cambiarFoto(url, this); };
      miniatura.innerHTML = `<img src="${url}" alt="Vista ${index + 1}">`;
      contenedorMiniaturas.appendChild(miniatura);
    });
  }

  // Opciones de tamaño adaptadas al precio base de cada producto
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

// -----------------------------------------------------------------------------
// 8. FUNCIÓN: DETALLE DEL PRODUCTO (Cantidad, personalización y botón comprar)
// -----------------------------------------------------------------------------
function inicializarDetalleProducto() {
  const btnRestar = document.getElementById('btn-restar');
  const btnSumar = document.getElementById('btn-sumar');
  const inputCantidad = document.getElementById('input-cantidad');
  const btnComprar = document.getElementById('btn-comprar-detalle');
  const selectTamano = document.getElementById('select-tamano');
  const elementoPrecio = document.getElementById('precio-torta');

  if (!btnComprar || !inputCantidad) return;

  // 1. Cambio de precio automático al elegir tamaño
  if (selectTamano && elementoPrecio) {
    selectTamano.addEventListener('change', () => {
      const opcion = selectTamano.options[selectTamano.selectedIndex];
      const precio = opcion.getAttribute('data-precio') || '55000';
      elementoPrecio.textContent = `$${parseInt(precio, 10).toLocaleString('es-CL')} CLP`;
    });
  }

  // 2. Botón para restar cantidad
  if (btnRestar) {
    btnRestar.addEventListener('click', () => {
      let valor = parseInt(inputCantidad.value, 10) || 1;
      if (valor > 1) {
        inputCantidad.value = valor - 1;
      }
    });
  }

  // 3. Botón para sumar cantidad
  if (btnSumar) {
    btnSumar.addEventListener('click', () => {
      let valor = parseInt(inputCantidad.value, 10) || 1;
      inputCantidad.value = valor + 1;
    });
  }

  // 4. Agregar al carrito desde la vista de detalle
  btnComprar.addEventListener('click', () => {
    const cantidad = parseInt(inputCantidad.value, 10) || 1;
    const forma = document.getElementById('select-forma') ? document.getElementById('select-forma').value : 'Circular';
    
    // Obtenemos el producto actual según la URL
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

    const productoDetalle = {
      codigo: productoActual.codigo,
      nombre: `${productoActual.nombre} (${forma}, ${tamano})`,
      precio: precio,
      cantidad: cantidad,
      personalizacion: mensaje ? `Mensaje: "${mensaje}"` : 'Sin dedicatoria'
    };

    agregarAlCarrito(productoDetalle);
    alert(`🧁 ¡Se agregaron ${cantidad} unidad(es) de "${productoDetalle.nombre}" a tu carrito!`);
  });
}

// -----------------------------------------------------------------------------
// 9. FUNCIÓN: CAMBIAR FOTO PRINCIPAL AL HACER CLIC EN MINIATURA
// -----------------------------------------------------------------------------
function cambiarFoto(nuevaSrc, elementoMiniatura) {
  const imagenGrande = document.getElementById('img-principal');
  if (imagenGrande) {
    imagenGrande.src = nuevaSrc;
  }

  if (elementoMiniatura) {
    const todasLasMiniaturas = document.querySelectorAll('.thumbnail-item');
    todasLasMiniaturas.forEach(miniatura => miniatura.classList.remove('active'));
    elementoMiniatura.classList.add('active');
  }
}

// -----------------------------------------------------------------------------
// 10. FUNCIÓN: FILTROS Y BUSCADOR DEL CATÁLOGO (CATEGORIA.HTML)
// -----------------------------------------------------------------------------
function inicializarFiltrosCatalogo() {
  const botonesFiltro = document.querySelectorAll('.filter-btn');
  const itemsCatalogo = document.querySelectorAll('.catalog-item');
  const buscador = document.getElementById('buscador-productos');
  const textoContador = document.getElementById('total-mostrados');

  if (itemsCatalogo.length === 0) return;

  function actualizarTotal() {
    let visibles = 0;
    itemsCatalogo.forEach(item => {
      if (item.style.display !== 'none') {
        visibles++;
      }
    });
    if (textoContador) {
      textoContador.textContent = `${visibles} producto(s) en catálogo`;
    }
  }

  botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
      botonesFiltro.forEach(b => b.classList.remove('active'));
      boton.classList.add('active');

      const categoriaSeleccionada = boton.getAttribute('data-categoria');
      if (buscador) buscador.value = '';

      itemsCatalogo.forEach(item => {
        const catItem = item.getAttribute('data-categoria');
        if (categoriaSeleccionada === 'todos' || catItem === categoriaSeleccionada) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });

      actualizarTotal();
    });
  });

  if (buscador) {
    buscador.addEventListener('input', () => {
      const texto = buscador.value.toLowerCase().trim();

      botonesFiltro.forEach(b => b.classList.remove('active'));
      const btnTodos = document.querySelector('.filter-btn[data-categoria="todos"]');
      if (btnTodos) btnTodos.classList.add('active');

      itemsCatalogo.forEach(item => {
        const nombre = item.querySelector('.catalog-item-title').textContent.toLowerCase();
        const descripcion = item.querySelector('.catalog-item-desc').textContent.toLowerCase();
        const codigo = (item.getAttribute('data-codigo') || '').toLowerCase();

        if (nombre.includes(texto) || descripcion.includes(texto) || codigo.includes(texto)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });

      actualizarTotal();
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    const botonCoincidente = document.querySelector(`.filter-btn[data-categoria="${catParam}"]`);
    if (botonCoincidente) {
      botonCoincidente.click();
    }
  }
}

// -----------------------------------------------------------------------------
// 11. FUNCIÓN: INICIALIZAR CARRITO (CARRITO.HTML)
// Lee el localStorage y muestra los productos en la página del carrito
// También calcula el total, aplica códigos de descuento y confirma pedido
// -----------------------------------------------------------------------------
function inicializarCarrito() {
  // Si no estamos en carrito.html, salimos (verificamos que exista el contenedor)
  const contenedor = document.getElementById('lista-items-carrito');
  if (!contenedor) return;

  // Variable que guarda el porcentaje de descuento aplicado (0 por defecto)
  let porcentajeDescuento = 0;

  // Llamamos a esta función para dibujar los productos en pantalla
  function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const divVacio = document.getElementById('carrito-vacio');

    // Limpiamos el contenedor antes de volver a dibujar
    contenedor.innerHTML = '';

    // Si el carrito está vacío, mostramos el mensaje y ocultamos el resumen
    if (carrito.length === 0) {
      if (divVacio) divVacio.style.display = 'block';
      actualizarResumen(0);
      return;
    }

    // Si hay productos, ocultamos el mensaje de vacío
    if (divVacio) divVacio.style.display = 'none';

    // Calculamos el subtotal sumando precio × cantidad de cada producto
    let subtotal = 0;
    for (let i = 0; i < carrito.length; i++) {
      subtotal += carrito[i].precio * carrito[i].cantidad;
    }

    // Creamos una fila HTML por cada producto en el carrito
    for (let i = 0; i < carrito.length; i++) {
      const item = carrito[i];
      const precioTotalItem = item.precio * item.cantidad;

      // Creamos el elemento HTML de la fila
      const fila = document.createElement('div');
      fila.className = 'cart-item';
      fila.innerHTML = `
        <div class="cart-item-img">🧁</div>
        <div class="cart-item-info">
          <p class="cart-item-name">${item.nombre}</p>
          <p class="cart-item-personalizacion">${item.personalizacion}</p>
          <p class="cart-item-cantidad">Cantidad: ${item.cantidad}</p>
        </div>
        <span class="cart-item-precio">$${precioTotalItem.toLocaleString('es-CL')} CLP</span>
        <button class="cart-item-eliminar" data-indice="${i}" aria-label="Eliminar producto">✕</button>
      `;

      contenedor.appendChild(fila);
    }

    // Activamos los botones de eliminar (uno por cada producto)
    const botonesEliminar = contenedor.querySelectorAll('.cart-item-eliminar');
    botonesEliminar.forEach(boton => {
      boton.addEventListener('click', () => {
        const indice = parseInt(boton.getAttribute('data-indice'), 10);
        const carritoActual = obtenerCarrito();
        carritoActual.splice(indice, 1); // Eliminamos ese producto del arreglo
        guardarCarrito(carritoActual);
        renderizarCarrito(); // Volvemos a dibujar la lista actualizada
      });
    });

    // Actualizamos el resumen con el subtotal calculado
    actualizarResumen(subtotal);
  }

  // Función que actualiza los valores del resumen (subtotal, descuento, total)
  function actualizarResumen(subtotal) {
    const ENVIO = 3500;

    // Calculamos el descuento en pesos
    const montoDescuento = Math.round(subtotal * (porcentajeDescuento / 100));
    const total = subtotal - montoDescuento + ENVIO;

    // Actualizamos los elementos del HTML
    const elemSubtotal = document.getElementById('resumen-subtotal');
    if (elemSubtotal) elemSubtotal.textContent = '$' + subtotal.toLocaleString('es-CL') + ' CLP';

    const elemTotal = document.getElementById('resumen-total');
    if (elemTotal) elemTotal.textContent = '$' + total.toLocaleString('es-CL') + ' CLP';

    // Mostramos u ocultamos la fila de descuento
    const filaDescuento = document.getElementById('fila-descuento');
    const elemDescuento = document.getElementById('resumen-descuento');
    if (porcentajeDescuento > 0 && filaDescuento && elemDescuento) {
      filaDescuento.style.display = 'flex';
      elemDescuento.textContent = '-$' + montoDescuento.toLocaleString('es-CL') + ' CLP';
    } else if (filaDescuento) {
      filaDescuento.style.display = 'none';
    }
  }

  // Botón "Aplicar" código de descuento
  const btnAplicar = document.getElementById('btn-aplicar-codigo');
  if (btnAplicar) {
    btnAplicar.addEventListener('click', () => {
      const inputCodigo = document.getElementById('input-codigo');
      const msgCodigo = document.getElementById('msg-codigo');
      const codigo = inputCodigo ? inputCodigo.value.trim().toUpperCase() : '';

      // Verificamos los códigos válidos
      if (codigo === 'FELICES50') {
        porcentajeDescuento = 10; // 10% de descuento
        if (msgCodigo) {
          msgCodigo.style.display = 'block';
          msgCodigo.style.color = '#6fcf6f';
          msgCodigo.textContent = '✓ Código aplicado: 10% de descuento por los 50 años';
        }
        const labelDesc = document.getElementById('label-descuento');
        if (labelDesc) labelDesc.textContent = 'Descuento FELICES50 (10%)';
      } else if (codigo === '') {
        if (msgCodigo) {
          msgCodigo.style.display = 'block';
          msgCodigo.style.color = '#ff8080';
          msgCodigo.textContent = 'Por favor ingresa un código.';
        }
      } else {
        if (msgCodigo) {
          msgCodigo.style.display = 'block';
          msgCodigo.style.color = '#ff8080';
          msgCodigo.textContent = '✗ Código inválido. Prueba con FELICES50.';
        }
        porcentajeDescuento = 0;
      }

      // Re-calculamos el resumen con el descuento actualizado
      const carrito = obtenerCarrito();
      let subtotal = 0;
      for (let i = 0; i < carrito.length; i++) {
        subtotal += carrito[i].precio * carrito[i].cantidad;
      }
      actualizarResumen(subtotal);
    });
  }

  // Botón "Confirmar Pedido"
  const btnConfirmar = document.getElementById('btn-confirmar');
  if (btnConfirmar) {
    btnConfirmar.addEventListener('click', () => {
      const carrito = obtenerCarrito();
      if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de confirmar.');
        return;
      }
      // Vaciamos el carrito del localStorage
      guardarCarrito([]);
      // Mostramos confirmación y redirigimos al inicio
      alert('🎉 ¡Pedido confirmado! Gracias por elegir Pastelería Mil Sabores. Te contactaremos pronto.');
      window.location.href = 'index.html';
    });
  }

  // Dibujamos el carrito al cargar la página
  renderizarCarrito();
}
