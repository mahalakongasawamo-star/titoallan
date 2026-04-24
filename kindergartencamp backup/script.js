// =============================================================================
// KINDERGARTEN CAMP — Interactive Motion Design & Animations
// Cursor-reactive particles, scroll storytelling, tilt effects, hero slider
// =============================================================================

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // THEME TOGGLE — Light/Dark mode with localStorage persistence
  // -------------------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

  // Restore saved theme or respect OS preference
  function getPreferredTheme() {
    const saved = localStorage.getItem('kclc-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('kclc-theme', theme);
    themeToggle.setAttribute('aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }

  // Apply on load (before paint, via attribute already on <html>)
  applyTheme(getPreferredTheme());

  themeToggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Listen for OS theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('kclc-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // -------------------------------------------------------------------------
  // CURSOR GLOW — Follows mouse with smooth interpolation
  // -------------------------------------------------------------------------
  const cursorGlow = document.querySelector('.cursor-glow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursorGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    if (cursorGlow) {
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
    }
    requestAnimationFrame(animateCursorGlow);
  }
  animateCursorGlow();

  // -------------------------------------------------------------------------
  // CURSOR-REACTIVE PARTICLES — Move away from cursor (alive, bouncing)
  // -------------------------------------------------------------------------
  const particles = document.querySelectorAll('.particle');

  function animateParticles() {
    particles.forEach((particle) => {
      const speed = parseFloat(particle.dataset.speed) || 0.03;
      const rect = particle.getBoundingClientRect();
      const px = rect.left + rect.width / 2;
      const py = rect.top + rect.height / 2;

      const dx = mouseX - px;
      const dy = mouseY - py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 300;

      if (dist < maxDist) {
        const force = (1 - dist / maxDist) * 60;
        const angle = Math.atan2(dy, dx);
        const offsetX = -Math.cos(angle) * force;
        const offsetY = -Math.sin(angle) * force;
        particle.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${offsetX * 0.5}deg)`;
      } else {
        particle.style.transform = '';
      }
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // -------------------------------------------------------------------------
  // HERO SLIDER — Auto-advances with Ken Burns zoom
  // -------------------------------------------------------------------------
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;

  function advanceSlide() {
    slides.forEach((s) => s.classList.remove('active'));
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  if (slides.length > 1) {
    setInterval(advanceSlide, 6000);
  }

  // -------------------------------------------------------------------------
  // SCROLL ANIMATIONS — IntersectionObserver with staggered delays
  // -------------------------------------------------------------------------
  const animatedElements = document.querySelectorAll('[data-animate]');

  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay) || 0;
          setTimeout(() => {
            el.classList.add('visible');
          }, delay);
          scrollObserver.unobserve(el);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  animatedElements.forEach((el) => scrollObserver.observe(el));

  // -------------------------------------------------------------------------
  // TILT EFFECT — 3D perspective tilt on hover (interactive graphics)
  // -------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        card.style.transition = '';
      }, 600);
    });
  });

  // -------------------------------------------------------------------------
  // STICKY HEADER — Add scrolled class for style change
  // -------------------------------------------------------------------------
  const header = document.getElementById('siteHeader');

  function updateHeader() {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // -------------------------------------------------------------------------
  // ACTIVE NAV LINK — Highlight current page or scroll section
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Mark current page link as active
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && href === currentPage) {
      link.classList.add('active');
    }
  });

  // For single-page sections, update on scroll
  function updateActiveNav() {
    if (sections.length === 0) return;
    const scrollY = window.scrollY + 100;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // -------------------------------------------------------------------------
  // NAV DROPDOWN — Programs submenu toggle
  // -------------------------------------------------------------------------
  document.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    const menu = dropdown.querySelector('.nav-dropdown-menu');

    if (toggle && menu) {
      toggle.addEventListener('click', (e) => {
        // On mobile, toggle dropdown
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('open');
        }
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown.open').forEach((d) => d.classList.remove('open'));
    }
  });

  // -------------------------------------------------------------------------
  // MOBILE NAVIGATION
  // -------------------------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when clicking a link
  navLinksContainer.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinksContainer.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // -------------------------------------------------------------------------
  // PROGRAM CARD TOGGLES — Expand/collapse details
  // -------------------------------------------------------------------------
  document.querySelectorAll('.program-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const details = document.getElementById(targetId);
      const isOpen = details.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);

      const textEl = btn.querySelector('.toggle-text');
      textEl.textContent = isOpen ? 'Show Less' : 'Read More';
    });
  });

  // -------------------------------------------------------------------------
  // FAQ ACCORDION — Expand/collapse with single-open behavior
  // -------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';

      // Close all others first
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-answer').classList.remove('open');
        }
      });

      // Toggle this one
      if (isOpen) {
        question.setAttribute('aria-expanded', 'false');
        answer.classList.remove('open');
        item.classList.remove('active');
      } else {
        question.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
        item.classList.add('active');
      }
    });
  });

  // -------------------------------------------------------------------------
  // GALLERY LIGHTBOX — Full expand on click with prev/next navigation
  // -------------------------------------------------------------------------
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('galleryLightbox');

  if (lightbox) {
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxClose = lightbox.querySelector('.gallery-lightbox-close');
    const lightboxPrev = lightbox.querySelector('.gallery-lightbox-prev');
    const lightboxNext = lightbox.querySelector('.gallery-lightbox-next');
    let currentLightboxIndex = 0;

    function openLightbox(index) {
      currentLightboxIndex = index;
      const img = galleryItems[index].querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
      currentLightboxIndex = (currentLightboxIndex + direction + galleryItems.length) % galleryItems.length;
      const img = galleryItems[currentLightboxIndex].querySelector('img');
      lightboxImg.style.opacity = '0';
      lightboxImg.style.transform = 'scale(0.9)';
      setTimeout(() => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      }, 150);
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });

    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    });

    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    });

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  // -------------------------------------------------------------------------
  // IMAGE CAROUSEL — Slide transition with click-to-expand lightbox
  // -------------------------------------------------------------------------
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselDotsContainer = document.getElementById('carouselDots');

  if (carouselTrack) {
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    const prevBtn = carouselTrack.closest('.carousel').querySelector('.carousel-prev');
    const nextBtn = carouselTrack.closest('.carousel').querySelector('.carousel-next');
    let currentPage = 0;

    function getSlidesPerView() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getTotalPages() {
      return Math.ceil(slides.length / getSlidesPerView());
    }

    function updateCarousel() {
      const perView = getSlidesPerView();
      const gap = 12;
      const slideWidth = (carouselTrack.parentElement.offsetWidth - gap * (perView - 1)) / perView;
      const offset = currentPage * (slideWidth + gap) * perView;
      carouselTrack.style.transform = `translateX(-${offset}px)`;
      updateDots();
    }

    function buildDots() {
      if (!carouselDotsContainer) return;
      carouselDotsContainer.innerHTML = '';
      const total = getTotalPages();
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide group ' + (i + 1));
        dot.addEventListener('click', () => {
          currentPage = i;
          updateCarousel();
        });
        carouselDotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!carouselDotsContainer) return;
      carouselDotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentPage);
      });
    }

    prevBtn.addEventListener('click', () => {
      currentPage = (currentPage - 1 + getTotalPages()) % getTotalPages();
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentPage = (currentPage + 1) % getTotalPages();
      updateCarousel();
    });

    // Click slide to open lightbox
    slides.forEach((slide, index) => {
      slide.addEventListener('click', () => {
        const lb = document.getElementById('galleryLightbox');
        const lbImg = document.getElementById('lightboxImage');
        if (lb && lbImg) {
          const img = slide.querySelector('img');
          lbImg.src = img.src;
          lbImg.alt = img.alt;
          lb.classList.add('open');
          lb.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';

          // Set lightbox index for prev/next navigation
          window._carouselLightboxIndex = index;
          window._carouselSlides = slides;
        }
      });
    });

    // Auto-advance every 5s
    let autoPlay = setInterval(() => {
      currentPage = (currentPage + 1) % getTotalPages();
      updateCarousel();
    }, 5000);

    // Pause on hover
    carouselTrack.closest('.carousel').addEventListener('mouseenter', () => clearInterval(autoPlay));
    carouselTrack.closest('.carousel').addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => {
        currentPage = (currentPage + 1) % getTotalPages();
        updateCarousel();
      }, 5000);
    });

    // Rebuild on resize
    window.addEventListener('resize', () => {
      currentPage = 0;
      buildDots();
      updateCarousel();
    });

    buildDots();
    updateCarousel();

    // Override lightbox prev/next for carousel slides
    const lb = document.getElementById('galleryLightbox');
    if (lb) {
      const lbPrev = lb.querySelector('.gallery-lightbox-prev');
      const lbNext = lb.querySelector('.gallery-lightbox-next');
      const lbImg = document.getElementById('lightboxImage');

      function carouselLightboxNav(dir) {
        if (!window._carouselSlides) return;
        const total = window._carouselSlides.length;
        window._carouselLightboxIndex = (window._carouselLightboxIndex + dir + total) % total;
        const img = window._carouselSlides[window._carouselLightboxIndex].querySelector('img');
        lbImg.style.opacity = '0';
        setTimeout(() => {
          lbImg.src = img.src;
          lbImg.alt = img.alt;
          lbImg.style.opacity = '1';
        }, 150);
      }

      lbPrev.addEventListener('click', (e) => { e.stopPropagation(); carouselLightboxNav(-1); });
      lbNext.addEventListener('click', (e) => { e.stopPropagation(); carouselLightboxNav(1); });

      lb.querySelector('.gallery-lightbox-close').addEventListener('click', (e) => {
        e.stopPropagation();
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });

      lb.addEventListener('click', (e) => {
        if (e.target === lb) {
          lb.classList.remove('open');
          lb.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      });

      document.addEventListener('keydown', (e) => {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
        if (e.key === 'ArrowLeft') carouselLightboxNav(-1);
        if (e.key === 'ArrowRight') carouselLightboxNav(1);
      });
    }
  }

  // -------------------------------------------------------------------------
  // SMOOTH SCROLL — Only for same-page # anchors
  // -------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 72;
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - headerOffset,
          behavior: 'smooth',
        });
      }
    });
  });

  // -------------------------------------------------------------------------
  // FORMS — Generic validation & feedback for all site forms
  // -------------------------------------------------------------------------
  document.querySelectorAll('form[data-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check required fields
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach((field) => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#cd651b';
          field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
        }
      });

      if (!valid) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = 'Sent Successfully!';
        submitBtn.style.background = '#83cd16';
        form.reset();

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  });

  // -------------------------------------------------------------------------
  // PARALLAX — Subtle depth on scroll for hero
  // -------------------------------------------------------------------------
  const heroContent = document.querySelector('.hero-content');
  const heroParticles = document.querySelector('.hero-particles');

  function parallaxScroll() {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;

    if (scrollY < heroHeight) {
      const ratio = scrollY / heroHeight;
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
        heroContent.style.opacity = 1 - ratio * 1.2;
      }
      if (heroParticles) {
        heroParticles.style.transform = `translateY(${scrollY * 0.15}px)`;
      }
    }
  }

  window.addEventListener('scroll', parallaxScroll, { passive: true });

  // -------------------------------------------------------------------------
  // COUNTER ANIMATION — Animate any [data-count] element on scroll
  // -------------------------------------------------------------------------
  function animateCounter(el, start, end, suffix, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // .float-number (legacy)
  const floatNumber = document.querySelector('.float-number');
  if (floatNumber) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { animateCounter(floatNumber, 0, 14, '+', 1500); obs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    obs.observe(floatNumber);
  }

  // Generic [data-count] elements (trust badges, stats)
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(el, 0, target, suffix, 1800);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterObs.observe(el);
  });

  // -------------------------------------------------------------------------
  // MAGNETIC BUTTONS — Subtle pull towards cursor
  // -------------------------------------------------------------------------
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        btn.style.transition = '';
      }, 400);
    });
  });

  // -------------------------------------------------------------------------
  // STAGGER REVEAL — Values section icons bounce in
  // -------------------------------------------------------------------------
  const valueIcons = document.querySelectorAll('.value-icon');

  valueIcons.forEach((icon) => {
    const iconObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            icon.style.animation = 'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
            iconObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    iconObserver.observe(icon);
  });

  // Add bounceIn keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes bounceIn {
      0% { transform: scale(0) rotate(-10deg); opacity: 0; }
      60% { transform: scale(1.15) rotate(3deg); opacity: 1; }
      80% { transform: scale(0.95) rotate(-1deg); }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

})();
