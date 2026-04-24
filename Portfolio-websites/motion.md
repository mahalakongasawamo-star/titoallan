## motion.md — Scroll & Animation Choreography

### Global Scroll Engine
- Use GSAP ScrollTrigger (CDN) for all scroll-based animations
- Use Lenis for smooth scrolling (optional but recommended)
- All animations respect `prefers-reduced-motion`

### Hero Section
- Background image: parallax at 0.3x scroll speed (translateY)
- Headline: fades in from bottom, 0.8s ease-out, triggers at 10% viewport
- Subtext: same animation, 200ms delay after headline

### About Section  
- Left image: slides in from left, 0.6s, triggers when 20% visible
- Right text block: fades in from right, 0.6s, 150ms delay
- Parallax: background layer moves at 0.5x speed

### Gallery/Portfolio
- Images: staggered reveal, each card scales from 0.95→1.0 and opacity 0→1
- Stagger: 100ms between each card
- Trigger: when section top hits 80% of viewport

### Moving Images / Marquee
- Type: infinite horizontal marquee (CSS animation, not JS)
- Speed: 30s linear infinite
- Direction: left-to-right
- On hover: pause
- Duplicate content for seamless loop

### Parallax Layers
- Implementation: CSS transform translateY with GSAP ScrollTrigger
- NOT background-attachment: fixed (breaks on mobile)
- Layer speeds: foreground 1x, midground 0.6x, background 0.3x
