// Produce rebuild/app/projects.json — the canonical 129-row list for the site.
// Source of truth: copy.md (§ Project list). Assets matched from runtime-data
// extraction (capture/_tmp/projects-extracted.json) by name.

const fs = require("fs");
const path = require("path");

const copyMd = fs.readFileSync(path.resolve(__dirname, "../../copy.md"), "utf8");
const extracted = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "projects-extracted.json"), "utf8"),
);

// Parse copy.md project table. Rows look like: | 1 | Project Name | LOCATION |
// (pipe-delimited, inside a markdown table).
const lines = copyMd.split(/\r?\n/);
const startIdx = lines.findIndex((l) => /^\|\s*1\s*\|/.test(l));
const projects = [];
for (let i = startIdx; i < lines.length; i++) {
  const line = lines[i];
  if (!line.startsWith("|")) {
    // Multi-line rows (125-129) have content wrapped across newlines in raw copy.md.
    // If we hit a non-| line, it's continuation of the previous location cell.
    if (projects.length && !/^##/.test(line) && line.trim().length > 0) {
      const last = projects[projects.length - 1];
      last.location = (last.location + " " + line.trim()).trim();
      continue;
    }
    break;
  }
  const cells = line.split("|").map((c) => c.trim());
  // cells: ["", "1", "Tennessee Performing Arts Center", "NASHVILLE, UNITED STATES", ""]
  if (cells.length < 4) continue;
  const num = cells[1];
  if (!/^\d+$/.test(num)) continue;
  const name = cells[2];
  const location = cells.slice(3, -1).join(" | "); // preserve multi-loc like WeGrow NYC
  projects.push({ num: parseInt(num, 10), name, location });
}

// Build a name-index of the extracted data.
const extractedByName = new Map(extracted.map((p) => [p.name, p]));

// Slugify
function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// copy.md § Project list was extracted with a table-parser bug: 8 rows have
// corrupted locations (missing city, or office addresses spilled in). Prefer
// the DOM-captured location (from rendered-page.html, i.e. the live reference
// site) when it exists — that is the authoritative source for what BIG actually
// shows. Fallback to copy.md's location only when DOM has no match.
const corruptLocations = new Set([
  "Oakland A's Ballpark & Masterplan",
  "WeGrow NYC",
  "Ibervalles Hotel",
  "Dortheavej 2 Residences",
  "Downtown Brooklyn Public Realm",
  "Omniturm",
  "Copenhagen Harbor Bath",
  "Sjakket Youth Club",
]);

const out = projects.map((p) => {
  const match = extractedByName.get(p.name);
  const domLocation = match ? match.location : null;
  // Use DOM location if copy.md row is in the corrupted set
  const location = corruptLocations.has(p.name) && domLocation ? domLocation : p.location;
  return {
    num: p.num,
    name: p.name,
    location,
    locationSource: corruptLocations.has(p.name) && domLocation ? "dom" : "copy.md",
    slug: slugify(p.name),
    photoFile: match ? match.photoFile : null,
    monoFile: match ? match.monoFile : null,
    photoUrl: match ? match.photoUrl : null,
    monoUrl: match ? match.monoUrl : null,
    photoOnDisk: match ? match.photoOnDisk : false,
    monoOnDisk: match ? match.monoOnDisk : false,
  };
});

// Stats
const total = out.length;
const bothOnDisk = out.filter((p) => p.photoOnDisk && p.monoOnDisk).length;
const missingAssets = out.filter((p) => !p.photoOnDisk || !p.monoOnDisk).length;
const noMatchInDOM = out.filter((p) => !p.photoUrl).length;

console.log(`Copy.md rows: ${total}`);
console.log(`  both assets on disk: ${bothOnDisk}`);
console.log(`  some/all assets missing: ${missingAssets}`);
console.log(`  not found in rendered DOM at all: ${noMatchInDOM}`);

if (noMatchInDOM > 0) {
  console.log("\nMissing DOM matches (copy.md rows with no asset URL at all):");
  out.filter((p) => !p.photoUrl).forEach((p) => console.log(`  #${p.num} ${p.name}`));
}

fs.writeFileSync(
  path.resolve(__dirname, "../../rebuild/app/projects.json"),
  JSON.stringify(out, null, 2),
  "utf8",
);
console.log("\nwrote rebuild/app/projects.json");
