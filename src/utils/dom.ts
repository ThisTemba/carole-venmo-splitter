// Closing a row can shift the layout (warnings appear, blank rows go away). If
// that happens while the mouse is down, the click lands on the wrong thing, so
// changes like that wait until the click has gone through.
let pointerDown = false
document.addEventListener('pointerdown', () => (pointerDown = true), true)
document.addEventListener('pointerup', () => (pointerDown = false), true)

export function afterPointerRelease(fn: () => void) {
  if (!pointerDown) return fn()
  document.addEventListener('pointerup', () => setTimeout(fn, 0), { once: true, capture: true })
}

export function blurActive() {
  ;(document.activeElement as HTMLElement | null)?.blur()
}
