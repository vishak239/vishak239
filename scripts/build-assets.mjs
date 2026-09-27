// Generates every SVG in ../assets from the data below.
// Run: node scripts/build-assets.mjs
// GitHub strips CSS from READMEs, so all styling lives inside these SVGs.
// Theme: red and black. Typography follows the portfolio (vishak-portfolio):
// a serif for headlines, a monospace for labels, a sans-serif for body text.
// Content is kept in step with vishak-portfolio/src/data/portfolioContent.ts.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
mkdirSync(OUT, { recursive: true });

export const PORTFOLIO_URL = "https://vishak-portfolio-gray.vercel.app";

import { C, SANS, SERIF, MONO, esc, sansW, monoW, serifW, wrap, svg, panel, corners, tag, icon, vMark } from "./theme.mjs";

const write = (name, content) => writeFileSync(join(OUT, name), content);

// ── hero ───────────────────────────────────────────────────────────────────
function hero() {
  const W = 1200, H = 460;
  // neural net on the right, framed like a camera viewfinder
  const layers = [
    [160, 220, 280],
    [130, 190, 250, 310],
    [160, 220, 280],
    [190, 250],
  ].map((ys, i) => ys.map((y) => ({ x: 810 + i * 100, y })));
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
      title: "V Vishak — AI Engineer · Python Developer · AI / ML",
      desc: "An AI Engineer's journey. Building intelligence. Creating what's next. Building practical AI systems with Python, machine learning and computer vision, one working project at a time. Now building PrepPitch with Django / Python.",
      style: `
    @keyframes scan { 0% { transform: translateY(0); opacity: 0; } 10%, 90% { opacity: .9; } 100% { transform: translateY(236px); opacity: 0; } }
    @keyframes caret { 50% { opacity: 0; } }
    .scan { animation: scan 4.5s ease-in-out infinite; }
    .caret { animation: caret 1s steps(1) infinite; }`,
      defs: `
    <radialGradient id="glow" cx=".78" cy=".5" r=".45">
      <stop offset="0" stop-color="${C.accent}" stop-opacity=".14"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="scanline" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.accent2}" stop-opacity="0"/><stop offset=".5" stop-color="${C.accent2}"/><stop offset="1" stop-color="${C.accent2}" stop-opacity="0"/>
    </linearGradient>`,
    },
    `${panel(W, H, 18)}
  <rect width="${W}" height="${H}" rx="18" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" rx="18" fill="url(#glow)"/>
  ${corners(W, H, 28, 20)}

  <text x="80" y="92" class="mono" font-size="13" letter-spacing="4" fill="${C.accent2}">ACT I // SCENE 01<tspan fill="${C.dim}">  ·  AN AI ENGINEER’S JOURNEY</tspan></text>
  <text x="76" y="184" class="serif" font-size="84" font-weight="400" letter-spacing="6" fill="${C.text}">V Vishak</text>
  <text x="80" y="226" class="mono" font-size="15" font-weight="600" letter-spacing="4.5" fill="${C.accent}">AI ENGINEER / PYTHON DEVELOPER / AI / ML</text>
  <rect x="80" y="248" width="340" height="1.4" fill="url(#ruleL)"/>
  <text x="80" y="292" class="serif" font-size="25" font-style="italic" fill="${C.accent2}">“Building intelligence. Creating what’s next.”</text>
  <text x="80" y="332" class="sans" font-size="17" fill="${C.muted}">Building practical AI systems with Python, machine learning</text>
  <text x="80" y="356" class="sans" font-size="17" fill="${C.muted}">and computer vision, one working project at a time.</text>

  <g transform="translate(80 382)">
    <rect width="372" height="30" rx="15" fill="${C.accent}" fill-opacity=".07" stroke="${C.accent}" stroke-opacity=".35"/>
    <circle cx="18" cy="15" r="4" fill="${C.accent2}" class="pulse"/>
    <text x="32" y="20" class="mono" font-size="12" letter-spacing="1.2" fill="${C.accent2}">NOW BUILDING <tspan fill="${C.text}">PrepPitch · Django / Python</tspan></text>
  </g>

  <!-- viewfinder + network -->
  <g stroke="${C.accent}" stroke-opacity=".6" stroke-width="1.4" fill="none">
    <path d="M750 126V102H774"/><path d="M1116 102H1140V126"/>
    <path d="M750 314V338H774"/><path d="M1116 338H1140V314"/>
  </g>
  <text x="752" y="88" class="mono" font-size="11" letter-spacing="2" fill="${C.dim}"><tspan fill="${C.accent2}" class="pulse">●</tspan> REC · VISION · LEARNING · INFERENCE</text>
  <g stroke="${C.accent}" stroke-opacity=".16" stroke-width="1">${edges}</g>
  <g stroke="${C.accent2}" stroke-opacity=".55" stroke-width="1" fill="none">
    <path class="flow" d="M810 220L910 190L1010 220L1110 250"/>
    <path class="flow" style="animation-delay:-1.1s" d="M810 160L910 250L1010 160L1110 190"/>
  </g>
  ${nodes}
  <g class="scan"><rect x="754" y="106" width="382" height="1.5" fill="url(#scanline)"/></g>
  <text x="1140" y="366" class="mono" font-size="11" letter-spacing="2" fill="${C.dim}" text-anchor="end">ARCHIVE // 2026 · KANYAKUMARI, INDIA</text>
  <text x="1140" y="${H - 40}" class="mono" font-size="11" letter-spacing="2" fill="${C.dim}" text-anchor="end">B.TECH AI &amp; DS · FINAL YEAR<tspan fill="${C.accent2}" class="caret"> ▍</tspan></text>`
  );
}

