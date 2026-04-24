/* ============================================================
   TELHA CLARKE CLONE — JavaScript
   GSAP + ScrollTrigger — matching reference animations
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);

/* ---------- Inject SVG logos ---------- */
(function injectLogos() {
  const tpl = document.getElementById('tcLogoSVG');
  if (!tpl) return;
  document.querySelectorAll('.tc-logo-svg').forEach(el => {
    el.appendChild(tpl.content.cloneNode(true));
  });
})();

/* ---------- Viewport variables ---------- */
function setVH() {
  document.documentElement.style.setProperty('--vh', window.innerHeight + 'px');
}
setVH();
window.addEventListener('resize', setVH);

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const W = () => window.innerWidth;

/* ==========================================================
   PARALLAX IMAGE  (ported from reference c-parallax-image)
   ========================================================== */
class ParallaxImage {
  constructor(el) {
    this.$el = el;
    this.force = parseFloat(el.dataset.parallaxForce) || 5;
    this.$img = el.querySelector('img, .parallax-el');
    this.sT = null;
    this.anim = null;
    this.tv = 0; // transformValue
    if (this.$img) this.init();
  }
  init() {
    if (W() < 1200 || isMobile) return;
    this.$el.style.overflow = 'hidden';
    this.calc();
    this.anim = gsap.fromTo(this.$img,
      { y: () => -this.tv / 2 },
      { paused: true, y: () => this.tv / 2, ease: 'none' }
    );
    this.trigger();
  }
  trigger() {
    const top = this.$el.getBoundingClientRect().top + window.scrollY;
    const vh = window.innerHeight;
    this.sT = ScrollTrigger.create({
      trigger: this.$el,
      start: () => top < vh ? `clamp(top-=${top}px top)` : 'top bottom',
      animation: this.anim,
      invalidateOnRefresh: true,
      scrub: true
    });
  }
  calc() {
    const r = this.$el.getBoundingClientRect();
    this.tv = (r.height / this.force) * (Math.min(W(), 1440) / 1440);
    this.$img.style.height = `calc(100% + ${this.tv}px)`;
    this.$img.style.marginTop = `-${this.tv / 2}px`;
  }
  kill() { this.sT && this.sT.kill(); }
}

/* ==========================================================
   LAZY IMAGES
   ========================================================== */
function initLazy() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const img = e.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.onload = () => img.classList.add('loaded');
      }
      obs.unobserve(img);
    });
  }, { rootMargin: '300px 0px' });
  document.querySelectorAll('.lazy').forEach(i => obs.observe(i));
}

/* ==========================================================
   CLOCK  (Melbourne time)
   ========================================================== */
function initClock() {
  function tick() {
    const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Australia/Melbourne' }));
    let h = d.getHours(), m = d.getMinutes();
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const $h = document.getElementById('hour'),
          $m = document.getElementById('minute'),
          $a = document.getElementById('ampm');
    if ($h) $h.textContent = h;
    if ($m) $m.textContent = m < 10 ? '0' + m : m;
    if ($a) $a.textContent = ap;
  }
  tick();
  setInterval(tick, 30000);
  const colon = document.getElementById('colon');
  if (colon) setInterval(() => colon.style.opacity = colon.style.opacity === '0' ? '1' : '0', 1000);
}

/* ==========================================================
   LOADER
   ========================================================== */
