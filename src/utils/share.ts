// What gets sent to each person: their amount, or their breakdown as a
// little invoice image
import { groupItemsByReceipt, type PersonItem } from './calculations'
import { money } from './text'
import { toaster } from './toast'
import paperTexture from '../assets/paper-thermal.webp'
import { PAPER, PRINT, PRINT_FAINT, PRINT_SOFT } from './palette'

const sumShares = (items: PersonItem[]) => items.reduce((sum, item) => sum + parseFloat(item.share), 0)

const longDate = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    toaster.error({ title: "Couldn't copy", description: 'Your browser blocked the clipboard.' })
    return false
  }
}

// ---------- The invoice image ----------

const W = 380
const PAD = 26
const INK = PRINT
const SOFT = PRINT_SOFT
const FAINT = PRINT_FAINT
const MONO = "'Sometype Mono', ui-monospace, Menlo, monospace"

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Cut text to fit `width`, ending in an ellipsis
function fit(ctx: CanvasRenderingContext2D, text: string, width: number): string {
  if (ctx.measureText(text).width <= width) return text
  let cut = text
  while (cut.length > 1 && ctx.measureText(`${cut}…`).width > width) cut = cut.slice(0, -1)
  return `${cut.trimEnd()}…`
}

type Line =
  | { kind: 'title'; text: string }
  | { kind: 'meta'; text: string }
  | { kind: 'rule'; double?: boolean }
  | { kind: 'head'; text: string; amount: string }
  | { kind: 'item'; text: string; amount: string }
  | { kind: 'total'; amount: string }
  | { kind: 'gap'; size: number }

const HEIGHTS: Record<Line['kind'], number> = {
  title: 34,
  meta: 22,
  rule: 18,
  head: 26,
  item: 22,
  total: 40,
  gap: 0,
}

// A small thermal receipt for one person: their name, the date, what they
// had on each receipt, and the total
export async function invoiceImage(person: string, items: PersonItem[], total: string): Promise<Blob> {
  await Promise.all([
    document.fonts.load(`400 15px ${MONO}`),
    document.fonts.load(`700 15px ${MONO}`),
  ])
  const texture = await loadImage(paperTexture).catch(() => null)

  const lines: Line[] = [
    { kind: 'title', text: person },
    { kind: 'meta', text: longDate() },
    { kind: 'rule' },
  ]
  groupItemsByReceipt(items).forEach(({ receiptName, items: receiptItems }, i) => {
    if (i > 0) lines.push({ kind: 'gap', size: 10 })
    lines.push({ kind: 'head', text: receiptName || 'Untitled receipt', amount: money(sumShares(receiptItems)) })
    receiptItems.forEach((item) =>
      lines.push({ kind: 'item', text: item.item.what.trim() || 'Item', amount: money(parseFloat(item.share)) }),
    )
  })
  lines.push({ kind: 'gap', size: 6 }, { kind: 'rule', double: true }, { kind: 'total', amount: money(parseFloat(total)) })

  const height = PAD + lines.reduce((sum, line) => sum + (line.kind === 'gap' ? line.size : HEIGHTS[line.kind]), 0) + PAD
  const scale = 2
  const canvas = document.createElement('canvas')
  canvas.width = W * scale
  canvas.height = height * scale
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)

  // The paper
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, W, height)
  if (texture) {
    ctx.globalAlpha = 0.18
    ctx.globalCompositeOperation = 'multiply'
    ctx.drawImage(texture, 0, 0, texture.width / scale, texture.height / scale)
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
  }

  // The print
  const right = W - PAD
  const width = W - PAD * 2
  let y = PAD
  ctx.textBaseline = 'alphabetic'
  for (const line of lines) {
    if (line.kind === 'gap') {
      y += line.size
      continue
    }
    const h = HEIGHTS[line.kind]
    const base = y + h * 0.68
    ctx.fillStyle = INK
    ctx.textAlign = 'left'
    switch (line.kind) {
      case 'title':
        ctx.font = `700 19px ${MONO}`
        ctx.textAlign = 'center'
        ctx.letterSpacing = '3px'
        ctx.fillText(fit(ctx, line.text.toUpperCase(), width), W / 2, base)
        ctx.letterSpacing = '0px'
        break
      case 'meta':
        ctx.font = `400 12px ${MONO}`
        ctx.fillStyle = SOFT
        ctx.textAlign = 'center'
        ctx.letterSpacing = '1.5px'
        ctx.fillText(line.text.toUpperCase(), W / 2, base)
        ctx.letterSpacing = '0px'
        break
      case 'rule': {
        ctx.fillStyle = line.double ? INK : FAINT
        const mid = y + h / 2
        if (line.double) {
          ctx.fillRect(PAD, mid - 3, width, 1.5)
          ctx.fillRect(PAD, mid + 1.5, width, 1.5)
        } else ctx.fillRect(PAD, mid, width, 1)
        break
      }
      case 'head':
      case 'item': {
        ctx.font = `${line.kind === 'head' ? 700 : 400} 14px ${MONO}`
        if (line.kind === 'item') ctx.fillStyle = SOFT
        const amountWidth = ctx.measureText(line.amount).width
        const indent = line.kind === 'item' ? 12 : 0
        ctx.fillText(fit(ctx, line.text, width - amountWidth - indent - 16), PAD + indent, base)
        ctx.textAlign = 'right'
        ctx.fillText(line.amount, right, base)
        break
      }
      case 'total':
        ctx.font = `700 20px ${MONO}`
        ctx.letterSpacing = '1px'
        ctx.fillText('TOTAL', PAD, base)
        ctx.letterSpacing = '0px'
        ctx.textAlign = 'right'
        ctx.fillText(line.amount, right, base)
        break
    }
    y += h
  }

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('No image'))), 'image/png'),
  )
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// Puts the invoice on the clipboard, ready to paste into a message. Where
// the browser can't copy images, it downloads instead.
export async function copyImage(person: string, items: PersonItem[], total: string): Promise<'copied' | 'saved' | 'failed'> {
  const image = invoiceImage(person, items, total)
  try {
    // A promise, so Safari still counts it as part of the click
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': image })])
    return 'copied'
  } catch {
    try {
      const slug = person.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'invoice'
      downloadBlob(await image, `${slug}-invoice.png`)
      toaster.success({ title: 'Image saved', description: "Your browser can't copy images, so it was downloaded." })
      return 'saved'
    } catch {
      toaster.error({ title: "Couldn't make the image" })
      return 'failed'
    }
  }
}
