export default function Footer() {
  return (
    <footer className="theme-section border-t border-[var(--color-border)] py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Top row */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-12 mb-16">
          {/* Brand */}
          <div>
            <span className="text-xl font-bold text-[var(--color-text)] tracking-tight">
              upserv.ai
            </span>
            <p className="mt-2 text-[9px] tracking-[0.2em] text-[var(--color-text-subtle)] uppercase max-w-xs">
              AI-FRIENDLY WEB DESIGN FOR SMALL AND MEDIUM BUSINESSES
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <a href="#hero" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">HOME</a>
              <a href="#explore" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">WHY UPSERV</a>
            </div>
            <div className="flex flex-col gap-3">
              <a href="#models" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">PRICING</a>
              <a href="#industry" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">INDUSTRIES</a>
            </div>
            <div className="flex flex-col gap-3">
              <a href="#contact" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">CONTACT</a>
              <a
                href="https://geo-check.org/lander"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                FREE AI SCAN
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 border-t border-[var(--color-border)]">
          <span className="text-xs text-[var(--color-text-subtle)]">
            LANGUAGE <span>&#127482;&#127480;</span>
          </span>
          <p className="text-xs text-[var(--color-text-subtle)]">
            &copy; 2026 upserv.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
