# Modern CSS Animations

## Description
**TECHNICAL SKILL** — Creates smooth, performant CSS animations and transitions for modern web experiences. Focuses on enhancing user engagement through subtle, purposeful animations while maintaining accessibility and performance. Avoids overwhelming effects in favor of professional, polished interactions.

## When to Use
- Adding visual interest to static web pages
- Creating smooth transitions between states
- Implementing scroll-triggered effects
- Enhancing user interactions (hover, click, focus)
- Building loading animations and micro-interactions

## Key Workflows

### 1. Animation Planning and Performance
- Identify animation goals and user experience impact
- Choose appropriate animation techniques (CSS vs JavaScript)
- Plan for 60fps performance using transforms and opacity
- Consider accessibility and motion preferences

### 2. CSS Keyframe Animation Creation
- Define keyframe sequences for complex animations
- Use timing functions for natural motion (ease, ease-in-out)
- Create reusable animation classes
- Implement staggered animations for multiple elements

### 3. Transition Implementation
- Add smooth state changes for interactive elements
- Use transform properties for hardware acceleration
- Implement hover and focus states
- Create loading and progress indicators

### 4. Scroll-Triggered Effects
- Use Intersection Observer for viewport-based animations
- Implement parallax scrolling effects
- Create reveal animations on scroll
- Optimize for smooth scrolling performance

### 5. Animation Optimization and Testing
- Test animations across devices and browsers
- Monitor performance with browser dev tools
- Implement fallbacks for reduced motion preferences
- Optimize for mobile performance

## Code Examples

### Basic Keyframe Animation
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

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}
```

### Staggered Animation Sequence
```css
.service-card {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease-out forwards;
}

.service-card:nth-child(1) { animation-delay: 0.1s; }
.service-card:nth-child(2) { animation-delay: 0.2s; }
.service-card:nth-child(3) { animation-delay: 0.3s; }
.service-card:nth-child(4) { animation-delay: 0.4s; }
.service-card:nth-child(5) { animation-delay: 0.5s; }
```

### Hover Transition Effects
```css
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
```

### Intersection Observer for Scroll Effects
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

// Apply to elements
document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Best Practices

### Performance Optimization
- Use `transform` and `opacity` for animations (GPU accelerated)
- Avoid animating layout properties (width, height, top, left)
- Limit animation duration to 0.2-0.8 seconds
- Use `will-change` property sparingly and remove after animation

### Timing and Easing
- Choose appropriate easing functions (ease-out for entrances, ease-in-out for continuous)
- Use consistent timing across similar elements
- Implement staggered delays for sequential animations
- Test animation timing on target devices

### Accessibility Considerations
- Respect `prefers-reduced-motion` user preference
- Ensure animations don't interfere with content readability
- Provide alternative ways to access animated content
- Test with screen readers and keyboard navigation

### Cross-Browser Compatibility
- Use vendor prefixes for older browser support
- Test animations in target browsers
- Provide fallbacks for unsupported features
- Use progressive enhancement approach

### Animation Hierarchy
- Page load animations: Subtle, quick (0.5-1s)
- Hover effects: Immediate feedback (0.2-0.3s)
- Scroll effects: Smooth reveals (0.6-0.8s)
- Loading animations: Engaging but not distracting

## Tools and Resources
- **Animation Tools**: CSS Animations, Keyframes app, Principle for prototyping
- **Performance**: Chrome DevTools Performance tab, Lighthouse
- **Libraries**: Animate.css for pre-built animations, Framer Motion for React
- **Testing**: BrowserStack for cross-browser testing, WAVE for accessibility
- **Inspiration**: Awwwards, Dribbble, CodePen for animation examples

## Common Pitfalls to Avoid
- Over-animating (keep it purposeful and subtle)
- Ignoring performance impact on mobile devices
- Not testing with reduced motion preferences
- Using animations that cause layout shifts
- Forgetting to remove `will-change` after animations

## Integration with Other Skills
- Combine with **Case Study Page Builder** for animated case study layouts
- Use with **AI-Friendly Web Design** for engaging, accessible experiences
- Integrate with **Business Website Optimization** for industry-appropriate animations
- Apply to **Placeholder Content Management** for smooth content transitions