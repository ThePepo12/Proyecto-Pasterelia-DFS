/**
 * BASE DE DATOS LOCAL Y RESPALDO (src/data/db.js)
 * 
 * Implementa la persistencia en localStorage para el funcionamiento offline,
 * respaldo cuando el backend no esté disponible y soporte para pruebas unitarias con Vitest.
 * Replica exactamente la misma estructura de datos y operaciones CRUD que el backend Spring Boot.
 */

const STORAGE_KEYS = {
  PRODUCTOS: 'pasteleria_db_productos',
  CATEGORIAS: 'pasteleria_db_categorias',
  USUARIOS: 'pasteleria_db_usuarios',
  ORDENES: 'pasteleria_db_ordenes',
  BLOGS: 'pasteleria_db_blogs'
};

const CATEGORIAS_INICIALES = [
  {
    id: 1,
    nombre: 'Tortas Cuadradas',
    descripcion: 'Bizcochos húmedos y rellenos artesanales en presentación cuadrada.',
    imagen: '/img/producto_TC001.avif'
  },
  {
    id: 2,
    nombre: 'Tortas Circulares',
    descripcion: 'El formato tradicional para cumpleaños y reuniones familiares.',
    imagen: '/img/producto_TT001.avif'
  },
  {
    id: 3,
    nombre: 'Postres Individuales',
    descripcion: 'Deliciosas porciones personales para deleitar en cualquier momento.',
    imagen: '/img/producto_PI001.jpg'
  },
  {
    id: 4,
    nombre: 'Productos Sin Azúcar',
    descripcion: 'Endulzados con ingredientes naturales para disfrutar sin culpa.',
    imagen: '/img/producto_PSA001.avif'
  },
  {
    id: 5,
    nombre: 'Pastelería Tradicional',
    descripcion: 'Recetas clásicas chilenas e internacionales con 50 años de historia.',
    imagen: '/img/producto_PT001.avif'
  },
  {
    id: 6,
    nombre: 'Productos Sin Gluten',
    descripcion: 'Preparaciones certificadas libres de gluten para personas celíacas.',
    imagen: '/img/producto_PSG001.avif'
  },
  {
    id: 7,
    nombre: 'Productos Veganos',
    descripcion: '100% libres de ingredientes de origen animal sin perder el sabor artesanal.',
    imagen: '/img/producto_PV001.avif'
  },
  {
    id: 8,
    nombre: 'Tortas Especiales',
    descripcion: 'Creaciones exclusivas para bodas, aniversarios y momentos inolvidables.',
    imagen: '/img/producto_TE001.avif'
  }
];

