import projectsData from "./projects.json";

type Project = {
  num: number;
  name: string;
  location: string;
  slug: string;
  photoFile: string | null;
  monoFile: string | null;
  photoUrl: string | null;
  monoUrl: string | null;
  photoOnDisk: boolean;
  monoOnDisk: boolean;
};

const projects = projectsData as Project[];

// SVG 0 from capture/rendered-page.html — pixelated block-style BIG wordmark.
// Used at two sizes/colors: large white inside the intro loader, small black
// as the persistent top-left wordmark. fill="currentColor" lets parent control.
function BigLogo({ className, label = "BIG" }: { className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 475 216" role="img" aria-label={label} className={className}>
      <path fill="currentColor" d="M43 87V130V174H0V0H130V87H87V43H43V87Z" />
      <path fill="currentColor" d="M0 216V173H43H130H173V216H0Z" />
      <path fill="currentColor" d="M173 86V174H130V129H42V86H86H130H173Z" />
      <path fill="currentColor" d="M216 216V0H259V216H216Z" />
      <path fill="currentColor" d="M345 43H302V0H475V43H345Z" />
      <path fill="currentColor" d="M475 216H302V42H345V173H432V129H389V86H475V216Z" />
    </svg>
  );
}

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 12" role="img" aria-label="Open menu" className={className}>
      <rect x="0" y="1" width="24" height="2" fill="currentColor" />
      <rect x="0" y="5" width="24" height="2" fill="currentColor" />
      <rect x="0" y="9" width="24" height="2" fill="currentColor" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" role="img" aria-label="Search" className={className} fill="none">
      <circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="13.5" y1="13.5" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function photoSrc(p: Project): string | null {
  if (p.photoOnDisk && p.photoFile) return `/assets/${p.photoFile}`;
  return p.photoUrl; // remote fallback from media.big.dk
}

function monoSrc(p: Project): string | null {
  if (p.monoOnDisk && p.monoFile) return `/assets/${p.monoFile}`;
  return p.monoUrl;
}

export default function Page() {
  return (
    <>
      {/* §3.1 — Full-screen intro loader (static black overlay). Animation lands in Phase 4. */}
      <div className="intro-loader pointer-events-none fixed inset-0 z-50 bg-black flex items-center justify-center">
        <BigLogo className="intro-logo text-white block w-[80px] h-auto" />
      </div>

      {/* §3.2 — Fixed top bar: hamburger + BIG wordmark + filter tabs + search + stage toggle */}
      <div className="top-bar fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-[30px] pt-[24px]">
        <button className="hamburger relative z-50 inline-flex items-center justify-center text-black" aria-label="Open menu">
          <HamburgerIcon className="w-[24px] h-[12px]" />
        </button>

        {/* §3.1 / §3.2 — persistent BIG wordmark anchored at (30, 20) */}
        <a className="logo fixed top-[20px] left-[30px] inline-flex items-center text-black z-50" href="/">
          <BigLogo className="block w-[42px] h-[19px]" />
        </a>

        <label className="filter-menu group flex items-center gap-[48px] text-[14px] uppercase">
          <a href="/projects/architecture">ARCHITECTURE</a>
          <a href="/projects/interiors">INTERIORS</a>
          <a href="/projects/landscape">LANDSCAPE</a>
          <a href="/projects/planning">PLANNING</a>
          <a href="/projects/products">PRODUCTS</a>
        </label>

        <div className="top-bar-right flex items-center gap-[12px] text-[14px] uppercase">
          <button className="search inline-flex items-center justify-center text-black" aria-label="search">
            <SearchIcon className="w-[18px] h-[18px]" />
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

      {/* §3.4 — Project list (all 129 rows from copy.md § Project list) */}
      <div className="projects-container overflow-x-hidden pt-[80px]">
        <div className="project-list flex flex-col">
          {projects.map((p) => {
            const photo = photoSrc(p);
            const mono = monoSrc(p);
            return (
              <a
                key={`${p.num}-${p.slug}`}
                className="project-row grid grid-cols-[1fr_2fr] items-start gap-[30px] py-[30px] px-[30px] border-t border-gray-200"
                href={`/projects/${p.slug}`}
              >
                <div className="project-label flex items-start gap-[16px]">
                  {mono ? (
                    <img
                      className="w-[25px] h-[25px] object-cover bg-black shrink-0"
                      src={mono}
                      alt={`${p.name} monogram`}
                    />
                  ) : (
                    <span className="w-[25px] h-[25px] bg-black shrink-0 block" data-todo="monogram asset needed" />
                  )}
                  <div className="min-w-0">
                    <h3 className="text-[18px] leading-[20px]">{p.name}</h3>
                    <p className="text-[12px] text-[#797979] uppercase tracking-[0.3px] mt-[4px]">{p.location}</p>
                  </div>
                </div>
                <figure className="m-0 aspect-[16/9] overflow-hidden bg-gray-200">
                  {photo ? (
                    <img
                      className="w-full h-full object-cover"
                      src={photo}
                      alt={`${p.name} photograph`}
                      loading="lazy"
                    />
                  ) : (
                    /* TODO: photo asset needed for this row */
                    <span />
                  )}
                </figure>
              </a>
            );
          })}
        </div>
      </div>

      {/* §3.5 — Footer (copy.md § Footer verbatim) */}
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
