// The payer's own record of an outing, as one dated PDF: a summary (what each
// receipt came to, who owes what), every receipt as it was entered, then each
// person's breakdown. Typeset in Courier, which every PDF reader
// has, so it reads like the receipts it records.
import type { Receipt } from '../types'
import { getItemPeople, getItemsByPerson, getReceiptTotal, getSubtotal, groupItemsByReceipt, sumItems } from './calculations'
import { EVERYONE } from './people'
import { fileName } from './fileExport'
import { money } from './text'
import { PRINT, PRINT_FAINT, PRINT_RED, PRINT_SOFT, rgb } from './palette'

const PAGE_W = 612
const PAGE_H = 792
const MARGIN = 60
const WIDTH = PAGE_W - MARGIN * 2
const INK = rgb(PRINT)
const SOFT = rgb(PRINT_SOFT)
const FAINT = rgb(PRINT_FAINT)
const RED = rgb(PRINT_RED)

export async function saveRecord(people: string[], receipts: Receipt[]) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  let y = MARGIN

  // Starts a new page when the next `height` points won't fit
  const room = (height: number) => {
    if (y + height > PAGE_H - MARGIN) {
      doc.addPage()
      y = MARGIN
    }
  }
  const text = (s: string, x: number, size: number, opts: { bold?: boolean; color?: typeof INK; align?: 'right' | 'center' } = {}) => {
    doc.setFont('courier', opts.bold ? 'bold' : 'normal')
    doc.setFontSize(size)
    doc.setTextColor(...(opts.color ?? INK))
    doc.text(s, x, y, opts.align ? { align: opts.align } : undefined)
  }
  const fit = (s: string, size: number, width: number) => {
    doc.setFontSize(size)
    if (doc.getTextWidth(s) <= width) return s
    let cut = s
    while (cut.length > 1 && doc.getTextWidth(`${cut}...`) > width) cut = cut.slice(0, -1)
    return `${cut.trimEnd()}...`
  }
  const rule = (double = false) => {
    doc.setDrawColor(...(double ? INK : FAINT))
    doc.setLineWidth(double ? 1 : 0.6)
    doc.line(MARGIN, y, MARGIN + WIDTH, y)
    if (double) doc.line(MARGIN, y + 3, MARGIN + WIDTH, y + 3)
  }
  const whoLinesFor = (who?: string) => (who ? (doc.setFontSize(9), doc.splitTextToSize(who, WIDTH - 110) as string[]) : [])
  // item ............ $12.00, with who had it underneath in grey
  const line = (what: string, amount: string, who?: string, opts: { bold?: boolean; size?: number } = {}) => {
    const size = opts.size ?? 11
    const whoLines = whoLinesFor(who)
    room(16 + whoLines.length * 11)
    y += 15
    text(fit(what, size, WIDTH - 110), MARGIN, size, { bold: opts.bold })
    text(amount, MARGIN + WIDTH, size, { bold: opts.bold, align: 'right' })
    whoLines.forEach((l) => {
      y += 11
      text(l, MARGIN + 14, 9, { color: SOFT })
    })
  }

  // Heading
  y += 6
  text('CAROLE VENMO SPLITTER', PAGE_W / 2, 16, { bold: true, align: 'center' })
  y += 18
  text(date.toUpperCase(), PAGE_W / 2, 9, { color: SOFT, align: 'center' })
  y += 22

  // The summary up front: what each receipt came to, then who owes what
  const listed = receipts.filter((receipt) => receipt.items.some((item) => item.what.trim() || item.howMuch))
  text('RECEIPTS', MARGIN, 13, { bold: true })
  y += 8
  rule()
  listed.forEach((receipt) => line(receipt.name || 'Untitled receipt', money(getReceiptTotal(receipt))))
  const receiptsTotal = listed.reduce((sum, receipt) => sum + getReceiptTotal(receipt), 0)
  room(30)
  y += 12
  rule(true)
  y += 4
  line('ALL RECEIPTS', money(receiptsTotal), undefined, { bold: true, size: 12 })

  // Who owes what, most first
  const itemsByPerson = getItemsByPerson(receipts, people)
  const totals = people
    .map((person) => {
      const items = itemsByPerson.get(person) ?? []
      return { person, items, total: parseFloat(sumItems(items)) }
    })
    .sort((a, b) => b.total - a.total)
  room(Math.min(26 + 8 + totals.length * 16 + 62, PAGE_H - MARGIN * 2))
  y += 30
  text('WHO OWES WHAT', MARGIN, 13, { bold: true })
  y += 8
  rule()
  totals.forEach(({ person, total }) => {
    room(16)
    y += 16
    text(fit(person, 11, WIDTH - 200), MARGIN, 11)
    text(money(total), MARGIN + WIDTH, 11, { align: 'right' })
  })
  const everyone = totals.reduce((sum, { total }) => sum + total, 0)
  const unsplit = Math.round((receiptsTotal - everyone) * 100) / 100
  room(50)
  y += 12
  rule(true)
  y += 4
  line('EVERYONE', money(everyone), undefined, { bold: true, size: 12 })
  y += 16
  text(
    unsplit === 0 ? 'Matches the receipts' : `${money(unsplit)} on the receipts isn't split yet`,
    MARGIN,
    9,
    { color: unsplit === 0 ? SOFT : RED },
  )

  // Then every receipt in full, from a fresh page
  doc.addPage()
  y = MARGIN - 18

  // Each receipt
  receipts.forEach((receipt) => {
    const items = receipt.items.filter((item) => item.what.trim() || item.howMuch)
    if (!items.length) return
    const who = (item: (typeof items)[number]) =>
      item.everyone ? `${EVERYONE}: ${getItemPeople(item, receipt, people).join(', ')}` : item.who.join(', ') || 'Nobody yet'
    const fees = items.filter((item) => item.proportional)
    // Kept on one page when it fits on one
    const height =
      18 + 8 + items.reduce((sum, item) => sum + 15 + whoLinesFor(who(item)).length * 11, 0) + (fees.length ? 21 : 0) + 39
    room(Math.min(height, PAGE_H - MARGIN * 2))
    y += 18
    text(fit((receipt.name || 'Untitled receipt').toUpperCase(), 13, WIDTH), MARGIN, 13, { bold: true })
    y += 8
    rule()
    items.filter((item) => !item.proportional).forEach((item) => line(item.what, money(item.howMuch), who(item)))
    if (fees.length) {
      y += 6
      line('Subtotal', money(getSubtotal(receipt)), undefined, { bold: true })
      fees.forEach((item) => line(item.what, money(item.howMuch), who(item)))
    }
    room(30)
    y += 10
    rule(true)
    y += 4
    line('TOTAL', money(getReceiptTotal(receipt)), undefined, { bold: true, size: 12 })
    y += 10
  })

  // Each person's breakdown: what they had on each receipt, so any one of
  // them can be explained
  const byPerson = totals.filter(({ items }) => items.length)
  doc.addPage()
  y = MARGIN
  text('EACH PERSON', MARGIN, 13, { bold: true })
  y += 8
  rule()
  const priceRight = MARGIN + WIDTH
  byPerson.forEach(({ person, total, items }) => {
    const groups = groupItemsByReceipt(items)
    room(Math.min(30 + groups.length * 14 + items.length * 13, PAGE_H - MARGIN * 2))
    y += 22
    text(fit(person, 12, WIDTH - 110), MARGIN, 12, { bold: true })
    text(money(total), priceRight, 12, { bold: true, align: 'right' })
    groups.forEach(({ receiptName, items: receiptItems }) => {
      room(14)
      y += 14
      text(fit(receiptName || 'Untitled receipt', 10, WIDTH - 110), MARGIN + 14, 10, { color: SOFT })
      receiptItems.forEach((item) => {
        room(13)
        y += 13
        text(fit(item.item.what.trim() || 'Item', 10, WIDTH - 140), MARGIN + 28, 10)
        text(money(parseFloat(item.share)), priceRight, 10, { align: 'right' })
      })
    })
  })

  doc.save(`${fileName(receipts, 'carole')}.pdf`)
}
