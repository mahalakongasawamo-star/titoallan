const seedProjects = [
  { name: "Tennessee Performing Arts Center", location: "Nashville, United States", slug: "tennessee-performing-arts-center" },
  { name: "NOT A HOTEL Setouchi", location: "Sagishima, Japan", slug: "not-a-hotel-setouchi" },
  { name: "Gastronomy Open Ecosystem", location: "San Sebastian, Spain", slug: "gastronomy-open-ecosystem" },
  { name: "East Side Coastal Resiliency", location: "New York, United States", slug: "east-side-coastal-resiliency" },
  { name: "The Plus", location: "Magnor, Norway", slug: "the-plus" },
];

export default function Page() {
  return (
    <>
      {/* §1.4 — Full-screen intro loader */}
      <div className="intro-loader">
        <span className="intro-logo" data-placeholder="large BIG pixel SVG">BIG</span>
      </div>

      {/* §1.2 — Fixed top bar: hamburger + wordmark (§1.1) + filter tabs + search + stage toggle */}
      <div className="top-bar">
        <button className="hamburger" aria-label="Open menu">
          <span data-placeholder="hamburger icon">≡</span>
        </button>

        <a className="logo" href="/">
          <span data-placeholder="BIG wordmark SVG">BIG</span>
        </a>

        <label className="filter-menu group">
          <a href="/projects/architecture">ARCHITECTURE</a>
          <a href="/projects/interiors">INTERIORS</a>
          <a href="/projects/landscape">LANDSCAPE</a>
          <a href="/projects/planning">PLANNING</a>
          <a href="/projects/products">PRODUCTS</a>
        </label>

        <div className="top-bar-right">
          <button className="search" aria-label="search">
            <span data-placeholder="search icon">⌕</span>
          </button>
          <button className="stage-toggle">COMPLETED</button>
        </div>
      </div>

      {/* §1.3 — Slide-in nav overlay (off-screen at rest) */}
      <nav className="menu">
        <ul>
          <li><a href="/">PROJECTS</a></li>
          <li><a href="/news">NEWS</a></li>
          <li><a href="/about">ABOUT</a></li>
          <li><a href="/sustainability">SUSTAINABILITY</a></li>
          <li><a href="/people">PEOPLE</a></li>
          <li><a href="/careers">CAREERS</a></li>
          <li><a href="#footer">CONTACT</a></li>
        </ul>
      </nav>

      {/* §1.5 — Project list (seed: first 5 rows from copy.md) */}
      <div className="projects-container">
        <div className="project-list">
          {seedProjects.map((p) => (
            <a key={p.slug} className="project-row" href={`/projects/${p.slug}`}>
              <div className="project-label">
                <img alt="" data-placeholder="monogram SVG 52x52" />
                <div>
                  <h3>{p.name}</h3>
                  <p>{p.location}</p>
                </div>
              </div>
              <figure>
                <img alt="" data-placeholder="project photo 800w" />
              </figure>
            </a>
          ))}
        </div>
      </div>

      {/* §1.6 — Footer */}
      <footer id="footer">
        <div className="footer-grid">
          <section>
            <h4>EMAIL <span className="toggle">+</span></h4>
            <ul>
              <li><a href="mailto:newbiz@big.dk"><strong>NEW PROJECTS</strong> — newbiz@big.dk</a></li>
              <li><a href="mailto:press@big.dk"><strong>PRESS</strong> — press@big.dk</a></li>
              <li><a href="mailto:lectures@big.dk"><strong>LECTURES</strong> — lectures@big.dk</a></li>
              <li><a href="mailto:exhibitions@big.dk"><strong>EXHIBITIONS</strong> — exhibitions@big.dk</a></li>
            </ul>
          </section>
          <section>
            <h4>OFFICE <span className="toggle">+</span></h4>
            <address>
              <strong>COPENHAGEN</strong><br />
              Sundkaj 165<br />
              2150, Nordhavn<br />
              Copenhagen, DK<br />
              +45 7221 7227<br />
              +45 3512 7227
            </address>
          </section>
          <section>
            <h4>SOCIAL <span className="toggle">+</span></h4>
          </section>
          <section>
            <h4>LEGAL <span className="toggle">+</span></h4>
          </section>
        </div>
        <div className="back-to-top-wrap">
          <button className="back-to-top">BACK TO TOP</button>
        </div>
      </footer>

      {/* §1.7 — Command menu container (hidden by default) */}
      <div className="cmdk" data-state="closed" hidden />
    </>
  );
}
