/* ==============================
   BARRA DE NAVEGACIÓN
   ============================== */
const nav = document.querySelector('nav');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navAnchors = document.querySelectorAll('.nav-links a');

// Toggle del menú móvil
menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.textContent = open ? '✕' : '☰';
  menuToggle.setAttribute('aria-expanded', open);
});

// Cerrar menú al hacer clic en un link
navAnchors.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.textContent = '☰';
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Encoger nav al scrollear
function handleNavScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', handleNavScroll, { passive: true });

// Link activo según la sección visible (IntersectionObserver)
const sections = document.querySelectorAll('section[id]');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });

sections.forEach(s => navObserver.observe(s));

/* ==============================
   REVELACIÓN AL SCROLL
   ============================== */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ==============================
   CARGA DIFERIDA DE GALERÍA (lazy loading con data-src)
   ============================== */
const galleryObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const src = el.dataset.src;
      if (src) {
        el.style.backgroundImage = `url(${src})`;
        delete el.dataset.src;
      }
      galleryObserver.unobserve(el);
    }
  });
}, { rootMargin: '200px' });

document.querySelectorAll('.gallery-item[data-src]').forEach(el => galleryObserver.observe(el));

/* ==============================
   ANIMACIÓN DEL CONTADOR (Estadísticas)
   ============================== */
function animateCounter(el) {
  const text = el.textContent;
  const suffix = text.replace(/[\d]/g, '').trim();
  const target = parseInt(text.replace(/\D/g, ''), 10);
  if (isNaN(target)) return;

  let current = 0;
  const duration = 1200;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = value + (suffix ? ' ' + suffix : '');
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = text;
    }
  }

  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat h4');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach(el => counterObserver.observe(el));

/* ==============================
   LIGHTBOX DE GALERÍA
   ============================== */
const galleryItems = document.querySelectorAll('.gallery-item');
let lightboxIndex = -1;

const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Cerrar">&times;</button>
  <div class="lightbox-inner">
    <button class="lightbox-nav lightbox-prev" aria-label="Anterior">‹</button>
    <div>
      <div class="lightbox-content"></div>
      <div class="lightbox-label"></div>
    </div>
    <button class="lightbox-nav lightbox-next" aria-label="Siguiente">›</button>
  </div>
