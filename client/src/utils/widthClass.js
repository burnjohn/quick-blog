const WIDTHS = ['w-[4%]', 'w-[10%]', 'w-[20%]', 'w-[30%]', 'w-[40%]', 'w-[50%]', 'w-[60%]', 'w-[70%]', 'w-[80%]', 'w-[90%]', 'w-full']

// Quantizes value/max to a static Tailwind width class (no inline styles)
export const widthClass = (value, max) =>
  WIDTHS[max > 0 && value > 0 ? Math.max(0, Math.min(10, Math.round((value / max) * 10))) : 0]