// ── link buttons ───────────────────────────────────────────────────────────
function button(label, primary = false) {
  const w = Math.round(monoW(label, 13, 2.5) + 48), h = 42;
  return svg(w, h, { title: label },
    `  <rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="21" fill="${primary ? C.accent : C.bg1}" stroke="${C.accent}" stroke-opacity="${primary ? 1 : 0.55}"/>
  <circle cx="20" cy="21" r="3" fill="${primary ? C.bg0 : C.accent2}"/>
  <text x="${w / 2 + 6}" y="26" class="mono" font-size="13" letter-spacing="2.5" fill="${primary ? C.bg0 : C.text}" font-weight="${primary ? 700 : 400}" text-anchor="middle">${esc(label)}</text>`);
}

// ── section title ──────────────────────────────────────────────────────────
// Section titles sit on GitHub's page background, so they come in dark and light variants.
function sectionTitle(num, label, light = false) {
  const W = 1200, H = 76;
  const T = light ? { accent: "#B3121F", dim: "#8A8080", text: "#1A1112", accent2: "#C8192A" } : C;
  const textEnd = 96 + serifW(label, 32, 0.5) + 28;
  return svg(W, H, { title: `${num} — ${label}` },
    `  <text x="4" y="48" class="mono" font-size="14" letter-spacing="2" fill="${T.accent}">${num} —</text>
  <text x="80" y="51" class="serif" font-size="32" letter-spacing=".5" fill="${T.text}">${esc(label)}</text>
  <rect x="${Math.round(textEnd)}" y="42" width="${Math.round(W - textEnd - 4)}" height="1" fill="url(#ruleL)" opacity=".7"/>
  <rect x="${W - 12}" y="38" width="8" height="8" transform="rotate(45 ${W - 8} 42)" fill="none" stroke="${T.accent2}"/>`);
}

