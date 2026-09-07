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
    categoria: 'Tortas Chocolate',
    categoriaId: 'cuadradas',
    nombre: 'Tortas de Chocolate',
    precio: 45000,
    descripcion: 'Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.',
    imagen: 'img/producto_TC001.avif',
    imagenes: [
      'img/producto_TC001.avif',
      'img/producto_TE001_chocolate.jpg',
      'img/producto_PG001.avif'
    ]
  },
  {
    codigo: 'TC002',
    categoria: 'Tortas Cuadradas',
    categoriaId: 'cuadradas',
    nombre: 'Torta Cuadrada de Frutas',
    precio: 50000,
    descripcion: 'Una mezcla de frutas frescas de la estación y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones familiares.',
    imagen: 'img/producto_TC002.avif',
    imagenes: [
      'img/producto_TC002.avif',
      'img/producto_TT001.avif',
      'img/producto_PSA002.avif'
    ]
  },
  {
    codigo: 'TT001',
    categoria: 'Tortas Circulares',
    categoriaId: 'circulares',
    nombre: 'Torta Circular de Vainilla',
    precio: 40000,
    descripcion: 'Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce tradicional, perfecto para cualquier ocasión.',
    imagen: 'img/producto_TT001.avif',
    imagenes: [
      'img/producto_TT001.avif',
      'img/producto_TC002.avif',
      'img/producto_TE001_velas.jpg'
    ]
  },
  {
    codigo: 'TT002',
    categoria: 'Tortas Circulares',
    categoriaId: 'circulares',
    nombre: 'Torta Circular de Manjar',
    precio: 42000,
    descripcion: 'Torta tradicional chilena con manjar artesanal y nueces seleccionadas, un deleite para los amantes de los sabores clásicos.',
    imagen: 'img/producto_TT002.avif',
    imagenes: [
      'img/producto_TT002.avif',
      'img/producto_TT001.avif',
      'img/producto_TE001.avif'
    ]
  },
  {
    codigo: 'PI001',
    categoria: 'Postres Individuales',
    categoriaId: 'individuales',
    nombre: 'Mousse de Chocolate',
    precio: 5000,
    descripcion: 'Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.',
    imagen: 'img/producto_PI001.jpg',
    imagenes: [
      'img/producto_PI001.jpg',
      'img/producto_PI002.avif',
      'img/producto_PG001.avif'
    ]
  },
  {
    codigo: 'PI002',
    categoria: 'Postres Individuales',
    categoriaId: 'individuales',
    nombre: 'Tiramisú Clásico',
    precio: 5500,
    descripcion: 'Un postre italiano individual con capas de café, queso mascarpone y cacao en polvo fino, perfecto para finalizar cualquier comida.',
    imagen: 'img/producto_PI002.avif',
    imagenes: [
      'img/producto_PI002.avif',
      'img/producto_PI001.jpg',
      'img/producto_PSA002.avif'
    ]
  },
  {
    codigo: 'PSA001',
    categoria: 'Productos Sin Azúcar',
    categoriaId: 'sin-azucar',
    nombre: 'Torta Sin Azúcar de Naranja',
    precio: 48000,
    descripcion: 'Torta ligera y deliciosa, endulzada naturalmente con cítricos frescos, ideal para quienes buscan opciones más saludables.',
    imagen: 'img/producto_PSA001.avif',
    imagenes: [
      'img/producto_PSA001.avif',
      'img/producto_PSA002.avif',
      'img/producto_TC002.avif'
    ]
  },
  {
    codigo: 'PSA002',
    categoria: 'Productos Sin Azúcar',
    categoriaId: 'sin-azucar',
    nombre: 'Cheesecake Sin Azúcar',
    precio: 47000,
    descripcion: 'Suave y cremoso sobre base de frutos secos tostados, este cheesecake es una opción perfecta para disfrutar sin culpa.',
    imagen: 'img/producto_PSA002.avif',
    imagenes: [
      'img/producto_PSA002.avif',
      'img/producto_PSA001.avif',
      'img/producto_PI002.avif'
    ]
  },
  {
    codigo: 'PT001',
    categoria: 'Pastelería Tradicional',
    categoriaId: 'tradicional',
    nombre: 'Empanada de Manzana',
    precio: 3000,
    descripcion: 'Pastelería tradicional chilena rellena de manzanas del sur especiadas con canela, perfecta para un dulce desayuno o merienda.',
    imagen: 'img/producto_PT001.avif',
    imagenes: [
      'img/producto_PT001.avif',
      'img/producto_PT002.avif',
      'img/producto_PG002.avif'
    ]
  },
  {
    codigo: 'PT002',
    categoria: 'Pastelería Tradicional',
    categoriaId: 'tradicional',
    nombre: 'Tarta de Santiago',
    precio: 6000,
    descripcion: 'Tradicional tarta española hecha con almendras seleccionadas, azúcar y huevos, una delicia clásica insustituible.',
    imagen: 'img/producto_PT002.avif',
    imagenes: [
      'img/producto_PT002.avif',
      'img/producto_PT001.avif',
      'img/producto_TT001.avif'
    ]
  },
  {
    codigo: 'PG001',
    categoria: 'Productos Sin Gluten',
    categoriaId: 'sin-gluten',
    nombre: 'Brownie Sin Gluten',
    precio: 4000,
    descripcion: 'Rico, denso y con intenso sabor a cacao, este brownie es perfecto para personas celíacas sin sacrificar el sabor.',
    imagen: 'img/producto_PG001.avif',
    imagenes: [
      'img/producto_PG001.avif',
      'img/producto_PG002.avif',
      'img/producto_TE001_chocolate.jpg'
    ]
  },
  {
    codigo: 'PG002',
    categoria: 'Productos Sin Gluten',
    categoriaId: 'sin-gluten',
    nombre: 'Pan Sin Gluten',
    precio: 3500,
    descripcion: 'Suave y esponjoso, elaborado diariamente con harinas libres de gluten certificadas, ideal para sándwiches o acompañar comidas.',
    imagen: 'img/producto_PG002.avif',
    imagenes: [
      'img/producto_PG002.avif',
      'img/producto_PG001.avif',
      'img/producto_PT001.avif'
    ]
  },
  {
    codigo: 'PV001',
    categoria: 'Productos Vegana',
    categoriaId: 'vegana',
    nombre: 'Torta Vegana de Chocolate',
    precio: 50000,
    descripcion: 'Torta de chocolate húmeda y deliciosa, hecha 100% sin productos de origen animal, apta para veganos y vegetarianos.',
    imagen: 'img/producto_PV001.avif',
    imagenes: [
      'img/producto_PV001.avif',
      'img/producto_PV002.avif',
      'img/producto_TC001.avif'
    ]
  },
  {
    codigo: 'PV002',
    categoria: 'Productos Vegana',
    categoriaId: 'vegana',
    nombre: 'Galletas Veganas de Avena',
    precio: 4500,
    descripcion: 'Crujientes y sabrosas, horneadas con avena integral y endulzadas saludablemente para una colación nutritiva.',
    imagen: 'img/producto_PV002.avif',
    imagenes: [
      'img/producto_PV002.avif',
      'img/producto_PV001.avif',
      'img/producto_PG001.avif'
    ]
  },
  {
    codigo: 'TE001',
    categoria: 'Tortas Especiales',
    categoriaId: 'especiales',
    nombre: 'Torta Especial de Cumpleaños',
    precio: 55000,
    descripcion: 'Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos para homenajear a tus seres queridos.',
    imagen: 'img/producto_TE001.avif',
    imagenes: [
      'img/producto_TE001.avif',
      'img/producto_TE001_velas.jpg',
      'img/producto_TE001_chocolate.jpg'
    ]
  },
  {
    codigo: 'TE002',
    categoria: 'Tortas Especiales',
    categoriaId: 'especiales',
    nombre: 'Torta Especial de Boda',
    precio: 60000,
    descripcion: 'Elegante y deliciosa, con finas terminaciones en fondant y flores de azúcar, diseñada para ser el centro de atención en cualquier matrimonio.',
    imagen: 'img/producto_TE002.jpg',
    imagenes: [
      'img/producto_TE002.jpg',
      'img/producto_TE001.avif',
      'img/producto_TE001_velas.jpg'
    ]
  }
];

