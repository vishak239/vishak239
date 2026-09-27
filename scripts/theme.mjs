// Shared theme for every generated SVG: palette, fonts and drawing helpers.
// Red and black, with the portfolio's typography (serif headlines, mono labels).

// ── palette ────────────────────────────────────────────────────────────────
export const C = {
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
export const SANS = "'Manrope', 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif";
export const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
export const MONO = "'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

// ── helpers ────────────────────────────────────────────────────────────────
export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Rough text widths, good enough for layout with generous margins.
export const sansW = (s, size, ls = 0) => s.length * (size * 0.56 + ls);
export const monoW = (s, size, ls = 0) => s.length * (size * 0.6 + ls);
export const serifW = (s, size, ls = 0) => s.length * (size * 0.52 + ls);

export function wrap(text, maxChars) {
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

export const BASE_STYLE = `
    .sans { font-family: ${SANS}; }
    .serif { font-family: ${SERIF}; }
    .mono { font-family: ${MONO}; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .25; } }
    @keyframes flow { to { stroke-dashoffset: -40; } }
    .pulse { animation: pulse 2.4s ease-in-out infinite; }
    .flow { stroke-dasharray: 4 6; animation: flow 2.2s linear infinite; }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }`;

export function svg(w, h, { title, desc = "", style = "", defs = "" }, body) {
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

export const panel = (w, h, rx = 16) => `
  <rect width="${w}" height="${h}" rx="${rx}" fill="url(#bg)"/>
  <rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="${rx}" fill="none" stroke="${C.line}"/>`;

export const corners = (w, h, m = 24, s = 18) => `
  <g stroke="${C.accent}" stroke-opacity=".55" stroke-width="1.2" fill="none">
    <path d="M${m} ${m + s}V${m}H${m + s}"/><path d="M${w - m - s} ${m}H${w - m}V${m + s}"/>
    <path d="M${m} ${h - m - s}V${h - m}H${m + s}"/><path d="M${w - m - s} ${h - m}H${w - m}V${h - m - s}"/>
  </g>`;

export function tag(x, y, label, { dashed = false, solid = false, anchor = "start" } = {}) {
  const w = monoW(label, 11, 1.5) + 22;
  const x0 = anchor === "end" ? x - w : x;
  const fill = solid ? C.accent : "none";
  const color = solid ? C.bg0 : C.accent2;
  return `<g>
    <rect x="${x0}" y="${y - 15}" width="${w}" height="22" rx="11" fill="${fill}" fill-opacity="${solid ? 0.9 : 0}" stroke="${C.accent}" stroke-opacity="${solid ? 0 : 0.6}"${dashed ? ' stroke-dasharray="3 3"' : ""}/>
    <text x="${x0 + w / 2}" y="${y}" class="mono" font-size="11" letter-spacing="1.5" fill="${color}" text-anchor="middle" font-weight="600">${esc(label)}</text>
  </g>`;
}

export const ICONS = {
  app: `<rect x="1" y="3" width="22" height="18" rx="3"/><path d="M1 8h22M5 5.5h.01M8 5.5h.01"/><path d="M6 13l3 2.5L6 18M12 18h6"/>`,
  eye: `<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3.5"/>`,
  chart: `<path d="M2 21h20M5 17v-5M10 17V7M15 17v-8M20 17V4"/>`,
  fn: `<path d="M2 21h20M2 21V3"/><circle cx="6" cy="16" r="1"/><circle cx="10" cy="13" r="1"/><circle cx="14" cy="11" r="1"/><circle cx="18" cy="7" r="1"/><path d="M4 18L21 5"/>`,
  web: `<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2c3 3.5 3 16.5 0 20M12 2c-3 3.5-3 16.5 0 20"/>`,
  stack: `<path d="M12 2l10 5-10 5L2 7l10-5z"/><path d="M2 12l10 5 10-5M2 17l10 5 10-5"/>`,
};
export const icon = (name, x, y, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${C.accent2}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</g>`;

// The portfolio's "V" mark (vishak-portfolio/public/icon.svg), drawn in the red theme.
export const vMark = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none">
    <path d="M26 28L50 78L74 28" stroke="${C.accent}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M37 50L63 50" stroke="${C.accent2}" stroke-width="2" stroke-dasharray="2 3"/>
    <circle cx="50" cy="78" r="3.5" fill="${C.accent2}"/>
  </g>`;

