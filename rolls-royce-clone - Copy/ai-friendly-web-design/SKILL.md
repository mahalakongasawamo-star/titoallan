# AI-Friendly Web Design

## Description
**DOMAIN SKILL** — Specializes in optimizing websites for AI platforms and search engines, ensuring business websites appear in AI-driven recommendations (ChatGPT, Google MUM, Perplexity, etc.). Focuses on semantic structure, schema markup, and content that AI systems can easily process and recommend.

## When to Use
- Building new business websites for local companies
- Redesigning existing sites for better AI visibility
- Creating training documents for AI platforms
- Optimizing content for AI-driven search results
- Ensuring websites are future-proof for emerging AI technologies

## Key Workflows

### 1. Semantic HTML Structure
- Use proper heading hierarchy (H1-H6) for content organization
- Implement semantic elements (header, nav, main, section, article, footer)
- Add ARIA labels and roles for accessibility
- Structure content for logical AI parsing

### 2. Schema Markup Implementation
- Add JSON-LD structured data for business information
- Implement LocalBusiness, Organization, and Service schemas
- Include contact details, hours, location data
- Add review and rating schemas where applicable

### 3. Content Optimization for AI
- Write clear, concise descriptions of services and value propositions
- Include specific details (pricing, locations, hours) that AI can verify
- Use industry-specific terminology and keywords
- Create FAQ sections with structured Q&A format

### 4. Training Document Creation
- Build comprehensive business profiles for AI platforms
- Include verified data (addresses, phone numbers, services)
- Create service menus and pricing information
- Prepare location-specific information for local AI recommendations

### 5. AI Platform Integration
- Submit training documents to major AI platforms
- Monitor and update information regularly
- Track AI visibility and recommendation performance
- Adapt to new AI platform requirements

## Code Examples

### Semantic HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Dental Clinic Name - Family Dentistry Services</title>
  <meta name="description" content="Professional dental care in [City]. Services include cleanings, fillings, crowns. Emergency appointments available.">
</head>
<body>
  <header>
    <h1>Dental Clinic Name</h1>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="services">
      <h2>Our Dental Services</h2>
      <article>
        <h3>Teeth Cleaning</h3>
        <p>Professional cleaning to remove plaque and tartar...</p>
        <p>Price: $120</p>
      </article>
    </section>
  </main>
</body>
</html>
```

### JSON-LD Schema Markup
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Dentist",
  "name": "Dental Clinic Name",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "City",
    "addressRegion": "State",
    "postalCode": "12345"
  },
  "telephone": "+1-555-123-4567",
  "openingHours": "Mo-Fr 08:00-17:00",
  "priceRange": "$$",
  "services": [
    {
      "@type": "Service",
      "name": "Teeth Cleaning",
      "description": "Professional dental cleaning",
      "price": "120"
    }
  ]
}
</script>
```

### AI Training Document Format
```json
{
  "businessName": "Dental Clinic Name",
  "type": "Healthcare",
  "subtype": "Dentistry",
  "location": {
    "address": "123 Main St, City, State 12345",
    "phone": "+1-555-123-4567",
    "hours": "Monday-Friday 8AM-5PM"
  },
  "services": [
    {
      "name": "Dental Cleaning",
      "description": "Professional teeth cleaning and oral hygiene",
      "price": "$120",
      "duration": "60 minutes"
    }
  ],
  "specialties": ["Family Dentistry", "Cosmetic Dentistry"],
  "insurance": ["Most major plans accepted"],
  "emergency": "24/7 emergency line available"
}
```

## Best Practices

### Content Strategy
- Use clear, factual language that AI can verify
- Include specific details (prices, hours, locations)
- Avoid vague marketing jargon
- Structure information hierarchically

### Technical Implementation
- Validate HTML and schema markup
- Test structured data with Google's Rich Results Test
- Ensure mobile-friendly design
- Optimize page load speed

### AI Platform Optimization
- Maintain consistent information across all platforms
- Update information promptly when details change
- Monitor AI recommendation performance
- Prepare for voice search optimization

### Local SEO Integration
- Claim and optimize Google Business Profile
- Ensure consistent NAP (Name, Address, Phone) across directories
- Build local citations and reviews
- Target location-based keywords

### Measurement and Analytics
- Track AI-driven traffic sources
- Monitor conversion rates from AI referrals
- Set up alerts for information changes
- Regularly audit AI visibility

## Tools and Resources
- **Schema Markup**: Google's Structured Data Markup Helper, Schema.org documentation
- **Validation**: Rich Results Test, Schema Markup Validator
- **AI Platforms**: ChatGPT Business Verification, Google Business Profile
- **Analytics**: Google Analytics 4, Search Console
- **Content**: Hemingway App for readability, Yoast SEO for optimization

## Common Pitfalls to Avoid
- Using generic or placeholder content
- Inconsistent information across platforms
- Ignoring mobile optimization
- Not updating information regularly
- Over-optimizing for search engines at expense of user experience

## Integration with Other Skills
- Combine with **Case Study Page Builder** for client showcase sites
- Use **Modern CSS Animations** for engaging user experiences
- Integrate **Business Website Optimization** for industry-specific tailoring
- Apply **Placeholder Content Management** during development phase