const PRODUCTOS_INICIALES = [
  {
    id: 1,
    codigo: 'TC001',
    categoriaId: 1,
    categoriaNombre: 'Tortas Cuadradas',
    nombre: 'Torta Cuadrada de Chocolate',
    precio: 45000,
    stock: 12,
    stockCritico: 5,
    enOferta: true,
    porcentajeDescuento: 10,
    descripcion: 'Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con dedicatoria.',
    imagen: '/img/producto_TC001.avif'
  },
  {
    id: 2,
    codigo: 'TC002',
    categoriaId: 1,
    categoriaNombre: 'Tortas Cuadradas',
    nombre: 'Torta Cuadrada de Frutas',
    precio: 50000,
    stock: 15,
    stockCritico: 5,
    enOferta: false,
    porcentajeDescuento: 0,
    descripcion: 'Mezcla de frutas frescas de la estación y crema chantilly sobre bizcocho de vainilla suave.',
    imagen: '/img/producto_TC002.avif'
  },
  {
    id: 3,
    codigo: 'TT001',
    categoriaId: 2,
    categoriaNombre: 'Tortas Circulares',
    nombre: 'Torta Circular de Vainilla',
    precio: 40000,
    stock: 20,
    stockCritico: 5,
    enOferta: true,
    porcentajeDescuento: 15,
    descripcion: 'Bizcocho de vainilla clásico relleno con crema pastelera y glaseado dulce tradicional.',
    imagen: '/img/producto_TT001.avif'
  },
  {
    id: 4,
    codigo: 'TT002',
    categoriaId: 2,
    categoriaNombre: 'Tortas Circulares',
    nombre: 'Torta Circular de Manjar',
    precio: 42000,
    stock: 14,
    stockCritico: 5,
    enOferta: false,
    porcentajeDescuento: 0,
    descripcion: 'Torta tradicional chilena con manjar artesanal de campo y nueces seleccionadas.',
    imagen: '/img/producto_TT002.avif'
  },
  {
    id: 5,
    codigo: 'PI001',
    categoriaId: 3,
    categoriaNombre: 'Postres Individuales',
    nombre: 'Mousse de Chocolate',
    precio: 5000,
    stock: 30,
    stockCritico: 5,
    enOferta: false,
    porcentajeDescuento: 0,
    descripcion: 'Postre individual cremoso y suave, hecho con chocolate belga 70% cacao.',
    imagen: '/img/producto_PI001.jpg'
  },
  {
    id: 6,
    codigo: 'PI002',
    categoriaId: 3,
    categoriaNombre: 'Postres Individuales',
    nombre: 'Tiramisú Clásico',
    precio: 5500,
    stock: 25,
    stockCritico: 5,
    enOferta: true,
    porcentajeDescuento: 20,
    descripcion: 'Receta italiana con capas de bizcocho empapado en café espresso, mascarpone y cacao fino.',
    imagen: '/img/producto_PI002.avif'
  },
  {
    id: 7,
    codigo: 'PSA001',
    categoriaId: 4,
    categoriaNombre: 'Productos Sin Azúcar',
    nombre: 'Torta Sin Azúcar de Naranja',
    precio: 48000,
    stock: 10,
    stockCritico: 5,
    enOferta: false,
    porcentajeDescuento: 0,
    descripcion: 'Torta ligera y aromática, endulzada naturalmente con alulosa y cítricos frescos.',
    imagen: '/img/producto_PSA001.avif'
  },
  {
    id: 8,
    codigo: 'PSA002',
    categoriaId: 4,
    categoriaNombre: 'Productos Sin Azúcar',
    nombre: 'Cheesecake Sin Azúcar',
    precio: 47000,
    stock: 4, // Producto Crítico (<= 5)
    stockCritico: 5,
    enOferta: true,
    porcentajeDescuento: 10,
    descripcion: 'Suave y cremoso sobre base de frutos secos tostados con mermelada de frutos rojos casera.',
    imagen: '/img/producto_PSA002.avif'
  },
  {
    id: 9,
    codigo: 'PT001',
    categoriaId: 5,
    categoriaNombre: 'Pastelería Tradicional',
    nombre: 'Empanada de Manzana',
    precio: 3000,
    stock: 40,
    stockCritico: 5,
    enOferta: false,
    porcentajeDescuento: 0,
    descripcion: 'Pastel tradicional relleno de manzanas especiadas con canela y masa hojaldrada crujiente.',
    imagen: '/img/producto_PT001.avif'
  },
  {
    id: 10,
    codigo: 'PT002',
    categoriaId: 5,
    categoriaNombre: 'Pastelería Tradicional',
    nombre: 'Tarta de Santiago',
    precio: 6000,
    stock: 3, // Producto Crítico (<= 5)
    stockCritico: 5,
    enOferta: false,
    porcentajeDescuento: 0,
    descripcion: 'Tarta tradicional de almendras seleccionadas, azúcar y huevos con la emblemática cruz de Santiago.',
    imagen: '/img/producto_PT002.avif'
  },
  {
    id: 11,
    codigo: 'PSG001',
    categoriaId: 6,
    categoriaNombre: 'Productos Sin Gluten',
    nombre: 'Brownie Sin Gluten',
    precio: 4000,
    stock: 22,
    stockCritico: 5,
    enOferta: false,
    porcentajeDescuento: 0,
    descripcion: 'Intenso brownie húmedo elaborado con harina de almendras certificada libre de gluten.',
    imagen: '/img/producto_PSG001.avif'
  },
  {
    id: 12,
    codigo: 'PSG002',
    categoriaId: 6,
    categoriaNombre: 'Productos Sin Gluten',
    nombre: 'Panqueque de Naranja Sin Gluten',
    precio: 45000,
    stock: 7,
    stockCritico: 5,
    enOferta: false,
    porcentajeDescuento: 0,
    descripcion: 'Finas capas de panqueque sin gluten rellenas de crema de naranja natural y decorado artesanal.',
    imagen: '/img/producto_PSG002.avif'
  },
  {
    id: 13,
    codigo: 'PV001',
    categoriaId: 7,
    categoriaNombre: 'Productos Veganos',
    nombre: 'Torta Vegana de Chocolate',
    precio: 50000,
    stock: 8,
    stockCritico: 5,
    enOferta: true,
    porcentajeDescuento: 15,
    descripcion: 'Torta 100% vegana con cacao orgánico, leche de avena y ganache de coco cremoso.',
    imagen: '/img/producto_PV001.avif'
  },
  {
    id: 14,
    codigo: 'PV002',
    categoriaId: 7,
    categoriaNombre: 'Productos Veganos',
    nombre: 'Galletas Veganas de Avena',
    precio: 4500,
    stock: 18,
    stockCritico: 5,
    enOferta: false,
    porcentajeDescuento: 0,
    descripcion: 'Galletas crujientes de avena integral con miel de agave, pasas rubias y semillas de girasol.',
    imagen: '/img/producto_PV002.avif'
  },
  {
    id: 15,
    codigo: 'TE001',
    categoriaId: 8,
    categoriaNombre: 'Tortas Especiales',
    nombre: 'Torta Especial de Cumpleaños',
    precio: 55000,
    stock: 6,
    stockCritico: 5,
    enOferta: false,
    porcentajeDescuento: 0,
    descripcion: 'Diseñada para celebraciones únicas. Doble relleno de manjar y chantilly con flores de azúcar.',
    imagen: '/img/producto_TE001.avif'
  },
  {
    id: 16,
    codigo: 'TE002',
    categoriaId: 8,
    categoriaNombre: 'Tortas Especiales',
    nombre: 'Torta Especial de Boda',
    precio: 60000,
    stock: 5, // Producto Crítico (<= 5)
    stockCritico: 5,
    enOferta: false,
    porcentajeDescuento: 0,
    descripcion: 'Elegante creación de varios pisos con detalles artesanales de glaseado real y flores comestibles.',
    imagen: '/img/producto_TE002.jpg'
  }
];