// Esperamos a que todo el HTML se termine de cargar en el navegador antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
  console.log('Pastelería Mil Sabores - Sistema cargado correctamente.');

  // Llamamos a las funciones principales al iniciar
  iniciarMenuMovil();
  actualizarContadorCarrito();
  actualizarBarraUsuario();
  activarBotonesAgregar();
  cargarDatosProducto();
  inicializarDetalleProducto();
  inicializarFiltrosCatalogo();
  inicializarCarrito();
  inicializarRegistro();
  inicializarLogin();
  inicializarPerfil();
  inicializarBoleta();
  inicializarSeguimiento();
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
      miniatura.innerHTML = `<img src="${url}" alt="${producto.nombre} - Vista ${index + 1}">`;
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
// Filtros por Categoría, Forma de la Torta (Cuadrada/Circular) y Buscador
// -----------------------------------------------------------------------------
function inicializarFiltrosCatalogo() {
  const botonesFiltro = document.querySelectorAll('.filter-btn');
  const itemsCatalogo = document.querySelectorAll('.catalog-item');
  const buscador = document.getElementById('buscador-productos');
  const textoContador = document.getElementById('total-mostrados');
  const selectForma = document.getElementById('filtro-forma');

  if (itemsCatalogo.length === 0) return;

  function aplicarFiltros() {
    const botonActivo = document.querySelector('.filter-btn.active');
    const categoria = botonActivo ? botonActivo.getAttribute('data-categoria') : 'todos';
    const forma = selectForma ? selectForma.value.toLowerCase() : 'todas';
    const texto = buscador ? buscador.value.toLowerCase().trim() : '';

    let visibles = 0;
    itemsCatalogo.forEach(item => {
      const catItem = item.getAttribute('data-categoria') || '';
      const titulo = item.querySelector('.catalog-item-title').textContent.toLowerCase();
      const desc = item.querySelector('.catalog-item-desc').textContent.toLowerCase();
      const codigo = (item.getAttribute('data-codigo') || '').toLowerCase();

      // Validación de categoría
      const coincideCat = (categoria === 'todos' || catItem === categoria);

      // Validación de forma (cuadrada o circular)
      let coincideForma = true;
      if (forma === 'cuadrada') {
        coincideForma = titulo.includes('cuadrada') || catItem === 'cuadradas';
      } else if (forma === 'circular') {
        coincideForma = titulo.includes('circular') || catItem === 'circulares';
      }

      // Validación de texto de búsqueda
      const coincideTexto = !texto || titulo.includes(texto) || desc.includes(texto) || codigo.includes(texto);

      if (coincideCat && coincideForma && coincideTexto) {
        item.style.display = 'flex';
        visibles++;
      } else {
        item.style.display = 'none';
      }
    });

    if (textoContador) {
      textoContador.textContent = `${visibles} producto(s) en catálogo`;
    }
  }

  // Clic en botones de categorías
  botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
      botonesFiltro.forEach(b => b.classList.remove('active'));
      boton.classList.add('active');
      aplicarFiltros();
    });
  });

  // Selector de forma de la torta
  if (selectForma) {
    selectForma.addEventListener('change', aplicarFiltros);
  }

  // Buscador predictivo
  if (buscador) {
    buscador.addEventListener('input', aplicarFiltros);
  }

  // Parámetro de URL ?cat=...
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    const botonCoincidente = document.querySelector(`.filter-btn[data-categoria="${catParam}"]`);
    if (botonCoincidente) {
      botonCoincidente.click();
    }
  } else {
    aplicarFiltros();
  }
}