function initLoader() {
  document.body.classList.add('no-scroll');
  const counterEl = document.querySelector('.loader-counter');
  const c = { v: 0 };

  const tl = gsap.timeline({
    onComplete() {
      document.body.classList.remove('no-scroll');
      initPage();
    }
  });

  tl
    // 1. Reveal info text
    .to('.loader-title',    { y: 0, duration: .8, ease: 'power3.out' }, .3)
    .to('.loader-location', { y: 0, duration: .8, ease: 'power3.out' }, .4)
    .to('.loader-loading',  { y: 0, duration: .6, ease: 'power3.out' }, .5)
    .to('.loader-counter',  { y: 0, duration: .6, ease: 'power3.out' }, .6)

    // 2. Count 0 → 100%
    .to(c, {
      v: 100, duration: 2, ease: 'power2.inOut',
      onUpdate() { if (counterEl) counterEl.textContent = Math.round(c.v) + '%'; }
    }, .8)

    // 3. Black overlay fades in → logo visible (white on black)
    .to('.loader-overlay', { opacity: 1, duration: .8, ease: 'power2.inOut' }, 2.8)
    .to('.loader-logo-bottom', { clipPath: 'inset(0 0 0% 0)', duration: .8, ease: 'power2.inOut' }, 2.8)

    // 4. Loader panel + loader fade out, frame borders in
    .to('.loader-panel', { opacity: 0, duration: .4 }, 3.8)
    .to('.loader', { opacity: 0, duration: .5, pointerEvents: 'none' }, 3.8)
    .to(['.frame-left', '.frame-right'], { scaleX: 1, duration: .6, ease: 'power3.out' }, 4.0)

    // 5. Header + cover reveals
    .from('.header-logo svg', { y: 20, opacity: 0, duration: .6, ease: 'power3.out' }, 4.1)
    .from('.header-link',     { y: 20, opacity: 0, duration: .5, stagger: .08, ease: 'power3.out' }, 4.2)
    .from('.header-time',     { y: 20, opacity: 0, duration: .5, ease: 'power3.out' }, 4.25)
    .from('.header-location', { y: 20, opacity: 0, duration: .5, ease: 'power3.out' }, 4.3)
    .from('.header-contact-link', { y: 20, opacity: 0, duration: .5, ease: 'power3.out' }, 4.3)
    .from('.cover-tagline',   { y: 30, opacity: 0, duration: .8, ease: 'power3.out' }, 4.3)
    .from('.cover-scroll-light', { opacity: 0, duration: .6 }, 4.5);
}

/* ==========================================================
   PAGE ANIMATIONS  (called after loader finishes)
   ========================================================== */
function initPage() {
  initParallax();
  initHeaderDark();
  initAbout();
  initWorks();
  initWorksGrid();
  initVision();
  initProcess();
}

/* --- Parallax --- */
function initParallax() {
  document.querySelectorAll('.parallax-wrap').forEach(el => new ParallaxImage(el));
}

/* --- Header dark on cover & vision --- */
function initHeaderDark() {
  const h = document.getElementById('header');
  function dark(on) { h.classList.toggle('dark', on); }

  ScrollTrigger.create({
    trigger: '.cover', start: 'top top', end: 'bottom top',
    onEnter: () => dark(true), onLeave: () => dark(false),
    onEnterBack: () => dark(true), onLeaveBack: () => dark(false)
  });
  ScrollTrigger.create({
    trigger: '.vision', start: 'top 80px', end: 'bottom top',
    onEnter: () => dark(true), onLeave: () => dark(false),
    onEnterBack: () => dark(true), onLeaveBack: () => dark(false)
  });
}

/* --- About --- */
function initAbout() {
  // Subtitle
  gsap.from('.about .sub-num', {
    y: '100%', duration: .6, ease: 'power3.out',
    scrollTrigger: { trigger: '.about .sub-line', start: 'top 85%' }
  });
  gsap.from('.about .sub-label', {
    y: '100%', duration: .6, delay: .1, ease: 'power3.out',
    scrollTrigger: { trigger: '.about .sub-line', start: 'top 85%' }
  });
  // Acknowledgment
  gsap.from('.about-ack', {
    y: 40, opacity: 0, duration: .8, ease: 'power3.out',
    scrollTrigger: { trigger: '.about-ack', start: 'top 85%' }
  });
  // Big heading word-split
  const heading = document.querySelector('.about-heading');
  if (heading) {
    const words = heading.textContent.trim().split(/\s+/);
    heading.innerHTML = words.map(w =>
      `<span class="word-wrap"><span class="word">${w}</span></span>`
    ).join(' ');
    gsap.from('.about-heading .word', {
      y: '100%', opacity: 0, duration: .6, stagger: .03, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-heading', start: 'top 80%' }
    });
  }
  // Details
  gsap.from('.about-detail-l', { y: 30, opacity: 0, duration: .7, ease: 'power3.out',
    scrollTrigger: { trigger: '.about-detail-l', start: 'top 85%' } });
  gsap.from('.about-detail-r', { y: 30, opacity: 0, duration: .7, ease: 'power3.out',
    scrollTrigger: { trigger: '.about-detail-r', start: 'top 85%' } });
  // Corners
  document.querySelectorAll('.about .corner').forEach(c => {
    gsap.from(c, { scale: 0, duration: .5, ease: 'power3.out',
      scrollTrigger: { trigger: '.about', start: 'top 80%' } });
  });
}

