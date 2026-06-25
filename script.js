/* ═══════════════════════════════════════════════════
   Olga's GuideHub — script.js
═══════════════════════════════════════════════════ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Navbar: frosted glass on scroll + active link + floating CTA ── */
const navbar = document.getElementById('navbar');
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = document.querySelectorAll('a.nl[href^="#"]');
const floatCta = document.getElementById('floatCta');
const contactSection = document.getElementById('contact');

function onScroll() {
  navbar.classList.toggle('stuck', window.scrollY > 24);
  highlightNav();
  if (floatCta) {
    const nearContact = contactSection &&
      window.scrollY + window.innerHeight > contactSection.offsetTop + 150;
    floatCta.classList.toggle('show', window.scrollY > 620 && !nearContact);
  }
}

function highlightNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Smooth scroll for internal links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: 'smooth' });
    closeMobileMenu();
  });
});

/* ── Hamburger / mobile menu ── */
const burger = document.getElementById('burger');
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

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });

/* ── Scroll reveal ── */
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

/* ── Contact form via FormSubmit.co ── */
const contactForm = document.getElementById('contactForm');
const formSent = document.getElementById('formSent');
const formError = document.getElementById('formError');

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
      .then(res => { if (!res.ok) throw new Error('send failed'); contactForm.classList.add('hidden'); formSent.classList.remove('hidden'); })
      .catch(() => { btn.textContent = orig; btn.disabled = false; formError.classList.remove('hidden'); });
  });
}

/* ── FAQ accordion: close others when one opens ── */
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) faqItems.forEach(other => { if (other !== item) other.open = false; });
  });
});

/* ── Trust numbers count up when scrolled into view ── */
const trustNums = document.querySelectorAll('.trust-n');
if (trustNums.length && !prefersReducedMotion) {
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      countObs.unobserve(entry.target);
      const el = entry.target;
      const m = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (!m) return;
      const target = +m[1], suffix = m[2], dur = 1400, t0 = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  trustNums.forEach(el => countObs.observe(el));
}

/* ── Hero: 3D photo tilt + cursor glow (desktop, motion-safe) ── */
if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
  const hero = document.querySelector('.hero');
  const frame = document.querySelector('.hero-frame');
  const glow = document.querySelector('.hero-glow');

  if (hero && frame && glow) {
    hero.addEventListener('mousemove', e => {
      const r = frame.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      const clamp = v => Math.max(-0.6, Math.min(0.6, v));
      frame.style.transform = `rotateY(${clamp(dx) * 7}deg) rotateX(${-clamp(dy) * 7}deg)`;

      const hr = hero.getBoundingClientRect();
      glow.style.left = (e.clientX - hr.left) + 'px';
      glow.style.top = (e.clientY - hr.top) + 'px';
      glow.classList.add('on');
    });
    hero.addEventListener('mouseleave', () => { frame.style.transform = ''; glow.classList.remove('on'); });
  }

  /* Subtle hero parallax */
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < 900) heroVisual.style.transform = `translateY(${window.scrollY * 0.05}px)`;
    }, { passive: true });
  }
}