// ── about: quick facts ─────────────────────────────────────────────────────
function facts() {
  const W = 1200, H = 150;
  const items = [
    ["STUDYING", "B.Tech AI & DS", "Loyola Institute · Final year"],
    ["WORKING", "Python Developer", "Nexvra Solutions · since 7 Sep 2026"],
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
    <text x="20" y="64" class="serif" font-size="25" fill="${C.text}">${esc(v)}</text>
    <text x="20" y="86" class="sans" font-size="13.5" fill="${C.muted}">${esc(s)}</text>
  </g>`;
  }).join("\n  ");
  return svg(W, H, { title: "Quick facts", desc: items.map((i) => i.join(" ")).join("; ") }, `${panel(W, H)}\n  ${body}`);
}

// ── PrepPitch showcase ─────────────────────────────────────────────────────
function preppitch() {
  const W = 1200, H = 610;
  const built = [
    ["Interview setup", "type, difficulty, role and company, practice mode"],
    ["Question engine", "Gemini when a key is set, or a built-in question set"],
    ["Mock interview", "timed questions read aloud (text-to-speech)"],
    ["Answers", "typed answers with question and answer timers"],
    ["Follow-up", "one follow-up question per answer"],
    ["Evaluation", "Gemini rubric or rule-based scoring · STAR checklist"],
    ["Progress", "sessions saved in the browser and charted"],
  ];
  const dev = ["Django / Python backend", "Interview flow", "Question engine", "Answer evaluation", "Speech-to-text", "Adaptive interviews"];

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
    desc: `Public prototype (React, TypeScript, Vite, Tailwind CSS, Gemini API, Web Speech API) with built stages: ${built.map((b) => b[0]).join(", ")}. Main application in Django/Python, in development and not yet public: ${dev.join(", ")}.`,
    style: `
    @keyframes sweep { 0% { transform: translateX(-520px); } 60%, 100% { transform: translateX(520px); } }
    .shine { animation: sweep 5s ease-in-out infinite; }`,
    defs: `
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.accent}" stop-opacity="0"/><stop offset=".5" stop-color="${C.accent}" stop-opacity=".1"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="row"><rect width="500" height="44" rx="10"/></clipPath>
    <clipPath id="clip"><rect width="${W}" height="${H}" rx="16"/></clipPath>`,
  },
    `${panel(W, H)}
  <rect width="${W}" height="${H}" rx="16" fill="url(#grid)" opacity=".7"/>
  <g clip-path="url(#clip)">
  ${icon("app", 44, 42, 1.2)}
  <text x="84" y="62" class="mono" font-size="12" letter-spacing="3" fill="${C.accent}">FEATURED PROJECT</text>
  <text x="42" y="118" class="serif" font-size="48" fill="${C.text}">PrepPitch</text>
  <text x="300" y="92" class="serif" font-size="15" font-style="italic" letter-spacing="1" fill="${C.accent2}">Practice until your pitch is perfect.</text>
  <text x="300" y="116" class="sans" font-size="16" fill="${C.muted}">A mock-interview practice app for students that I own and develop:</text>
  <text x="300" y="138" class="sans" font-size="16" fill="${C.muted}">set up a role, answer timed questions, get structured feedback.</text>
  <rect x="42" y="156" width="${W - 84}" height="1" fill="${C.line2}"/>

  <text x="42" y="186" class="mono" font-size="12" letter-spacing="2.5" fill="${C.accent2}">PUBLIC PROTOTYPE</text>
  <text x="200" y="186" class="mono" font-size="12" fill="${C.dim}">React · TypeScript · Vite · Tailwind · Gemini API</text>
  ${rail}
  ${left}

  <path d="M624 172V${H - 40}" stroke="${C.line2}"/>
  <text x="652" y="186" class="mono" font-size="12" letter-spacing="2.5" fill="${C.accent2}">MAIN APPLICATION</text>
  <text x="818" y="186" class="mono" font-size="12" fill="${C.dim}">Django / Python · not yet public</text>
  ${right}
  <text x="652" y="${H - 34}" class="mono" font-size="12.5" fill="${C.muted}">github.com/vishak239/Prep-pitch <tspan fill="${C.accent2}">↗</tspan></text>
  </g>`);
}

// ── project cards ──────────────────────────────────────────────────────────
function card({ icon: ic, kind, status, statusDashed, statusSolid, title, tagline, desc, stack, linked }) {
  const W = 600, H = 270;
  const lines = wrap(desc, 62);
  return svg(W, H, { title: `${title} — ${status}`, desc: `${tagline} ${desc} Stack: ${stack}.` },
    `${panel(W, H)}
  <rect x="32" y="0" width="56" height="2" fill="${C.accent}"/>
  ${icon(ic, 32, 30)}
  <text x="66" y="47" class="mono" font-size="11.5" letter-spacing="2.5" fill="${C.accent}">${esc(kind)}</text>
  ${tag(W - 32, 46, status, { dashed: statusDashed, solid: statusSolid, anchor: "end" })}
  <text x="32" y="104" class="serif" font-size="30" fill="${C.text}">${esc(title)}</text>
  <text x="32" y="130" class="mono" font-size="11" letter-spacing="1.8" fill="${C.accent2}">${esc(tagline.toUpperCase())}</text>
  ${lines.map((l, i) => `<text x="32" y="${160 + i * 23}" class="sans" font-size="16" fill="${C.muted}">${esc(l)}</text>`).join("\n  ")}
  <rect x="32" y="${H - 52}" width="${W - 64}" height="1" fill="${C.line2}"/>
  <text x="32" y="${H - 24}" class="mono" font-size="12.5" letter-spacing=".5" fill="${C.accent2}">${esc(stack)}</text>
  ${linked ? `<text x="${W - 32}" y="${H - 23}" class="sans" font-size="18" fill="${C.accent2}" text-anchor="end">↗</text>` : `<text x="${W - 32}" y="${H - 24}" class="mono" font-size="11" letter-spacing="1.5" fill="${C.dim}" text-anchor="end">PRIVATE FOR NOW</text>`}`);
}

// Wording follows the portfolio, checked against each repository.
const PROJECTS = {
  "card-preppitch": { icon: "app", kind: "AI APPLICATION", status: "PUBLIC PROTOTYPE", title: "PrepPitch", linked: true,
    tagline: "Practice until your pitch is perfect",
    desc: "Mock-interview practice app: setup wizard, timed questions read aloud, one follow-up per answer, rubric feedback. Django version in development.",
    stack: "React · TypeScript · Vite · Gemini API" },
  "card-drowsiness": { icon: "eye", kind: "COMPUTER VISION", status: "NOT YET PUBLIC", statusDashed: true, title: "Driver Drowsiness Detection", linked: false,
    tagline: "Watching for closed eyes, frame by frame",
    desc: "Webcam-based drowsiness detection built with OpenCV, using the Eye Aspect Ratio (EAR) together with a CNN-based approach.",
    stack: "Python · OpenCV · EAR · CNN" },
  "card-house": { icon: "chart", kind: "PREDICTIVE ANALYTICS", status: "PHASE 1", title: "House Price Prediction", linked: true,
    tagline: "A first regression baseline for house prices",
    desc: "Fills missing values, holds out 20% for testing, trains Linear Regression and Random Forest, and compares them by MAE.",
    stack: "Python · pandas · scikit-learn · Matplotlib" },
  "card-regression": { icon: "fn", kind: "ML FUNDAMENTALS", status: "PRACTICE", title: "Multiple Linear Regression", linked: true,
    tagline: "Regression with more than one feature",
    desc: "Practice notebook fitting multiple linear regression models with NumPy and scikit-learn on small hand-written datasets.",
    stack: "Python · NumPy · scikit-learn" },
  "card-portfolio": { icon: "web", kind: "PORTFOLIO", status: "LIVE", statusSolid: true, title: "Vishak — Portfolio", linked: true,
    tagline: "An AI engineer's journey, told in acts",
    desc: "Cinematic single-page portfolio: projects, journey, skills, experience and education, with all text in one typed data file.",
    stack: "Next.js · React · TypeScript · Tailwind CSS" },
  "card-foundations": { icon: "stack", kind: "FOUNDATIONS", status: "ARCHIVE", title: "Python & Data Foundations", linked: true,
    tagline: "Where it started",
    desc: "Early Python projects (movie-ticket booking, food ordering, Tkinter screens, MySQL, Flask) and NumPy, Matplotlib and Seaborn practice.",
    stack: "Python · Tkinter · NumPy · Matplotlib · Seaborn" },
};

// ── the journey (portfolio "An AI Engineer's Journey") ─────────────────────
function journey() {
  const W = 1200, H = 330;
  const stages = [
    ["Python Foundations", "Exercises, classes, Tkinter GUIs and MySQL scripts"],
    ["Machine Learning", "Regression with scikit-learn, NumPy, pandas and plots"],
    ["Deep Learning", "Neural-network fundamentals, now learning"],
    ["Computer Vision", "OpenCV drowsiness detection with EAR and a CNN"],
    ["NLP", "Exploring tokens, embeddings and similarity"],
    ["Generative AI & Apps", "Gemini in PrepPitch; Django app in development"],
    ["Production AI Engineering", "Next: server APIs, data pipelines, deployed models"],
  ];
  const x0 = 60, x1 = W - 60, colW = (x1 - x0) / stages.length, railY = 120;
  const body = stages.map(([t, d], i) => {
    const cx = x0 + colW * i + colW / 2;
    const horizon = i === stages.length - 1;
    const titleLines = wrap(t, 15);
    const descLines = wrap(d, 19);
    return `<g>
    ${horizon ? `<circle cx="${cx}" cy="${railY}" r="15" fill="${C.accent}" fill-opacity=".14" class="pulse"/>` : ""}
    <circle cx="${cx}" cy="${railY}" r="8" fill="${C.bg0}" stroke="${C.accent}" stroke-width="1.5"${horizon ? ' stroke-dasharray="3 3"' : ""}/>
    <circle cx="${cx}" cy="${railY}" r="3.2" fill="${horizon ? C.dim : C.accent2}"/>
    <text x="${cx}" y="${railY - 30}" class="mono" font-size="11" letter-spacing="2" fill="${horizon ? C.accent2 : C.dim}" text-anchor="middle">${horizon ? "HORIZON" : `STAGE 0${i + 1}`}</text>
    ${titleLines.map((l, j) => `<text x="${cx}" y="${railY + 44 + j * 21}" class="serif" font-size="18" fill="${C.text}" text-anchor="middle">${esc(l)}</text>`).join("")}
    ${descLines.map((l, j) => `<text x="${cx}" y="${railY + 50 + titleLines.length * 21 + 8 + j * 19}" class="sans" font-size="13" fill="${C.muted}" text-anchor="middle">${esc(l)}</text>`).join("")}
  </g>`;
  }).join("\n  ");
  const lastX = x0 + colW * (stages.length - 1) + colW / 2;
  const prevX = x0 + colW * (stages.length - 2) + colW / 2;
  return svg(W, H, {
    title: "An AI Engineer's Journey",
    desc: stages.map(([t, d], i) => `Stage ${i + 1}, ${t}: ${d}`).join(". "),
  },
    `${panel(W, H)}
  <text x="60" y="52" class="mono" font-size="12" letter-spacing="3" fill="${C.accent}">AN AI ENGINEER’S JOURNEY</text>
  <text x="${W - 60}" y="52" class="serif" font-size="15" font-style="italic" fill="${C.muted}" text-anchor="end">Python → machine learning → vision → intelligent applications</text>
  <path d="M${x0 + colW / 2} ${railY}H${prevX}" stroke="${C.accent}" stroke-opacity=".5" stroke-width="1.4"/>
  <path d="M${prevX} ${railY}H${lastX}" stroke="${C.accent}" stroke-opacity=".6" stroke-width="1.4" class="flow"/>
  ${body}`);
}

// ── experience timeline ────────────────────────────────────────────────────
function experience() {
  const W = 1200;
  const items = [
    { role: "Python Developer / Python Developer Intern", org: "Nexvra Solutions", meta: "From 7 Sep 2026 · Marthandam",
      detail: "Python backend development · databases and APIs · testing and debugging",
      note: "Independently secured through my own job search and external application, not through college placement.",
      current: true },
    { role: "Python Training / Machine Learning Intern", org: "IT Desk", meta: "", detail: "Python course and machine learning internship, focused on practical Python and ML learning" },
    { role: "Deep Learning Intern", org: "G-Tech", meta: "", detail: "Internship focused on learning deep learning" },
    { role: "Internship / Student Role", org: "MyInspection", meta: "", detail: "" },
  ];
  const top = 62;
  let y = top;
  const ys = items.map((it) => { const cur = y; y += it.note ? 124 : 96; return cur; });
  const H = ys[ys.length - 1] + 70;
  const rows = items.map((it, i) => {
    const y = ys[i];
    return `<g>
    ${it.current ? `<circle cx="72" cy="${y}" r="13" fill="${C.accent}" fill-opacity=".15" class="pulse"/>` : ""}
    <circle cx="72" cy="${y}" r="7" fill="${C.bg0}" stroke="${C.accent}" stroke-width="1.5"/>
    <circle cx="72" cy="${y}" r="3" fill="${it.current ? C.accent2 : C.dim}"/>
    <text x="110" y="${y + 7}" class="serif" font-size="22" fill="${C.text}">${esc(it.role)}</text>
    <text x="110" y="${y + 34}" class="sans" font-size="15" fill="${C.accent2}">${esc(it.org)}${it.detail ? `<tspan fill="${C.muted}">  ·  ${esc(it.detail)}</tspan>` : ""}</text>
    ${it.note ? `<text x="110" y="${y + 62}" class="sans" font-size="13.5" font-style="italic" fill="${C.dim}">${esc(it.note)}</text>` : ""}
    ${it.meta ? `<text x="${W - 44}" y="${y + 6}" class="mono" font-size="12.5" letter-spacing="1" fill="${C.muted}" text-anchor="end">${esc(it.meta)}</text>` : ""}
    ${it.current ? tag(W - 44, y + 36, "INDEPENDENTLY SECURED", { solid: true, anchor: "end" }) : ""}
  </g>`;
  }).join("\n  ");
  return svg(W, H, { title: "Internships & roles", desc: items.map((i) => `${i.role}, ${i.org}${i.meta ? ", " + i.meta : ""}${i.detail ? ": " + i.detail : ""}`).join("; ") },
    `${panel(W, H)}
  <path d="M72 ${top}V${ys[ys.length - 1]}" stroke="${C.accent}" stroke-opacity=".35" stroke-width="1.4"/>
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
    <text x="20" y="62" class="serif" font-size="21" fill="${C.text}">${esc(v)}</text>
    <text x="20" y="86" class="sans" font-size="13.5" fill="${C.muted}">${esc(s)}</text>
  </g>`;
    x += widths[i];
    return g;
  }).join("\n  ");
  return svg(W, H, { title: "Education", desc: cols.map((c) => c.slice(1).join(", ")).join("; ") }, `${panel(W, H)}\n  ${body}`);
}

// ── skills (portfolio categories) ──────────────────────────────────────────
function stack() {
  const W = 1200;
  const rows = [
    ["PROGRAMMING", ["Python", "TypeScript", "JavaScript", "SQL", "HTML", "CSS"], []],
    ["AI & ML", ["scikit-learn", "Regression models", "Gemini API"], ["Deep learning"]],
    ["COMPUTER VISION", ["OpenCV", "Eye Aspect Ratio (EAR)", "CNNs"], []],
    ["DATA SCIENCE", ["NumPy", "pandas", "Matplotlib", "Seaborn", "Jupyter"], []],
    ["BACKEND", ["Flask", "MySQL"], ["Django"]],
    ["WEB", ["React", "Next.js", "Vite", "Tailwind CSS"], []],
    ["TOOLING", ["Git", "GitHub", "VS Code"], []],
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
    return `<text x="44" y="${y}" class="mono" font-size="12" letter-spacing="2.5" fill="${C.accent}">${esc(label)}</text>
  ${i ? `<rect x="44" y="${y - 38}" width="${W - 88}" height="1" fill="${C.line}"/>` : ""}
  ${out}`;
  }).join("\n  ");
  return svg(W, H, {
    title: "Skills",
    desc: rows.map(([l, h, g]) => `${l}: ${h.join(", ")}${g.length ? ` (learning: ${g.join(", ")})` : ""}`).join("; "),
  },
    `${panel(W, H)}
  <text x="44" y="48" class="serif" font-size="17" font-style="italic" fill="${C.muted}">The tools and techniques I work with across applied AI, computer vision and backend development.</text>
  <g transform="translate(${W - 290} 32)">
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
    ["Computer vision", ["Webcam-based drowsiness", "detection with OpenCV,", "EAR and a CNN"]],
    ["Automotive AI", ["How vision and ML apply", "to driver and vehicle", "systems"]],
  ];
  const tw = (W - 40 * 2 - 20 * 3) / 4;
  const body = items.map(([t, lines], i) => {
    const x = 40 + i * (tw + 20);
    return `<g transform="translate(${x} 28)">
    <rect width="${tw}" height="194" rx="12" fill="${C.card}" stroke="${C.line2}"/>
    <text x="22" y="44" class="mono" font-size="28" font-weight="300" fill="${C.accent}" opacity=".85">0${i + 1}</text>
    <text x="22" y="84" class="serif" font-size="22" fill="${C.text}">${esc(t)}</text>
    ${lines.map((l, j) => `<text x="22" y="${114 + j * 21}" class="sans" font-size="14.5" fill="${C.muted}">${esc(l)}</text>`).join("")}
  </g>`;
  }).join("\n  ");
  return svg(W, H, { title: "Current focus", desc: items.map(([t, l]) => `${t}: ${l.join(" ")}`).join("; ") }, `${panel(W, H)}\n  ${body}`);
}