const USUARIOS_INICIALES = [
  {
    id: 1,
    nombre: 'Administrador Mil Sabores',
    email: 'admin@pasteleriamilsabores.cl',
    password: 'admin123',
    telefono: '+56 9 8765 4321',
    direccion: 'Casa Matriz, Av. Concha y Toro #1234, Puente Alto, Santiago',
    rol: 'ADMIN',
    edad: 42,
    descuentoSenior: false,
    esEstudianteDuoc: false
  },
  {
    id: 2,
    nombre: 'Rosa María Carrasco',
    email: 'rosa.carrasco@gmail.com',
    password: 'rosa123',
    telefono: '+56 9 7654 3210',
    direccion: 'Av. Concha y Toro #2500, depto 402, Puente Alto',
    fechaNacimiento: '1965-03-20',
    edad: 61,
    rol: 'CLIENTE',
    descuentoSenior: true, // +50 años = 50% descuento
    esEstudianteDuoc: false
  },
  {
    id: 3,
    nombre: 'Matías Albornoz',
    email: 'estudiante@duocuc.cl',
    password: 'duoc123',
    telefono: '+56 9 6543 2109',
    direccion: 'San Carlos de Apoquindo #2222, Las Condes',
    fechaNacimiento: '2002-08-14',
    edad: 24,
    rol: 'CLIENTE',
    descuentoSenior: false,
    esEstudianteDuoc: true // Duoc UC
  }
];

