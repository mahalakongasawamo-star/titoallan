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
      {/* §3.1 — Full-screen intro loader (static black overlay; slide anim lands in Phase 4) */}
      <div className="intro-loader pointer-events-none fixed inset-0 z-50 bg-black flex items-center justify-center">
        <span
          className="intro-logo text-white inline-flex items-center justify-center w-[80px] h-[40px] text-xl"
          data-placeholder="large BIG pixel SVG"
        >
          BIG
        </span>
      </div>

      {/* §3.2 — Fixed top bar: hamburger + BIG wordmark + filter tabs + search + stage toggle */}
      <div className="top-bar fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-[30px] pt-[24px]">
        <button className="hamburger relative z-50 w-[24px] h-[24px] inline-flex items-center justify-center" aria-label="Open menu">
          <span data-placeholder="hamburger icon">≡</span>
        </button>

        {/* §3.1 / §3.2 — persistent BIG wordmark anchored at (30, 20) */}
        <a className="logo fixed top-[20px] left-[30px] w-[42px] h-[19px] inline-flex items-center text-black z-50" href="/">
          <span className="text-[14px] leading-none" data-placeholder="BIG wordmark SVG">BIG</span>
        </a>

        <label className="filter-menu group flex items-center gap-[48px] text-[14px] uppercase">
          <a href="/projects/architecture">ARCHITECTURE</a>
          <a href="/projects/interiors">INTERIORS</a>
          <a href="/projects/landscape">LANDSCAPE</a>
          <a href="/projects/planning">PLANNING</a>
          <a href="/projects/products">PRODUCTS</a>
        </label>

        <div className="top-bar-right flex items-center gap-[12px] text-[14px] uppercase">
          <button className="search w-[20px] h-[20px] inline-flex items-center justify-center" aria-label="search">
            <span data-placeholder="search icon">⌕</span>
          </button>
          <button className="stage-toggle">COMPLETED</button>
        </div>
      </div>

      {/* §3.3 — Slide-in nav overlay; at rest translated -158px off-screen */}
      <nav
        className="menu fixed inset-y-0 left-0 w-[158px] pointer-events-none z-30"
        style={{ transform: "translate3d(-158px, 0, 0)" }}
      >
        <ul className="flex flex-col gap-y-[20px] pt-[80px] pl-[30px] text-[14px] leading-[20px] uppercase">
          <li><a href="/">PROJECTS</a></li>
          <li><a href="/news">NEWS</a></li>
          <li><a href="/about">ABOUT</a></li>
          <li><a href="/sustainability">SUSTAINABILITY</a></li>
          <li><a href="/people">PEOPLE</a></li>
          <li><a href="/careers">CAREERS</a></li>
          <li><a href="#footer">CONTACT</a></li>
        </ul>
      </nav>

      {/* §3.4 — Project list (seed: first 5 rows from copy.md). Top-padded so top bar doesn't overlap the first row. */}
      <div className="projects-container overflow-x-hidden pt-[80px]">
        <div className="project-list flex flex-col">
          {seedProjects.map((p) => (
            <a key={p.slug} className="project-row grid grid-cols-[1fr_2fr] items-start gap-[30px] py-[30px] px-[30px] border-t border-gray-200" href={`/projects/${p.slug}`}>
              <div className="project-label flex items-start gap-[16px]">
                <img className="w-[25px] h-[25px] bg-black" alt="" data-placeholder="monogram SVG 52x52" />
                <div>
                  <h3 className="text-[18px] leading-[20px]">{p.name}</h3>
                  <p className="text-[12px] text-[#797979] uppercase tracking-[0.3px] mt-[4px]">{p.location}</p>
                </div>
              </div>
              <figure className="m-0 aspect-[16/9] overflow-hidden bg-gray-200">
                <img className="w-full h-full object-cover" alt="" data-placeholder="project photo 800w" />
              </figure>
            </a>
          ))}
        </div>
      </div>

      {/* §3.5 — Footer */}
      <footer id="footer" className="bg-white py-[64px] px-[30px] text-[14px]">
        <div className="footer-grid grid grid-cols-[1fr_1fr_1fr_1fr] gap-x-[30px]">
          <section>
            <h4 className="uppercase text-[14px] flex items-center justify-between font-normal">
              <span>EMAIL</span>
              <span className="toggle">+</span>
            </h4>
            <ul className="mt-[16px] flex flex-col gap-[8px]">
              <li><a href="mailto:newbiz@big.dk"><span className="uppercase">NEW PROJECTS</span> — newbiz@big.dk</a></li>
              <li><a href="mailto:press@big.dk"><span className="uppercase">PRESS</span> — press@big.dk</a></li>
              <li><a href="mailto:lectures@big.dk"><span className="uppercase">LECTURES</span> — lectures@big.dk</a></li>
              <li><a href="mailto:exhibitions@big.dk"><span className="uppercase">EXHIBITIONS</span> — exhibitions@big.dk</a></li>
            </ul>
          </section>
          <section>
            <h4 className="uppercase text-[14px] flex items-center justify-between font-normal">
              <span>OFFICE</span>
              <span className="toggle">+</span>
            </h4>
            <address className="mt-[16px] leading-[20px]">
              <span className="uppercase">COPENHAGEN</span><br />
              Sundkaj 165<br />
              2150, Nordhavn<br />
              Copenhagen, DK<br />
              +45 7221 7227<br />
              +45 3512 7227
            </address>
          </section>
          <section>
            <h4 className="uppercase text-[14px] flex items-center justify-between font-normal">
              <span>SOCIAL</span>
              <span className="toggle">+</span>
            </h4>
          </section>
          <section>
            <h4 className="uppercase text-[14px] flex items-center justify-between font-normal">
              <span>LEGAL</span>
              <span className="toggle">+</span>
            </h4>
          </section>
        </div>
        <div className="back-to-top-wrap flex justify-center mt-[96px]">
          <button className="back-to-top uppercase text-[14px]">BACK TO TOP</button>
        </div>
      </footer>

      {/* §1.7 — Command menu container (hidden by default) */}
      <div className="cmdk" data-state="closed" hidden />
    </>
  );
}
