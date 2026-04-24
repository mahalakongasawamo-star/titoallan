# Scrolling Effects Documentation

## Overview
This document outlines the scrolling effects implemented on the website for enhanced user experience and modern design.

## Implemented Effects

### 1. Image Parallax Scrolling
- **Target Elements**: Hero image and gallery images
- **Effect**: Images move at a slower rate than the page scroll, creating a depth illusion
- **Implementation**: CSS `transform: translateY()` with scroll event listener
- **Code Snippet**:
  ```javascript
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    parallaxElements.forEach(el => {
      const rate = el.dataset.rate || 0.5;
      el.style.transform = `translateY(${scrolled * rate}px)`;
    });
  });
  ```

### 2. Fade-in on Scroll
- **Target Elements**: Service cards, gallery items, quote section
- **Effect**: Elements fade in and slide up when they enter the viewport
- **Implementation**: Intersection Observer API
- **Code Snippet**:
  ```javascript
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  ```

### 3. Image Zoom on Scroll
- **Target Elements**: Gallery images
- **Effect**: Images slightly zoom in as they come into view
- **Implementation**: CSS transitions triggered by scroll position
- **Code Snippet**:
  ```css
  .gallery-item {
    transition: transform 0.3s ease;
  }
  .gallery-item.in-view {
    transform: scale(1.1);
  }
  ```

## Performance Considerations
- Use `requestAnimationFrame` for smooth animations
- Debounce scroll events to prevent excessive calculations
- Optimize images for web (WebP format, lazy loading)

## Browser Compatibility
- Modern browsers with Intersection Observer support
- Fallback for older browsers using scroll event listeners

## Future Enhancements
- Add more complex animations (e.g., rotate, skew)
- Implement scroll-triggered video playback
- Add scroll progress indicators