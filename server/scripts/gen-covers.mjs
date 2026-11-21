// Regenerates the brand SVG covers used by the seed: node scripts/gen-covers.mjs uploads/seed
// Generates "Ink & Signal" editorial covers (1200x900 SVG) into server/uploads/seed/
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = process.argv[2]
const P = '#F4F1EA', I = '#111111', Y = '#FFCE00', M = '#5E5A52', T = '#A39B88'
const W = 1200, H = 900
const SERIF = "Georgia, 'Times New Roman', Times, serif"
const MONO = "Menlo, 'SF Mono', 'Courier New', monospace"

// deterministic PRNG
const rng = (seed) => () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)

const chrome = ({ label, no, bg = P, fg = I }) => `
  <g font-family="${MONO}" font-size="20" letter-spacing="4" fill="${fg}">
    <text x="60" y="78">QUICK BLOG / ${label}</text>
    <text x="${W - 60}" y="78" text-anchor="end">NO. ${String(no).padStart(2, '0')}</text>
  </g>
  <rect x="60" y="96" width="${W - 120}" height="3" fill="${fg}"/>`

const svg = (body, { bg = P, label, no, fg = I, defs = '' }) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="9" cy="9" r="4" fill="${I}"/></pattern>
    <pattern id="dotsSm" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="2.2" fill="${I}"/></pattern>
    <pattern id="dotsY" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="9" cy="9" r="4.5" fill="${Y}"/></pattern>
    <pattern id="dotsP" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="3" fill="${P}"/></pattern>
    <pattern id="stripes" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="28" fill="${I}"/></pattern>
    <pattern id="stripesT" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="8" height="24" fill="${T}"/></pattern>
    <pattern id="hlines" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="6" fill="${I}"/></pattern>
    ${defs}
  </defs>
  <rect width="${W}" height="${H}" fill="${bg}"/>
  ${body}
  ${chrome({ label, no, fg })}
</svg>
`

// halftone gradient: dot radius grows along an axis
const halftone = ({ x, y, w, h, step = 22, color = I, dir = 'x', maxR = 9, minR = 1, seed }) => {
  let out = ''
  for (let cx = x + step / 2; cx < x + w; cx += step) {
    for (let cy = y + step / 2; cy < y + h; cy += step) {
      const t = dir === 'x' ? (cx - x) / w : dir === 'y' ? (cy - y) / h
        : Math.hypot(cx - (x + w / 2), cy - (y + h / 2)) / (Math.hypot(w, h) / 2)
      const r = minR + (maxR - minR) * (dir === 'r' ? 1 - t : t)
      if (r > 0.6) out += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(2)}" fill="${color}"/>`
    }
  }
  return out
}

const covers = {}

// ---------- TECHNOLOGY: grids, cells, dot-matrix, brackets ----------
covers.cover_tech_01 = svg((() => {
  // modular grid with some filled cells, one yellow "failing" cell
  const r = rng(11); let b = ''
  const cols = 9, rows = 6, cw = 120, gx = 60, gy = 160
  for (let c = 0; c < cols; c++) for (let rr = 0; rr < rows; rr++) {
    const x = gx + c * cw, y = gy + rr * 110
    const v = r()
    if (c === 6 && rr === 2) b += `<rect x="${x}" y="${y}" width="${cw - 12}" height="98" fill="${Y}"/>`
    else if (v < 0.42) b += `<rect x="${x}" y="${y}" width="${cw - 12}" height="98" fill="${I}"/>`
    else if (v < 0.55) b += `<rect x="${x}" y="${y}" width="${cw - 12}" height="98" fill="url(#dotsSm)"/>`
    else b += `<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 15}" height="95" fill="none" stroke="${I}" stroke-width="3"/>`
  }
  return b
})(), { label: 'TECHNOLOGY', no: 19 })

