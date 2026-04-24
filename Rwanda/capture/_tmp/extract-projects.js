// Parse capture/rendered-page.html and emit a JSON list of projects
// with photo URL, monogram URL, name, location.
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.resolve(__dirname, "../rendered-page.html"), "utf8");

// Split on project-item markers. Each <div class="project-item ..."> ... </div>
// begins a new project row.
const parts = html.split(/<div[^>]*class="project-item[^"]*"[^>]*>/);
// parts[0] is everything before the first project-item
const items = parts.slice(1);

const projects = [];
for (const raw of items) {
  // photo: first <img ... src="https://media.big.dk/*.jpg?width=800" ...>
  const photoMatch = raw.match(/<img[^>]*src="(https:\/\/media\.big\.dk\/[^"]*\.jpg\?width=800)"/);
  // monogram: <img ... src="https://media.big.dk/*.svg?width=52&amp;height=52">
  const monoMatch = raw.match(/<img[^>]*src="(https:\/\/media\.big\.dk\/[^"]*\.svg\?width=52(?:&amp;|&)height=52)"/);
  // h3 + p
  const h3Match = raw.match(/<h3[^>]*>([^<]+)<\/h3>/);
  const pMatch = raw.match(/<p[^>]*>([^<]+)<\/p>/);

  const decode = (s) =>
    s
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

  const photoUrl = photoMatch ? decode(photoMatch[1]) : null;
  const monoUrl = monoMatch ? decode(monoMatch[1]) : null;
  const name = h3Match ? decode(h3Match[1].trim()) : null;
  const location = pMatch ? decode(pMatch[1].trim()) : null;

  if (!name) continue;

  projects.push({ name, location, photoUrl, monoUrl });
}

// Local filename transform: strip query, replace /YYYY/MM/ path segments, append dim suffix
// Rule from asset_rows.json: `https://media.big.dk/02-broadway_15-credit-Bloomimages_sh.jpg?width=800`
//   → `02-broadway_15-credit-Bloomimages_sh_w800.jpg`
// and `https://media.big.dk/2024/05/NAH_ICON.svg?width=52&height=52`
//   → `NAH_ICON_w52_h52.svg`
function toLocalFilename(url) {
  if (!url) return null;
  const u = new URL(url);
  const basename = u.pathname.split("/").pop(); // e.g. "02-broadway_15-credit-Bloomimages_sh.jpg"
  const dot = basename.lastIndexOf(".");
  const stem = basename.slice(0, dot);
  const ext = basename.slice(dot);
  const w = u.searchParams.get("width");
  const h = u.searchParams.get("height");
  let suffix = "";
  if (w && h) suffix = `_w${w}_h${h}`;
  else if (w) suffix = `_w${w}`;
  return `${stem}${suffix}${ext}`;
}

// Check which files exist in assets/
const assetsDir = path.resolve(__dirname, "../../assets");
const onDisk = new Set(fs.readdirSync(assetsDir));

for (const p of projects) {
  p.photoFile = toLocalFilename(p.photoUrl);
  p.monoFile = toLocalFilename(p.monoUrl);
  p.photoOnDisk = p.photoFile ? onDisk.has(p.photoFile) : false;
  p.monoOnDisk = p.monoFile ? onDisk.has(p.monoFile) : false;
}

const total = projects.length;
const bothOnDisk = projects.filter((p) => p.photoOnDisk && p.monoOnDisk).length;
const photoOnly = projects.filter((p) => p.photoOnDisk && !p.monoOnDisk).length;
const monoOnly = projects.filter((p) => !p.photoOnDisk && p.monoOnDisk).length;
const neither = projects.filter((p) => !p.photoOnDisk && !p.monoOnDisk).length;

console.log(`Total projects: ${total}`);
console.log(`  both assets on disk: ${bothOnDisk}`);
console.log(`  photo only: ${photoOnly}`);
console.log(`  monogram only: ${monoOnly}`);
console.log(`  neither: ${neither}`);

fs.writeFileSync(
  path.resolve(__dirname, "projects-extracted.json"),
  JSON.stringify(projects, null, 2),
  "utf8",
);
console.log("wrote capture/_tmp/projects-extracted.json");
