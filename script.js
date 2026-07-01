/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO JAVASCRIPT — Benito Lopes · Analista de Dados & BI
   ─────────────────────────────────────────────────────────────
   Módulos:
   1. Navbar scroll
   2. Menu mobile
   3. Typed text effect
   4. AOS (Animate on Scroll)
   5. Counter animation (hero stats)
   6. Progress bars animation
   7. Particle system
   8. Active nav link on scroll
   9. Smooth hover tilt on project cards
   10. Console easter egg
   ═══════════════════════════════════════════════════════════════ */

/* ─── 1. NAVBAR — Scroll behavior ──────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ─── 2. MENU MOBILE ────────────────────────────────────────── */
(function initMobileMenu() {
  const toggle   = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navCta   = document.querySelector('.nav-cta');
  if (!toggle || !navLinks) return;

  let open = false;

  const closeMenu = () => {
    open = false;
    navLinks.classList.remove('open');
    if (navCta) navCta.classList.remove('open');
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = '';
  };

  toggle.addEventListener('click', () => {
    open = !open;
    navLinks.classList.toggle('open', open);
    if (navCta) navCta.classList.toggle('open', open);

    const spans = toggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '1';
      spans[2].style.transform = '';
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (open && !toggle.contains(e.target) && !navLinks.contains(e.target)) {
      closeMenu();
    }
  });
})();


/* ─── 3. TYPED TEXT ─────────────────────────────────────────── */
(function initTypedText() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Analista de Dados Jr',
    'Analista de BI Jr',
    'BI Analyst',
    'Data Analyst',
    'Dashboard Builder',
  ];

  let phraseIdx  = 0;
  let charIdx    = 0;
  let isDeleting = false;

  const TYPING_SPEED        = 80;
  const DELETING_SPEED      = 40;
  const PAUSE_BEFORE_DELETE = 2200;
  const PAUSE_BEFORE_TYPE   = 400;

  const tick = () => {
    const current = phrases[phraseIdx];

    if (!isDeleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;

      if (charIdx === current.length) {
        setTimeout(() => {
          isDeleting = true;
          tick();
        }, PAUSE_BEFORE_DELETE);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, PAUSE_BEFORE_TYPE);
        return;
      }
    }

    setTimeout(tick, isDeleting ? DELETING_SPEED : TYPING_SPEED);
  };

  tick();
})();


/* ─── 4. AOS — Animate on Scroll (lightweight) ─────────────── */
(function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => io.observe(el));
})();


/* ─── 5. COUNTER ANIMATION (Hero stats) ─────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  let started = false;

  const animateCounter = (el) => {
    const target   = parseFloat(el.dataset.target);
    const isFloat  = String(target).includes('.');
    const duration = 1800;
    const start    = performance.now();

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = eased * target;

      el.textContent = isFloat ? value.toFixed(1) : Math.floor(value);

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = isFloat ? target.toFixed(1) : target;
    };

    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          counters.forEach((el) => animateCounter(el));
          io.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) io.observe(statsSection);
})();


/* ─── 6. PROGRESS BARS ──────────────────────────────────────── */
(function initProgressBars() {
  const bars = document.querySelectorAll('.pb-fill[data-width]');
  if (!bars.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          bars.forEach((bar) => {
            const w = bar.dataset.width;
            setTimeout(() => {
              bar.style.width = w + '%';
              const pct = bar.closest('.prof-bar')?.querySelector('.pb-percent');
              if (pct) {
                let current = 0;
                const target   = parseInt(w);
                const duration = 1200;
                const start    = performance.now();
                const step = (now) => {
                  const p     = Math.min((now - start) / duration, 1);
                  const eased = 1 - Math.pow(1 - p, 3);
                  pct.textContent = Math.floor(eased * target) + '%';
                  if (p < 1) requestAnimationFrame(step);
                  else pct.textContent = target + '%';
                };
                requestAnimationFrame(step);
              }
            }, 200 + parseInt(w) * 1.5);
          });
          io.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const section = document.querySelector('.proficiency');
  if (section) io.observe(section);
})();


/* ─── 7. PARTICLE SYSTEM ────────────────────────────────────── */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 14 : 28;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 3 + 2;
    p.style.width  = size + 'px';
    p.style.height = size + 'px';

    p.style.left = Math.random() * 100 + '%';

    const dur = 8 + Math.random() * 10;
    p.style.animationDuration = dur + 's';
    p.style.animationDelay   = -(Math.random() * dur) + 's';

    p.style.opacity = 0.15 + Math.random() * 0.4;

    container.appendChild(p);
  }
})();


/* ─── 8. ACTIVE NAV LINK ON SCROLL ─────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + id);
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => io.observe(s));
})();


/* ─── 9. SMOOTH HOVER TILT on project cards ─────────────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length || window.innerWidth < 900) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -4;
      const tiltY = dx *  4;

      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ─── 10. PROJECT FILTERING ─────────────────────────────────── */
(function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.display = '';
            card.style.opacity = '1';
            card.style.transform = '';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.classList.add('hidden');
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
})();


/* ─── 11. CONSOLE EASTER EGG ────────────────────────────────── */
(function consoleGreeting() {
  const style = [
    'color: #FFFFFF',
    'font-size: 14px',
    'font-family: monospace',
    'font-weight: bold',
  ].join(';');

  console.log('%c╔══════════════════════════════════════╗', style);
  console.log('%c║  Olá, Dev! 👋                        ║', style);
  console.log('%c║  Portfólio de Benito Lopes            ║', style);
  console.log('%c║  Analista de Dados & BI Jr            ║', style);
  console.log('%c║  github.com/benitolopes               ║', style);
  console.log('%c╚══════════════════════════════════════╝', style);
})();
