// The thermal print colors, for what's drawn outside CSS: the invoice image
// and the PDF record. Keep in step with --paper, --print, --print-soft,
// --print-faint and --print-red in styles.css.
export const PAPER = '#f7f7f4'
export const PRINT = '#2e2b27'
export const PRINT_SOFT = '#5f5a53'
export const PRINT_FAINT = '#aaa59c'
export const PRINT_RED = '#b3261e'

// '#2e2b27' → [46, 43, 39], for jsPDF
export const rgb = (hex: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number]
