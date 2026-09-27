// Builds the SVGs that depend on live GitHub data, in the profile theme:
//   assets/live/contributions.svg   contribution calendar + streak stats
//   assets/live/repo-<name>.svg     pinned-style repository cards
// Data comes from `gh api graphql`, so it needs an authenticated GitHub CLI
// (locally: `gh auth login`; in Actions: GH_TOKEN). Set GH_BIN to use a gh that is not on PATH.
// Run: node scripts/build-live.mjs

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { C, esc, monoW, svg, panel, wrap } from "./theme.mjs";

const USER = "vishak239";
// Shown in this order, like pinned repositories.
const PINNED = [
  "Prep-pitch",
  "vishak-portfolio",
  "house-price-prediction",
  "Multiple-Linear-regression-practices",
  "python-practice",
  "numpy-practice",
];

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "live");
mkdirSync(OUT, { recursive: true });

function graphql(query) {
  const out = execFileSync(process.env.GH_BIN || "gh", ["api", "graphql", "-f", `query=${query}`], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  const json = JSON.parse(out);
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const data = graphql(`{
  user(login: "${USER}") {
    contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount weekday } } } }
    repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC) {
      nodes { name description stargazerCount forkCount pushedAt primaryLanguage { name } }
    }
  }
}`).user;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDate = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

// ── contribution calendar ──────────────────────────────────────────────────
const LEVELS = ["#161012", "#4A1219", "#7E1624", "#B81D31", C.accent2];

function contributions(calendar) {
  const weeks = calendar.weeks;
  const days = weeks.flatMap((w) => w.contributionDays);
  // Quartiles of the non-zero days, as GitHub does, so one busy day doesn't flatten the rest.
  const counts = days.map((d) => d.contributionCount).filter(Boolean).sort((a, b) => a - b);
  const q = (p) => counts[Math.min(counts.length - 1, Math.floor(p * counts.length))] ?? 0;
  const [q1, q2, q3] = [q(0.25), q(0.5), q(0.75)];
  const level = (n) => (n === 0 ? 0 : n <= q1 ? 1 : n <= q2 ? 2 : n <= q3 ? 3 : 4);

  // stats
  let longest = 0, run = 0;
  for (const d of days) {
    run = d.contributionCount ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount) current++;
    else if (i === days.length - 1) continue; // today can still be empty
    else break;
  }
  const active = days.filter((d) => d.contributionCount).length;
  const best = days.reduce((a, b) => (b.contributionCount > a.contributionCount ? b : a), days[0]);

  const W = 1200, H = 400, cell = 15, step = 19;
  const gx = 1200 - 64 - weeks.length * step + (step - cell), gy = 112;

  let cells = "", months = "", lastMonth = -1;
  weeks.forEach((w, wi) => {
    const x = gx + wi * step;
    const m = Number(w.contributionDays[0].date.slice(5, 7)) - 1;
    if (m !== lastMonth && w.contributionDays[0].date.slice(8) <= "07" && wi < weeks.length - 1) {
      months += `<text x="${x}" y="${gy - 12}" class="mono" font-size="11" fill="${C.dim}">${MONTHS[m]}</text>`;
      lastMonth = m;
    }
    for (const d of w.contributionDays) {
      const y = gy + d.weekday * step;
      const lv = level(d.contributionCount);
      cells += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="3" fill="${LEVELS[lv]}"${lv ? "" : ` stroke="${C.line}"`}><title>${d.contributionCount} on ${fmtDate(d.date)}</title></rect>`;
    }
  });
  const last = days[days.length - 1];
  const lastW = weeks.length - 1;
  const today = last.contributionCount
    ? `<rect x="${gx + lastW * step - 3}" y="${gy + last.weekday * step - 3}" width="${cell + 6}" height="${cell + 6}" rx="5" fill="none" stroke="${C.accent2}" class="pulse"/>`
    : "";

  const dayLabels = [["Mon", 1], ["Wed", 3], ["Fri", 5]]
    .map(([l, i]) => `<text x="${gx - 14}" y="${gy + i * step + 12}" class="mono" font-size="11" fill="${C.dim}" text-anchor="end">${l}</text>`).join("");
  const legendX = W - 64 - 5 * step - 44;
  const legend = `<text x="${legendX - 10}" y="${gy + 7 * step + 22}" class="mono" font-size="11" fill="${C.dim}" text-anchor="end">Less</text>
  ${LEVELS.map((c, i) => `<rect x="${legendX + i * step}" y="${gy + 7 * step + 10}" width="${cell}" height="${cell}" rx="3" fill="${c}"${i ? "" : ` stroke="${C.line}"`}/>`).join("")}
  <text x="${legendX + 5 * step + 6}" y="${gy + 7 * step + 22}" class="mono" font-size="11" fill="${C.dim}">More</text>`;

  const stats = [
    ["CONTRIBUTIONS", String(calendar.totalContributions), "in the last year"],
    ["ACTIVE DAYS", String(active), `of ${days.length}`],
    ["CURRENT STREAK", `${current} day${current === 1 ? "" : "s"}`, current ? "and counting" : "start one today"],
    ["LONGEST STREAK", `${longest} day${longest === 1 ? "" : "s"}`, "in the last year"],
    ["BEST DAY", String(best.contributionCount), fmtDate(best.date)],
  ];
  const tw = (W - 64 * 2 - 16 * 4) / 5;
  const tiles = stats.map(([k, v, s], i) => `<g transform="translate(${64 + i * (tw + 16)} 292)">
    <rect width="${tw}" height="84" rx="12" fill="${C.card}" stroke="${C.line2}"/>
    <rect x="18" width="30" height="2" fill="${C.accent}"/>
    <text x="18" y="26" class="mono" font-size="10.5" letter-spacing="2" fill="${C.accent}">${k}</text>
    <text x="18" y="56" class="serif" font-size="24" fill="${C.text}">${esc(v)}</text>
    <text x="18" y="74" class="sans" font-size="12.5" fill="${C.muted}">${esc(s)}</text>
  </g>`).join("\n  ");

  return svg(W, H, {
    title: `${calendar.totalContributions} contributions in the last year`,
    desc: stats.map(([k, v, s]) => `${k.toLowerCase()}: ${v} (${s})`).join("; "),
  },
    `${panel(W, H)}
  <text x="64" y="54" class="mono" font-size="12" letter-spacing="3" fill="${C.accent}">CONTRIBUTIONS · LAST 12 MONTHS</text>
  <text x="${W - 64}" y="54" class="serif" font-size="17" font-style="italic" fill="${C.muted}" text-anchor="end">${calendar.totalContributions} contributions in the last year</text>
  ${months}
  ${dayLabels}
  ${cells}
  ${today}
  ${legend}
  ${tiles}`);
}

// ── pinned-style repository card ───────────────────────────────────────────
const FORK = `<path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>`;
const BOOK = `<path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/>`;

function repoCard(r) {
  const W = 600, H = 190;
  let lines = wrap(r.description || "No description.", 64);
  if (lines.length > 3) lines = [...lines.slice(0, 2), lines[2].replace(/\W*\w*$/, "") + "…"];
  const lang = r.primaryLanguage?.name ?? "";
  const pill = "PUBLIC";
  const pw = monoW(pill, 10.5, 1.5) + 20;
  let x = 32;
  const meta = [];
  if (lang) {
    meta.push(`<circle cx="${x + 6}" cy="${H - 31}" r="6" fill="${C.accent}"/><text x="${x + 18}" y="${H - 26}" class="sans" font-size="14" fill="${C.muted}">${esc(lang)}</text>`);
    x += 30 + lang.length * 8;
  }
  meta.push(`<text x="${x}" y="${H - 26}" class="sans" font-size="14" fill="${C.muted}"><tspan fill="${C.accent2}">★</tspan> ${r.stargazerCount}</text>`);
  x += 56;
  x += 18;
  meta.push(`<text x="${x}" y="${H - 26}" class="sans" font-size="14" fill="${C.muted}">${r.forkCount}</text><g transform="translate(${x - 18} ${H - 39})" fill="${C.accent2}">${FORK}</g>`);
  return svg(W, H, {
    title: r.name,
    desc: `${r.description ?? ""} ${lang ? `Language: ${lang}.` : ""} ${r.stargazerCount} stars, ${r.forkCount} forks. Updated ${fmtDate(r.pushedAt)}.`,
  },
    `${panel(W, H, 14)}
  <g transform="translate(32 26) scale(1.25)" fill="${C.accent2}">${BOOK}</g>
  <text x="62" y="43" class="mono" font-size="18" font-weight="600" fill="${C.accent2}">${esc(r.name)}</text>
  <rect x="${W - 32 - pw}" y="26" width="${pw}" height="22" rx="11" fill="none" stroke="${C.accent}" stroke-opacity=".55"/>
  <text x="${W - 32 - pw / 2}" y="41" class="mono" font-size="10.5" letter-spacing="1.5" fill="${C.muted}" text-anchor="middle">${pill}</text>
  ${lines.map((l, i) => `<text x="32" y="${82 + i * 22}" class="sans" font-size="15" fill="${C.muted}">${esc(l)}</text>`).join("\n  ")}
  ${meta.join("\n  ")}
  <text x="${W - 32}" y="${H - 26}" class="mono" font-size="11.5" fill="${C.dim}" text-anchor="end">updated ${fmtDate(r.pushedAt)}</text>`);
}

writeFileSync(join(OUT, "contributions.svg"), contributions(data.contributionsCollection.contributionCalendar));
const byName = Object.fromEntries(data.repositories.nodes.map((r) => [r.name, r]));
for (const name of PINNED) {
  if (!byName[name]) throw new Error(`repository not found: ${name}`);
  writeFileSync(join(OUT, `repo-${name}.svg`), repoCard(byName[name]));
}
console.log("live assets written to", OUT);