// ── footer (portfolio "Act III — The next chapter") ────────────────────────
function footer() {
  const W = 1200, H = 230;
  return svg(W, H, {
    title: "The next chapter",
    desc: `Open to engineering fellowships, research collaborations and ambitious AI product teams. Email vishak3416@gmail.com. Portfolio ${PORTFOLIO_URL.replace("https://", "")}. LinkedIn linkedin.com/in/vishak3416.`,
    style: `
    @keyframes grow { 0%, 100% { transform: scaleX(.35); } 50% { transform: scaleX(1); } }
    .grow { transform-origin: 600px 0; animation: grow 6s ease-in-out infinite; }`,
  },
    `${panel(W, H, 18)}
  <rect width="${W}" height="${H}" rx="18" fill="url(#grid)"/>
  ${corners(W, H, 22, 16)}
  <text x="600" y="66" class="mono" font-size="12" letter-spacing="4" fill="${C.accent}" text-anchor="middle">ACT III // FINALE — EPILOGUE</text>
  <text x="600" y="118" class="serif" font-size="44" fill="${C.text}" text-anchor="middle">The next chapter.</text>
  <rect class="grow" x="420" y="138" width="360" height="1.2" fill="url(#rule)"/>
  <text x="600" y="170" class="sans" font-size="16" fill="${C.muted}" text-anchor="middle">Open to engineering fellowships, research collaborations and ambitious AI product teams.</text>
  <text x="600" y="200" class="mono" font-size="13" fill="${C.muted}" text-anchor="middle"><tspan fill="${C.accent2}">vishak3416@gmail.com</tspan>  ·  ${PORTFOLIO_URL.replace("https://", "")}  ·  linkedin.com/in/vishak3416</text>`);
}

