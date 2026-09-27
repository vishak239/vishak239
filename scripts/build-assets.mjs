// Generates every SVG in ../assets from the data below.
// Run: node scripts/build-assets.mjs
// GitHub strips CSS from READMEs, so all styling lives inside these SVGs.
// Theme: red and black.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
mkdirSync(OUT, { recursive: true });

// ── palette ────────────────────────────────────────────────────────────────
const C = {
  bg0: "#050505",
  bg1: "#0B0B0B",
  card: "#100C0D",
  line: "#26100F",
  line2: "#3A1517",
  accent: "#D7263D",
  accent2: "#FF4D5E",
  text: "#F7F2F2",
  muted: "#ABA3A3",
  dim: "#6E6566",
};
const SANS = "'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

// ── helpers ────────────────────────────────────────────────────────────────
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Rough text widths, good enough for layout with generous margins.
const sansW = (s, size, ls = 0) => s.length * (size * 0.56 + ls);
const monoW = (s, size, ls = 0) => s.length * (size * 0.6 + ls);

function wrap(text, maxChars) {
  const lines = [];
  let cur = "";
  for (const word of text.split(" ")) {
    if ((cur + " " + word).trim().length > maxChars) {
      lines.push(cur);
      cur = word;
    } else cur = (cur + " " + word).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

const BASE_STYLE = `
    .sans { font-family: ${SANS}; }
    .mono { font-family: ${MONO}; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .25; } }
    @keyframes flow { to { stroke-dashoffset: -40; } }
    @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
    .pulse { animation: pulse 2.4s ease-in-out infinite; }
    .flow { stroke-dasharray: 4 6; animation: flow 2.2s linear infinite; }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }`;

function svg(w, h, { title, desc = "", style = "", defs = "" }, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t d">
  <title id="t">${esc(title)}</title>
  <desc id="d">${esc(desc)}</desc>
  <style>${BASE_STYLE}${style}
  </style>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.bg0}"/><stop offset="1" stop-color="${C.bg1}"/>
    </linearGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.accent}" stop-opacity="0"/>
      <stop offset=".5" stop-color="${C.accent2}"/>
      <stop offset="1" stop-color="${C.accent}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="ruleL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.accent2}"/>
      <stop offset="1" stop-color="${C.accent}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="${C.accent}" stroke-opacity=".05"/>
    </pattern>${defs}
  </defs>