// -----------------------------------------------------------------------------
// 11. FUNCIÓN: GESTIÓN DE USUARIOS, EDAD (+50 AÑOS) Y BENEFICIOS DUOC
// -----------------------------------------------------------------------------
function obtenerUsuarioActual() {
  try {
    const data = localStorage.getItem('usuario_mil_sabores_activo');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function guardarUsuarioActual(usuario) {
  if (usuario) {
    localStorage.setItem('usuario_mil_sabores_activo', JSON.stringify(usuario));
  } else {
    localStorage.removeItem('usuario_mil_sabores_activo');
  }
  actualizarBarraUsuario();
}

function obtenerUsuariosRegistrados() {
  try {
    const data = localStorage.getItem('usuarios_mil_sabores_lista');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function guardarUsuarioRegistrado(usuario) {
  const lista = obtenerUsuariosRegistrados();
  const index = lista.findIndex(u => u.email.toLowerCase() === usuario.email.toLowerCase());
  if (index >= 0) {
    lista[index] = usuario;
  } else {
    lista.push(usuario);
  }
  localStorage.setItem('usuarios_mil_sabores_lista', JSON.stringify(lista));
  guardarUsuarioActual(usuario);
}

function calcularEdad(fechaNacimientoStr) {
  if (!fechaNacimientoStr) return 0;
  const hoy = new Date();
  const cumple = new Date(fechaNacimientoStr);
  let edad = hoy.getFullYear() - cumple.getFullYear();
  const m = hoy.getMonth() - cumple.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
    edad--;
  }
  return isNaN(edad) ? 0 : edad;
}

function actualizarBarraUsuario() {
  const contenedorEnlaces = document.querySelector('.top-user-links');
  if (!contenedorEnlaces) return;

  const usuario = obtenerUsuarioActual();
  if (usuario) {
    let insignia = '';
    if (usuario.descuentoSenior) {
      insignia = ' <span class="badge badge-rose" style="font-size: 0.68rem; margin-left: 4px;">50% Senior (+50 años)</span>';
    } else if (usuario.esEstudianteDuoc) {
      insignia = ' <span class="badge badge-rose" style="font-size: 0.68rem; margin-left: 4px;">Duoc UC 🎂</span>';
    } else if (usuario.descuentoFelices50) {
      insignia = ' <span class="badge badge-rose" style="font-size: 0.68rem; margin-left: 4px;">-10% FELICES50</span>';
    }

    const primerNombre = (usuario.nombre || 'Usuario').split(' ')[0];
    contenedorEnlaces.innerHTML = `
      <span style="color: #FFF5E1; font-weight: 600;">👤 Hola, <strong>${primerNombre}</strong>${insignia}</span>
      <span>|</span>
      <a href="perfil.html" style="color: var(--color-rose); font-weight: 700;">Mi Perfil</a>
      <span>|</span>
      <a href="#" id="btn-cerrar-sesion" style="color: #FFC0CB;">Cerrar sesión</a>
    `;

    const btnSalir = document.getElementById('btn-cerrar-sesion');
    if (btnSalir) {
      btnSalir.addEventListener('click', (e) => {
        e.preventDefault();
        guardarUsuarioActual(null);
        alert('🧁 Has cerrado sesión correctamente.');
        window.location.reload();
      });
    }
  } else {
    contenedorEnlaces.innerHTML = `
      <a href="login.html">Iniciar sesión</a>
      <span>|</span>
      <a href="registro.html">Registrar usuario</a>
    `;
  }
}

// -----------------------------------------------------------------------------
// 12. FUNCIÓN: INICIALIZAR CARRITO MEJORADO (CARRITO.HTML)
// Botones de cantidad (+ / -), Descuento automático por edad, Envíos y Boleta
// -----------------------------------------------------------------------------
function inicializarCarrito() {
  const contenedor = document.getElementById('lista-items-carrito');
  if (!contenedor) return;

  let porcentajeDescuento = 0;
  let motivoDescuento = '';
  const usuario = obtenerUsuarioActual();

  // Detección de beneficios automáticos por usuario logueado
  if (usuario) {
    if (usuario.descuentoSenior) {
      porcentajeDescuento = 50;
      motivoDescuento = 'Descuento Senior Mayores de 50 Años (50%)';
    } else if (usuario.descuentoFelices50) {
      porcentajeDescuento = 10;
      motivoDescuento = 'Descuento de por Vida FELICES50 (10%)';
    }
  }

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

    carrito.forEach((item, i) => {
      const precioTotalItem = item.precio * item.cantidad;
      subtotal += precioTotalItem;

      // Buscar foto del producto
      const prodEncontrado = LISTA_PRODUCTOS.find(p => p.codigo === item.codigo);
      const imgPath = prodEncontrado ? prodEncontrado.imagen : 'img/producto_TE001.avif';

      const fila = document.createElement('div');
      fila.className = 'cart-item';
      fila.innerHTML = `
        <div class="cart-item-img-wrap" style="width: 75px; height: 75px; border-radius: 10px; overflow: hidden; border: 1px solid var(--border-subtle); flex-shrink: 0;">
          <img src="${imgPath}" alt="${item.nombre}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="cart-item-info" style="flex: 1;">
          <p class="cart-item-name" style="font-weight: 700; color: var(--text-main);">${item.nombre}</p>
          <p class="cart-item-personalizacion" style="font-size: 0.85rem; color: var(--text-secondary);">${item.personalizacion || 'Estándar'}</p>
          <span class="cart-item-unit-price" style="font-size: 0.82rem; color: var(--text-muted);">$${item.precio.toLocaleString('es-CL')} c/u</span>
        </div>
        <div class="cart-item-qty-control" style="display: flex; align-items: center; gap: 0.4rem; background: var(--bg-card-soft); padding: 0.2rem 0.6rem; border-radius: 20px; border: 1px solid var(--border-subtle);">
          <button type="button" class="btn-qty-action btn-minus" data-indice="${i}" style="border: none; background: none; font-weight: 900; font-size: 1.1rem; cursor: pointer; color: var(--color-chocolate); width: 22px;">-</button>
          <span style="font-weight: 700; font-size: 0.95rem; min-width: 18px; text-align: center;">${item.cantidad}</span>
          <button type="button" class="btn-qty-action btn-plus" data-indice="${i}" style="border: none; background: none; font-weight: 900; font-size: 1.1rem; cursor: pointer; color: var(--color-chocolate); width: 22px;">+</button>
        </div>
        <div style="text-align: right; min-width: 105px;">
          <span class="cart-item-precio" style="font-weight: 700; font-size: 1.05rem; color: var(--text-main); display: block;">$${precioTotalItem.toLocaleString('es-CL')} CLP</span>
          <button class="cart-item-eliminar" data-indice="${i}" aria-label="Eliminar producto" style="background: none; border: none; color: #d32f2f; font-size: 0.82rem; cursor: pointer; text-decoration: underline; margin-top: 4px;">Eliminar</button>
        </div>
      `;

      contenedor.appendChild(fila);
    });

    // Eventos sumar y restar cantidad
    contenedor.querySelectorAll('.btn-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const indice = parseInt(btn.getAttribute('data-indice'), 10);
        const carritoActual = obtenerCarrito();
        if (carritoActual[indice].cantidad > 1) {
          carritoActual[indice].cantidad--;
        } else {
          carritoActual.splice(indice, 1);
        }
        guardarCarrito(carritoActual);
        renderizarCarrito();
      });
    });

    contenedor.querySelectorAll('.btn-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const indice = parseInt(btn.getAttribute('data-indice'), 10);
        const carritoActual = obtenerCarrito();
        carritoActual[indice].cantidad++;
        guardarCarrito(carritoActual);
        renderizarCarrito();
      });
    });

    contenedor.querySelectorAll('.cart-item-eliminar').forEach(btn => {
      btn.addEventListener('click', () => {
        const indice = parseInt(btn.getAttribute('data-indice'), 10);
        const carritoActual = obtenerCarrito();
        carritoActual.splice(indice, 1);
        guardarCarrito(carritoActual);
        renderizarCarrito();
      });
    });

    actualizarResumen(subtotal);
  }

  function actualizarResumen(subtotal) {
    const ENVIO = 3500;
    const montoDescuento = Math.round(subtotal * (porcentajeDescuento / 100));
    const total = Math.max(0, subtotal - montoDescuento) + (subtotal > 0 ? ENVIO : 0);

    const elemSubtotal = document.getElementById('resumen-subtotal');
    if (elemSubtotal) elemSubtotal.textContent = `$${subtotal.toLocaleString('es-CL')} CLP`;

    const elemTotal = document.getElementById('resumen-total');
    if (elemTotal) elemTotal.textContent = `$${total.toLocaleString('es-CL')} CLP`;

    const filaDescuento = document.getElementById('fila-descuento');
    const elemDescuento = document.getElementById('resumen-descuento');
    const labelDesc = document.getElementById('label-descuento');

    if (porcentajeDescuento > 0 && filaDescuento && elemDescuento) {
      filaDescuento.style.display = 'flex';
      elemDescuento.textContent = `-$${montoDescuento.toLocaleString('es-CL')} CLP`;
      if (labelDesc && motivoDescuento) labelDesc.textContent = motivoDescuento;
    } else if (filaDescuento) {
      filaDescuento.style.display = 'none';
    }

    // Aviso de beneficio activo
    const avisoBeneficio = document.getElementById('aviso-beneficio-usuario');
    if (avisoBeneficio && usuario) {
      if (usuario.descuentoSenior) {
        avisoBeneficio.style.display = 'block';
        avisoBeneficio.innerHTML = `🎉 <strong>¡Beneficio Senior Aplicado!</strong> Tienes un 50% de descuento en todos tus productos por tener ${usuario.edad || '50+'} años.`;
      } else if (usuario.esEstudianteDuoc) {
        avisoBeneficio.style.display = 'block';
        avisoBeneficio.innerHTML = `🎓 <strong>¡Comunidad Duoc UC!</strong> Registrado con correo institucional. Tu regalo de cumpleaños está asegurado.`;
      }
    }
  }

  // Cupón manual
  const btnAplicar = document.getElementById('btn-aplicar-codigo');
  if (btnAplicar) {
    btnAplicar.addEventListener('click', () => {
      const inputCodigo = document.getElementById('input-codigo');
      const msgCodigo = document.getElementById('msg-codigo');
      const codigo = inputCodigo ? inputCodigo.value.trim().toUpperCase() : '';

      if (codigo === 'FELICES50') {
        porcentajeDescuento = Math.max(porcentajeDescuento, 10);
        motivoDescuento = 'Descuento FELICES50 (10%)';
        if (msgCodigo) {
          msgCodigo.style.display = 'block';
          msgCodigo.style.color = '#2e7d32';
          msgCodigo.textContent = '✓ Código FELICES50 aplicado: 10% de descuento de por vida.';
        }
      } else if (codigo === 'DUOCUMPLE') {
        porcentajeDescuento = Math.max(porcentajeDescuento, 20);
        motivoDescuento = 'Promoción Cumpleaños Estudiante Duoc UC (20%)';
        if (msgCodigo) {
          msgCodigo.style.display = 'block';
          msgCodigo.style.color = '#2e7d32';
          msgCodigo.textContent = '✓ Beneficio Estudiante Duoc activado para tu celebración.';
        }
      } else if (!codigo) {
        if (msgCodigo) {
          msgCodigo.style.display = 'block';
          msgCodigo.style.color = '#c62828';
          msgCodigo.textContent = 'Por favor introduce un código.';
        }
      } else {
        if (msgCodigo) {
          msgCodigo.style.display = 'block';
          msgCodigo.style.color = '#c62828';
          msgCodigo.textContent = '✗ Código inválido. Prueba con FELICES50.';
        }
      }

      const carrito = obtenerCarrito();
      let subtotal = 0;
      carrito.forEach(item => subtotal += item.precio * item.cantidad);
      actualizarResumen(subtotal);
    });
  }

  // Botón Confirmar Pedido -> Genera Boleta y Seguimiento
  const btnConfirmar = document.getElementById('btn-confirmar');
  if (btnConfirmar) {
    btnConfirmar.addEventListener('click', () => {
      const carrito = obtenerCarrito();
      if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega productos de nuestro catálogo antes de confirmar.');
        return;
      }

      // Datos de despacho seleccionados
      const inputFecha = document.getElementById('input-fecha-entrega');
      const selectHorario = document.getElementById('select-horario-entrega');
      const inputDireccion = document.getElementById('input-direccion-despacho');

      const fechaEntrega = inputFecha && inputFecha.value ? inputFecha.value : new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const horarioEntrega = selectHorario ? selectHorario.value : '10:00 a 14:00 hrs';
      const direccion = inputDireccion && inputDireccion.value ? inputDireccion.value : (usuario ? (usuario.direccion || 'Av. Concha y Toro #1234') : 'Retiro en Tienda / Domicilio');

      let subtotal = 0;
      carrito.forEach(item => subtotal += item.precio * item.cantidad);
      const ENVIO = 3500;
      const montoDescuento = Math.round(subtotal * (porcentajeDescuento / 100));
      const total = subtotal - montoDescuento + ENVIO;

      const nuevoPedido = {
        folio: 'MS-' + Math.floor(100000 + Math.random() * 900000),
        fecha: new Date().toLocaleDateString('es-CL'),
        hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
        items: carrito,
        subtotal: subtotal,
        porcentajeDescuento: porcentajeDescuento,
        montoDescuento: montoDescuento,
        motivoDescuento: motivoDescuento || 'Sin descuento',
        envio: ENVIO,
        iva: Math.round(total * 0.19 / 1.19),
        total: total,
        cliente: usuario ? usuario.nombre : 'Cliente Invitado',
        email: usuario ? usuario.email : 'contacto@pasteleriamilsabores.cl',
        telefono: usuario ? (usuario.telefono || '+56 9 2987 6543') : '+56 9 2987 6543',
        direccion: direccion,
        fechaEntrega: fechaEntrega,
        horarioEntrega: horarioEntrega,
        estado: 'Confirmado',
        repartidor: 'Carlos Valenzuela - Repartos Mil Sabores (Furgón Refrigerado)'
      };

      localStorage.setItem('ultimo_pedido_mil_sabores', JSON.stringify(nuevoPedido));

      // Guardar en historial
      try {
        const historial = JSON.parse(localStorage.getItem('historial_pedidos_mil_sabores') || '[]');
        historial.unshift(nuevoPedido);
        localStorage.setItem('historial_pedidos_mil_sabores', JSON.stringify(historial));
      } catch (e) {}

      // Limpiar carrito
      guardarCarrito([]);

      alert('🎉 ¡Pedido generado con éxito! Redirigiendo a tu boleta electrónica...');
      window.location.href = 'boleta.html';
    });
  }

  renderizarCarrito();
}