covers.cover_tech_02 = svg(`
  <rect x="60" y="150" width="520" height="690" fill="${I}"/>
  <rect x="620" y="150" width="520" height="690" fill="none" stroke="${I}" stroke-width="4"/>
  <text x="320" y="610" text-anchor="middle" font-family="${SERIF}" font-size="460" font-weight="bold" fill="${P}">{</text>
  <text x="880" y="610" text-anchor="middle" font-family="${SERIF}" font-size="460" font-weight="bold" fill="${I}">[</text>
  <rect x="620" y="700" width="520" height="140" fill="url(#dots)"/>
  <circle cx="580" cy="495" r="70" fill="${Y}" stroke="${I}" stroke-width="4"/>
  <text x="580" y="515" text-anchor="middle" font-family="${MONO}" font-size="56" font-weight="bold" fill="${I}">/</text>
`, { label: 'TECHNOLOGY', no: 20 })

covers.cover_tech_03 = svg(`
  <rect x="0" y="0" width="${W}" height="${H}" fill="${I}"/>
  ${halftone({ x: 60, y: 140, w: 1080, h: 700, step: 24, color: M, dir: 'r', maxR: 10, minR: 0 })}
  <circle cx="600" cy="490" r="150" fill="${Y}"/>
  <circle cx="600" cy="490" r="230" fill="none" stroke="${P}" stroke-width="3" stroke-dasharray="10 14"/>
  <circle cx="600" cy="490" r="310" fill="none" stroke="${P}" stroke-width="2" stroke-dasharray="4 18"/>
  <rect x="588" y="400" width="24" height="120" fill="${I}"/>
  <rect x="588" y="545" width="24" height="24" fill="${I}"/>
`, { label: 'TECHNOLOGY', no: 21, bg: I, fg: P })

covers.cover_tech_04 = svg((() => {
  // diff-like horizontal bars
  let b = ''; const r = rng(4)
  for (let i = 0; i < 14; i++) {
    const y = 150 + i * 49
    const w = 200 + Math.floor(r() * 760)
    const indent = [0, 0, 60, 60, 120, 60, 0][i % 7]
    const color = i === 5 || i === 6 ? Y : i === 9 ? T : I
    b += `<rect x="${170 + indent}" y="${y}" width="${w}" height="30" fill="${color}"/>`
    b += `<text x="80" y="${y + 25}" font-family="${MONO}" font-size="24" fill="${M}">${String(i + 1).padStart(3, '0')}</text>`
    if (i === 5 || i === 6) b += `<text x="140" y="${y + 26}" font-family="${MONO}" font-size="30" font-weight="bold" fill="${I}">+</text>`
    if (i === 9) b += `<text x="140" y="${y + 26}" font-family="${MONO}" font-size="30" font-weight="bold" fill="${I}">-</text>`
  }
  return b
})(), { label: 'TECHNOLOGY', no: 22 })

covers.cover_tech_05 = svg(`
  <rect x="60" y="150" width="1080" height="690" fill="url(#dotsSm)" opacity="0.18"/>
  <text x="70" y="700" font-family="${SERIF}" font-size="440" font-weight="bold" fill="${I}" letter-spacing="-20">40</text>
  <text x="820" y="440" font-family="${MONO}" font-size="110" font-weight="bold" fill="${I}">ms</text>
  <rect x="820" y="490" width="320" height="56" fill="${Y}"/>
  <rect x="820" y="566" width="230" height="56" fill="${I}"/>
  <rect x="820" y="642" width="120" height="56" fill="${T}"/>
`, { label: 'TECHNOLOGY', no: 23 })

covers.cover_tech_06 = svg((() => {
  // toggle switches field
  let b = ''
  const r = rng(66)
  for (let rr = 0; rr < 5; rr++) for (let c = 0; c < 5; c++) {
    const x = 90 + c * 210, y = 170 + rr * 135
    const on = r() > 0.45
    const yel = rr === 2 && c === 2
    b += `<rect x="${x}" y="${y}" width="170" height="84" rx="42" fill="${yel ? Y : on ? I : 'none'}" stroke="${I}" stroke-width="4"/>`
    b += `<circle cx="${on || yel ? x + 128 : x + 42}" cy="${y + 42}" r="30" fill="${on && !yel ? P : I}"/>`
  }
  return b
})(), { label: 'TECHNOLOGY', no: 24 })

