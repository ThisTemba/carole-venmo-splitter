// The torn bottom of a slip: a row of teeth with a little variation, different
// for every slip. It's a clip-path rather than a mask, so a tilted slip's
// edge stays clean instead of leaving a faint line under the teeth.

// How deep the tear is, in px; matches --tooth in styles.css
const DEPTH = 12
// Wider than any slip, so the teeth always run the full width
const SPAN = 1400

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

// A point `y` px into the bottom DEPTH px of the box
const at = (x: number, y: number) => `${x.toFixed(1)}px calc(100% - ${(DEPTH - y).toFixed(1)}px)`

function teeth(seed: number): string {
  const rand = random(seed)
  // Left to right along the bottom: valleys near the top of the tear, tips near the bottom
  const points: string[] = [at(0, 1.5 + rand() * 1.5)]
  let x = 0
  while (x < SPAN) {
    const width = 10 + rand() * 4
    points.push(at(x + width * (0.35 + rand() * 0.3), 7.5 + rand() * 2.5))
    x += width
    points.push(at(x, 1.5 + rand() * 1.5))
  }
  // Across the top, down the right side, then back along the teeth
  return `polygon(0 0, 100% 0, ${SPAN}px 0, ${points.reverse().join(', ')})`
}

const cache = new Map<number, string>()

// The clip-path for a slip's paper, torn along the bottom
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

// The same kind of torn edge as a path, for drawing one outline round a
// blank slip `width` × `height` px, the teeth below `height`
export function tornOutline(seed: number, width: number, height: number): string {
  const rand = random(seed)
  const points: string[] = [`${width},${height + 1.5 + rand() * 1.5}`]
  let x = width
  while (x > 0) {
    const w = 10 + rand() * 4
    points.push(`${Math.max(x - w * (0.35 + rand() * 0.3), 0).toFixed(1)},${(height + 7.5 + rand() * 2.5).toFixed(1)}`)
    x -= w
    points.push(`${Math.max(x, 0).toFixed(1)},${(height + 1.5 + rand() * 1.5).toFixed(1)}`)
  }
  return `M0,${height} L0,0 L${width},0 L${points.join(' L')} Z`
}
