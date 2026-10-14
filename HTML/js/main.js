document.addEventListener('DOMContentLoaded', () => {
  iniciarMenuMovil();
  if (typeof actualizarContadorCarrito === 'function') actualizarContadorCarrito();
  if (typeof actualizarBarraUsuario === 'function') actualizarBarraUsuario();

  if (typeof activarBotonesAgregar === 'function') activarBotonesAgregar();
  if (typeof cargarDatosProducto === 'function') cargarDatosProducto();
  if (typeof inicializarDetalleProducto === 'function') inicializarDetalleProducto();
  if (typeof inicializarFiltrosCatalogo === 'function') inicializarFiltrosCatalogo();
  if (typeof inicializarComentariosProducto === 'function') inicializarComentariosProducto();

  if (typeof inicializarRegistro === 'function') inicializarRegistro();
  if (typeof inicializarLogin === 'function') inicializarLogin();
  if (typeof inicializarPerfil === 'function') inicializarPerfil();
  if (typeof inicializarSugerenciasPerfil === 'function') inicializarSugerenciasPerfil();

  if (typeof inicializarCarrito === 'function') inicializarCarrito();
  if (typeof inicializarBoleta === 'function') inicializarBoleta();
  if (typeof inicializarSeguimiento === 'function') inicializarSeguimiento();

  inicializarFormularioContacto();
  inicializarRecetasBlog();
});

function iniciarMenuMovil() {
  const botonMenu = document.querySelector('.menu-toggle');
  const menuNav = document.querySelector('nav');

  if (botonMenu && menuNav) {
    botonMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      menuNav.classList.toggle('nav-open');
    });

    const enlaces = menuNav.querySelectorAll('a');
    enlaces.forEach(enlace => {
      enlace.addEventListener('click', () => {
        menuNav.classList.remove('nav-open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!menuNav.contains(e.target) && !botonMenu.contains(e.target)) {
        menuNav.classList.remove('nav-open');
      }
    });
  }
}

function inicializarFormularioContacto() {
  const formulario = document.getElementById('form-contacto');
  if (!formulario) return;

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById('contacto-nombre').value.trim();
    const email = document.getElementById('contacto-email').value.trim();

    if (!nombre || !email) {
      alert('Por favor completa los campos obligatorios (*)');
      return;
    }

    alert(`Muchas gracias, ${nombre}. Tu consulta ha sido enviada con éxito. Te responderemos pronto a ${email}.`);
    formulario.reset();
  });
}

function inicializarRecetasBlog() {
  const lista = document.getElementById('lista-recetas-comunidad');
  const form = document.getElementById('form-receta-blog');
  if (!lista || !form) return;

  const recetasBase = [
    { 
      autor: 'Sofía Navarro (Gastronomía Duoc UC)', 
      titulo: 'Merengue suizo brillante y firme', 
      puntuacion: 'Dificultad Media', 
      contenido: 'Calentar las claras con el azúcar a baño maría hasta disolver los cristales antes de batir a velocidad máxima.' 
    }
  ];

  function renderRecetas() {
    lista.innerHTML = '';
    recetasBase.forEach(rec => {
      const item = document.createElement('div');
      item.style.cssText = 'padding: 1.2rem; border-radius: 10px; background: var(--bg-card-soft); border: 1px solid var(--border-subtle);';
      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; flex-wrap: wrap; gap: 0.5rem;">
          <h4 style="margin: 0; font-family: var(--font-serif); font-size: 1.1rem; color: var(--color-chocolate);">${rec.titulo}</h4>
          <span class="badge badge-gold" style="font-size: 0.72rem;">${rec.puntuacion}</span>
        </div>
        <p style="margin: 0.4rem 0; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.5;">${rec.contenido}</p>
        <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">Aporte de: ${rec.autor}</span>
      `;
      lista.appendChild(item);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const autor = document.getElementById('rec-autor').value.trim();
    const titulo = document.getElementById('rec-titulo').value.trim();
    const puntuacion = document.getElementById('rec-puntuacion').value;
    const contenido = document.getElementById('rec-contenido').value.trim();

    recetasBase.unshift({ autor: autor, titulo: titulo, puntuacion: puntuacion, contenido: contenido });
    renderRecetas();
    alert(`Gracias, ${autor}. Tu publicación fue añadida al blog.`);
    form.reset();
  });

  renderRecetas();
}