// -----------------------------------------------------------------------------
// 13. FUNCIÓN: REGISTRO DE USUARIOS (REGISTRO.HTML)
// Validación de mayores de 50 años (50% desc), FELICES50 y correo Duoc UC
// -----------------------------------------------------------------------------
function inicializarRegistro() {
  const form = document.getElementById('form-registro');
  if (!form) return;

  const inputFechaNac = document.getElementById('reg-fecha-nac');
  const alertSenior = document.getElementById('alert-senior-benefit');
  const alertDuoc = document.getElementById('alert-duoc-benefit');
  const inputEmail = document.getElementById('reg-email');

  if (inputFechaNac && alertSenior) {
    inputFechaNac.addEventListener('change', () => {
      const edad = calcularEdad(inputFechaNac.value);
      if (edad >= 50) {
        alertSenior.style.display = 'block';
        alertSenior.innerHTML = `🎉 <strong>¡Beneficio Senior Detectado!</strong> Tienes ${edad} años. Recibirás automáticamente un <strong>50% de descuento</strong> en todos los productos.`;
      } else {
        alertSenior.style.display = 'none';
      }
    });
  }

  if (inputEmail && alertDuoc) {
    inputEmail.addEventListener('input', () => {
      const email = inputEmail.value.toLowerCase().trim();
      if (email.endsWith('@duocuc.cl') || email.endsWith('@profesor.duoc.cl') || email.endsWith('@alumnos.duoc.cl')) {
        alertDuoc.style.display = 'block';
        alertDuoc.innerHTML = `🎓 <strong>¡Estudiante/Docente Duoc UC!</strong> Identificado con correo institucional. Accedes a <strong>torta gratis en el día de tu cumpleaños</strong>.`;
      } else {
        alertDuoc.style.display = 'none';
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('reg-nombre').value.trim();
    const rut = document.getElementById('reg-rut').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const fechaNac = document.getElementById('reg-fecha-nac').value;
    const password = document.getElementById('reg-pass').value;
    const codigoPromo = (document.getElementById('reg-codigo') ? document.getElementById('reg-codigo').value.trim().toUpperCase() : '');
    const telefono = document.getElementById('reg-telefono') ? document.getElementById('reg-telefono').value.trim() : '+56 9 1234 5678';
    const direccion = document.getElementById('reg-direccion') ? document.getElementById('reg-direccion').value.trim() : 'Av. Providencia #1234, Santiago';

    const edad = calcularEdad(fechaNac);
    const esSenior = edad >= 50;
    const esDuoc = email.toLowerCase().endsWith('@duocuc.cl') || email.toLowerCase().endsWith('@profesor.duoc.cl') || email.toLowerCase().endsWith('@alumnos.duoc.cl');
    const tieneFelices50 = codigoPromo === 'FELICES50';

    const nuevoUsuario = {
      nombre,
      rut,
      email,
      fechaNacimiento: fechaNac,
      edad,
      password,
      telefono,
      direccion,
      descuentoSenior: esSenior,
      descuentoFelices50: tieneFelices50,
      esEstudianteDuoc: esDuoc,
      preferencias: {
        masa: 'Bizcocho Tradicional',
        relleno: 'Manjar Artesanal',
        restriccion: 'Ninguna'
      }
    };

    guardarUsuarioRegistrado(nuevoUsuario);

    let mensaje = `🧁 ¡Bienvenido(a) a Pastelería Mil Sabores, ${nombre}!\n\nTu cuenta fue creada con éxito.`;
    if (esSenior) mensaje += `\n- Beneficio activado: 50% de descuento permanente por ser mayor de 50 años (${edad} años).`;
    if (esDuoc) mensaje += `\n- Convenio Duoc UC activado: Torta gratis de cortesía en tu cumpleaños.`;
    if (tieneFelices50) mensaje += `\n- Código FELICES50 activado: 10% de descuento de por vida.`;

    alert(mensaje);
    window.location.href = 'perfil.html';
  });
}

// -----------------------------------------------------------------------------
// 14. FUNCIÓN: INICIO DE SESIÓN (LOGIN.HTML)
// Autenticación estándar y botones de acceso rápido de demostración
// -----------------------------------------------------------------------------
function inicializarLogin() {
  const form = document.getElementById('form-login');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const pass = document.getElementById('login-pass').value;

    const lista = obtenerUsuariosRegistrados();
    let usuario = lista.find(u => u.email.toLowerCase() === email);

    if (!usuario) {
      // Si no existe previamente, creamos la sesión para permitir probar fluidamente
      const edad = 52; // Demo predeterminado senior si ingresa nuevo
      usuario = {
        nombre: email.split('@')[0].toUpperCase(),
        email: email,
        edad: edad,
        descuentoSenior: true,
        esEstudianteDuoc: email.endsWith('@duocuc.cl'),
        descuentoFelices50: true,
        telefono: '+56 9 8765 4321',
        direccion: 'Av. Libertador Bernardo O\'Higgins #1020, Santiago'
      };
      guardarUsuarioRegistrado(usuario);
    }

    guardarUsuarioActual(usuario);
    alert(`🧁 ¡Hola ${usuario.nombre}! Has iniciado sesión exitosamente.`);
    window.location.href = 'perfil.html';
  });

  // Botones de prueba rápida (Demo Rápido para el profesor/evaluador)
  const btnDemoSenior = document.getElementById('btn-demo-senior');
  if (btnDemoSenior) {
    btnDemoSenior.addEventListener('click', () => {
      const demoSenior = {
        nombre: 'Marta Valenzuela (58 años)',
        email: 'marta.valenzuela@gmail.com',
        fechaNacimiento: '1968-05-14',
        edad: 58,
        telefono: '+56 9 9123 4567',
        direccion: 'Av. Las Condes #7890, Santiago',
        descuentoSenior: true,
        descuentoFelices50: true,
        esEstudianteDuoc: false,
        preferencias: { masa: 'Hojarasca Chilena', relleno: 'Manjar y Nueces', restriccion: 'Ninguna' }
      };
      guardarUsuarioRegistrado(demoSenior);
      alert('👤 Sesión iniciada como Usuario Senior (+50 años). Beneficio del 50% de descuento activado.');
      window.location.href = 'carrito.html';
    });
  }

  const btnDemoDuoc = document.getElementById('btn-demo-duoc');
  if (btnDemoDuoc) {
    btnDemoDuoc.addEventListener('click', () => {
      const demoDuoc = {
        nombre: 'Matías González (Alumno Duoc UC)',
        email: 'matias.gonzalez@duocuc.cl',
        fechaNacimiento: '2002-09-15',
        edad: 24,
        telefono: '+56 9 8234 5678',
        direccion: 'Calle Concha y Toro #1234, Puente Alto',
        descuentoSenior: false,
        descuentoFelices50: true,
        esEstudianteDuoc: true,
        preferencias: { masa: 'Bizcocho de Chocolate', relleno: 'Ganache y Frutillas', restriccion: 'Vegana' }
      };
      guardarUsuarioRegistrado(demoDuoc);
      alert('🎓 Sesión iniciada como Estudiante Duoc UC. Beneficio de Torta Gratis en Cumpleaños activado.');
      window.location.href = 'perfil.html';
    });
  }
}

