// ============================================================
//  ANIMATIONS & INTERACTIVITY
//  Cloned from telhaclarke.com.au animation patterns
//  Using GSAP + ScrollTrigger
// ============================================================

(function () {
  'use strict';

  // ── Viewport height fix (mobile address bar) ───────────────
  function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }
  setVH();
  window.addEventListener('resize', setVH);

  // ── Wait for GSAP to load ─────────────────────────────────
  function init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(init, 50);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Add loading state
    document.body.classList.add('is-loading');

    // ══════════════════════════════════════════════════════════
    //  CLOCK (header time display)
    // ══════════════════════════════════════════════════════════
    function updateClock() {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;

      const hourEl = document.getElementById('hour');
      const minEl = document.getElementById('minute');
      const ampmEl = document.getElementById('ampm');
      const semiEl = document.getElementById('semicolon');

      if (hourEl) hourEl.textContent = h;
      if (minEl) minEl.textContent = m;
      if (ampmEl) ampmEl.textContent = ampm;

      // Blink semicolon
      if (semiEl) {
        semiEl.style.opacity = semiEl.style.opacity === '0' ? '1' : '0';
      }
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ══════════════════════════════════════════════════════════
    //  LAZY IMAGE LOADING
    // ══════════════════════════════════════════════════════════
    function lazyLoadImages() {
      const images = document.querySelectorAll('img.lazy:not(.loaded)');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
              }
              if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
              }
              if (img.dataset.sizes) {
                img.sizes = img.dataset.sizes;
              }
              img.onload = () => img.classList.add('loaded');
              img.onerror = () => img.classList.add('loaded');
              observer.unobserve(img);
            }
          });
        },
        { rootMargin: '200px 0px' }
      );

      images.forEach((img) => observer.observe(img));
    }

    // Run after content.js populates the DOM
    setTimeout(lazyLoadImages, 100);

    // ══════════════════════════════════════════════════════════
    //  LOADER ANIMATION SEQUENCE
    //  1. White panel visible, black logo text visible
    //  2. Black overlay fades in (logo-bottom clip reveals)
    //  3. Counter animates 0% → 100%
    //  4. Loader slides away revealing page
    // ══════════════════════════════════════════════════════════
    function runLoader() {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.classList.remove('is-loading');
          // Re-run lazy load after loader completes
          lazyLoadImages();
          // Init scroll animations after page is visible
          initScrollAnimations();
        },
      });

      // Phase 1: Reveal loader text elements
      tl.to('.loader-title, .loader-location, .loader-loading, .loader-counter', {
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.3,
      });

      // Phase 2: Animate counter 0 → 100
      const counterEl = document.querySelector('.loader-counter');
      const counterObj = { val: 0 };
      tl.to(
        counterObj,
        {
          val: 100,
          duration: 2,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (counterEl) counterEl.textContent = Math.round(counterObj.val) + '%';
          },
        },
        '-=0.4'
      );

      // Phase 3: Black overlay fades in + logo bottom clip reveals
      tl.to(
        '.loader-overlay',
        {
          opacity: 1,
          duration: 1,
          ease: 'power2.inOut',
        },
        '-=1.2'
      );

      tl.to(
        '.loader-logo-bottom',
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1,
          ease: 'power2.inOut',
        },
        '-=1'
      );

      // Phase 4: Slide loader panel up, revealing content
      tl.to('.loader-panel', {
        yPercent: -100,
        duration: 1,
        ease: 'power3.inOut',
      });

      tl.to(
        '.loader',
        {
          yPercent: -100,
          duration: 1,
          ease: 'power3.inOut',
        },
        '-=1'
      );

      // Phase 5: Animate header elements in
      tl.from(
        '.header-logo',
        {
          yPercent: 100,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.4'
      );

      tl.from(
        '.header-link, .header-time, .header-location, .header-contact',
        {
          yPercent: 100,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.05,
        },
        '-=0.4'
      );

      // Phase 6: Hero content reveals
      tl.from(
        '.cover-home-content',
        {
          yPercent: 100,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.3'
      );
    }

    runLoader();

    // ══════════════════════════════════════════════════════════
    //  HEADER COLOR CHANGE ON DARK SECTIONS
    // ══════════════════════════════════════════════════════════
    function initHeaderColorChange() {
      const header = document.querySelector('.header');
      if (!header) return;

      // When cover image is in view, header should be dark (white text)
      ScrollTrigger.create({
        trigger: '.cover-home',
        start: 'top top',
        end: 'bottom top',
        onEnter: () => header.classList.add('is-dark'),
        onLeave: () => header.classList.remove('is-dark'),
        onEnterBack: () => header.classList.add('is-dark'),
        onLeaveBack: () => header.classList.remove('is-dark'),
      });

      // Vision section is also dark
      const vision = document.querySelector('.vision');
      if (vision) {
        ScrollTrigger.create({
          trigger: '.vision',
          start: 'top top',
          end: 'bottom top',
          onEnter: () => header.classList.add('is-dark'),
          onLeave: () => header.classList.remove('is-dark'),
          onEnterBack: () => header.classList.add('is-dark'),
          onLeaveBack: () => header.classList.remove('is-dark'),
        });
      }
    }

    // ══════════════════════════════════════════════════════════
    //  SCROLL-TRIGGERED ANIMATIONS
    // ══════════════════════════════════════════════════════════
    function initScrollAnimations() {
      initHeaderColorChange();
      initHeroParallax();
      initAboutAnimations();
      initWorksAnimations();
      initWorksGridParallax();
      initVisionAnimations();
      initProcessAnimations();
      initFooterAnimations();
    }

    // ── Hero Parallax ────────────────────────────────────────
    function initHeroParallax() {
      const prlx = document.querySelector('.cover-home-image-prlx');
      if (!prlx) return;

      gsap.to(prlx, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.cover-home',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Scroll text animation
      gsap.from('.cover-home-scroll-bracket', {
        x: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.cover-home',
          start: 'top top',
        },
      });
    }

    // ── About Section Animations ─────────────────────────────
    function initAboutAnimations() {
      const about = document.querySelector('.about');
      if (!about) return;

      // Subtitle reveal
      gsap.from('.about .subtitle-number, .about .subtitle-text', {
        yPercent: 100,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.about',
          start: 'top 80%',
        },
      });

      // Acknowledgment text fade in
      gsap.from('.about-acknowledgment', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-acknowledgment',
          start: 'top 85%',
        },
      });

      // Title reveal (word by word effect approximation)
      gsap.from('.about-title', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-title-row',
          start: 'top 80%',
        },
      });

      // Label + description
      gsap.from('.about-label', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-label-col',
          start: 'top 85%',
        },
      });

      gsap.from('.about-description', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-desc-col',
          start: 'top 85%',
        },
      });
    }

    // ── Works Section Animations ─────────────────────────────
    function initWorksAnimations() {
      const items = document.querySelectorAll('.works-item');
      if (!items.length) return;

      items.forEach((item) => {
        const title = item.querySelector('.works-item-title');
        const bracketL = item.querySelector('.works-item-bracket-left');
        const bracketR = item.querySelector('.works-item-bracket-right');
        const image = item.querySelector('.works-item-image');
        const meta = item.querySelectorAll('.works-item-category, .works-item-date');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
          },
        });

        // Brackets spread
        if (bracketL && bracketR) {
          tl.from([bracketL, bracketR], {
            x: (i) => (i === 0 ? 30 : -30),
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
          });
        }

        // Title reveal
        if (title) {
          tl.from(
            title,
            {
              yPercent: 100,
              opacity: 0,
              duration: 0.8,
              ease: 'power3.out',
            },
            '-=0.4'
          );
        }

        // Image reveal
        if (image) {
          tl.from(
            image,
            {
              clipPath: 'inset(100% 0 0 0)',
              duration: 1,
              ease: 'power3.inOut',
            },
            '-=0.4'
          );
        }

        // Meta text
        if (meta.length) {
          tl.from(
            meta,
            {
              yPercent: 100,
              duration: 0.6,
              ease: 'power3.out',
              stagger: 0.1,
            },
            '-=0.4'
          );
        }

        // Horizontal lines
        const lines = item.querySelectorAll('.works-item-line-left, .works-item-line-right');
        if (lines.length) {
          tl.from(
            lines,
            {
              scaleX: 0,
              duration: 0.6,
              ease: 'power3.out',
            },
            '-=0.8'
          );
        }
      });
    }

    // ── Works Grid Parallax ──────────────────────────────────
    function initWorksGridParallax() {
      const gridImages = document.querySelectorAll('.works-grid-image');
      if (!gridImages.length) return;

      gridImages.forEach((img) => {
        const size = img.closest('.works-grid-item')?.dataset.size || 'medium';
        const speed = size === 'large' ? -80 : size === 'small' ? -30 : -50;

        gsap.to(img, {
          y: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.works-grid-cell'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // Fade in grid items
      document.querySelectorAll('.works-grid-item').forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
          },
        });
      });
    }

    // ══════════════════════════════════════════════════════════
    //  VISION SECTION ANIMATIONS
    //  - Image grows from center
    //  - Titles scroll horizontally
    //  - Content fades between sections
    // ══════════════════════════════════════════════════════════
    function initVisionAnimations() {
      const vision = document.querySelector('.vision');
      if (!vision) return;

      const titles = document.querySelector('.vision-titles');
      const contents = document.querySelector('.vision-contents');
      const imageWrapper = document.querySelector('.vision-image-wrapper');

      // Make titles and contents visible
      if (titles) {
        gsap.to(titles, {
          opacity: 1,
          visibility: 'visible',
          duration: 0.6,
          scrollTrigger: {
            trigger: '.vision-scroll-area',
            start: 'top 80%',
          },
        });
      }

      if (contents) {
        gsap.to(contents, {
          opacity: 1,
          visibility: 'visible',
          duration: 0.6,
          scrollTrigger: {
            trigger: '.vision-scroll-area',
            start: 'top 80%',
          },
        });
      }

      // Image scale-in effect
      if (imageWrapper) {
        gsap.from(imageWrapper, {
          scale: 0.6,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.vision-sticky',
            start: 'top 60%',
          },
        });
      }

      // Horizontal scrolling titles on scroll
      const titleWraps = document.querySelectorAll('.vision-title-wrap');
      const titleEls = document.querySelectorAll('.vision-title');
      const contentEls = document.querySelectorAll('.vision-content');

      if (titleWraps.length > 1) {
        // Scroll-driven title switching
        const scrollArea = document.querySelector('.vision-scroll-area');
        if (!scrollArea) return;

        ScrollTrigger.create({
          trigger: scrollArea,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const totalTitles = titleEls.length;
            const activeIndex = Math.min(
              Math.floor(progress * totalTitles),
              totalTitles - 1
            );

            // Update title opacities
            titleEls.forEach((t, i) => {
              if (i === activeIndex) {
                gsap.to(t, { opacity: 1, duration: 0.3 });
              } else {
                gsap.to(t, { opacity: 0.32, duration: 0.3 });
              }
            });

            // Horizontal scroll effect on titles container
            if (titles && totalTitles > 1) {
              const translateX = -(progress * (totalTitles - 1) * 100) / totalTitles;
              gsap.to(titles, {
                xPercent: translateX * 0.3,
                duration: 0.3,
                ease: 'none',
              });
            }

            // Switch content
            contentEls.forEach((c, i) => {
              if (i === activeIndex) {
                c.classList.add('active');
              } else {
                c.classList.remove('active');
              }
            });
          },
        });
      }

      // Vision image parallax
      const visionParallax = document.querySelector('.vision-image-parallax');
      if (visionParallax) {
        gsap.to(visionParallax, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: '.vision',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }

    // ══════════════════════════════════════════════════════════
    //  PROCESS SECTION
    //  - Click step → switch active image
    //  - Scroll reveal
    // ══════════════════════════════════════════════════════════
    function initProcessAnimations() {
      const process = document.querySelector('.process');
      if (!process) return;

      // Reveal animations
      gsap.from('.process .subtitle-number, .process .subtitle-text', {
        yPercent: 100,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.process',
          start: 'top 80%',
        },
      });

      gsap.from('.process-steps-col', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.process-steps-col',
          start: 'top 85%',
        },
      });

      gsap.from('.process-description', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.process-desc-col',
          start: 'top 85%',
        },
      });

      // Corner bracket animations
      gsap.from('.process .corner-h', {
        scaleX: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.05,
        scrollTrigger: {
          trigger: '.process',
          start: 'top 80%',
        },
      });

      gsap.from('.process .corner-v', {
        scaleY: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.05,
        scrollTrigger: {
          trigger: '.process',
          start: 'top 80%',
        },
      });

      // Click handler for process steps
      document.querySelectorAll('.process-item').forEach((item) => {
        item.addEventListener('click', () => {
          const index = parseInt(item.dataset.index, 10);

          // Update active step
          document.querySelectorAll('.process-item').forEach((s) => s.classList.remove('active'));
          item.classList.add('active');

          // Update active image
          document.querySelectorAll('.process-image').forEach((img, i) => {
            if (i === index) {
              img.classList.add('active');
            } else {
              img.classList.remove('active');
            }
          });
        });
      });
    }

    // ── Footer Animations ────────────────────────────────────
    function initFooterAnimations() {
      const footer = document.querySelector('.footer');
      if (!footer) return;

      gsap.from('.footer-cta', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.footer',
          start: 'top 80%',
        },
      });

      gsap.from('.footer-col-nav, .footer-col-contact', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.footer',
          start: 'top 70%',
        },
      });

      // Back to top
      document.querySelectorAll('.footer-scroll').forEach((btn) => {
        btn.addEventListener('click', () => {
          gsap.to(window, {
            scrollTo: 0,
            duration: 1.5,
            ease: 'power3.inOut',
          });
          // Fallback for browsers without scrollTo plugin
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
    }

    // ══════════════════════════════════════════════════════════
    //  MOBILE MENU
    // ══════════════════════════════════════════════════════════
    function initMobileMenu() {
      const toggler = document.querySelector('.header-toggler');
      const closer = document.querySelector('.header-toggler-close');
      const menu = document.querySelector('.header-menu');
      const overlay = document.querySelector('.header-overlay');

      if (!toggler || !menu) return;

      function openMenu() {
        menu.classList.add('is-open');
        document.body.style.overflow = 'hidden';

        gsap.to(menu, {
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.6,
          ease: 'power3.inOut',
        });

        if (overlay) {
          gsap.to(overlay, {
            opacity: 0.5,
            duration: 0.4,
            ease: 'power2.out',
          });
        }

        // Animate links in
        gsap.from('.header-link-mobile', {
          yPercent: 100,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.08,
          delay: 0.3,
        });

        gsap.from('.header-social-link', {
          yPercent: 100,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.05,
          delay: 0.5,
        });
      }

      function closeMenu() {
        gsap.to(menu, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.5,
          ease: 'power3.inOut',
          onComplete: () => {
            menu.classList.remove('is-open');
            document.body.style.overflow = '';
          },
        });

        if (overlay) {
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      }

      toggler.addEventListener('click', openMenu);
      if (closer) closer.addEventListener('click', closeMenu);

      // Close on link click
      menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
      });
    }

    initMobileMenu();

    // ══════════════════════════════════════════════════════════
    //  NEWSLETTER FORM
    // ══════════════════════════════════════════════════════════
    const form = document.getElementById('newsletter-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.classList.add('submitted');
        setTimeout(() => form.classList.remove('submitted'), 3000);
      });
    }

    // ══════════════════════════════════════════════════════════
    //  SMOOTH ANCHOR SCROLLING
    // ══════════════════════════════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = target.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      });
    });

    // ══════════════════════════════════════════════════════════
    //  ABOUT CORNER BRACKETS ANIMATION
    // ══════════════════════════════════════════════════════════
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
      gsap.from('.about .corner-h', {
        scaleX: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.05,
        scrollTrigger: {
          trigger: '.about',
          start: 'top 80%',
        },
      });

      gsap.from('.about .corner-v', {
        scaleY: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.05,
        scrollTrigger: {
          trigger: '.about',
          start: 'top 80%',
        },
      });
    }
  }

  // ── Start ──────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
