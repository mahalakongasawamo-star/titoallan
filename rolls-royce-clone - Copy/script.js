// ========================================================
// GSAP — REGISTER PLUGINS
// ========================================================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ========================================================
// LENIS SMOOTH SCROLL (themenectar stack — lerp 0.1)
// ========================================================
const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: true,
  syncTouch: false,
});

// Sync Lenis with GSAP ticker + ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// ========================================================
// PRELOADER
// ========================================================
const preloader = document.getElementById('preloader');

const heroTl = gsap.timeline({ paused: true });
heroTl.fromTo('.hero .anim-item',
  { y: 60, opacity: 0 },
  { y: 0, opacity: 1, duration: 1.4, stagger: 0.14, ease: 'power3.out' }
);
// Count up 93% after the stat block fades in
heroTl.fromTo('.hero__stat-num span',
  { textContent: 0 },
  { textContent: 93, duration: 2.2, ease: 'power2.out', snap: { textContent: 1 } },
  '-=1.0'
);

window.addEventListener('load', () => {
  gsap.to(preloader, {
    opacity: 0,
    duration: 0.35,
    delay: 0.25,
    ease: 'power2.in',
    onComplete: () => {
      preloader.style.visibility = 'hidden';
      heroTl.play();
    }
  });
});

// ========================================================
// HEADER — ScrollTrigger toggle class
// ========================================================
const header = document.getElementById('header');

ScrollTrigger.create({
  start: 'top -80',
  end: 99999,
  toggleClass: { className: 'header--scrolled', targets: header }
});

// ========================================================
// BACK TO TOP
// ========================================================
const backToTop = document.getElementById('backToTop');

ScrollTrigger.create({
  start: 'top -600',
  end: 99999,
  toggleClass: { className: 'back-to-top--visible', targets: backToTop }
});

backToTop.addEventListener('click', () => {
  lenis.scrollTo(0, { duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
});

// ========================================================
// MOBILE NAV
// ========================================================
const menuBtn    = document.getElementById('menuBtn');
const navOverlay = document.getElementById('navOverlay');
const navClose   = document.getElementById('navClose');

menuBtn.addEventListener('click', () => {
  navOverlay.classList.add('nav-overlay--open');
  document.body.style.overflow = 'hidden';
  lenis.stop();
});

navClose.addEventListener('click', () => {
  navOverlay.classList.remove('nav-overlay--open');
  document.body.style.overflow = '';
  lenis.start();
});

document.querySelectorAll('.nav-overlay__list a').forEach(link => {
  link.addEventListener('click', () => {
    navOverlay.classList.remove('nav-overlay--open');
    document.body.style.overflow = '';
    lenis.start();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navOverlay.classList.contains('nav-overlay--open')) {
    navOverlay.classList.remove('nav-overlay--open');
    document.body.style.overflow = '';
    lenis.start();
  }
});

// ========================================================
// HERO FRAME — expand from inset to full-width on scroll
// ========================================================
gsap.to('.hero__frame', {
  borderRadius: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: '+=480',
    scrub: 1.2,
  }
});

gsap.to('.hero', {
  padding: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: '+=480',
    scrub: 1.2,
  }
});

// ========================================================
// HERO IMAGE PARALLAX (subtle depth on scroll)
// ========================================================
gsap.to('.hero__bg', {
  y: 100,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  }
});

// ========================================================
// PRICING SECTION ANIMATIONS
// ========================================================
(function initPricingAnimations() {
  if (!document.querySelector('.pricing')) return;

  // Header cells stagger in from bottom
  gsap.fromTo('.pricing__header > *',
    { y: 50, opacity: 0 },
    {
      y: 0, opacity: 1,
      duration: 1.0,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.pricing', start: 'top 72%', once: true }
    }
  );

  // Cards cascade up with increasing delay
  gsap.fromTo('.pricing__card',
    { y: 110, opacity: 0 },
    {
      y: 0, opacity: 1,
      duration: 1.1,
      stagger: 0.22,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.pricing__grid', start: 'top 82%', once: true }
    }
  );

  // Differential parallax — each card drifts at a different rate
  gsap.utils.toArray('.pricing__card').forEach((card, i) => {
    gsap.to(card, {
      y: (i - 1) * -28,
      ease: 'none',
      scrollTrigger: {
        trigger: '.pricing',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      }
    });
  });


})();