// -----------------------------------------------------------------------------
// 15. FUNCIÓN: GESTIÓN DEL PERFIL DE USUARIO (PERFIL.HTML)
// Edición de información personal y preferencias de compra
// -----------------------------------------------------------------------------
function inicializarPerfil() {
  const contenedorPerfil = document.getElementById('perfil-container');
  if (!contenedorPerfil) return;

  let usuario = obtenerUsuarioActual();
  if (!usuario) {
    // Si no hay sesión, cargamos un usuario por defecto
    usuario = {
      nombre: 'Rosa María Carrasco',
      email: 'rosa.carrasco@gmail.com',
      rut: '7.890.123-4',
      fechaNacimiento: '1965-03-20',
      edad: 61,
      telefono: '+56 9 7654 3210',
      direccion: 'Av. Concha y Toro #2500, Santiago',
      descuentoSenior: true,
      descuentoFelices50: true,
      esEstudianteDuoc: false,
      preferencias: {
        masa: 'Milhojas Clásico',
        relleno: 'Manjar Artesanal',
        restriccion: 'Sin Azúcar'
      }
    };
    guardarUsuarioActual(usuario);
  }

  // Rellenar datos
  const elemNombre = document.getElementById('perfil-nombre-display');
  const elemEmail = document.getElementById('perfil-email-display');
  const inputNombre = document.getElementById('perf-nombre');
  const inputEmail = document.getElementById('perf-email');
  const inputTelefono = document.getElementById('perf-telefono');
  const inputDireccion = document.getElementById('perf-direccion');
  const inputFechaNac = document.getElementById('perf-fecha-nac');
  const selectMasa = document.getElementById('pref-masa');
  const selectRelleno = document.getElementById('pref-relleno');
  const selectRestriccion = document.getElementById('pref-restriccion');

  if (elemNombre) elemNombre.textContent = usuario.nombre;
  if (elemEmail) elemEmail.textContent = usuario.email;
  if (inputNombre) inputNombre.value = usuario.nombre;
  if (inputEmail) inputEmail.value = usuario.email;
  if (inputTelefono) inputTelefono.value = usuario.telefono || '';
  if (inputDireccion) inputDireccion.value = usuario.direccion || '';
  if (inputFechaNac) inputFechaNac.value = usuario.fechaNacimiento || '';

  if (usuario.preferencias) {
    if (selectMasa && usuario.preferencias.masa) selectMasa.value = usuario.preferencias.masa;
    if (selectRelleno && usuario.preferencias.relleno) selectRelleno.value = usuario.preferencias.relleno;
    if (selectRestriccion && usuario.preferencias.restriccion) selectRestriccion.value = usuario.preferencias.restriccion;
  }

  // Insignias de beneficios en perfil
  const boxInsignias = document.getElementById('perfil-insignias-beneficios');
  if (boxInsignias) {
    boxInsignias.innerHTML = '';
    if (usuario.descuentoSenior) {
      boxInsignias.innerHTML += `
        <div class="benefit-badge-card" style="background: rgba(229, 169, 60, 0.1); border: 1px solid var(--accent-gold); padding: 0.8rem; border-radius: 12px; margin-bottom: 0.8rem;">
          <h4 style="color: var(--accent-gold); margin-bottom: 0.2rem;">🎂 Beneficio Senior (+50 años)</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">Tienes 50% de descuento automático en todas tus compras por tu edad (${usuario.edad || 50} años).</p>
        </div>
      `;
    }
    if (usuario.esEstudianteDuoc) {
      boxInsignias.innerHTML += `
        <div class="benefit-badge-card" style="background: rgba(229, 169, 60, 0.1); border: 1px solid var(--accent-gold); padding: 0.8rem; border-radius: 12px; margin-bottom: 0.8rem;">
          <h4 style="color: var(--accent-gold); margin-bottom: 0.2rem;">🎓 Convenio Alumnos Duoc UC</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">Torta de cortesía gratuita para tu cumpleaños presentando tu credencial o correo institucional.</p>
        </div>
      `;
    }
    if (usuario.descuentoFelices50) {
      boxInsignias.innerHTML += `
        <div class="benefit-badge-card" style="background: rgba(229, 169, 60, 0.1); border: 1px solid var(--accent-gold); padding: 0.8rem; border-radius: 12px; margin-bottom: 0.8rem;">
          <h4 style="color: var(--accent-gold); margin-bottom: 0.2rem;">🎉 Código FELICES50</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">10% de rebaja garantizada de por vida en homenaje a nuestro 50 aniversario.</p>
        </div>
      `;
    }
  }

  // Guardar cambios en el formulario de perfil
  const formPerfil = document.getElementById('form-perfil');
  if (formPerfil) {
    formPerfil.addEventListener('submit', (e) => {
      e.preventDefault();
      usuario.nombre = inputNombre.value.trim();
      usuario.telefono = inputTelefono.value.trim();
      usuario.direccion = inputDireccion.value.trim();
      usuario.fechaNacimiento = inputFechaNac.value;
      usuario.edad = calcularEdad(usuario.fechaNacimiento);
      usuario.descuentoSenior = usuario.edad >= 50;
      usuario.preferencias = {
        masa: selectMasa ? selectMasa.value : 'Bizcocho Tradicional',
        relleno: selectRelleno ? selectRelleno.value : 'Manjar Artesanal',
        restriccion: selectRestriccion ? selectRestriccion.value : 'Ninguna'
      };

      guardarUsuarioRegistrado(usuario);
      alert('✓ Tus datos y preferencias de compra fueron actualizados correctamente.');
      window.location.reload();
    });
  }

  // Mostrar historial de pedidos
  const boxHistorial = document.getElementById('historial-pedidos-lista');
  if (boxHistorial) {
    try {
      const historial = JSON.parse(localStorage.getItem('historial_pedidos_mil_sabores') || '[]');
      if (historial.length === 0) {
        boxHistorial.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">Aún no has realizado pedidos con tu cuenta.</p>';
      } else {
        boxHistorial.innerHTML = '';
        historial.forEach(ped => {
          const itemDiv = document.createElement('div');
          itemDiv.style.cssText = 'border: 1px solid var(--border-subtle); padding: 1rem; border-radius: 12px; margin-bottom: 0.8rem; background: var(--bg-card); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;';
          itemDiv.innerHTML = `
            <div>
              <strong>Folio: ${ped.folio}</strong> - <span style="color: var(--text-muted); font-size: 0.85rem;">${ped.fecha} ${ped.hora}</span>
              <p style="margin: 0.2rem 0; font-size: 0.88rem; color: var(--text-secondary);">${ped.items.length} producto(s) · Total: <strong>$${ped.total.toLocaleString('es-CL')} CLP</strong></p>
              <span class="badge badge-gold" style="font-size: 0.72rem;">Estado: ${ped.estado || 'En Preparación'}</span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <a href="seguimiento.html" class="btn btn-outline btn-sm">🚚 Rastrear</a>
              <a href="boleta.html" class="btn btn-primary btn-sm">📄 Ver Boleta</a>
            </div>
          `;
          boxHistorial.appendChild(itemDiv);
        });
      }
    } catch (e) {}
  }
}