const ORDENES_INICIALES = [
  {
    id: 1,
    folio: 'MS-501991',
    fecha: '20/10/2026',
    hora: '10:15',
    subtotal: 55000,
    descuento: 27500,
    envio: 3500,
    iva: 5890,
    total: 31000,
    estado: 'Entregado',
    clienteNombre: 'Rosa María Carrasco',
    clienteEmail: 'rosa.carrasco@gmail.com',
    direccionEntrega: 'Av. Concha y Toro #2500, depto 402, Puente Alto, Región Metropolitana',
    usuario: { id: 2, nombre: 'Rosa María Carrasco', email: 'rosa.carrasco@gmail.com' },
    items: [
      {
        id: 1,
        codigoProducto: 'TE001',
        nombreProducto: 'Torta Especial de Cumpleaños (Circular, Mediana)',
        precioUnitario: 55000,
        cantidad: 1,
        subtotal: 55000,
        personalizacion: 'Mensaje: "¡Feliz Aniversario Mamá!"'
      }
    ]
  },
  {
    id: 2,
    folio: 'MS-501992',
    fecha: '21/10/2026',
    hora: '11:45',
    subtotal: 45000,
    descuento: 9000,
    envio: 3500,
    iva: 7505,
    total: 39500,
    estado: 'En preparación',
    clienteNombre: 'Matías Albornoz',
    clienteEmail: 'estudiante@duocuc.cl',
    direccionEntrega: 'San Carlos de Apoquindo #2222, Las Condes, Región Metropolitana',
    usuario: { id: 3, nombre: 'Matías Albornoz', email: 'estudiante@duocuc.cl' },
    items: [
      {
        id: 2,
        codigoProducto: 'TC001',
        nombreProducto: 'Torta Cuadrada de Chocolate (Cuadrada, Chica)',
        precioUnitario: 45000,
        cantidad: 1,
        subtotal: 45000,
        personalizacion: 'Sin dedicatoria'
      }
    ]
  },
  {
    id: 3,
    folio: 'MS-501993',
    fecha: '21/10/2026',
    hora: '12:30',
    subtotal: 10500,
    descuento: 1050,
    envio: 3500,
    iva: 2460,
    total: 12950,
    estado: 'Confirmado',
    clienteNombre: 'Cliente Invitado',
    clienteEmail: 'contacto@cliente.cl',
    direccionEntrega: 'Av. Providencia #1234, Providencia, Región Metropolitana',
    usuario: null,
    items: [
      {
        id: 3,
        codigoProducto: 'PI001',
        nombreProducto: 'Mousse de Chocolate',
        precioUnitario: 5000,
        cantidad: 1,
        subtotal: 5000,
        personalizacion: 'Individual'
      },
      {
        id: 4,
        codigoProducto: 'PI002',
        nombreProducto: 'Tiramisú Clásico',
        precioUnitario: 5500,
        cantidad: 1,
        subtotal: 5500,
        personalizacion: 'Individual'
      }
    ]
  }
];

