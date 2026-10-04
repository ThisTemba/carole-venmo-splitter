// plural(1, 'item') → "1 item", plural(3, 'item') → "3 items"
export function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

// money(-43) → "-$43.00", money(1234.5) → "$1,234.50"
export function money(amount: number): string {
  const formatted = Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `${amount < 0 ? '-' : ''}$${formatted}`
}
