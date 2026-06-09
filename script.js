/* ==============================
   NAVBAR
   ============================== */
const nav = document.querySelector('nav');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navAnchors = document.querySelectorAll('.nav-links a');

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});

// Close menu on link click
navAnchors.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.textContent = '☰';
  });
});

// Shrink nav on scroll
function handleNavScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

// Active nav link based on scroll position
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 150;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });
  navAnchors.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });

/* ==============================
   SCROLL REVEAL (Intersection Observer)
   ============================== */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach(el => observer.observe(el));

/* ==============================
   COUNTER ANIMATION (Stats)
   ============================== */
function animateCounter(el) {
  const text = el.textContent;
  const suffix = text.replace(/[\d]/g, '').trim();
  const target = parseInt(text.replace(/\D/g, ''), 10);
  if (isNaN(target)) return;

  let current = 0;
  const step = Math.ceil(target / 40);
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
   GALLERY LIGHTBOX
   ============================== */
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Cerrar">&times;</button>
  <div>
    <div class="lightbox-content"></div>
    <div class="lightbox-label"></div>
  </div>
`;
document.body.appendChild(lightbox);

const lightboxContent = lightbox.querySelector('.lightbox-content');
const lightboxLabel = lightbox.querySelector('.lightbox-label');
const lightboxClose = lightbox.querySelector('.lightbox-close');

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    const bgImage = item.style.backgroundImage;
    lightboxContent.textContent = '';
    if (bgImage && bgImage !== 'none') {
      const imgUrl = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
      lightboxContent.style.backgroundImage = `url(${imgUrl})`;
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
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* ==============================
   FORM VALIDATION
   ============================== */
const reservaForm = document.querySelector('.reserva-form');
const formInputs = reservaForm.querySelectorAll('input, select, textarea');

// Real-time validation on blur
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
  } else {
    field.classList.remove('error');
    errorMsg.classList.remove('visible');
  }
  return isValid || !field.value;
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

// Full validation before submit
function validateForm() {
  let valid = true;
  formInputs.forEach(input => {
    if (!validateField(input) && input.required) {
      valid = false;
    }
    // Also check empty required
    if (input.required && !input.value) {
      input.classList.add('error');
      const errorMsg = input.parentElement.querySelector('.error-msg') || createErrorMsg(input);
      errorMsg.textContent = 'Este campo es obligatorio';
      errorMsg.classList.add('visible');
      valid = false;
    }
  });
  return valid;
}

// Format date for display
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
  const date = formatDate(data.get('fecha'));

  showToast(
    `¡Reserva confirmada, ${data.get('nombre') || 'cliente'}! Te esperamos el ${date || 'ese día'}. Te enviaremos la confirmación.`,
    'success'
  );

  reservaForm.reset();
  // Clear error states
  reservaForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  reservaForm.querySelectorAll('.error-msg.visible').forEach(el => el.classList.remove('visible'));
});

/* ==============================
   TOAST SYSTEM
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
   SCROLL TO TOP
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
   SMOOTH SCROLL (polyfill for older browsers)
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

// Data-scroll buttons (btn with data-scroll="#section")
document.querySelectorAll('[data-scroll]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.getAttribute('data-scroll'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

console.log('%c Sushi Club ', 'background:#e11d48;color:#fff;font-size:1.2rem;padding:8px 12px;border-radius:4px;font-weight:bold;');
console.log('%c Hecho con ♥ para vos', 'color:#a3a3a3;font-size:0.9rem;');
