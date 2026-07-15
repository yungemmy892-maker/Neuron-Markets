// ─── Design Tokens ────────────────────────────────────────────────────────────

export const theme = {
  bg: '#06080f',
  bgCard: '#0c0f1a',
  bgCardHover: '#111525',
  border: '#1a1f35',
  borderGlow: '#2a3060',
  accent: '#4f9eff',
  accentGlow: '#4f9eff33',
  green: '#00e5a0',
  red: '#ff4466',
  yellow: '#ffc046',
  purple: '#a78bfa',
  text: '#e2e8f0',
  textMuted: '#64748b',
  textDim: '#94a3b8',
  grid: '#131729',
} as const

export type ThemeKey = keyof typeof theme

// ─── Asset Colors ─────────────────────────────────────────────────────────────

export const assetColors: Record<string, string> = {
  'BTC/USD': '#f7931a',
  'ETH/USD': '#a78bfa',
  'SOL/USD': '#00e5a0',
  'MATIC/USD': '#8247e5',
  'ARB/USD': '#4f9eff',
}

export const assetShortColors: Record<string, string> = {
  BTC: '#f7931a',
  ETH: '#a78bfa',
  SOL: '#00e5a0',
  MATIC: '#8247e5',
  ARB: '#4f9eff',
}

// ─── Liquidity Pool Colors ─────────────────────────────────────────────────────

export const poolColors: Record<string, string> = {
  'BTC/USDT': '#f7931a',
  'ETH/USDT': '#a78bfa',
  'SOL/USDT': '#00e5a0',
  'ARB/ETH': '#4f9eff',
  'MATIC/USDT': '#8247e5',
}

// ─── Severity Config ──────────────────────────────────────────────────────────

export const severityConfig = {
  critical: { bg: '#ff446622', color: '#ff4466', label: 'CRIT' },
  warn:     { bg: '#ffc04622', color: '#ffc046', label: 'WARN' },
  info:     { bg: '#4f9eff22', color: '#4f9eff', label: 'INFO' },
  ok:       { bg: '#00e5a022', color: '#00e5a0', label: ' OK ' },
} as const