const BLOGS_INICIALES = [
  {
    id: 1,
    titulo: 'Los 5 Secretos para un Hojaldre Perfecto',
    fecha: '15 de Octubre, 2026',
    autor: 'Maestro Pastelero Juan Pérez',
    resumen: 'Descubre la técnica de laminado, la temperatura exacta de la mantequilla y el reposo que transforman una masa simple en capas crujientes y livianas.',
    categoria: 'Técnicas y Consejos',
    imagen: '/img/producto_PT001.avif',
    contenido: [
      'El hojaldre es una de las preparaciones más nobles de la pastelería clásica. Su magia reside en atrapar finas capas de mantequilla entre láminas de masa que, al hornearse a alta temperatura, evaporan el agua generando el efecto hojaldrado.',
      'Secreto 1: La mantequilla y la masa deben tener exactamente la misma consistencia y temperatura plástica (entre 14°C y 16°C).',
      'Secreto 2: No apresurar los reposos en frío entre pliegues sencillos y dobles.',
      'Secreto 3: Cortar siempre con cuchillo muy afilado para no sellar los bordes del hojaldre antes del horneado.'
    ]
  },
  {
    id: 2,
    titulo: 'Tendencias en Repostería 2026: Menos Azúcar, Más Sabor',
    fecha: '18 de Octubre, 2026',
    autor: 'Chef Repostera Elena Morales',
    resumen: 'Cómo la pastelería moderna combina ingredientes naturales como alulosa, cacao puro de origen y harinas alternativas sin sacrificar la indulgencia.',
    categoria: 'Innovación',
    imagen: '/img/producto_PSA001.avif',
    contenido: [
      'Hoy nuestros clientes buscan equilibrar la salud familiar con el placer de celebrar con una rica torta. En Mil Sabores cumplimos 50 años adaptando nuestras recetas tradicionales.',
      'El uso de cítricos como la naranja y el limón ayuda a resaltar la dulzura natural reduciendo hasta en un 40% la necesidad de endulzantes.',
      'Las harinas de almendras y avena integral aportan notas tostadas y textura que enriquecen cualquier preparación vegana o libre de gluten.'
    ]
  }
];

function obtenerColeccion(key, defaults) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaults));
      return JSON.parse(JSON.stringify(defaults));
    }
    return JSON.parse(raw);
  } catch (e) {
    return JSON.parse(JSON.stringify(defaults));
  }
}

