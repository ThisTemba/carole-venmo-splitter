// plural(1, 'item') → "1 item", plural(3, 'item') → "3 items"
export function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}