/* --- Works --- */
function initWorks() {
  gsap.from('.works-top', { y: 30, opacity: 0, duration: .7, ease: 'power3.out',
    scrollTrigger: { trigger: '.works-top', start: 'top 85%' } });

  document.querySelectorAll('.wi').forEach(item => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: item, start: 'top 80%' }
    });
    tl.from(item.querySelector('.wi-name'), { y: '100%', duration: .8, ease: 'power3.out' }, 0)
      .from(item.querySelector('.wi-bracket-l'), { x: '100%', opacity: 0, duration: .6, ease: 'power3.out' }, .1)
      .from(item.querySelector('.wi-bracket-r'), { x: '-100%', opacity: 0, duration: .6, ease: 'power3.out' }, .1)
      .from(item.querySelector('.wi-line-l'), { scaleX: 0, transformOrigin: 'right', duration: .5, ease: 'power3.out' }, .2)
      .from(item.querySelector('.wi-line-r'), { scaleX: 0, transformOrigin: 'left', duration: .5, ease: 'power3.out' }, .2)
      .from(item.querySelector('.wi-img'), { clipPath: 'inset(100% 0 0 0)', duration: .9, ease: 'power3.out' }, .3)
      .from(item.querySelector('.wi-img img'), { scale: 1.2, duration: 1.2, ease: 'power3.out' }, .3)
      .from(item.querySelectorAll('.wi-meta span'), { y: '100%', duration: .5, stagger: .1, ease: 'power3.out' }, .6);
  });
}