covers.cover_tech_07 = svg(`
  <rect x="60" y="150" width="1080" height="690" fill="${P}" stroke="${I}" stroke-width="4"/>
  ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<rect x="100" y="${190 + i * 70}" width="${[620, 480, 760, 540, 300, 700, 410, 650, 520][i]}" height="34" fill="${i === 4 ? Y : I}"/>
  <rect x="${130 + [620, 480, 760, 540, 300, 700, 410, 650, 520][i]}" y="${190 + i * 70}" width="${[180, 260, 120, 300, 480, 160, 220, 200, 140][i]}" height="34" fill="${i % 3 === 0 ? T : 'url(#dotsSm)'}"/>`).join('')}
  <text x="1110" y="815" text-anchor="end" font-family="${MONO}" font-size="40" font-weight="bold" fill="${I}">{ }</text>
`, { label: 'TECHNOLOGY', no: 25 })

covers.cover_tech_08 = svg(`
  <rect x="0" y="0" width="${W}" height="${H}" fill="${Y}"/>
  ${[0, 1, 2].map((i) => `<rect x="${110 + i * 340}" y="230" width="300" height="420" fill="${i === 1 ? I : P}" stroke="${I}" stroke-width="5"/>
  <rect x="${140 + i * 340}" y="270" width="240" height="160" fill="${i === 1 ? 'url(#dotsY)' : 'url(#dotsSm)'}"/>
  <rect x="${140 + i * 340}" y="460" width="${[200, 160, 220][i]}" height="22" fill="${i === 1 ? P : I}"/>
  <rect x="${140 + i * 340}" y="500" width="${[140, 210, 120][i]}" height="22" fill="${i === 1 ? P : I}"/>`).join('')}
  <path d="M410 440 H450 M750 440 H790" stroke="${I}" stroke-width="6" stroke-dasharray="8 8"/>
  <rect x="60" y="760" width="1080" height="6" fill="${I}"/>
`, { label: 'TECHNOLOGY', no: 26, bg: Y })

// ---------- LIFESTYLE: circles, arcs, suns, rings ----------
covers.cover_life_01 = svg(`
  <circle cx="600" cy="500" r="300" fill="${I}"/>
  <circle cx="600" cy="500" r="220" fill="${P}"/>
  <circle cx="600" cy="500" r="200" fill="url(#dotsSm)" opacity="0.35"/>
  <circle cx="600" cy="500" r="120" fill="${Y}"/>
  <rect x="160" y="300" width="18" height="400" rx="9" fill="${I}"/>
  <rect x="1020" y="300" width="18" height="400" rx="9" fill="${I}"/>
  <path d="M1008 300 v120 M1050 300 v120" stroke="${I}" stroke-width="8" stroke-linecap="round"/>
`, { label: 'LIFESTYLE', no: 27 })

covers.cover_life_02 = svg(`
  <rect x="60" y="150" width="1080" height="690" fill="${T}" opacity="0.35"/>
  <path d="M60 840 V520 A540 370 0 0 1 1140 520 V840 Z" fill="${I}"/>
  <circle cx="600" cy="420" r="150" fill="${Y}"/>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="60" y="${600 + i * 40}" width="1080" height="16" fill="${P}" opacity="${0.15 + i * 0.12}"/>`).join('')}
`, { label: 'LIFESTYLE', no: 28 })

covers.cover_life_03 = svg(`
  ${[300, 250, 200, 150, 100, 50].map((r, i) => `<ellipse cx="600" cy="520" rx="${r * 1.6}" ry="${r}" fill="none" stroke="${i === 2 ? Y : I}" stroke-width="${i === 2 ? 22 : 6}"/>`).join('')}
  <ellipse cx="600" cy="520" rx="60" ry="36" fill="${I}"/>
  <rect x="60" y="800" width="1080" height="40" fill="url(#stripesT)"/>
`, { label: 'LIFESTYLE', no: 29 })