`;
document.body.appendChild(lightbox);

const lightboxInner = lightbox.querySelector('.lightbox-inner');
const lightboxContent = lightbox.querySelector('.lightbox-content');
const lightboxLabel = lightbox.querySelector('.lightbox-label');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox.querySelector('.lightbox-next');

function openLightbox(index) {
  const item = galleryItems[index];
  if (!item) return;
  lightboxIndex = index;

  const src = item.dataset.src || item.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
  lightboxContent.textContent = '';

  if (src && src !== 'none' && src !== '') {
    lightboxContent.style.backgroundImage = `url(${src})`;
    lightboxContent.style.backgroundSize = 'contain';
    lightboxContent.style.backgroundPosition = 'center';
    lightboxContent.style.backgroundRepeat = 'no-repeat';
    lightboxContent.style.width = 'min(80vw, 500px)';
    lightboxContent.style.height = 'min(80vw, 500px)';
    lightboxContent.style.borderRadius = '20px';
    lightboxContent.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
    lightboxContent.style.fontSize = '0';
  }

  lightboxLabel.textContent = item.getAttribute('data-label') || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxIndex = -1;
}

function prevLightbox() {
  if (lightboxIndex > 0) openLightbox(lightboxIndex - 1);
}

function nextLightbox() {
  if (lightboxIndex < galleryItems.length - 1) openLightbox(lightboxIndex + 1);
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(i);
    }
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevLightbox(); });
lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextLightbox(); });

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevLightbox();
  if (e.key === 'ArrowRight') nextLightbox();
});

/* ==============================
   VALIDACIÓN DEL FORMULARIO
   ============================== */
const reservaForm = document.querySelector('.reserva-form');
const formInputs = reservaForm.querySelectorAll('input, select, textarea');

// Fecha por defecto: mañana
const dateInput = document.getElementById('reserva-fecha');
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const dateStr = tomorrow.toISOString().split('T')[0];
dateInput.value = dateStr;
dateInput.setAttribute('min', dateStr);

// Validación en tiempo real al perder el foco
formInputs.forEach(input => {
  input.addEventListener('blur', () => validateField(input));
  input.addEventListener('input', () => {
    if (input.classList.contains('error')) {
      validateField(input);
    }
  });
});

function validateField(field) {
  const errorMsg = field.parentElement.querySelector('.error-msg') || createErrorMsg(field);
  const isValid = field.checkValidity();

  if (!isValid && field.value) {
    field.classList.add('error');
    errorMsg.textContent = getErrorMessage(field);
    errorMsg.classList.add('visible');
    return false;
  }

  field.classList.remove('error');
  errorMsg.classList.remove('visible');
  return true;
}

function createErrorMsg(field) {
  const span = document.createElement('span');
  span.className = 'error-msg';
  field.parentElement.appendChild(span);
  return span;
}

function getErrorMessage(field) {
  if (field.type === 'email') return 'Ingresá un email válido';
  if (field.type === 'tel') return 'Ingresá un teléfono válido';
  if (field.required && !field.value) return 'Este campo es obligatorio';
  if (field.type === 'date' && !field.value) return 'Seleccioná una fecha';
  if (field.type === 'time' && !field.value) return 'Seleccioná un horario';
  return 'Campo inválido';
}

// Validación completa
function validateForm() {
  let valid = true;
  formInputs.forEach(input => {
    if (input.required && !input.value) {
      input.classList.add('error');
      const errorMsg = input.parentElement.querySelector('.error-msg') || createErrorMsg(input);
      errorMsg.textContent = 'Este campo es obligatorio';
      errorMsg.classList.add('visible');
      valid = false;
    } else if (!validateField(input) && input.required) {
      valid = false;
    }
  });
  return valid;
}

// Formatear fecha para mostrar
function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
}

reservaForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const data = new FormData(reservaForm);
  const nombre = data.get('nombre') || '';
  const email = data.get('email') || '';
  const telefono = data.get('telefono') || '';
  const personas = data.get('personas') || '';
  const fecha = formatDate(data.get('fecha'));
  const hora = data.get('hora') || '';
  const comentarios = data.get('comentarios') || '';

  showToast(
    `¡Reserva confirmada, ${nombre || 'cliente'}! Te esperamos el ${fecha || 'ese día'} a las ${hora}.`,
    'success'
  );

  // Enviar por WhatsApp
  const msg = encodeURIComponent(
    `Hola Sushi Club! Quiero hacer una reserva:%0A👤 *Nombre:* ${nombre}%0A📧 *Email:* ${email}%0A📞 *Teléfono:* ${telefono}%0A👥 *Personas:* ${personas}%0A📅 *Fecha:* ${fecha}%0A🕐 *Hora:* ${hora}%0A💬 *Comentarios:* ${comentarios || '—'}`
  );
  window.open(`https://wa.me/543414372809?text=${msg}`, '_blank');

  reservaForm.reset();
  dateInput.value = dateStr;
  reservaForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  reservaForm.querySelectorAll('.error-msg.visible').forEach(el => el.classList.remove('visible'));
});

/* ==============================
   SISTEMA DE TOAST
   ============================== */
function showToast(message, type = 'info') {
  const container = document.querySelector('.toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 4000);
}

function createToastContainer() {
  const div = document.createElement('div');
  div.className = 'toast-container';
  document.body.appendChild(div);
  return div;
}

/* ==============================
   VOLVER ARRIBA
   ============================== */
const scrollBtn = document.createElement('button');
scrollBtn.className = 'scroll-top';
scrollBtn.innerHTML = '↑';
scrollBtn.setAttribute('aria-label', 'Volver arriba');
document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ==============================
   SCROLL SUAVE
   ============================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

document.querySelectorAll('[data-scroll]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.getAttribute('data-scroll'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

console.log('%c Sushi Club ', 'background:#dc143c;color:#fff;font-size:1.2rem;padding:8px 12px;border-radius:4px;font-weight:bold;');
console.log('%c Hecho con ♥ para vos', 'color:#a3a3a3;font-size:0.9rem;');
