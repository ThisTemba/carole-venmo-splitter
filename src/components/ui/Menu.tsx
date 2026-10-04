import { useEffect, useRef, useState, type ReactNode } from 'react'
import { LuEllipsis } from 'react-icons/lu'

export interface MenuItem {
  label: string
  icon: ReactNode
  onSelect: () => void
  danger?: boolean
  disabled?: boolean
}

interface MenuProps {
  label: string
  items: MenuItem[]
  triggerClassName: string
  className?: string
  // Stands in for the ⋯, e.g. to show something's under way
  icon?: ReactNode
}

// A "⋯" button with a short list under it: closes on a pick, a click
// elsewhere, or Escape
export default function Menu({ label, items, triggerClassName, className = '', icon }: MenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    rootRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus()
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open])

  const pick = (fn: () => void) => {
    setOpen(false)
    fn()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const buttons = [...(rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [])]
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (e.key === 'Escape') {
      setOpen(false)
      triggerRef.current?.focus()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      buttons[(i + 1) % buttons.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      buttons[(i - 1 + buttons.length) % buttons.length]?.focus()
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div className={`menu ${className}`} ref={rootRef} onKeyDown={handleKeyDown} data-open={open}>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClassName}
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {icon ?? <LuEllipsis aria-hidden />}
      </button>
      {open && (
        <ul className="menu__list" role="menu">
          {items.map((item) => (
            <li key={item.label} role="none">
              <button
                type="button"
                role="menuitem"
                className={`menu__item ${item.danger ? 'menu__item--danger' : ''}`}
                disabled={item.disabled}
                onClick={() => pick(item.onSelect)}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
