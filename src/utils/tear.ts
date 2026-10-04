// The torn bottom of a slip: a row of teeth with a little variation, different
// for every slip, as an SVG mask. The pattern repeats every WIDTH px.

const WIDTH = 360
const HEIGHT = 12

// A small seeded random number generator, so a slip keeps its tear
function random(seed: number) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

// Teeth along the top of a HEIGHT-tall strip, solid below them; starts and
// ends at the same depth so it tiles without a seam
function teeth(seed: number): string {
  const rand = random(seed)
  const points: string[] = [`0,${HEIGHT}`, `0,${HEIGHT - 1.5}`]
  let x = 0
  while (x < WIDTH - 18) {
    const width = 10 + rand() * 4
    const peak = 2 + rand() * 2.5
    const valley = HEIGHT - 1.5 - rand() * 1.5
    points.push(`${(x + width * (0.35 + rand() * 0.3)).toFixed(1)},${peak.toFixed(1)}`)
    x += width
    points.push(`${x.toFixed(1)},${valley.toFixed(1)}`)
  }
  points.push(`${WIDTH - 6},${(2 + rand() * 2.5).toFixed(1)}`, `${WIDTH},${HEIGHT - 1.5}`, `${WIDTH},${HEIGHT}`)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${WIDTH}' height='${HEIGHT}'><polygon points='${points.join(' ')}'/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const cache = new Map<number, string>()

// The mask for a slip's bottom edge
export function tearFor(seed: number): string {
  let edge = cache.get(seed)
  if (!edge) {
    edge = teeth(seed)
    cache.set(seed, edge)
  }
  return edge
}

export function seedFrom(text: string): number {
  let hash = 0
  for (const ch of text) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  return Math.abs(hash)
}