// ── avatar (upload as the GitHub profile picture; not used in the README) ─
function avatar() {
  const S = 460;
  return svg(S, S, { title: "V Vishak monogram" },
    `  <rect width="${S}" height="${S}" fill="url(#bg)"/>
  <rect width="${S}" height="${S}" fill="url(#grid)"/>
  <circle cx="230" cy="230" r="170" fill="${C.accent}" fill-opacity=".07"/>
  ${corners(S, S, 70, 34)}
  ${vMark(80, 70, 3)}
  <text x="230" y="392" class="mono" font-size="15" letter-spacing="8" fill="${C.muted}" text-anchor="middle">VISHAK</text>`);
}

// ── divider ────────────────────────────────────────────────────────────────
function divider() {
  return svg(1200, 24, { title: "section divider" },
    `  <rect x="300" y="11.5" width="284" height="1" fill="url(#rule)"/>
  <rect x="616" y="11.5" width="284" height="1" fill="url(#rule)"/>
  <rect x="594" y="6" width="12" height="12" transform="rotate(45 600 12)" fill="none" stroke="${C.accent2}" stroke-width="1.2"/>`);
}

// ── small link chips and strips (replace plain-text link rows) ──────────────
function chip(label, { lead = false, arrow = true } = {}) {
  const h = 34, w = Math.round(monoW(label, 12, 2) + (arrow ? 52 : 34));
  return svg(w, h, { title: label },
    `  <rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="17" fill="${lead ? C.accent : C.bg1}" stroke="${C.accent}" stroke-opacity="${lead ? 1 : 0.5}"/>
  <text x="17" y="22" class="mono" font-size="12" letter-spacing="2" fill="${lead ? C.bg0 : C.text}" font-weight="${lead ? 700 : 400}">${esc(label)}</text>
  ${arrow ? `<text x="${w - 16}" y="22" class="sans" font-size="13" fill="${C.accent2}" text-anchor="end">↗</text>` : ""}`);
}

