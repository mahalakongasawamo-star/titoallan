# Case Study Page Builder

## Description
**WORKFLOW SKILL** — Streamlines the creation of professional case study pages for business websites, focusing on AI-visible, modern designs with engaging transitions and effects. Perfect for showcasing client success stories in dental clinics, restaurants, law firms, and other industries.

## When to Use
- Creating new case study pages for client portfolios
- Building example websites for different business types
- Generating placeholder content for development
- Ensuring consistent, modern layouts across case studies
- Optimizing for AI visibility and user engagement

## Key Workflows

### 1. Template Structure Setup
- Create semantic HTML structure with proper headings and sections
- Implement responsive grid layouts for content organization
- Add ARIA labels and schema markup for AI accessibility
- Set up CSS custom properties for consistent theming

### 2. Hero Section Implementation
- Design impactful hero with gradient backgrounds and animations
- Add placeholder image/video containers with hover effects
- Implement title animations (fade-in, slide-in effects)
- Ensure mobile-responsive hero sizing

### 3. Content Sections Building
- Create services/industry badges with staggered animations
- Build image galleries with parallax or zoom effects
- Add testimonial quotes with decorative elements
- Implement call-to-action sections

### 4. Animation and Effects Integration
- Add Intersection Observer for scroll-triggered animations
- Implement CSS keyframes for smooth transitions
- Create hover states for interactive elements
- Optimize animations for performance (60fps)

### 5. Placeholder Content Management
- Generate semantic placeholder text and titles
- Create image/video placeholder containers
- Add alt text and accessibility attributes
- Prepare for easy content replacement

## Code Examples

### Basic Case Study Template Structure
```html
<section class="case-study">
  <header class="case-study__header">
    <h1>CASE STUDY</h1>
    <h2>Client Business Name</h2>
  </header>

  <section class="case-study__hero">
    <div class="hero-image">
      <img src="placeholder-hero.jpg" alt="Hero Image">
    </div>
  </section>

  <section class="case-study__content">
    <p class="description">Client story and challenge description...</p>
    <div class="services">
      <span class="service-tag">SERVICE 1</span>
      <span class="service-tag">SERVICE 2</span>
    </div>
  </section>
</section>
```

### CSS Animation Setup
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.case-study__header h2 {
  animation: fadeInUp 1s ease-out;
}

.service-tag {
  animation: fadeInUp 1s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
}
```

### JavaScript for Scroll Effects
```javascript
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
```

## Best Practices

### Design Principles
- Use modern color palettes (gradients, pastels) avoiding black/plain schemes
- Implement subtle shadows and rounded corners for depth
- Ensure 1.6+ line height for readability
- Use Inter or similar modern fonts

### Performance Optimization
- Lazy load images and videos
- Use CSS transforms instead of position changes for animations
- Debounce scroll events to prevent excessive calculations
- Optimize images (WebP format, proper sizing)

### AI Visibility
- Use semantic HTML5 elements (header, section, article)
- Add structured data (JSON-LD) for business information
- Include clear headings and descriptive alt text
- Ensure content is scannable for AI processing

### Responsive Design
- Mobile-first approach with breakpoints at 768px, 1024px
- Flexible grid systems (CSS Grid, Flexbox)
- Touch-friendly interactive elements (44px minimum)
- Optimized typography scaling

### Content Strategy
- Write client-focused success stories
- Include specific metrics and results
- Use industry-relevant terminology
- Prepare for easy localization

## Tools and Resources
- **Design**: Figma for mockups, Coolors for color palettes
- **Development**: VS Code with Emmet, Prettier for formatting
- **Testing**: Browser DevTools, Lighthouse for performance
- **Animation**: CSS Animations, Framer Motion (if using frameworks)
- **AI Tools**: Schema markup generators, accessibility checkers

## Common Pitfalls to Avoid
- Over-animating (keep it subtle and purposeful)
- Ignoring mobile performance
- Using generic placeholder text that doesn't match industry
- Forgetting accessibility features
- Not testing across different browsers/devices

## Integration with Other Skills
- Combine with **AI-Friendly Web Design** for optimization
- Use **Modern CSS Animations** for advanced effects
- Integrate **Placeholder Content Management** for development workflow
- Apply **Business Website Optimization** for industry-specific tailoring