// ========================================================
// SECTION REVEALS
// ========================================================
gsap.from('.about-text__lead', {
  y: 50, opacity: 0, duration: 1.2, ease: 'power3.out',
  scrollTrigger: { trigger: '.about-text', start: 'top 80%' }
});

gsap.from('.about-text__body', {
  y: 40, opacity: 0, duration: 1.0,
  stagger: 0.15,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.about-text', start: 'top 75%' }
});

gsap.from('.stats__single', {
  y: 70, opacity: 0, duration: 1.2, ease: 'power3.out',
  scrollTrigger: { trigger: '.stats', start: 'top 78%' }
});

gsap.from('.value-prop__inner', {
  y: 80, opacity: 0, duration: 1.4, ease: 'power3.out',
  scrollTrigger: { trigger: '.value-prop', start: 'top 78%' }
});

gsap.from('.pricing__header', {
  y: 50, opacity: 0, duration: 1.1, ease: 'power3.out',
  scrollTrigger: { trigger: '.pricing', start: 'top 80%' }
});

gsap.from('.pricing__card', {
  y: 70, opacity: 0, duration: 0.9,
  stagger: { amount: 0.4, from: 'start' },
  ease: 'power3.out',
  scrollTrigger: { trigger: '.pricing__grid', start: 'top 80%' }
});

gsap.from('.pricing__note', {
  y: 20, opacity: 0, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '.pricing__note', start: 'top 90%' }
});

gsap.from('.contact__info', {
  x: -50, opacity: 0, duration: 1.1, ease: 'power3.out',
  scrollTrigger: { trigger: '.contact', start: 'top 80%' }
});

gsap.from('.contact__form', {
  x: 50, opacity: 0, duration: 1.1, ease: 'power3.out',
  scrollTrigger: { trigger: '.contact', start: 'top 80%' }
});

// ========================================================
// COUNTER ANIMATIONS
// ========================================================
document.querySelectorAll('[data-count]').forEach(el => {
  if (el.closest('.hero')) return; // handled by heroTl above
  const target  = parseInt(el.dataset.count);
  const section = el.closest('.stats, .value-prop') || el;

  gsap.fromTo(el,
    { textContent: 0 },
    {
      textContent: target,
      duration: 2.5,
      ease: 'power2.out',
      snap: { textContent: 1 },
      scrollTrigger: { trigger: section, start: 'top 75%', once: true }
    }
  );
});

// ========================================================
// INDUSTRY — VERTICAL FULL-SCREEN PANELS (themenectar style)
// Each card is 100vh, stacked vertically, Lenis drives smooth scroll
// GSAP adds parallax on each card's background + content reveal
// ========================================================
(function initIndustryVertical() {
  const section = document.querySelector('.industry');
  if (!section) return;

  // Section header reveal
  gsap.from('.industry__header', {
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.industry__header', start: 'top 80%' }
  });

  // Each card: parallax background + content fade-up
  document.querySelectorAll('.industry__card').forEach((card) => {
    const bg      = card.querySelector('.industry__card-bg');
    const content = card.querySelector('.industry__card-content');

    // Background parallax — bg travels faster than the card (classic themenectar feel)
    if (bg) {
      gsap.fromTo(bg,
        { y: '-12%' },
        {
          y: '12%',
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    }

    // Content slides up as card enters
    if (content) {
      gsap.from(content, {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 72%',
          once: true,
        }
      });
    }
  });
})();

// ========================================================
// SMOOTH SCROLL — anchor links via Lenis
// ========================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      lenis.scrollTo(target, {
        offset: -80,
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  });
});

// ========================================================
// THEME TOGGLE (light / dark)
// ========================================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Restore saved preference on load
if (localStorage.getItem('theme') === 'dark') {
  html.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  if (isDark) {
    html.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
});

// ========================================================
// FORM HANDLING (legacy — form removed, kept for safety)
// ========================================================
const contactForm = document.getElementById('contactForm');
if (contactForm) contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('.form__submit span');
  const original = btn.textContent;
  btn.textContent = 'SENT SUCCESSFULLY';
  setTimeout(() => { btn.textContent = original; contactForm.reset(); }, 2500);
});
