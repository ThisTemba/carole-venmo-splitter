// Brief messages in the corner, shown by <Toaster />

export interface Toast {
  id: number
  type: 'success' | 'error'
  title: string
  description?: string
}

type Listener = (toasts: Toast[]) => void

export let toasts: Toast[] = []
let nextId = 0
export const listeners = new Set<Listener>()

const emit = () => listeners.forEach((listener) => listener(toasts))

function show(type: Toast['type'], { title, description }: { title: string; description?: string }) {
  const id = nextId++
  toasts = [...toasts, { id, type, title, description }]
  emit()
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    emit()
  }, 4500)
}

export const toaster = {
  success: (toast: { title: string; description?: string }) => show('success', toast),
  error: (toast: { title: string; description?: string }) => show('error', toast),
}
