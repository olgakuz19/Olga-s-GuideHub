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

/* ── Page-wide cursor glow + hero 3D photo tilt (desktop, motion-safe) ── */
if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
  const glow = document.getElementById('pageGlow');
  if (glow) {
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.classList.add('on');
    });
    document.documentElement.addEventListener('mouseleave', () => glow.classList.remove('on'));
  }

  const hero = document.querySelector('.hero');
  const frame = document.querySelector('.hero-frame');
  if (hero && frame) {
    hero.addEventListener('mousemove', e => {
      const r = frame.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      const clamp = v => Math.max(-0.6, Math.min(0.6, v));
      frame.style.transform = `rotateY(${clamp(dx) * 7}deg) rotateX(${-clamp(dy) * 7}deg)`;
    });
    hero.addEventListener('mouseleave', () => { frame.style.transform = ''; });
  }

  /* Subtle hero parallax */
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < 900) heroVisual.style.transform = `translateY(${window.scrollY * 0.05}px)`;
    }, { passive: true });
  }
}

/* ── USCIS Interview Readiness Quiz ── */
const QUIZ = [
  {
    q: 'The officer asks: "How did you and your spouse meet?" What is the best way to answer?',
    a: [
      'Tell the whole story in every detail, starting from years back',
      'Answer briefly and honestly: where, when, and how the relationship grew',
      'Repeat the exact answer you memorized word for word'
    ],
    correct: 1,
    why: 'Short, honest, natural answers work best. You are not performing a script.'
  },
  {
    q: 'You are asked about a trip abroad but you do not remember the exact date. What do you do?',
    a: [
      'Give your best guess so you do not look unprepared',
      'Say you never traveled, it is simpler',
      'Ask to check your notes so you give the correct information'
    ],
    correct: 2,
    why: 'Accuracy beats speed. Checking your documents is completely allowed.'
  },
  {
    q: 'In 2026 many field offices interview married couples in a new way. Which one?',
    a: [
      'Spouses are interviewed separately and their answers are compared',
      'Spouses are always interviewed together in one room',
      'Spouse interviews were cancelled'
    ],
    correct: 0,
    why: 'Separate interviews are the new normal, so honesty and consistency matter more than ever.'
  },
  {
    q: 'The officer asks something you did not understand. What now?',
    a: [
      'Answer what you think they probably meant',
      'Politely ask the officer to repeat or rephrase the question',
      'Stay quiet until they move on'
    ],
    correct: 1,
    why: 'Asking to repeat a question is normal and shows care, not weakness.'
  },
  {
    q: 'Under the May 2026 memo, officers may ask why you applied inside the US instead of at a consulate abroad. How do you prepare?',
    a: [
      'Be ready to explain your honest reasons calmly',
      'Refuse to answer, that question is not allowed',
      'Say your lawyer told you to'
    ],
    correct: 0,
    why: 'The new memo makes this a real question. A calm, truthful explanation is your best answer.'
  },
  {
    q: 'What do you bring to the interview?',
    a: [
      'Just your ID, they already have your file',
      'Originals and copies of your documents, organized and easy to find',
      'Nothing, carrying papers looks nervous'
    ],
    correct: 1,
    why: 'An organized folder can save your interview when a surprise question comes up.'
  }
];

const QUIZ_TIME = 60;
const qzStart = document.getElementById('qzStart');
const qzPlay = document.getElementById('qzPlay');
const qzEnd = document.getElementById('qzEnd');

if (qzStart && qzPlay && qzEnd) {
  const qzQ = document.getElementById('qzQ');
  const qzA = document.getElementById('qzA');
  const qzCount = document.getElementById('qzCount');
  const qzClock = document.getElementById('qzClock');
  const qzBar = document.getElementById('qzBar');

  let idx = 0, score = 0, timeLeft = QUIZ_TIME, timer = null, picks = [], locked = false, done = false;

  document.getElementById('qzStartBtn').addEventListener('click', startQuiz);

  function startQuiz() {
    idx = 0; score = 0; timeLeft = QUIZ_TIME; picks = []; locked = false; done = false;
    qzStart.classList.add('hidden');
    qzEnd.classList.add('hidden');
    qzPlay.classList.remove('hidden');
    qzClock.textContent = timeLeft;
    qzClock.classList.remove('low');
    qzBar.style.width = '100%';
    timer = setInterval(tick, 1000);
    showQuestion();
  }

  function tick() {
    timeLeft--;
    qzClock.textContent = Math.max(timeLeft, 0);
    qzBar.style.width = (Math.max(timeLeft, 0) / QUIZ_TIME * 100) + '%';
    if (timeLeft <= 10) qzClock.classList.add('low');
    if (timeLeft <= 0) finish(false);
  }

  function showQuestion() {
    const item = QUIZ[idx];
    qzCount.textContent = 'Question ' + (idx + 1) + ' of ' + QUIZ.length;
    qzQ.textContent = item.q;
    qzA.innerHTML = '';
    locked = false;
    item.a.forEach((text, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qz-answer';
      btn.textContent = text;
      btn.addEventListener('click', () => pick(i, btn));
      qzA.appendChild(btn);
    });
  }

  function pick(i, btn) {
    if (locked) return;
    locked = true;
    const item = QUIZ[idx];
    picks.push(i);
    if (i === item.correct) { score++; btn.classList.add('good'); }
    else {
      btn.classList.add('bad');
      qzA.children[item.correct].classList.add('good');
    }
    setTimeout(() => {
      if (done) return;
      idx++;
      if (idx >= QUIZ.length) finish(true);
      else showQuestion();
    }, 650);
  }

  function finish(inTime) {
    if (done) return;
    done = true;
    clearInterval(timer);
    qzPlay.classList.add('hidden');
    qzEnd.classList.remove('hidden');

    let headline, sub;
    if (!inTime) {
      headline = '⏰ Time is up!';
      sub = 'The real interview will not rush you like this, promise. Want another try?';
    } else if (score === QUIZ.length) {
      headline = '🎉 ' + score + ' out of ' + QUIZ.length + '. Officer level calm!';
      sub = 'You clearly did your homework. Imagine how ready you will feel after we prep together.';
    } else if (score >= 4) {
      headline = '💪 ' + score + ' out of ' + QUIZ.length + '. Almost there!';
      sub = 'A strong result. The last details are exactly what we polish in a coaching session.';
    } else {
      headline = '🌱 ' + score + ' out of ' + QUIZ.length + '. Good start!';
      sub = 'Most people score here before preparing. That is exactly why preparation works.';
    }

    let html = '<div class="qz-score">' + headline + '</div><p>' + sub + '</p>';

    if (inTime) {
      html += '<div class="qz-reward">🎁 You finished the 60 second challenge!' +
        '<strong>READY10</strong>' +
        'Mention this code when you book and get 10% off your 30 minute session.</div>';
      html += '<ul class="qz-review">';
      QUIZ.forEach((item, i) => {
        const ok = picks[i] === item.correct;
        html += '<li class="' + (ok ? 'ok' : 'miss') + '"><strong>' + item.q + '</strong><br>' + item.why + '</li>';
      });
      html += '</ul>';
      html += '<a href="#contact" class="btn btn-rose btn-lg">Book your session</a> ';
    }
    html += '<button type="button" class="btn btn-ghost" id="qzRetry">Try again</button>';

    qzEnd.innerHTML = html;
    document.getElementById('qzRetry').addEventListener('click', startQuiz);
  }
}