/* --- Works grid --- */
function initWorksGrid() {
  document.querySelectorAll('.wgrid-img').forEach(el => {
    gsap.from(el, { y: 80, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' } });
    if (W() >= 1200 && !isMobile) {
      gsap.to(el, { y: () => -(30 + Math.random() * 50), ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
    }
  });
}

/* ==========================================================
   VISION SECTION (03) — the key scroll animation
   Matches reference: sticky image, horizontal title scroll,
   content crossfade, parallax image, all scrub-driven
   ========================================================== */
function initVision() {
  const section    = document.querySelector('.vision');
  const scrollArea = document.querySelector('.vision-scroll');
  const titles     = document.getElementById('visionTitles');
  const contents   = document.getElementById('visionContents');
  const titleItems = document.querySelectorAll('.vision-ti');
  const ctItems    = document.querySelectorAll('.vision-ct');
  const vImg       = document.querySelector('.vision-img');
  const prlx       = document.querySelector('.vision-img-prlx');
  if (!section || !scrollArea) return;

  // Image scale-in on approach
  gsap.from(vImg, {
    scale: .6, opacity: 0, duration: 1, ease: 'power2.out',
    scrollTrigger: { trigger: '.vision-bg', start: 'top 60%', end: 'top 20%', scrub: 1 }
  });

  // Show / hide titles & contents
  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top bottom', end: 'bottom top',
    onEnter()     { gsap.set([titles, contents], { opacity: 1, visibility: 'visible' }); },
    onLeaveBack() { gsap.set([titles, contents], { opacity: 0, visibility: 'hidden' }); }
  });

  // Horizontal title scroll — scrubbed
  gsap.to(titles, {
    x: () => {
      if (titleItems.length <= 1) return 0;
      return -(titleItems[0].offsetWidth + (titleItems[1] ? titleItems[1].offsetWidth : 0));
    },
    ease: 'none',
    scrollTrigger: {
      trigger: scrollArea, start: 'top top', end: 'bottom bottom',
      scrub: 1, invalidateOnRefresh: true
    }
  });

  // Parallax on vision image (scrub)
  if (prlx && W() >= 768 && !isMobile) {
    gsap.fromTo(prlx, { y: '-15%' }, {
      y: '15%', ease: 'none',
      scrollTrigger: { trigger: scrollArea, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
    });
  }

  // Content & title opacity cycling (3 segments)
  const n = titleItems.length;
  for (let i = 0; i < n; i++) {
    const s = i / n, e = (i + 1) / n;
    ScrollTrigger.create({
      trigger: scrollArea,
      start: () => `top+=${s * (scrollArea.scrollHeight - window.innerHeight)}px top`,
      end:   () => `top+=${e * (scrollArea.scrollHeight - window.innerHeight)}px top`,
      onEnter: () => setActive(i),
      onEnterBack: () => setActive(i)
    });
  }

  function setActive(idx) {
    titleItems.forEach((t, i) => {
      gsap.to(t, { opacity: i === idx ? 1 : .32, duration: .5, ease: 'power2.out' });
    });
    ctItems.forEach((c, i) => {
      if (i === idx) {
        c.classList.add('active');
        gsap.to(c, { opacity: 1, duration: .5, ease: 'power2.out' });
      } else {
        gsap.to(c, { opacity: 0, duration: .4, ease: 'power2.out',
          onComplete() { c.classList.remove('active'); }
        });
      }
    });
  }

  // Separator line + text reveal
  gsap.from('.vision-sep-line', { scaleX: 0, transformOrigin: 'left', duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: scrollArea, start: 'top 80%' } });
  gsap.from('.vision-sep-num span', { y: '100%', duration: .6, ease: 'power3.out',
    scrollTrigger: { trigger: scrollArea, start: 'top 80%' } });
  gsap.from('.vision-sep-label span', { y: '100%', duration: .6, delay: .1, ease: 'power3.out',
    scrollTrigger: { trigger: scrollArea, start: 'top 80%' } });
}

/* --- Process --- */
function initProcess() {
  const steps = document.querySelectorAll('.process-step');
  const imgs  = document.querySelectorAll('.process-img');

  // Click handler
  steps.forEach(s => s.addEventListener('click', () => {
    const i = parseInt(s.dataset.idx);
    steps.forEach(x => x.classList.toggle('active', x === s));
    imgs.forEach((x, j) => x.classList.toggle('active', j === i));
  }));

  // Auto-cycle synced to scroll
  ScrollTrigger.create({
    trigger: '.process', start: 'top 60%', end: 'bottom 40%',
    onUpdate(self) {
      const i = Math.min(Math.floor(self.progress * steps.length), steps.length - 1);
      steps.forEach((s, j) => s.classList.toggle('active', j === i));
      imgs.forEach((x, j) => x.classList.toggle('active', j === i));
    }
  });

  // Reveal anims
  gsap.from('.process .sub-num', { y: '100%', duration: .6, ease: 'power3.out',
    scrollTrigger: { trigger: '.process', start: 'top 80%' } });
  gsap.from('.process .sub-label', { y: '100%', duration: .6, delay: .1, ease: 'power3.out',
    scrollTrigger: { trigger: '.process', start: 'top 80%' } });
  gsap.from('.process-step', { y: 20, opacity: 0, duration: .5, stagger: .08, ease: 'power3.out',
    scrollTrigger: { trigger: '.process-steps', start: 'top 85%' } });
  // Corners
  document.querySelectorAll('.process .corner').forEach(c => {
    gsap.from(c, { scale: 0, duration: .5, ease: 'power3.out',
      scrollTrigger: { trigger: '.process', start: 'top 80%' } });
  });
}

/* ==========================================================
   MOBILE MENU
   ========================================================== */
function initMenu() {
  const menu = document.getElementById('menu');
  const overlay = document.getElementById('menuOverlay');
  const open = document.getElementById('menuOpen');
  const close = document.getElementById('menuClose');

  function show() {
    menu.classList.add('open');
    overlay.classList.add('open');
    document.body.classList.add('no-scroll');
    gsap.from('.menu-link span', { y: '100%', duration: .6, stagger: .06, ease: 'power3.out', delay: .3 });
  }
  function hide() {
    menu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
  if (open) open.addEventListener('click', show);
  if (close) close.addEventListener('click', hide);
  if (overlay) overlay.addEventListener('click', hide);
  document.querySelectorAll('.menu-link').forEach(a => a.addEventListener('click', hide));
}

/* ==========================================================
   MISC
   ========================================================== */
function initBackToTop() {
  const btn = document.getElementById('btt');
  if (btn) btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initNewsletter() {
  const f = document.getElementById('nlForm');
  if (f) f.addEventListener('submit', e => {
    e.preventDefault();
    const inp = f.querySelector('input');
    if (inp && inp.value) { inp.value = ''; inp.placeholder = 'Thanks for joining!';
      setTimeout(() => inp.placeholder = 'Enter your email', 3000); }
  });
}

function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* ==========================================================
   BOOT
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initLazy();
  initClock();
  initMenu();
  initBackToTop();
  initNewsletter();
  initSmoothLinks();
  initLoader();
});

let rt;
window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 250); });