covers.cover_life_04 = svg(`
  <rect x="160" y="170" width="380" height="560" rx="190" fill="${I}"/>
  <rect x="200" y="210" width="300" height="480" rx="150" fill="${Y}"/>
  <circle cx="350" cy="560" r="80" fill="${P}"/>
  <rect x="620" y="260" width="420" height="300" fill="url(#dots)" opacity="0.85"/>
  <circle cx="830" cy="640" r="120" fill="none" stroke="${I}" stroke-width="6"/>
  <circle cx="830" cy="640" r="60" fill="${T}"/>
  <rect x="60" y="760" width="1080" height="10" fill="${I}"/>
`, { label: 'LIFESTYLE', no: 30 })

covers.cover_life_05 = svg(`
  <rect width="${W}" height="${H}" fill="${I}"/>
  ${halftone({ x: 60, y: 140, w: 1080, h: 700, step: 26, color: Y, dir: 'y', maxR: 0.5, minR: 11 })}
  <circle cx="860" cy="360" r="140" fill="${P}"/>
  <path d="M60 840 C 300 620, 520 860, 760 700 S 1060 640, 1140 700 V840 Z" fill="${P}"/>
  ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${180 + i * 95}" cy="${760 - Math.sin(i / 1.6) * 40}" r="9" fill="${I}"/>`).join('')}
`, { label: 'LIFESTYLE', no: 31, bg: I, fg: P })

covers.cover_life_06 = svg(`
  <circle cx="420" cy="500" r="260" fill="none" stroke="${I}" stroke-width="5"/>
  <circle cx="780" cy="500" r="260" fill="url(#dotsSm)" opacity="0.6"/>
  <path d="M600 316 A260 260 0 0 1 600 684 A260 260 0 0 1 600 316 Z" fill="${Y}"/>
  <text x="600" y="540" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="130" fill="${I}">&amp;</text>
`, { label: 'LIFESTYLE', no: 32 })

// ---------- STARTUP: diagonals, stripes, arrows, steps ----------
covers.cover_startup_01 = svg(`
  <rect x="60" y="150" width="1080" height="690" fill="url(#stripes)" opacity="0.12"/>
  ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<circle cx="${140 + i * 104}" cy="${770 - i * 58}" r="${i === 9 ? 46 : 26}" fill="${i === 9 ? Y : I}" ${i === 9 ? `stroke="${I}" stroke-width="6"` : ''}/>`).join('')}
  <text x="80" y="420" font-family="${SERIF}" font-size="300" font-weight="bold" fill="${I}">10</text>
`, { label: 'STARTUP', no: 33 })

covers.cover_startup_02 = svg(`
  ${[0, 1, 2].map((i) => `<rect x="${140 + i * 330}" y="${640 - i * 180}" width="260" height="${200 + i * 180}" fill="${i === 2 ? Y : i === 1 ? I : 'url(#stripes)'}" stroke="${I}" stroke-width="5"/>`).join('')}
  <text x="270" y="610" text-anchor="middle" font-family="${SERIF}" font-size="90" font-weight="bold" fill="${I}">$</text>
  <text x="600" y="430" text-anchor="middle" font-family="${SERIF}" font-size="110" font-weight="bold" fill="${P}">$$</text>
  <text x="930" y="250" text-anchor="middle" font-family="${SERIF}" font-size="120" font-weight="bold" fill="${I}">$$$</text>
`, { label: 'STARTUP', no: 34 })

covers.cover_startup_03 = svg(`
  <rect width="${W}" height="${H}" fill="${I}"/>
  <rect x="60" y="150" width="1080" height="690" fill="url(#stripesT)" opacity="0.5"/>
  <rect x="300" y="250" width="600" height="500" fill="${P}"/>
  <path d="M300 250 L600 520 L900 250" fill="none" stroke="${I}" stroke-width="10"/>
  <rect x="540" y="600" width="120" height="60" fill="${Y}"/>
`, { label: 'STARTUP', no: 35, bg: I, fg: P })

covers.cover_startup_04 = svg(`
  ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<text x="${150 + (i % 4) * 260}" y="${i < 4 ? 400 : 720}" text-anchor="middle" font-family="${SERIF}" font-size="230" font-weight="bold" fill="${i === 0 ? Y : i % 2 ? I : 'none'}" stroke="${I}" stroke-width="5">?</text>`).join('')}
  <rect x="60" y="460" width="1080" height="8" fill="${I}"/>
