import { useEffect, useId, useRef, type ReactNode } from 'react'
import Slip from './Slip'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  actions: ReactNode
  role?: 'dialog' | 'alertdialog'
  wide?: boolean
}

// A modal slip, on the browser's own <dialog> so focus and Escape just work
export default function Dialog({ open, onOpenChange, title, children, actions, role, wide }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const id = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className={`dialog ${wide ? 'dialog--wide' : ''}`}
      role={role}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-body`}
      onClose={() => onOpenChange(false)}
      // Clicking the dimmed desk around the slip closes it
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false)
      }}
    >
      {open && (
        <Slip tilt={-0.4}>
          <h2 id={`${id}-title`} className="print-heading dialog__title">{title}</h2>
          <div id={`${id}-body`} className="dialog__body">{children}</div>
          <div className="dialog__actions">{actions}</div>
        </Slip>
      )}
    </dialog>
  )
}
