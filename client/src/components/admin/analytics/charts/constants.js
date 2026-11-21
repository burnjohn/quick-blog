import { createElement } from 'react'

// Chart palette mirrors the "Ink & Signal" tokens in src/index.css.
// Recharts takes raw colors via props, so the hex values live here.
export const CHART_COLORS = {
  ink: '#111111',
  inkMuted: '#5E5A52',
  line: '#D9D3C5',
  signal: '#FFCE00',
  surface: '#FFFFFF',
  success: '#1F7A3D'
}

export const CATEGORY_COLORS = {
  Technology: CHART_COLORS.ink,
  Lifestyle: CHART_COLORS.signal,
  Startup: CHART_COLORS.inkMuted,
  Finance: '#A39B88'
}

export const AXIS_PROPS = {
  stroke: CHART_COLORS.inkMuted,
  tick: { fontSize: 11, fontFamily: 'JetBrains Mono, ui-monospace, monospace', fill: CHART_COLORS.inkMuted },
  tickLine: false
}

export const GRID_PROPS = {
  strokeDasharray: '2 4',
  stroke: CHART_COLORS.line
}

// Recharts colors legend text with the series color; yellow text on white is
// unreadable, so labels are always rendered in ink and only the swatch is colored.
export const LEGEND_PROPS = {
  iconType: 'square',
  formatter: (value) => createElement('span', { style: { color: CHART_COLORS.ink } }, value),
  wrapperStyle: {
    fontFamily: 'JetBrains Mono, ui-monospace, monospace',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: CHART_COLORS.ink
  }
}

export const TOOLTIP_CLASS = 'border border-ink bg-surface px-3 py-2 font-mono text-xs text-ink shadow-hard-sm'
