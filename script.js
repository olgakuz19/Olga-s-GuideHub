/* ═══════════════════════════════════════════════════
   Olga's GuideHub — script.js
═══════════════════════════════════════════════════ */

/* ── Navbar: frosted-glass on scroll + active link ── */
const navbar   = document.getElementById('navbar');
const sections = [...document.querySelectorAll('section[id], header[id]')];
const navLinks = document.querySelectorAll('a.nl[href^="#"]');

const floatCta = document.getElementById('floatCta');
const contactSection = document.getElementById('contact');

function onScroll() {
  navbar.classList.toggle('stuck', window.scrollY > 30);
  highlightNav();
  if (floatCta) {
    const nearContact = contactSection &&
      window.scrollY + window.innerHeight > contactSection.offsetTop + 150;
    floatCta.classList.toggle('show', window.scrollY > 650 && !nearContact);
  }
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

/* ── Trust numbers count up when scrolled into view ── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

/* ── Hero: 3D photo tilt + cursor glow (desktop, motion-safe only) ── */
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
      frame.style.transform = `rotateY(${clamp(dx) * 9}deg) rotateX(${-clamp(dy) * 9}deg)`;

      const hr = hero.getBoundingClientRect();
      glow.style.left = (e.clientX - hr.left) + 'px';
      glow.style.top = (e.clientY - hr.top) + 'px';
      glow.classList.add('on');
    });
    hero.addEventListener('mouseleave', () => {
      frame.style.transform = '';
      glow.classList.remove('on');
    });
  }
}

/* ── Subtle hero parallax (respects prefers-reduced-motion) ── */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    window.addEventListener('scroll', () => {
      heroVisual.style.transform = `translateY(${window.scrollY * 0.055}px)`;
    }, { passive: true });
  }
}

/* ── Scroll journey line: dotted path + star that travels as you scroll ── */
const journeySvg = document.getElementById('journeyLine');

if (journeySvg && !prefersReducedMotion && window.innerWidth > 960) {
  const NS = 'http://www.w3.org/2000/svg';
  const ahead = document.createElementNS(NS, 'path');
  const done  = document.createElementNS(NS, 'path');
  const star  = document.createElementNS(NS, 'path');
  ahead.setAttribute('class', 'j-ahead');
  done.setAttribute('class', 'j-done');
  star.setAttribute('class', 'j-star');
  star.setAttribute('d', 'M0,-11 C1.5,-3 3,-1.5 11,0 C3,1.5 1.5,3 0,11 C-1.5,3 -3,1.5 -11,0 C-3,-1.5 -1.5,-3 0,-11Z');
  journeySvg.append(ahead, done, star);

  let pathLen = 0, firstY = 0, lastY = 0;

  function buildJourney() {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.scrollHeight;
    journeySvg.setAttribute('width', w);
    journeySvg.setAttribute('height', h);
    journeySvg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    const stops = ['coaching', 'insider', 'videos', 'about', 'stories', 'faq', 'contact']
      .map(id => document.getElementById(id))
      .filter(Boolean)
      .map((sec, i) => ({
        x: w * (i % 2 === 0 ? 0.085 : 0.915),
        y: sec.offsetTop + sec.offsetHeight * 0.5
      }));
    if (stops.length < 2) return;

    let d = `M ${stops[0].x} ${stops[0].y}`;
    for (let i = 1; i < stops.length; i++) {
      const midY = (stops[i - 1].y + stops[i].y) / 2;
      d += ` C ${stops[i - 1].x} ${midY}, ${stops[i].x} ${midY}, ${stops[i].x} ${stops[i].y}`;
    }
    ahead.setAttribute('d', d);
    done.setAttribute('d', d);

    pathLen = done.getTotalLength();
    firstY = stops[0].y;
    lastY = stops[stops.length - 1].y;
    done.style.strokeDasharray = pathLen;
    drawJourney();
  }

  function drawJourney() {
    if (!pathLen) return;
    const focus = window.scrollY + window.innerHeight * 0.55;
    const p = Math.min(Math.max((focus - firstY) / (lastY - firstY), 0), 1);
    done.style.strokeDashoffset = pathLen * (1 - p);
    const pt = done.getPointAtLength(pathLen * p);
    const ahead2 = done.getPointAtLength(Math.min(pathLen * p + 2, pathLen));
    const angle = Math.atan2(ahead2.y - pt.y, ahead2.x - pt.x) * 180 / Math.PI;
    star.setAttribute('transform', `translate(${pt.x}, ${pt.y}) rotate(${angle * 0.15})`);
  }

  window.addEventListener('scroll', drawJourney, { passive: true });
  window.addEventListener('resize', () => requestAnimationFrame(buildJourney));
  window.addEventListener('load', buildJourney);
  buildJourney();
}

/* ── Keyboard: close mobile menu on Escape ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileMenu();
});
