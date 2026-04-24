# Placeholder Content Management

## Description
**WORKFLOW SKILL** — Streamlines the creation, management, and replacement of placeholder content during web development. Ensures consistent, semantic placeholders for images, videos, and text that can be easily identified and replaced with final content, maintaining development momentum.

## When to Use
- Starting new web development projects
- Creating templates for multiple similar pages
- Managing content replacement workflows
- Ensuring consistent placeholder standards across teams
- Preparing sites for client content delivery

## Key Workflows

### 1. Placeholder Content Strategy
- Define naming conventions for placeholder files
- Establish content categories (hero, gallery, testimonials)
- Create semantic alt text and descriptions
- Plan replacement workflow and handoff process

### 2. Image and Video Placeholder Creation
- Generate appropriately sized placeholder images
- Create video containers with proper aspect ratios
- Implement lazy loading for performance
- Add visual indicators for placeholder status

### 3. Text Content Templating
- Develop semantic text structures
- Create industry-specific content templates
- Implement lorem ipsum with meaningful context
- Prepare for easy search-and-replace operations

### 4. Content Organization and Tracking
- Maintain content inventory spreadsheets
- Tag placeholders with replacement priorities
- Document content requirements and specifications
- Track completion status across development phases

### 5. Replacement and Handoff Process
- Implement find-and-replace workflows
- Validate content against placeholder specifications
- Test responsive behavior with real content
- Document final content integration

## Code Examples

### Image Placeholder Structure
```html
<!-- Hero Image Placeholder -->
<div class="hero-image">
  <img src="placeholder-hero-1920x1080.jpg"
       alt="Hero image: [Brief description of expected content]"
       loading="lazy"
       data-placeholder="hero-main">
  <div class="placeholder-overlay">
    <span class="placeholder-label">HERO IMAGE</span>
    <span class="placeholder-specs">1920×1080px recommended</span>
  </div>
</div>

<!-- Gallery Image Placeholders -->
<div class="gallery">
  <div class="gallery-item">
    <img src="placeholder-gallery-800x600-01.jpg"
         alt="Gallery image 1: [Expected content description]"
         data-placeholder="gallery-01">
  </div>
  <div class="gallery-item">
    <img src="placeholder-gallery-800x600-02.jpg"
         alt="Gallery image 2: [Expected content description]"
         data-placeholder="gallery-02">
  </div>
</div>
```

### Video Placeholder Structure
```html
<!-- Video Placeholder -->
<div class="video-container">
  <video controls
         poster="placeholder-video-poster-1280x720.jpg"
         data-placeholder="main-video">
    <source src="placeholder-video-1280x720.mp4" type="video/mp4">
    <div class="video-placeholder-content">
      <div class="video-play-icon">▶</div>
      <span class="placeholder-label">VIDEO CONTENT</span>
      <span class="placeholder-specs">1280×720px, MP4 format</span>
    </div>
  </video>
</div>
```

### Text Content Templates
```html
<!-- Service Description Template -->
<section class="service-description">
  <h2 data-placeholder="service-title">Service Title Placeholder</h2>
  <p data-placeholder="service-description">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
  </p>
  <ul data-placeholder="service-features">
    <li>Feature one: detailed description</li>
    <li>Feature two: detailed description</li>
    <li>Feature three: detailed description</li>
  </ul>
</section>

<!-- Testimonial Template -->
<blockquote class="testimonial" data-placeholder="client-testimonial">
  <p>"This is a placeholder testimonial quote. The actual testimonial will include specific details about the client's experience and results achieved."</p>
  <cite data-placeholder="client-name">Client Name, Company Position</cite>
</blockquote>
```

### CSS for Placeholder Styling
```css
[data-placeholder] {
  position: relative;
}

.placeholder-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: #666;
}

.placeholder-label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.placeholder-specs {
  display: block;
  font-size: 10px;
  font-weight: normal;
  color: #999;
}

.video-placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
  color: #666;
  text-align: center;
}
```

### JavaScript for Content Tracking
```javascript
// Content Inventory Tracker
class PlaceholderTracker {
  constructor() {
    this.placeholders = new Map();
    this.init();
  }

  init() {
    document.querySelectorAll('[data-placeholder]').forEach(el => {
      const key = el.dataset.placeholder;
      this.placeholders.set(key, {
        element: el,
        type: el.tagName.toLowerCase(),
        specs: this.getSpecs(el),
        replaced: false
      });
    });
  }

  getSpecs(element) {
    // Extract specs from nearby elements or attributes
    const specsEl = element.parentElement.querySelector('.placeholder-specs');
    return specsEl ? specsEl.textContent : 'No specs available';
  }

  markReplaced(placeholderKey) {
    if (this.placeholders.has(placeholderKey)) {
      this.placeholders.get(placeholderKey).replaced = true;
      this.updateUI();
    }
  }

  getReport() {
    const total = this.placeholders.size;
    const replaced = Array.from(this.placeholders.values()).filter(p => p.replaced).length;
    return { total, replaced, remaining: total - replaced };
  }

  updateUI() {
    // Update any UI indicators
    console.log('Content replacement status:', this.getReport());
  }
}

// Initialize tracker
const tracker = new PlaceholderTracker();
```

## Best Practices

### Naming Conventions
- Use descriptive, consistent naming (e.g., `placeholder-hero-main.jpg`)
- Include dimensions in filenames (e.g., `800x600`)
- Use sequential numbering for multiple items
- Include content type in name (hero, gallery, testimonial)

### Content Specifications
- Document required dimensions and formats
- Specify aspect ratios for responsive design
- Include alt text guidelines
- Define content style and tone requirements

### Development Workflow
- Create placeholders early in development
- Use version control for placeholder assets
- Document replacement procedures
- Test with real content before launch

### Quality Assurance
- Validate placeholder replacement completeness
- Test responsive behavior with actual content
- Check accessibility with real content
- Verify performance impact of content changes

### Client Handoff
- Provide clear content requirement documents
- Include placeholder context and examples
- Set realistic deadlines for content delivery
- Establish communication channels for questions

## Tools and Resources
- **Image Generation**: Unsplash API, Lorem Picsum, Placeholder.com
- **Text Generation**: Lorem Ipsum generators, industry-specific content templates
- **Asset Management**: Content inventory spreadsheets, project management tools
- **Validation**: Custom scripts for placeholder detection, content validation tools
- **Documentation**: Markdown templates, content requirement documents

## Common Pitfalls to Avoid
- Using non-semantic placeholder text
- Forgetting to update alt text with real content
- Not planning for responsive image requirements
- Missing specifications for content creators
- Not testing with actual content before launch

## Integration with Other Skills
- Combine with **Case Study Page Builder** for template-based development
- Use with **AI-Friendly Web Design** to ensure semantic placeholders
- Integrate with **Modern CSS Animations** for smooth content transitions
- Apply to **Business Website Optimization** for industry-specific placeholders