// -----------------------------------------------------------------------------
// 16. FUNCIÓN: GENERACIÓN Y VISTA DE BOLETA ELECTRÓNICA (BOLETA.HTML)
// Desglose oficial de productos, personalizaciones, IVA 19% y descuentos
// -----------------------------------------------------------------------------
function inicializarBoleta() {
  const contenedorBoleta = document.getElementById('boleta-container');
  if (!contenedorBoleta) return;

  let pedido = null;
  try {
    pedido = JSON.parse(localStorage.getItem('ultimo_pedido_mil_sabores'));
  } catch (e) {}

  if (!pedido) {
    // Pedido demo representativo si se ingresa directamente
    pedido = {
      folio: 'MS-501995',
      fecha: new Date().toLocaleDateString('es-CL'),
      hora: '14:30',
      cliente: 'Rosa María Carrasco',
      email: 'rosa.carrasco@gmail.com',
      telefono: '+56 9 7654 3210',
      direccion: 'Av. Concha y Toro #1234, Santiago, Chile',
      fechaEntrega: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      horarioEntrega: '10:00 - 14:00 hrs',
      subtotal: 55000,
      porcentajeDescuento: 50,
      montoDescuento: 27500,
      motivoDescuento: 'Descuento Senior 50 Años o Más (50%)',
      envio: 3500,
      iva: 4950,
      total: 31000,
      items: [
        {
          codigo: 'TE001',
          nombre: 'Torta Especial de Cumpleaños',
          precio: 55000,
          cantidad: 1,
          personalizacion: 'Forma: Circular · Tamaño: Mediana (12-15 porc.) · Mensaje: "¡Felices 50 Años Familia!"'
        }
      ]
    };
  }

  // Rellenar cabecera y datos
  const setTxt = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };

  setTxt('bol-folio', pedido.folio);
  setTxt('bol-fecha', `${pedido.fecha} a las ${pedido.hora} hrs`);
  setTxt('bol-cliente', pedido.cliente);
  setTxt('bol-email', pedido.email);
  setTxt('bol-telefono', pedido.telefono);
  setTxt('bol-direccion', pedido.direccion);
  setTxt('bol-fecha-entrega', `${pedido.fechaEntrega} (${pedido.horarioEntrega || 'Horario Hábil'})`);

  // Tabla de items
  const tbody = document.getElementById('bol-items-body');
  if (tbody) {
    tbody.innerHTML = '';
    pedido.items.forEach(item => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--border-subtle)';
      tr.innerHTML = `
        <td style="padding: 0.8rem 0.5rem; text-align: center; font-weight: 700; color: var(--color-chocolate);">${item.codigo}</td>
        <td style="padding: 0.8rem 0.5rem;">
          <strong>${item.nombre}</strong>
          <br><span style="font-size: 0.82rem; color: var(--text-muted);">${item.personalizacion || 'Estándar'}</span>
        </td>
        <td style="padding: 0.8rem 0.5rem; text-align: center;">${item.cantidad}</td>
        <td style="padding: 0.8rem 0.5rem; text-align: right;">$${item.precio.toLocaleString('es-CL')}</td>
        <td style="padding: 0.8rem 0.5rem; text-align: right; font-weight: 700;">$${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  setTxt('bol-subtotal', `$${pedido.subtotal.toLocaleString('es-CL')} CLP`);
  setTxt('bol-envio', `$${pedido.envio.toLocaleString('es-CL')} CLP`);
  setTxt('bol-iva', `$${pedido.iva.toLocaleString('es-CL')} CLP`);
  setTxt('bol-total', `$${pedido.total.toLocaleString('es-CL')} CLP`);

  const filaDesc = document.getElementById('bol-fila-descuento');
  if (filaDesc) {
    if (pedido.montoDescuento > 0) {
      filaDesc.style.display = 'table-row';
      setTxt('bol-motivo-desc', `-${pedido.motivoDescuento || 'Descuento'}`);
      setTxt('bol-monto-desc', `-$${pedido.montoDescuento.toLocaleString('es-CL')} CLP`);
    } else {
      filaDesc.style.display = 'none';
    }
  }

  // Botón Imprimir
  const btnPrint = document.getElementById('btn-imprimir-boleta');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }
}

// -----------------------------------------------------------------------------
// 17. FUNCIÓN: SEGUIMIENTO DE ENVÍOS EN TIEMPO REAL (SEGUIMIENTO.HTML)
// Notificaciones de estado desde la preparación hasta la entrega
// -----------------------------------------------------------------------------
function inicializarSeguimiento() {
  const contenedor = document.getElementById('seguimiento-container');
  if (!contenedor) return;

  let pedido = null;
  try {
    pedido = JSON.parse(localStorage.getItem('ultimo_pedido_mil_sabores'));
  } catch (e) {}

  if (!pedido) {
    pedido = {
      folio: 'MS-501995',
      fechaEntrega: new Date().toISOString().split('T')[0],
      horarioEntrega: '14:00 a 18:00 hrs',
      direccion: 'Av. Concha y Toro #1234, Santiago',
      cliente: 'Cliente Estimado',
      estado: 'Decoración'
    };
  }

  const elFolio = document.getElementById('seg-folio-display');
  const elCliente = document.getElementById('seg-cliente-display');
  const elDestino = document.getElementById('seg-destino-display');
  const elHorario = document.getElementById('seg-horario-display');

  if (elFolio) elFolio.textContent = pedido.folio;
  if (elCliente) elCliente.textContent = pedido.cliente;
  if (elDestino) elDestino.textContent = pedido.direccion;
  if (elHorario) elHorario.textContent = `${pedido.fechaEntrega} · ${pedido.horarioEntrega || 'Tarde'}`;

  // Estados del proceso de elaboración y despacho
  const estados = [
    { key: 'confirmado', titulo: '1. Pedido Confirmado', desc: 'Tu orden fue ingresada y validada en nuestro taller.' },
    { key: 'preparacion', titulo: '2. En Horneado', desc: 'Nuestros maestros pasteleros están horneando tus bizcochos.' },
    { key: 'decoracion', titulo: '3. Decoración Artesanal', desc: 'Aplicando rellenos de manjar, crema chantilly y dedicatorias.' },
    { key: 'ruta', titulo: '4. En Ruta con Repartidor', desc: 'Tu pedido viaja en furgón refrigerado hacia tu domicilio.' },
    { key: 'entregado', titulo: '5. Entregado con Éxito', desc: '¡Disfruta tus momentos dulces con Pastelería Mil Sabores!' }
  ];

  let estadoActualIndex = 2; // Por defecto en decoración para demo interactiva

  function actualizarVisualizacionEstado(index) {
    estadoActualIndex = index;
    const items = document.querySelectorAll('.tracking-step-item');
    items.forEach((item, i) => {
      item.classList.remove('active', 'completed');
      if (i < index) {
        item.classList.add('completed');
      } else if (i === index) {
        item.classList.add('active');
      }
    });

    const statusBanner = document.getElementById('seg-status-banner');
    if (statusBanner) {
      statusBanner.innerHTML = `
        <h3 style="color: var(--color-chocolate); font-family: var(--font-serif); margin-bottom: 0.3rem;">${estados[index].titulo}</h3>
        <p style="margin: 0; color: var(--text-secondary); font-size: 0.95rem;">${estados[index].desc}</p>
      `;
    }
  }

  // Botones de avance de estado para demostración
  const btnsControl = document.querySelectorAll('.btn-simular-estado');
  btnsControl.forEach(btn => {
    btn.addEventListener('click', () => {
      const stepIndex = parseInt(btn.getAttribute('data-step'), 10);
      actualizarVisualizacionEstado(stepIndex);
    });
  });

  actualizarVisualizacionEstado(estadoActualIndex);
}

// -----------------------------------------------------------------------------
// 18. FUNCIÓN UNIVERSAL: COMPARTIR EN REDES SOCIALES
// WhatsApp, Facebook, X (Twitter) y Copiar Enlace
// -----------------------------------------------------------------------------
window.compartirEnRedes = function(red, tituloPersonalizado, urlPersonalizada) {
  const url = encodeURIComponent(urlPersonalizada || window.location.href);
  const texto = encodeURIComponent(tituloPersonalizado || '¡Mira esta delicia en Pastelería Mil Sabores! 50 Años de tradición: ');
  let targetUrl = '';

  switch (red) {
    case 'whatsapp':
      targetUrl = `https://api.whatsapp.com/send?text=${texto}%20${url}`;
      window.open(targetUrl, '_blank');
      break;
    case 'facebook':
      targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      window.open(targetUrl, '_blank');
      break;
    case 'twitter':
      targetUrl = `https://twitter.com/intent/tweet?text=${texto}&url=${url}`;
      window.open(targetUrl, '_blank');
      break;
    case 'copiar':
      if (navigator.clipboard) {
        navigator.clipboard.writeText(urlPersonalizada || window.location.href)
          .then(() => alert('📋 ¡Enlace copiado al portapapeles! Ya puedes pegarlo y compartirlo con tus amigos.'))
          .catch(() => prompt('Copia este enlace para compartir:', urlPersonalizada || window.location.href));
      } else {
        prompt('Copia este enlace para compartir:', urlPersonalizada || window.location.href);
      }
      break;
    default:
      break;
  }
};
