// ============================================================
//  MASTER CONTENT FILE — Portfolio Website
//  Inspired by telhaclarke.com.au structure + BMW Design System
//  ▸ Edit ONLY the values inside CONTENT to update the site.
//  ▸ Do NOT edit below the "DO NOT EDIT BELOW" line.
//  ▸ Use <br> inside strings for manual line breaks.
//  ▸ Image URLs use placeholders — replace with real assets.
// ============================================================

const CONTENT = {

  // ──────────────────────────────────────────────────────────
  //  SITE-WIDE
  // ──────────────────────────────────────────────────────────
  site: {
    name: 'DENTAL CLINIC',
    tagline: 'Your everday dental',
    location: 'Kamuning, AUS',
    locationFull: 'Kamuning<br>Australia',
  },

  // ──────────────────────────────────────────────────────────
  //  LOADER
  // ──────────────────────────────────────────────────────────
  loader: {
    title: 'Design studio<br>Architecture & interior',
    location: 'Kamuning<br>Australia',
  },

  // ──────────────────────────────────────────────────────────
  //  NAVIGATION
  // ──────────────────────────────────────────────────────────
  nav: {
    links: [
      { text: 'Dentalk', url: '#works' },
      { text: 'Doctors', url: '#process' },
      { text: 'Booking', url: '#about' },
    ],
    contact: { text: 'Contact', url: '#footer' },
    socials: [
      { text: 'Instagram', url: '#' },
      { text: 'Linkedin', url: '#' },
    ],
  },

  // ──────────────────────────────────────────────────────────
  //  HERO / COVER
  // ──────────────────────────────────────────────────────────
  hero: {
    // Placeholder image — replace with real hero photography
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
    scrollText: '[Scroll down]',
    tagline: 'Driven by History, Centered on Context, Embracing Culture',
  },

  // ──────────────────────────────────────────────────────────
  //  ABOUT / STUDIO SECTION  (01)
  // ──────────────────────────────────────────────────────────
  about: {
    number: '01',
    subtitle: 'Studio',
    sideImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',

    acknowledgment: 'We connect, create and work on the lands of Aboriginal and Torres Strait Islander peoples throughout Australia. We acknowledge First Nations\u2019 ancient histories, cultures, and ongoing connections to Country, and we pay our respect to Elders past and present.',

    // Large offset title
    title: 'Studio Name is a Melbourne based Architecture & Interior Design studio, designing various project typologies across Australia and Internationally.',

    label: 'Architecture<br>& Interior Design',

    description: 'With experience covering a range of typologies; from single & multi-residential, seniors living, student accommodation, social housing, hotels, hospitality and workplace. We believe human touch must drive creativity.',
  },

  // ──────────────────────────────────────────────────────────
  //  SELECTED WORKS  (02)
  // ──────────────────────────────────────────────────────────
  works: {
    number: '02',
    subtitle: 'Selected Works',
    dateRange: '17 - 25\'',
    allWorkCount: 28,

    items: [
      {
        title: 'Project Alpha',
        category: 'Multi-residential',
        year: '2025',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
        url: '#',
      },
      {
        title: 'Penthouse Vue',
        category: 'Residential',
        year: '2025',
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
        url: '#',
      },
      {
        title: 'Tower South',
        category: 'Multi-residential',
        year: '2019',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
        url: '#',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  //  WORKS GRID (scattered image mosaic)
  // ──────────────────────────────────────────────────────────
  worksGrid: {
    buttonText: 'All Work',

    // Images for the scattered grid — mix of sizes
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&q=80',
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=600&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=600&q=80',
      'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&q=80',
    ],
  },

  // ──────────────────────────────────────────────────────────
  //  VISION SECTION  (03)
  // ──────────────────────────────────────────────────────────
  vision: {
    number: '03',
    subtitle: 'Vision',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80',

    titles: [
      'Design integrity',
      'Innovation',
      'Enhanced living',
    ],

    contents: [
      'Our design aesthetic is established through a consistent process and a detailed concept brief, which considers client needs, site context, and the future occupiers. We combine and test these elements to create a singular design vision concealing many influencing layers.',
      'We welcome innovation through research and technology to contribute new ideas and challenging theories. We see technology as a tool, we engage with it and it is integral to our work, however we believe human touch must drive creativity.',
      'We believe enhanced user experience and well-being should be at the forefront of design. We constantly consider the impact of design on the end user to ensure our designs promote positive human interaction and encourage healthier, enriched experiences.',
    ],
  },

  // ──────────────────────────────────────────────────────────
  //  PROCESS / METHOD SECTION  (04)
  // ──────────────────────────────────────────────────────────
  process: {
    number: '04',
    subtitle: 'Method',

    description: 'The scope of our Studio covers all stages within Architecture and Interior Design. We offer an end to end level of service from early concepts through to practical completion.',

    steps: [
      {
        name: 'Schematic Design',
        num: '01',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
      },
      {
        name: 'Development & Town Planning',
        num: '02',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      },
      {
        name: 'Design Development',
        num: '03',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      },
      {
        name: 'Marketing',
        num: '04',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      },
      {
        name: 'Interior Design',
        num: '05',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
      },
      {
        name: 'Construction Documentation',
        num: '06',
        image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      },
      {
        name: 'Contract Administration',
        num: '07',
        image: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&q=80',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  //  FOOTER
  // ──────────────────────────────────────────────────────────
  footer: {
    cta: 'Talk to us about your project',
    ctaLink: { text: 'Contact us', url: '#' },

    newsletter: {
      label: 'Subscribe to our newsletter',
      placeholder: 'Enter your email',
      successMessage: 'Thanks for joining!',
    },

    address: '59 Garden Street<br>South Yarra<br>Victoria, Australia 3141',
    phone: { text: '+61 3 8672 5999', url: 'tel:+61 3 8672 5999' },
    email: { text: 'contact@studioname.com.au', url: 'mailto:contact@studioname.com.au' },

    nav: [
      { text: 'Home', url: '#' },
      { text: 'Work', url: '#works' },
      { text: 'Studio', url: '#about' },
      { text: 'Process', url: '#process' },
      { text: 'Contact', url: '#footer' },
    ],

    socials: [
      { text: 'Instagram', url: '#' },
      { text: 'Linkedin', url: '#' },
    ],

    legal: [
      { text: 'Privacy policy', url: '#' },
      { text: 'Terms of services', url: '#' },
    ],

    copyright: 'All rights reserved<br>\u00a9 Studio Name 2025',
    credit: { designers: ['TM', 'GL'], urls: ['#', '#'] },
  },

};


// ============================================================
//  DO NOT EDIT BELOW THIS LINE
//  The function below reads CONTENT and injects it into the DOM
// ============================================================
function applyContent() {

  // Helper: set innerHTML safely
  const setHTML = (sel, val) => {
    const el = document.querySelector(sel);
    if (el && val !== undefined) el.innerHTML = val;
  };
  const setText = (sel, val) => {
    const el = document.querySelector(sel);
    if (el && val !== undefined) el.textContent = val;
  };

  // ── Loader ────────────────────────────────────────────────
  setHTML('.loader-title', CONTENT.loader.title);
  setHTML('.loader-location', CONTENT.loader.location);

  // ── Header / Nav ──────────────────────────────────────────
  const headerLinks = document.querySelector('.header-links');
  if (headerLinks) {
    headerLinks.innerHTML = CONTENT.nav.links
      .map((l, i) => `<a href="${l.url}" class="header-link list-o-item">${l.text}${i < CONTENT.nav.links.length - 1 ? ',' : ''}</a>`)
      .join('');
  }
  setText('.header-location', CONTENT.site.location);

  const contactLink = document.querySelector('.header-contact');
  if (contactLink) {
    contactLink.textContent = CONTENT.nav.contact.text;
    contactLink.href = CONTENT.nav.contact.url;
  }

  // Mobile menu links
  const mobileMenu = document.querySelector('.header-menu-links');
  if (mobileMenu) {
    let links = `<a href="#" class="overflow-hidden"><span class="header-link-mobile inline-block">Home</span></a>`;
    CONTENT.nav.links.forEach(l => {
      links += `<a href="${l.url}" class="overflow-hidden"><span class="header-link-mobile inline-block">${l.text}</span></a>`;
    });
    links += `<a href="${CONTENT.nav.contact.url}" class="overflow-hidden"><span class="header-link-mobile inline-block">${CONTENT.nav.contact.text}</span></a>`;
    mobileMenu.innerHTML = links;
  }

  // Mobile socials
  const mobileSocials = document.querySelector('.header-social-links');
  if (mobileSocials) {
    mobileSocials.innerHTML = CONTENT.nav.socials
      .map((s, i) => `<a href="${s.url}" target="_blank" rel="noopener" class="header-social-link">${s.text}${i < CONTENT.nav.socials.length - 1 ? ',' : ''}</a>`)
      .join(' ');
  }

  // ── Hero / Cover ──────────────────────────────────────────
  const heroImg = document.querySelector('.cover-home-img');
  if (heroImg) heroImg.src = CONTENT.hero.image;

  setText('.cover-home-scroll', CONTENT.hero.scrollText);
  setText('.cover-home-content', CONTENT.hero.tagline);
  setText('.cover-home-content-dark', CONTENT.hero.tagline);

  // ── About / Studio ────────────────────────────────────────
  setText('.about .subtitle-number', CONTENT.about.number);
  setText('.about .subtitle-text', CONTENT.about.subtitle);

  const aboutImg = document.querySelector('.about-side-img');
  if (aboutImg) aboutImg.src = CONTENT.about.sideImage;

  setHTML('.about-acknowledgment', CONTENT.about.acknowledgment);
  setHTML('.about-title', CONTENT.about.title);
  setHTML('.about-label', CONTENT.about.label);
  setHTML('.about-description', CONTENT.about.description);

  // ── Selected Works ────────────────────────────────────────
  setText('.works-number', CONTENT.works.number);
  setText('.works-subtitle', CONTENT.works.subtitle);
  setText('.works-date-range', CONTENT.works.dateRange);

  const worksContainer = document.querySelector('.works-list');
  if (worksContainer) {
    worksContainer.innerHTML = CONTENT.works.items.map(item => `
      <a href="${item.url}" class="works-item w-full">
        <div class="works-item-wrapper">
          <div class="works-item-header">
            <div class="works-item-line-left"></div>
            <div class="works-item-line-right"></div>
            <div class="works-item-bracket-left">[</div>
            <h3 class="works-item-title">${item.title}</h3>
            <div class="works-item-bracket-right">]</div>
          </div>
          <div class="works-item-image-wrapper">
            <div class="works-item-image-container">
              <div class="works-item-image">
                <figure>
                  <img class="lazy" data-src="${item.image}" alt="${item.title}" width="150" height="150">
                </figure>
              </div>
              <div class="works-item-meta">
                <div class="works-item-category">${item.category}</div>
                <div class="works-item-date">${item.year}</div>
              </div>
            </div>
          </div>
        </div>
      </a>
    `).join('');
  }

  // ── Works Grid ────────────────────────────────────────────
  setText('.works-grid-count', `(${CONTENT.works.allWorkCount})`);
  setText('.works-grid-label', CONTENT.worksGrid.buttonText);

  const gridImages = document.querySelectorAll('.works-grid-image img');
  gridImages.forEach((img, i) => {
    if (CONTENT.worksGrid.images[i]) {
      img.dataset.src = CONTENT.worksGrid.images[i];
    }
  });

  // ── Vision ────────────────────────────────────────────────
  const visionImg = document.querySelector('.vision-image img');
  if (visionImg) visionImg.src = CONTENT.vision.image;

  const visionTitles = document.querySelector('.vision-titles');
  if (visionTitles) {
    visionTitles.innerHTML = CONTENT.vision.titles
      .map((t, i) => `<div class="vision-title-wrap"><h3 class="vision-title${i > 0 ? ' opacity-32' : ''}">${t}</h3></div>`)
      .join('');
  }

  setText('.vision-number-text', CONTENT.vision.number);
  setText('.vision-suptitle-text', CONTENT.vision.subtitle);

  const visionContents = document.querySelector('.vision-contents');
  if (visionContents) {
    visionContents.innerHTML = CONTENT.vision.contents
      .map((c, i) => `<div class="vision-content${i === 0 ? ' active' : ''}">${c}</div>`)
      .join('');
  }

  // ── Process / Method ──────────────────────────────────────
  setText('.process .subtitle-number', CONTENT.process.number);
  setText('.process .subtitle-text', CONTENT.process.subtitle);
  setHTML('.process-description', CONTENT.process.description);

  const processSteps = document.querySelector('.process-steps');
  if (processSteps) {
    processSteps.innerHTML = CONTENT.process.steps
      .map((s, i) => `<span class="leading-120"><span class="process-item${i === 0 ? ' active' : ''}" data-index="${i}"><span>${s.name} <sup>(${s.num})</sup></span></span>${i < CONTENT.process.steps.length - 1 ? '<span class="process-separator">/</span>' : ''}</span>`)
      .join(' ');
  }

  const processImages = document.querySelector('.process-images');
  if (processImages) {
    processImages.innerHTML = CONTENT.process.steps
      .map((s, i) => `<div class="process-image${i === 0 ? ' active' : ''}"><figure><img class="lazy" data-src="${s.image}" alt="${s.name}" width="150" height="150"></figure></div>`)
      .join('');
  }

  // ── Footer ────────────────────────────────────────────────
  setText('.footer-cta-label', CONTENT.footer.cta);

  const footerCtaLink = document.querySelector('.footer-cta-link');
  if (footerCtaLink) {
    footerCtaLink.textContent = CONTENT.footer.ctaLink.text;
    footerCtaLink.href = CONTENT.footer.ctaLink.url;
  }

  setText('.newsletter-label', CONTENT.footer.newsletter.label);

  const newsletterInput = document.querySelector('.newsletter-email-field');
  if (newsletterInput) newsletterInput.placeholder = CONTENT.footer.newsletter.placeholder;

  setHTML('.footer-address', CONTENT.footer.address);

  const footerPhone = document.querySelector('.footer-phone');
  if (footerPhone) {
    footerPhone.textContent = CONTENT.footer.phone.text;
    footerPhone.href = CONTENT.footer.phone.url;
  }

  const footerEmail = document.querySelector('.footer-email');
  if (footerEmail) {
    footerEmail.textContent = CONTENT.footer.email.text;
    footerEmail.href = CONTENT.footer.email.url;
  }

  const footerNav = document.querySelector('.footer-nav');
  if (footerNav) {
    footerNav.innerHTML = CONTENT.footer.nav
      .map(n => `<a href="${n.url}">${n.text}</a>`)
      .join('');
  }

  const footerSocials = document.querySelector('.footer-socials');
  if (footerSocials) {
    footerSocials.innerHTML = CONTENT.footer.socials
      .map((s, i) => `<a href="${s.url}" target="_blank" rel="noopener">${s.text}${i < CONTENT.footer.socials.length - 1 ? ',' : ''}</a>`)
      .join(' ');
  }

  const footerLegal = document.querySelector('.footer-legal');
  if (footerLegal) {
    footerLegal.innerHTML = CONTENT.footer.legal
      .map(l => `<a href="${l.url}">${l.text}</a>`)
      .join('');
  }

  setHTML('.footer-copyright', CONTENT.footer.copyright);
}

// Run as soon as the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyContent);
} else {
  applyContent();
}
