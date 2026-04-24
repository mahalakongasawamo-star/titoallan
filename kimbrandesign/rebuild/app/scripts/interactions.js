// Phase 6 — Interactive elements.
// Covers every row in SITE_SPEC.md § 8:
//   - Header + sticky nav click → smooth-scroll via Lenis' scrollTo
//   - <summary> click → animated height expand/collapse on .faq__answer (4.12)
//   - mailto click → copy email to clipboard + toast the snackbar (4.13)
// Hover states live in sections.css so they apply without JS.

(function interactions() {
  const lenis = window.__lenis || null;
  const snackbar = document.querySelector('kim-snackbar.snackbar');
  const SNACKBAR_HOLD_MS = 2500;
  const FAQ_DURATION = 0.4;
  const FAQ_EASE = 'power2.inOut';

  // --- 4.12-adjacent: FAQ <details> animated height ---------------------
  // Native <details> snaps open. We intercept the summary click, animate the
  // answer's height with GSAP (fall back to CSS transition if gsap missing),
  // and only toggle the [open] attribute around the animation so the
  // accessibility state still advertises correctly.
  document.querySelectorAll('kim-faq details').forEach((d) => {
    const summary = d.querySelector('summary');
    const answer = d.querySelector('.faq__answer');
    if (!summary || !answer) return;

    // Start collapsed — measurable height, no visible content, overflow hidden.
    answer.style.overflow = 'hidden';
    answer.style.height = '0px';

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = d.hasAttribute('open');

      const animate = (from, to, done) => {
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(
            answer,
            { height: from },
            { height: to, duration: FAQ_DURATION, ease: FAQ_EASE, onComplete: done }
          );
        } else {
          answer.style.transition = `height ${FAQ_DURATION}s ease`;
          answer.style.height = from + 'px';
          requestAnimationFrame(() => {
            answer.style.height = to + 'px';
            setTimeout(done, FAQ_DURATION * 1000);
          });
        }
      };

      if (isOpen) {
        const current = answer.scrollHeight;
        animate(current, 0, () => {
          d.removeAttribute('open');
        });
      } else {
        d.setAttribute('open', '');
        const target = answer.scrollHeight;
        animate(0, target, () => {
          // Release to 'auto' so long answers re-flow on resize.
          answer.style.height = 'auto';
        });
      }
    });
  });

  // --- 4.13: mailto click → clipboard copy + snackbar ------------------
  let snackbarTimer;
  const showSnackbar = () => {
    if (!snackbar) return;
    snackbar.classList.add('is-visible');
    clearTimeout(snackbarTimer);
    snackbarTimer = setTimeout(() => {
      snackbar.classList.remove('is-visible');
    }, SNACKBAR_HOLD_MS);
  };

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      const email = href.replace(/^mailto:/, '').split('?')[0];
      // Fire-and-forget clipboard copy; don't block the mailto navigation.
      if (navigator.clipboard && navigator.clipboard.writeText && email) {
        navigator.clipboard.writeText(email).catch(() => {});
      }
      showSnackbar();
      // Intentionally no preventDefault() — the mail client should still open.
    });
  });

  // --- Nav smooth-scroll (header + sticky nav) -------------------------
  const navLinks = document.querySelectorAll(
    'header nav a[href^="#"], kim-sticky-nav .navigation a[href^="#"]'
  );
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href) return;
      // Only handle in-page hash navigation.
      if (href === '#') {
        e.preventDefault();
        if (lenis) lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: 0 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
