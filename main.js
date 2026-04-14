/* ── Preloader vezérlés ── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Rövid késleltetés a simább átmenetért
    setTimeout(() => { preloader.classList.add('hide'); }, 500);
  }
});

/* ── Kapcsolat figyelés ── */
window.addEventListener('offline', () => {
  const preloader = document.getElementById('preloader');
  const status = document.getElementById('loaderStatus');
  if (preloader) {
    status.textContent = 'Nincs internetkapcsolat...';
    preloader.classList.remove('hide');
  }
});

window.addEventListener('online', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) { preloader.classList.add('hide'); }
});

/* ── NAV scroll effect ── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  const st = document.getElementById('scrollTop');
  if (window.scrollY > 60) { nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
  if (window.scrollY > 400) { st.classList.add('visible'); } else { st.classList.remove('visible'); }
});

/* ── Mobile menu ── */
function toggleMenu() {
  const m = document.getElementById('navMobile');
  const hbg = document.getElementById('hbg');
  m.classList.toggle('open');
  hbg.classList.toggle('open');
}
function closeMenu() {
  document.getElementById('navMobile').classList.remove('open');
  document.getElementById('hbg').classList.remove('open');
}

/* ── File upload ── */
function showFile(input) {
  if (input.files[0]) {
    const z = input.closest('.upload-zone');
    z.querySelector('strong').textContent = '✅ ' + input.files[0].name;
    z.querySelector('p').textContent = (input.files[0].size / 1024).toFixed(0) + ' KB';
    document.getElementById('removeFileBtn').style.display = 'block';
  }
}

function removeFile(event) {
  event.stopPropagation(); // Megakadályozza, hogy a szülő kattintás eseménye (fájlválasztó) lefusson
  const input = document.getElementById('file');
  input.value = ''; // Törli a kiválasztott fájlt
  const z = input.closest('.upload-zone');
  z.querySelector('strong').textContent = '📎 Kattints a feltöltéshez';
  z.querySelector('p').textContent = 'JPG, PNG, PDF – max 20 MB';
  document.getElementById('removeFileBtn').style.display = 'none';
}

/* ── Form submit ── */
function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.textContent = 'Küldés...';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
  }, 1200);
}

/* ── FAQ accordion ── */
function toggleFaq(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ── Gallery filter ── */
function filterGallery(cat, btn) {
  document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.gallery-item').forEach(item => {
    if (cat === 'all' || item.dataset.cat === cat) {
      item.style.display = '';
      item.style.opacity = '0';
      setTimeout(() => { item.style.transition = 'opacity 0.4s'; item.style.opacity = '1'; }, 10);
    } else {
      item.style.opacity = '0';
      setTimeout(() => { item.style.display = 'none'; }, 400);
    }
  });
}

/* ── Scroll fade ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); } });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
document.querySelectorAll('.fade').forEach(el => observer.observe(el));

/* ── Counter animation ── */
function animateCount(el, target, suffix) {
  let start = 0;
  const duration = 1800;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + (suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ── Counter trigger on scroll ── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.count);
      if (!isNaN(target)) animateCount(el, target, '');
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ── 3D Modell színezése ── */
const modelViewer = document.querySelector('.hero-3d-model');
if (modelViewer) {
  modelViewer.addEventListener('load', () => {
    const materials = modelViewer.model.materials;
    const white = [0.95, 0.95, 0.95, 1.0];
    const darkBlue = [0.02, 0.12, 0.35, 1.0];
    const black = [0.1, 0.1, 0.1, 1.0];

    materials.forEach((material, index) => {
      const name = material.name.toLowerCase();
      
      if (name.includes('blue') || name.includes('accent')) {
        material.pbrMetallicRoughness.setBaseColorFactor(darkBlue);
      } else if (name.includes('black') || name.includes('arm') || name.includes('joint')) {
        material.pbrMetallicRoughness.setBaseColorFactor(black);
      } else if (name.includes('white') || name.includes('body')) {
        material.pbrMetallicRoughness.setBaseColorFactor(white);
      } else {
        // Fallback: váltakozó színek, ha a modell alkatrészei nincsenek egyedileg elnevezve
        const colors = [white, darkBlue, black];
        material.pbrMetallicRoughness.setBaseColorFactor(colors[index % 3]);
      }
    });
  });
}