function guardarColeccion(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error guardando en localStorage [${key}]:`, e);
  }
}

export const db = {
  // Inicialización y reinicio
  init() {
    obtenerColeccion(STORAGE_KEYS.CATEGORIAS, CATEGORIAS_INICIALES);
    obtenerColeccion(STORAGE_KEYS.PRODUCTOS, PRODUCTOS_INICIALES);
    obtenerColeccion(STORAGE_KEYS.USUARIOS, USUARIOS_INICIALES);
    obtenerColeccion(STORAGE_KEYS.ORDENES, ORDENES_INICIALES);
    obtenerColeccion(STORAGE_KEYS.BLOGS, BLOGS_INICIALES);
  },

  reset() {
    localStorage.setItem(STORAGE_KEYS.CATEGORIAS, JSON.stringify(CATEGORIAS_INICIALES));
    localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(PRODUCTOS_INICIALES));
    localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(USUARIOS_INICIALES));
    localStorage.setItem(STORAGE_KEYS.ORDENES, JSON.stringify(ORDENES_INICIALES));
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(BLOGS_INICIALES));
  },

  // PRODUCTOS CRUD + CONSULTAS
  productos: {
    getAll() {
      return obtenerColeccion(STORAGE_KEYS.PRODUCTOS, PRODUCTOS_INICIALES);
    },
    getById(id) {
      const list = this.getAll();
      return list.find(p => String(p.id) === String(id)) || null;
    },
    getByCodigo(codigo) {
      const list = this.getAll();
      return list.find(p => p.codigo?.toLowerCase() === codigo?.toLowerCase()) || null;
    },
    getByCategoria(categoriaId) {
      const list = this.getAll();
      return list.filter(p => String(p.categoriaId) === String(categoriaId));
    },
    getOfertas() {
      const list = this.getAll();
      return list.filter(p => Boolean(p.enOferta));
    },
    getCriticos(limite = 5) {
      const list = this.getAll();
      return list.filter(p => (p.stock ?? 0) <= (p.stockCritico ?? limite));
    },
    create(data) {
      const list = this.getAll();
      const nuevoId = list.length > 0 ? Math.max(...list.map(p => Number(p.id) || 0)) + 1 : 1;
      const nuevo = { ...data, id: nuevoId };
      list.push(nuevo);
      guardarColeccion(STORAGE_KEYS.PRODUCTOS, list);
      return nuevo;
    },
    update(id, data) {
      const list = this.getAll();
      const index = list.findIndex(p => String(p.id) === String(id));
      if (index === -1) return null;
      list[index] = { ...list[index], ...data, id: Number(id) };
      guardarColeccion(STORAGE_KEYS.PRODUCTOS, list);
      return list[index];
    },
    delete(id) {
      const list = this.getAll();
      const filtered = list.filter(p => String(p.id) !== String(id));
      const removed = filtered.length < list.length;
      if (removed) {
        guardarColeccion(STORAGE_KEYS.PRODUCTOS, filtered);
      }
      return removed;
    }
  },

  // CATEGORIAS CRUD
  categorias: {
    getAll() {
      return obtenerColeccion(STORAGE_KEYS.CATEGORIAS, CATEGORIAS_INICIALES);
    },
    getById(id) {
      const list = this.getAll();
      return list.find(c => String(c.id) === String(id)) || null;
    },
    create(data) {
      const list = this.getAll();
      const nuevoId = list.length > 0 ? Math.max(...list.map(c => Number(c.id) || 0)) + 1 : 1;
      const nueva = { ...data, id: nuevoId };
      list.push(nueva);
      guardarColeccion(STORAGE_KEYS.CATEGORIAS, list);
      return nueva;
    },
    update(id, data) {
      const list = this.getAll();
      const index = list.findIndex(c => String(c.id) === String(id));
      if (index === -1) return null;
      list[index] = { ...list[index], ...data, id: Number(id) };
      guardarColeccion(STORAGE_KEYS.CATEGORIAS, list);
      return list[index];
    },
    delete(id) {
      const list = this.getAll();
      const filtered = list.filter(c => String(c.id) !== String(id));
      const removed = filtered.length < list.length;
      if (removed) {
        guardarColeccion(STORAGE_KEYS.CATEGORIAS, filtered);
      }
      return removed;
    }
  },

  // USUARIOS CRUD + LOGIN
  usuarios: {
    getAll() {
      return obtenerColeccion(STORAGE_KEYS.USUARIOS, USUARIOS_INICIALES);
    },
    getById(id) {
      const list = this.getAll();
      return list.find(u => String(u.id) === String(id)) || null;
    },
    getByEmail(email) {
      const list = this.getAll();
      return list.find(u => u.email?.trim().toLowerCase() === email?.trim().toLowerCase()) || null;
    },
    login(email, password) {
      const u = this.getByEmail(email);
      if (u && u.password === password) {
        const { password: _, ...seguro } = u;
        return seguro;
      }
      return null;
    },
    create(data) {
      const list = this.getAll();
      const nuevoId = list.length > 0 ? Math.max(...list.map(u => Number(u.id) || 0)) + 1 : 1;
      const nuevo = { ...data, id: nuevoId };
      list.push(nuevo);
      guardarColeccion(STORAGE_KEYS.USUARIOS, list);
      const { password: _, ...seguro } = nuevo;
      return seguro;
    },
    update(id, data) {
      const list = this.getAll();
      const index = list.findIndex(u => String(u.id) === String(id));
      if (index === -1) return null;
      list[index] = { ...list[index], ...data, id: Number(id) };
      guardarColeccion(STORAGE_KEYS.USUARIOS, list);
      const { password: _, ...seguro } = list[index];
      return seguro;
    },
    delete(id) {
      const list = this.getAll();
      const filtered = list.filter(u => String(u.id) !== String(id));
      const removed = filtered.length < list.length;
      if (removed) {
        guardarColeccion(STORAGE_KEYS.USUARIOS, filtered);
      }
      return removed;
    }
  },

  // ORDENES CRUD
  ordenes: {
    getAll() {
      return obtenerColeccion(STORAGE_KEYS.ORDENES, ORDENES_INICIALES);
    },
    getById(id) {
      const list = this.getAll();
      return list.find(o => String(o.id) === String(id)) || null;
    },
    getByFolio(folio) {
      const list = this.getAll();
      return list.find(o => o.folio?.toUpperCase() === folio?.toUpperCase()) || null;
    },
    getByUsuario(usuarioId) {
      const list = this.getAll();
      return list.filter(o => o.usuario && String(o.usuario.id) === String(usuarioId));
    },
    create(data) {
      const list = this.getAll();
      const nuevoId = list.length > 0 ? Math.max(...list.map(o => Number(o.id) || 0)) + 1 : 1;
      const folioGenerado = data.folio || `MS-${Math.floor(100000 + Math.random() * 900000)}`;
      const nueva = {
        ...data,
        id: nuevoId,
        folio: folioGenerado,
        fecha: data.fecha || new Date().toLocaleDateString('es-CL'),
        hora: data.hora || new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
        estado: data.estado || 'Confirmado'
      };

      // Rebajar stock de productos comprados
      if (Array.isArray(nueva.items)) {
        nueva.items.forEach(item => {
          const prod = db.productos.getByCodigo(item.codigoProducto);
          if (prod) {
            const nuevoStock = Math.max(0, (prod.stock || 0) - (item.cantidad || 1));
            db.productos.update(prod.id, { stock: nuevoStock });
          }
        });
      }

      list.unshift(nueva);
      guardarColeccion(STORAGE_KEYS.ORDENES, list);
      return nueva;
    },
    updateEstado(id, estado) {
      const list = this.getAll();
      const index = list.findIndex(o => String(o.id) === String(id));
      if (index === -1) return null;
      list[index].estado = estado;
      guardarColeccion(STORAGE_KEYS.ORDENES, list);
      return list[index];
    },
    delete(id) {
      const list = this.getAll();
      const filtered = list.filter(o => String(o.id) !== String(id));
      const removed = filtered.length < list.length;
      if (removed) {
        guardarColeccion(STORAGE_KEYS.ORDENES, filtered);
      }
      return removed;
    }
  },

  // REPORTES
  reportes: {
    getProductos() {
      const prods = db.productos.getAll();
      const totalProductos = prods.length;
      const stockTotalUnidades = prods.reduce((sum, p) => sum + (p.stock || 0), 0);
      const valorTotalInventarioClp = prods.reduce((sum, p) => sum + ((p.precio || 0) * (p.stock || 0)), 0);
      const productosCriticosCount = prods.filter(p => (p.stock || 0) <= (p.stockCritico || 5)).length;
      const productosEnOfertaCount = prods.filter(p => Boolean(p.enOferta)).length;

      return {
        totalProductos,
        stockTotalUnidades,
        valorTotalInventarioClp,
        productosCriticosCount,
        productosEnOfertaCount
      };
    },
    getGenerales() {
      const ords = db.ordenes.getAll();
      const ventasTotalesClp = ords.reduce((sum, o) => sum + (o.total || 0), 0);
      const cantidadOrdenes = ords.length;
      const usuariosRegistrados = db.usuarios.getAll().length;
      const ticketPromedioClp = cantidadOrdenes > 0 ? Math.round(ventasTotalesClp / cantidadOrdenes) : 0;

      return {
        ventasTotalesClp,
        cantidadOrdenes,
        usuariosRegistrados,
        ticketPromedioClp
      };
    }
  },

  // BLOGS
  blogs: {
    getAll() {
      return obtenerColeccion(STORAGE_KEYS.BLOGS, BLOGS_INICIALES);
    },
    getById(id) {
      const list = this.getAll();
      return list.find(b => String(b.id) === String(id)) || null;
    }
  }
};