function interests() {
  const items = ["Artificial intelligence", "Machine learning", "Python development", "Backend development",
    "Computer vision", "Data science", "Automotive AI", "Intelligent applications"];
  const W = 1200, H = 116;
  let x = 44, y = 62, body = "";
  for (const it of items) {
    const w = it.length * 8.2 + 30;
    if (x + w > W - 44) { x = 44; y += 44; }
    body += `<rect x="${x}" y="${y - 22}" width="${w}" height="32" rx="16" fill="${C.card}" stroke="${C.accent}" stroke-opacity=".3"/>
  <text x="${x + w / 2}" y="${y - 1}" class="sans" font-size="14.5" fill="${C.text}" text-anchor="middle">${esc(it)}</text>`;
    x += w + 10;
  }
  const h = y + 30;
  return svg(W, h, { title: "Interests", desc: items.join(", ") },
    `${panel(W, h)}
  <text x="44" y="30" class="mono" font-size="11" letter-spacing="2.5" fill="${C.accent}">INTERESTS</text>
  ${body}`);
}

function note(label) {
  const w = Math.round(monoW(label, 11, 1.8) + 44), h = 26;
  return svg(w, h, { title: label },
    `  <circle cx="14" cy="13" r="3.5" fill="${C.accent2}" class="pulse"/>
  <text x="26" y="17.5" class="mono" font-size="11" letter-spacing="1.8" fill="${C.muted}">${esc(label)}</text>`);
}