`, { label: 'STARTUP', no: 36 })

covers.cover_startup_05 = svg(`
  <rect x="60" y="150" width="1080" height="690" fill="${Y}"/>
  ${[0, 1, 2, 3].map((i) => `<rect x="${200 + i * 40}" y="${220 + i * 40}" width="640" height="440" fill="${i === 3 ? P : I}" stroke="${I}" stroke-width="5"/>`).join('')}
  <path d="M400 560 L520 460 L620 520 L780 380" fill="none" stroke="${I}" stroke-width="12" stroke-linejoin="round"/>
  <path d="M780 380 l-50 6 l34 38 z" fill="${I}"/>
  <path d="M60 840 L1140 150" stroke="${I}" stroke-width="5" stroke-dasharray="18 14"/>
`, { label: 'STARTUP', no: 37 })

// ---------- FINANCE: big serif glyphs & numerals, columns ----------
covers.cover_fin_01 = svg(`
  ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const h = Math.round(40 * Math.pow(1.45, i)); return `<rect x="${110 + i * 125}" y="${840 - h}" width="90" height="${h}" fill="${i === 7 ? Y : i % 2 ? I : M}"/>` }).join('')}
  <text x="100" y="420" font-family="${SERIF}" font-size="280" font-style="italic" fill="${I}">%</text>
`, { label: 'FINANCE', no: 38 })

covers.cover_fin_02 = svg(`
  ${[0, 1, 2, 3].map((i) => `<rect x="${110 + i * 260}" y="200" width="200" height="600" rx="12" fill="none" stroke="${I}" stroke-width="5"/>
  <rect x="${118 + i * 260}" y="${200 + 600 - [200, 330, 470, 560][i]}" width="184" height="${[200, 330, 470, 560][i] - 8}" rx="6" fill="${i === 2 ? Y : 'url(#hlines)'}"/>`).join('')}
`, { label: 'FINANCE', no: 39 })

covers.cover_fin_03 = svg(`
  <rect width="${W}" height="${H}" fill="${I}"/>
  <text x="600" y="760" text-anchor="middle" font-family="${SERIF}" font-size="720" font-weight="bold" fill="${Y}">$</text>
  <rect x="60" y="440" width="1080" height="90" fill="url(#dotsP)" opacity="0.8"/>
`, { label: 'FINANCE', no: 40, bg: I, fg: P })

covers.cover_fin_04 = svg(`
  <circle cx="440" cy="500" r="250" fill="${I}"/>
  <circle cx="760" cy="500" r="250" fill="${Y}" style="mix-blend-mode:multiply"/>
  <path d="M600 306 A250 250 0 0 1 600 694 A250 250 0 0 1 600 306 Z" fill="${I}"/>
  <text x="380" y="560" text-anchor="middle" font-family="${SERIF}" font-size="160" font-weight="bold" fill="${P}">6</text>
  <rect x="60" y="800" width="1080" height="40" fill="url(#dotsSm)"/>
`, { label: 'FINANCE', no: 41 })

covers.cover_fin_05 = svg(`
  <rect x="60" y="150" width="1080" height="690" fill="url(#dotsSm)" opacity="0.15"/>
  <path d="M100 760 L300 700 L500 640 L700 560 L900 470 L1100 360" fill="none" stroke="${T}" stroke-width="14"/>
  <path d="M100 780 L300 770 L500 765 L700 760 L900 750 L1100 745" fill="none" stroke="${I}" stroke-width="14"/>
  <path d="M100 760 L300 700 L500 640 L700 560 L900 470 L1100 360 L1100 745 L900 750 L700 760 L500 765 L300 770 L100 780 Z" fill="${Y}" opacity="0.85"/>
  <text x="100" y="420" font-family="${SERIF}" font-size="230" font-weight="bold" fill="${I}">+40%</text>
`, { label: 'FINANCE', no: 42 })

for (const [name, content] of Object.entries(covers)) {
  writeFileSync(join(OUT, `${name}.svg`), content)
}
console.log(`Wrote ${Object.keys(covers).length} covers to ${OUT}`)
