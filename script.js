/* ═══════════════════════════════════════════════════
   Olga's GuideHub — script.js
═══════════════════════════════════════════════════ */

/* ── Navbar: frosted-glass on scroll + active link ── */
const navbar   = document.getElementById('navbar');
const sections = [...document.querySelectorAll('section[id], header[id]')];
const navLinks = document.querySelectorAll('a.nl[href^="#"]');

function onScroll() {
  navbar.classList.toggle('stuck', window.scrollY > 30);
  highlightNav();
}

function highlightNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Smooth scroll for all internal links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 78;
    window.scrollTo({ top, behavior: 'smooth' });
    closeMobileMenu();
  });
});

/* ── Hamburger / mobile menu ── */
const burger  = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');

burger.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) closeMobileMenu();
});

function closeMobileMenu() {
  navMenu.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ── Intersection Observer — scroll-reveal ── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

revealEls.forEach(el => observer.observe(el));

/* ── Video tabs ── */
const ytPanel = document.getElementById('yt-panel');
const ttPanel = document.getElementById('tt-panel');

document.querySelectorAll('.vtab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.vtab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (btn.dataset.tab === 'yt') {
      ytPanel.classList.remove('hidden');
      ttPanel.classList.add('hidden');
    } else {
      ttPanel.classList.remove('hidden');
      ytPanel.classList.add('hidden');
      // Re-trigger reveal for newly shown cards
      ttPanel.querySelectorAll('.reveal-up').forEach(el => {
        el.classList.remove('in');
        requestAnimationFrame(() => el.classList.add('in'));
      });
    }
  });
});

/* ── Contact form — sends via FormSubmit.co to olga@olgaguidehub.com ── */
const contactForm = document.getElementById('contactForm');
const formSent    = document.getElementById('formSent');
const formError   = document.getElementById('formError');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }

    const btn = contactForm.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    formError.classList.add('hidden');

    fetch('https://formsubmit.co/ajax/olga@olgaguidehub.com', {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' }
    })
      .then(res => {
        if (!res.ok) throw new Error('send failed');
        contactForm.classList.add('hidden');
        formSent.classList.remove('hidden');
      })
      .catch(() => {
        btn.textContent = orig;
        btn.disabled = false;
        formError.classList.remove('hidden');
      });
  });
}

/* ── FAQ accordion — close others when one opens ── */
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) faqItems.forEach(other => { if (other !== item) other.open = false; });
  });
});

/* ── Subtle hero parallax (respects prefers-reduced-motion) ── */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    window.addEventListener('scroll', () => {
      heroVisual.style.transform = `translateY(${window.scrollY * 0.055}px)`;
    }, { passive: true });
  }
}

/* ── Keyboard: close mobile menu on Escape ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileMenu();
});