${body}
</svg>
`;
}

const panel = (w, h, rx = 16) => `
  <rect width="${w}" height="${h}" rx="${rx}" fill="url(#bg)"/>
  <rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="${rx}" fill="none" stroke="${C.line}"/>`;

const corners = (w, h, m = 24, s = 18) => `
  <g stroke="${C.accent}" stroke-opacity=".55" stroke-width="1.2" fill="none">
    <path d="M${m} ${m + s}V${m}H${m + s}"/><path d="M${w - m - s} ${m}H${w - m}V${m + s}"/>
    <path d="M${m} ${h - m - s}V${h - m}H${m + s}"/><path d="M${w - m - s} ${h - m}H${w - m}V${h - m - s}"/>
  </g>`;

function tag(x, y, label, { dashed = false, solid = false, anchor = "start" } = {}) {
  const w = monoW(label, 11, 1.5) + 22;
  const x0 = anchor === "end" ? x - w : x;
  const fill = solid ? C.accent : "none";
  const color = solid ? C.bg0 : C.accent2;
  return `<g>
    <rect x="${x0}" y="${y - 15}" width="${w}" height="22" rx="11" fill="${fill}" fill-opacity="${solid ? 0.9 : 0}" stroke="${C.accent}" stroke-opacity="${solid ? 0 : 0.6}"${dashed ? ' stroke-dasharray="3 3"' : ""}/>
    <text x="${x0 + w / 2}" y="${y}" class="mono" font-size="11" letter-spacing="1.5" fill="${color}" text-anchor="middle" font-weight="600">${esc(label)}</text>
  </g>`;
}

const ICONS = {
  app: `<rect x="1" y="3" width="22" height="18" rx="3"/><path d="M1 8h22M5 5.5h.01M8 5.5h.01"/><path d="M6 13l3 2.5L6 18M12 18h6"/>`,
  eye: `<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3.5"/>`,
  chart: `<path d="M2 21h20M5 17v-5M10 17V7M15 17v-8M20 17V4"/>`,
  fn: `<path d="M2 21h20M2 21V3"/><circle cx="6" cy="16" r="1"/><circle cx="10" cy="13" r="1"/><circle cx="14" cy="11" r="1"/><circle cx="18" cy="7" r="1"/><path d="M4 18L21 5"/>`,
  web: `<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2c3 3.5 3 16.5 0 20M12 2c-3 3.5-3 16.5 0 20"/>`,
  stack: `<path d="M12 2l10 5-10 5L2 7l10-5z"/><path d="M2 12l10 5 10-5M2 17l10 5 10-5"/>`,
};
const icon = (name, x, y, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${C.accent2}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</g>`;

const write = (name, content) => writeFileSync(join(OUT, name), content);

// ── hero ───────────────────────────────────────────────────────────────────
function hero() {
  const W = 1200, H = 420;
  // neural net on the right, framed like a camera viewfinder
  const layers = [
    [150, 210, 270],
    [120, 180, 240, 300],
    [150, 210, 270],
    [180, 240],
  ].map((ys, i) => ys.map((y) => ({ x: 800 + i * 105, y })));
  let edges = "";
  for (let i = 0; i < layers.length - 1; i++)
    for (const a of layers[i])
      for (const b of layers[i + 1])
        edges += `<path d="M${a.x} ${a.y}L${b.x} ${b.y}"/>`;
  let nodes = "";
  layers.flat().forEach((n, i) => {
    nodes += `<circle cx="${n.x}" cy="${n.y}" r="7" fill="${C.bg0}" stroke="${C.accent}" stroke-width="1.4"/>
      <circle cx="${n.x}" cy="${n.y}" r="3" fill="${C.accent2}" class="pulse" style="animation-delay:${(i * 0.23).toFixed(2)}s"/>`;
  });

  return svg(
    W, H,
    {
      title: "V VISHAK — AI Engineer · Python Developer · AI / ML",
      desc: "Building intelligent systems with Python, machine learning and computer vision. Currently building PrepPitch.",
      style: `
    @keyframes scan { 0% { transform: translateY(0); opacity: 0; } 10%, 90% { opacity: .9; } 100% { transform: translateY(236px); opacity: 0; } }
    @keyframes caret { 50% { opacity: 0; } }
    .scan { animation: scan 4.5s ease-in-out infinite; }
    .caret { animation: caret 1s steps(1) infinite; }`,
      defs: `
    <radialGradient id="glow" cx=".78" cy=".5" r=".45">
      <stop offset="0" stop-color="${C.accent}" stop-opacity=".13"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="scanline" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.accent2}" stop-opacity="0"/><stop offset=".5" stop-color="${C.accent2}"/><stop offset="1" stop-color="${C.accent2}" stop-opacity="0"/>
    </linearGradient>`,
    },
    `${panel(W, H, 18)}
  <rect width="${W}" height="${H}" rx="18" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" rx="18" fill="url(#glow)"/>
  ${corners(W, H, 28, 20)}

  <g class="sans">
    <text x="80" y="104" class="mono" font-size="15" fill="${C.muted}"><tspan fill="${C.accent}">~/vishak239</tspan> <tspan fill="${C.dim}">$</tspan> whoami<tspan class="caret" fill="${C.accent2}"> ▍</tspan></text>
    <text x="76" y="196" font-size="86" font-weight="300" letter-spacing="16" fill="${C.text}">V VISHAK</text>
    <rect x="80" y="224" width="340" height="1.4" fill="url(#ruleL)"/>
    <text x="80" y="264" font-size="16" font-weight="600" letter-spacing="4.5" fill="${C.accent}">AI ENGINEER  ·  PYTHON DEVELOPER  ·  AI / ML</text>
    <text x="80" y="306" font-size="18" fill="${C.muted}">Building intelligent systems with Python,</text>
    <text x="80" y="332" font-size="18" fill="${C.muted}">machine learning and computer vision.</text>
  </g>

  <g transform="translate(80 350)">
    <rect width="372" height="30" rx="15" fill="${C.accent}" fill-opacity=".07" stroke="${C.accent}" stroke-opacity=".35"/>
    <circle cx="18" cy="15" r="4" fill="${C.accent2}" class="pulse"/>
    <text x="32" y="20" class="mono" font-size="12" letter-spacing="1.2" fill="${C.accent2}">NOW BUILDING <tspan fill="${C.text}">PrepPitch · Django / Python</tspan></text>
  </g>

  <!-- viewfinder + network -->
  <g stroke="${C.accent}" stroke-opacity=".6" stroke-width="1.4" fill="none">
    <path d="M740 116V92H764"/><path d="M1116 92H1140V116"/>
    <path d="M740 304V328H764"/><path d="M1116 328H1140V304"/>
  </g>
  <text x="742" y="80" class="mono" font-size="11" letter-spacing="2" fill="${C.dim}">REC ● VISION · LEARNING · INFERENCE</text>
  <g stroke="${C.accent}" stroke-opacity=".16" stroke-width="1">${edges}</g>
  <g stroke="${C.accent2}" stroke-opacity=".55" stroke-width="1" fill="none">
    <path class="flow" d="M800 210L905 180L1010 210L1115 240"/>
    <path class="flow" style="animation-delay:-1.1s" d="M800 150L905 240L1010 150L1115 180"/>
  </g>
  ${nodes}
  <g class="scan"><rect x="744" y="96" width="392" height="1.5" fill="url(#scanline)"/></g>
  <text x="1140" y="352" class="mono" font-size="11" letter-spacing="2" fill="${C.dim}" text-anchor="end">KANYAKUMARI · INDIA</text>`
  );
}

// ── link buttons ───────────────────────────────────────────────────────────
function button(label) {
  const w = Math.round(monoW(label, 13, 2.5) + 48), h = 42;
  return svg(w, h, { title: label },
    `  <rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="21" fill="${C.bg1}" stroke="${C.accent}" stroke-opacity=".55"/>
  <circle cx="20" cy="21" r="3" fill="${C.accent2}"/>
  <text x="${w / 2 + 6}" y="26" class="mono" font-size="13" letter-spacing="2.5" fill="${C.text}" text-anchor="middle">${esc(label)}</text>`);
}

// ── section title ──────────────────────────────────────────────────────────
// Section titles sit on GitHub's page background, so they come in dark and light variants.
function sectionTitle(num, label, light = false) {
  const W = 1200, H = 72;
  const T = light ? { accent: "#B3121F", dim: "#8A8080", text: "#1A1112", accent2: "#C8192A" } : C;
  const textEnd = 130 + sansW(label, 22, 7) + 24;
  return svg(W, H, { title: `${num} / ${label}` },
    `  <text x="4" y="46" class="mono" font-size="15" letter-spacing="2" fill="${T.accent}">${num}</text>
  <text x="42" y="46" class="mono" font-size="15" fill="${T.dim}">/</text>
  <text x="70" y="47" class="sans" font-size="22" font-weight="600" letter-spacing="7" fill="${T.text}">${esc(label)}</text>
  <rect x="${Math.round(textEnd)}" y="40" width="${Math.round(W - textEnd - 4)}" height="1" fill="url(#ruleL)" opacity=".7"/>
  <rect x="${W - 12}" y="36" width="8" height="8" transform="rotate(45 ${W - 8} 40)" fill="none" stroke="${T.accent2}"/>`);
}

// ── about: quick facts ─────────────────────────────────────────────────────
function facts() {
  const W = 1200, H = 150;
  const items = [
    ["STUDYING", "B.Tech AI & DS", "Loyola Institute · Final year"],
    ["WORKING", "Python Developer", "Nexvra Solutions · Sep 2026 →"],
    ["CGPA", "8.5 / 10", "7th semester"],
    ["GRADUATING", "2027", "Expected"],
  ];
  const tw = (W - 40 * 2 - 20 * 3) / 4;
  const body = items.map(([k, v, s], i) => {
    const x = 40 + i * (tw + 20);
    return `<g transform="translate(${x} 24)">
    <rect width="${tw}" height="102" rx="12" fill="${C.card}" stroke="${C.line2}"/>
    <rect x="20" y="0" width="36" height="2" fill="${C.accent}"/>
    <text x="20" y="32" class="mono" font-size="11" letter-spacing="2.5" fill="${C.accent}">${k}</text>
    <text x="20" y="64" class="sans" font-size="23" font-weight="600" fill="${C.text}">${esc(v)}</text>
    <text x="20" y="86" class="sans" font-size="13.5" fill="${C.muted}">${esc(s)}</text>
  </g>`;
  }).join("\n  ");
  return svg(W, H, { title: "Quick facts", desc: items.map((i) => i.join(" ")).join("; ") }, `${panel(W, H)}\n  ${body}`);
}

// ── PrepPitch showcase ─────────────────────────────────────────────────────
function preppitch() {
  const W = 1200, H = 610;
  const built = [
    ["Interview setup", "type, difficulty, role, job description"],
    ["Question engine", "Gemini, or a built-in question bank"],
    ["Mock interview", "timed questions read aloud (TTS)"],
    ["Answers", "typed answers"],
    ["Follow-up", "one follow-up question per answer"],
    ["Evaluation", "Gemini rubric or rules · STAR checklist"],
    ["Progress", "charts and session history"],
  ];
  const dev = ["Backend", "Interview flow", "Question engine", "Answer evaluation", "Speech-to-text", "Adaptive interviews"];

  const top = 214, step = 50;
  const left = built.map(([n, d], i) => {
    const y = top + i * step;
    return `<g>
      <circle cx="72" cy="${y}" r="7" fill="${C.bg0}" stroke="${C.accent}" stroke-width="1.4"/>
      <circle cx="72" cy="${y}" r="3" fill="${C.accent2}"/>
      <text x="96" y="${y - 2}" class="sans" font-size="16.5" font-weight="600" fill="${C.text}">${esc(n)}</text>
      <text x="96" y="${y + 17}" class="sans" font-size="13" fill="${C.muted}">${esc(d)}</text>
      ${tag(596, y + 4, "BUILT", { anchor: "end" })}
    </g>`;
  }).join("");
  const rail = `<path d="M72 ${top}V${top + (built.length - 1) * step}" stroke="${C.accent}" stroke-opacity=".6" stroke-width="1.4" class="flow"/>`;

  const right = dev.map((n, i) => {
    const y = top + 4 + i * 58;
    return `<g transform="translate(652 ${y - 26})">
      <rect width="500" height="44" rx="10" fill="${C.card}" stroke="${C.line2}"/>
      <g clip-path="url(#row)"><rect width="500" height="44" fill="url(#shine)" class="shine" style="animation-delay:${(i * 0.5).toFixed(1)}s"/></g>
      <text x="20" y="28" class="sans" font-size="16" fill="${C.text}">${esc(n)}</text>
    </g>
    ${tag(1136, y + 1, "IN DEVELOPMENT", { dashed: true, anchor: "end" })}`;
  }).join("");

  return svg(W, H, {
    title: "PrepPitch — interview-practice platform",
    desc: `Public prototype (React, TypeScript, Vite, Tailwind CSS, Gemini API) with built stages: ${built.map((b) => b[0]).join(", ")}. Main application in Django/Python, in development and not yet public: ${dev.join(", ")}.`,
    style: `
    @keyframes sweep { 0% { transform: translateX(-520px); } 60%, 100% { transform: translateX(520px); } }
    .shine { animation: sweep 5s ease-in-out infinite; }`,
    defs: `
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.accent}" stop-opacity="0"/><stop offset=".5" stop-color="${C.accent}" stop-opacity=".09"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="row"><rect width="500" height="44" rx="10"/></clipPath>
    <clipPath id="clip"><rect width="${W}" height="${H}" rx="16"/></clipPath>`,
  },
    `${panel(W, H)}
  <rect width="${W}" height="${H}" rx="16" fill="url(#grid)" opacity=".7"/>
  <g clip-path="url(#clip)">
  ${icon("app", 44, 42, 1.2)}
  <text x="84" y="62" class="mono" font-size="12" letter-spacing="3" fill="${C.accent}">FLAGSHIP PROJECT</text>
  <text x="42" y="116" class="sans" font-size="44" font-weight="300" letter-spacing="2" fill="${C.text}">PrepPitch</text>
  <text x="300" y="104" class="sans" font-size="17" fill="${C.muted}">An interview-practice platform: set up a role, answer timed</text>
  <text x="300" y="128" class="sans" font-size="17" fill="${C.muted}">questions, get feedback, and track progress over time.</text>
  <rect x="42" y="150" width="${W - 84}" height="1" fill="${C.line2}"/>

  <text x="42" y="184" class="mono" font-size="12" letter-spacing="2.5" fill="${C.accent2}">PUBLIC PROTOTYPE</text>
  <text x="200" y="184" class="mono" font-size="12" fill="${C.dim}">React · TypeScript · Vite · Tailwind · Gemini API</text>
  ${rail}
  ${left}

  <path d="M624 172V${H - 40}" stroke="${C.line2}"/>
  <text x="652" y="184" class="mono" font-size="12" letter-spacing="2.5" fill="${C.accent2}">MAIN APPLICATION</text>
  <text x="818" y="184" class="mono" font-size="12" fill="${C.dim}">Django / Python · not yet public</text>
  ${right}
  <text x="652" y="${H - 34}" class="mono" font-size="12.5" fill="${C.muted}">github.com/vishak239/Prep-pitch <tspan fill="${C.accent2}">↗</tspan></text>
  </g>`);
}

// ── project cards ──────────────────────────────────────────────────────────
function card({ icon: ic, kind, status, statusDashed, title, desc, stack, linked }) {
  const W = 600, H = 250;
  const lines = wrap(desc, 62);
  return svg(W, H, { title: `${title} — ${status}`, desc: `${desc} Stack: ${stack}.` },
    `${panel(W, H)}
  <rect x="32" y="0" width="56" height="2" fill="${C.accent}"/>
  ${icon(ic, 32, 30)}
  <text x="66" y="47" class="mono" font-size="11.5" letter-spacing="2.5" fill="${C.accent}">${esc(kind)}</text>
  ${tag(W - 32, 46, status, { dashed: statusDashed, anchor: "end" })}
  <text x="32" y="102" class="sans" font-size="27" font-weight="600" fill="${C.text}">${esc(title)}</text>
  ${lines.map((l, i) => `<text x="32" y="${136 + i * 23}" class="sans" font-size="16" fill="${C.muted}">${esc(l)}</text>`).join("\n  ")}
  <rect x="32" y="${H - 52}" width="${W - 64}" height="1" fill="${C.line2}"/>
  <text x="32" y="${H - 24}" class="mono" font-size="12.5" letter-spacing=".5" fill="${C.accent2}">${esc(stack)}</text>
  ${linked ? `<text x="${W - 32}" y="${H - 23}" class="sans" font-size="18" fill="${C.accent2}" text-anchor="end">↗</text>` : `<text x="${W - 32}" y="${H - 24}" class="mono" font-size="11" letter-spacing="1.5" fill="${C.dim}" text-anchor="end">PRIVATE FOR NOW</text>`}`);
}

const PROJECTS = {
  "card-preppitch": { icon: "app", kind: "AI APPLICATION", status: "PUBLIC PROTOTYPE", title: "PrepPitch", linked: true,
    desc: "Interview-practice web app with timed questions, one follow-up per answer, and rubric-based feedback. Django version in development.",
    stack: "React · TypeScript · Vite · Gemini API" },
  "card-drowsiness": { icon: "eye", kind: "COMPUTER VISION", status: "NOT YET PUBLIC", statusDashed: true, title: "Driver Drowsiness Detection", linked: false,
    desc: "Webcam-based drowsiness detection using the Eye Aspect Ratio and a CNN-based approach.",
    stack: "Python · OpenCV · EAR · CNN" },
  "card-house": { icon: "chart", kind: "MACHINE LEARNING", status: "PHASE 1", title: "House Price Prediction", linked: true,
    desc: "Notebook comparing Linear Regression and Random Forest on house prices, evaluated with MAE.",
    stack: "Python · pandas · scikit-learn" },
  "card-regression": { icon: "fn", kind: "ML FUNDAMENTALS", status: "PRACTICE", title: "Multiple Linear Regression", linked: true,
    desc: "Multi-feature regression experiments fitted with NumPy and scikit-learn.",
    stack: "Python · NumPy · scikit-learn" },
  "card-portfolio": { icon: "web", kind: "WEB", status: "BUILT", title: "Portfolio", linked: true,
    desc: "Personal portfolio site: projects, experience and the story behind them.",
    stack: "Next.js · TypeScript · Tailwind CSS" },
  "card-foundations": { icon: "stack", kind: "FOUNDATIONS", status: "LEARNING", title: "Python & Data Foundations", linked: true,
    desc: "Practice repos for NumPy, Matplotlib and Seaborn, plus a Python archive with Tkinter, MySQL and Flask.",
    stack: "NumPy · Matplotlib · Seaborn · Flask" },
};

// ── experience timeline ────────────────────────────────────────────────────
function experience() {
  const W = 1200;
  const items = [
    { role: "Python Developer / Python Developer Intern", org: "Nexvra Solutions", meta: "Sep 2026 – Present · Marthandam",
      detail: "Python · backend development · databases · APIs · testing and debugging", current: true },
    { role: "Python Training / Machine Learning Intern", org: "IT Desk", meta: "", detail: "Python course and machine learning internship" },
    { role: "Deep Learning Intern", org: "G-Tech", meta: "", detail: "Deep learning internship" },
    { role: "Internship / Student Role", org: "MyInspection", meta: "", detail: "" },
  ];
  const top = 60, gap = 100;
  const H = top + gap * (items.length - 1) + 70;
  const rows = items.map((it, i) => {
    const y = top + i * gap;
    return `<g>
    ${it.current ? `<circle cx="72" cy="${y}" r="13" fill="${C.accent}" fill-opacity=".15" class="pulse"/>` : ""}
    <circle cx="72" cy="${y}" r="7" fill="${C.bg0}" stroke="${C.accent}" stroke-width="1.5"/>
    <circle cx="72" cy="${y}" r="3" fill="${it.current ? C.accent2 : C.dim}"/>
    <text x="110" y="${y + 6}" class="sans" font-size="19" font-weight="600" fill="${C.text}">${esc(it.role)}</text>
    <text x="110" y="${y + 32}" class="sans" font-size="15" fill="${C.accent2}">${esc(it.org)}${it.detail ? `<tspan fill="${C.muted}">  ·  ${esc(it.detail)}</tspan>` : ""}</text>
    ${it.meta ? `<text x="${W - 44}" y="${y + 6}" class="mono" font-size="12.5" letter-spacing="1" fill="${C.muted}" text-anchor="end">${esc(it.meta)}</text>` : ""}
    ${it.current ? tag(W - 44, y + 34, "CURRENT", { solid: true, anchor: "end" }) : ""}
  </g>`;
  }).join("\n  ");
  return svg(W, H, { title: "Experience", desc: items.map((i) => `${i.role}, ${i.org}${i.meta ? ", " + i.meta : ""}`).join("; ") },
    `${panel(W, H)}
  <path d="M72 ${top}V${top + gap * (items.length - 1)}" stroke="${C.accent}" stroke-opacity=".35" stroke-width="1.4"/>
  ${rows}`);
}

// ── education ──────────────────────────────────────────────────────────────
function education() {
  const W = 1200, H = 150;
  const cols = [
    ["UNIVERSITY", "B.Tech Artificial Intelligence & Data Science", "Loyola Institute of Technology and Science · Final year · CGPA 8.5 / 10 · 2027"],
    ["SCHOOL", "Vidya Jyothi Matriculation HSS", "State Board"],
  ];
  const widths = [740, 356];
  let x = 40;
  const body = cols.map(([k, v, s], i) => {
    const g = `<g transform="translate(${x} 24)">
    <rect width="${widths[i] - (i ? 0 : 20)}" height="102" rx="12" fill="${C.card}" stroke="${C.line2}"/>
    <rect x="20" y="0" width="36" height="2" fill="${C.accent}"/>
    <text x="20" y="32" class="mono" font-size="11" letter-spacing="2.5" fill="${C.accent}">${k}</text>
    <text x="20" y="62" class="sans" font-size="20" font-weight="600" fill="${C.text}">${esc(v)}</text>
    <text x="20" y="86" class="sans" font-size="13.5" fill="${C.muted}">${esc(s)}</text>
  </g>`;
    x += widths[i];
    return g;
  }).join("\n  ");
  return svg(W, H, { title: "Education", desc: cols.map((c) => c.slice(1).join(", ")).join("; ") }, `${panel(W, H)}\n  ${body}`);
}

// ── stack ──────────────────────────────────────────────────────────────────
function stack() {
  const W = 1200;
  const rows = [
    ["LANGUAGES", ["Python", "SQL", "JavaScript", "TypeScript"], []],
    ["AI / ML", ["scikit-learn", "pandas", "NumPy", "Jupyter", "Gemini API"], ["Deep learning"]],
    ["COMPUTER VISION", ["OpenCV", "Eye Aspect Ratio", "CNN-based approach"], []],
    ["BACKEND", ["Flask", "MySQL"], ["Django"]],
    ["DATA VIZ", ["Matplotlib", "Seaborn"], []],
    ["WEB", ["React", "Next.js", "Vite", "Tailwind CSS"], []],
    ["TOOLS", ["Git", "GitHub", "VS Code"], []],
  ];
  const top = 92, rh = 54;
  const H = top + rows.length * rh + 14;
  const chip = (x, y, label, learning) => {
    const w = sansW(label, 15) + 30;
    return [`<g transform="translate(${x} ${y})">
      <rect width="${w}" height="34" rx="17" fill="${learning ? "none" : C.card}" stroke="${C.accent}" stroke-opacity="${learning ? 0.7 : 0.3}"${learning ? ' stroke-dasharray="4 4"' : ""}/>
      <text x="${w / 2}" y="22" class="sans" font-size="15" fill="${learning ? C.accent2 : C.text}" text-anchor="middle">${esc(label)}</text>
    </g>`, w];
  };
  const body = rows.map(([label, have, learning], i) => {
    const y = top + i * rh;
    let x = 270, out = "";
    for (const [items, l] of [[have, false], [learning, true]])
      for (const it of items) {
        const [g, w] = chip(x, y - 22, it, l);
        out += g;
        x += w + 10;
      }
    return `<text x="44" y="${y}" class="mono" font-size="12" letter-spacing="2.5" fill="${C.accent}">${label}</text>
  ${i ? `<rect x="44" y="${y - 38}" width="${W - 88}" height="1" fill="${C.line}"/>` : ""}
  ${out}`;
  }).join("\n  ");
  return svg(W, H, {
    title: "Technical stack",
    desc: rows.map(([l, h, g]) => `${l}: ${h.join(", ")}${g.length ? ` (learning: ${g.join(", ")})` : ""}`).join("; "),
  },
    `${panel(W, H)}
  <text x="44" y="48" class="mono" font-size="12" letter-spacing="2.5" fill="${C.muted}">WORKING WITH / LEARNING</text>
  <g transform="translate(${W - 330} 30)">
    <rect width="30" height="20" rx="10" fill="${C.card}" stroke="${C.accent}" stroke-opacity=".3"/>
    <text x="40" y="15" class="sans" font-size="13.5" fill="${C.muted}">working with</text>
    <rect x="150" width="30" height="20" rx="10" fill="none" stroke="${C.accent}" stroke-opacity=".7" stroke-dasharray="4 4"/>
    <text x="190" y="15" class="sans" font-size="13.5" fill="${C.muted}">learning</text>
  </g>
  ${body}`);
}

// ── current focus ──────────────────────────────────────────────────────────
function focus() {
  const W = 1200, H = 250;
  const items = [
    ["PrepPitch", ["Main app in Django / Python:", "interview flow, evaluation,", "speech-to-text, adaptive", "interviews"]],
    ["Machine learning", ["Complete, reproducible", "notebooks with proper", "evaluation"]],
    ["Computer vision", ["Webcam-based drowsiness", "detection with OpenCV"]],
    ["Automotive AI", ["How vision and ML apply", "to driver and vehicle", "systems"]],
  ];
  const tw = (W - 40 * 2 - 20 * 3) / 4;
  const body = items.map(([t, lines], i) => {
    const x = 40 + i * (tw + 20);
    return `<g transform="translate(${x} 28)">
    <rect width="${tw}" height="194" rx="12" fill="${C.card}" stroke="${C.line2}"/>
    <text x="22" y="42" class="mono" font-size="28" font-weight="300" fill="${C.accent}" opacity=".85">0${i + 1}</text>
    <text x="22" y="82" class="sans" font-size="19" font-weight="600" fill="${C.text}">${esc(t)}</text>
    ${lines.map((l, j) => `<text x="22" y="${112 + j * 21}" class="sans" font-size="14.5" fill="${C.muted}">${esc(l)}</text>`).join("")}
  </g>`;
  }).join("\n  ");
  return svg(W, H, { title: "Current focus", desc: items.map(([t, l]) => `${t}: ${l.join(" ")}`).join("; ") }, `${panel(W, H)}\n  ${body}`);
}

// ── footer ─────────────────────────────────────────────────────────────────
function footer() {
  const W = 1200, H = 200;
  return svg(W, H, {
    title: "Let's build something intelligent",
    desc: "Reach V Vishak at vishak3416@gmail.com or linkedin.com/in/vishak3416",
    style: `
    @keyframes grow { 0%, 100% { transform: scaleX(.35); } 50% { transform: scaleX(1); } }
    .grow { transform-origin: 600px 0; animation: grow 6s ease-in-out infinite; }`,
  },
    `${panel(W, H, 18)}
  <rect width="${W}" height="${H}" rx="18" fill="url(#grid)"/>
  ${corners(W, H, 22, 16)}
  <rect class="grow" x="420" y="142" width="360" height="1.2" fill="url(#rule)"/>
  <text x="600" y="78" class="mono" font-size="12" letter-spacing="4" fill="${C.accent}" text-anchor="middle">OPEN TO CONVERSATIONS ON AI · ML · PYTHON</text>
  <text x="600" y="122" class="sans" font-size="34" font-weight="300" letter-spacing="2" fill="${C.text}" text-anchor="middle">Let’s build something intelligent.</text>
  <text x="600" y="172" class="mono" font-size="13" fill="${C.muted}" text-anchor="middle">vishak3416@gmail.com  ·  linkedin.com/in/vishak3416  ·  github.com/vishak239</text>`);
}

// ── divider ────────────────────────────────────────────────────────────────
function divider() {
  return svg(1200, 24, { title: "section divider" },
    `  <rect x="300" y="11.5" width="284" height="1" fill="url(#rule)"/>
  <rect x="616" y="11.5" width="284" height="1" fill="url(#rule)"/>
  <rect x="594" y="6" width="12" height="12" transform="rotate(45 600 12)" fill="none" stroke="${C.accent2}" stroke-width="1.2"/>`);
}

// ── avatar (upload as the GitHub profile picture; not used in the README) ─
function avatar() {
  const S = 460;
  return svg(S, S, { title: "V Vishak monogram" },
    `  <rect width="${S}" height="${S}" fill="url(#bg)"/>
  <rect width="${S}" height="${S}" fill="url(#grid)"/>
  <circle cx="230" cy="230" r="170" fill="${C.accent}" fill-opacity=".08"/>
  ${corners(S, S, 70, 34)}
  <path d="M150 150 L230 318 L310 150" fill="none" stroke="${C.accent}" stroke-width="30" stroke-linejoin="miter" stroke-linecap="square"/>
  <path d="M196 150 L230 222 L264 150" fill="none" stroke="${C.text}" stroke-width="10" stroke-linecap="square" opacity=".9"/>
  <text x="230" y="378" class="mono" font-size="16" letter-spacing="8" fill="${C.muted}" text-anchor="middle">VISHAK</text>`);
}

// ── write everything ───────────────────────────────────────────────────────
write("hero.svg", hero());
write("avatar.svg", avatar());
write("divider.svg", divider());
write("facts.svg", facts());
write("preppitch.svg", preppitch());
write("experience.svg", experience());
write("education.svg", education());
write("stack.svg", stack());
write("focus.svg", focus());
write("footer.svg", footer());
for (const [name, p] of Object.entries(PROJECTS)) write(`${name}.svg`, card(p));
for (const label of ["LINKEDIN", "EMAIL", "PREPPITCH", "PORTFOLIO"]) write(`btn-${label.toLowerCase().replace(/ /g, "-")}.svg`, button(label));
const titles = [
  ["01", "ABOUT"], ["02", "CURRENTLY BUILDING"], ["03", "SELECTED PROJECTS"], ["04", "EXPERIENCE"],
  ["05", "EDUCATION"], ["06", "TECHNICAL STACK"], ["07", "CURRENT FOCUS"], ["08", "GITHUB ACTIVITY"], ["09", "CONTACT"],
];
for (const [n, l] of titles) {
  write(`title-${n}.svg`, sectionTitle(n, l));
  write(`title-${n}-light.svg`, sectionTitle(n, l, true));
}
console.log("assets written to", OUT);