// ── write everything ───────────────────────────────────────────────────────
write("hero.svg", hero());
write("avatar.svg", avatar());
write("divider.svg", divider());
write("facts.svg", facts());
write("preppitch.svg", preppitch());
write("journey.svg", journey());
write("experience.svg", experience());
write("education.svg", education());
write("stack.svg", stack());
write("focus.svg", focus());
write("footer.svg", footer());
write("chip-code.svg", chip("CODE", { lead: true, arrow: false }));
for (const [file, label] of [["portfolio-source", "PORTFOLIO SOURCE"], ["python-practice", "PYTHON-PRACTICE"], ["numpy", "NUMPY"], ["matplotlib", "MATPLOTLIB"], ["seaborn", "SEABORN"]])
  write(`chip-${file}.svg`, chip(label));
write("interests.svg", interests());
write("note-refresh.svg", note("REFRESHED DAILY BY A GITHUB ACTION"));
for (const [name, p] of Object.entries(PROJECTS)) write(`${name}.svg`, card(p));
write("btn-portfolio.svg", button("PORTFOLIO", true));
for (const label of ["LINKEDIN", "EMAIL", "PREPPITCH"]) write(`btn-${label.toLowerCase()}.svg`, button(label));
const titles = [
  ["01", "About"], ["02", "Currently Building"], ["03", "Selected Projects"], ["04", "The Journey"],
  ["05", "Internships & Roles"], ["06", "Education"], ["07", "Skills"], ["08", "Current Focus"],
  ["09", "Repositories"], ["10", "GitHub Activity"], ["11", "Contact"],
];
for (const [n, l] of titles) {
  write(`title-${n}.svg`, sectionTitle(n, l));
  write(`title-${n}-light.svg`, sectionTitle(n, l, true));
}
console.log("assets written to", OUT);
