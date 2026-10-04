import { useState, useRef, useEffect } from 'react'

interface ReceiptNameProps {
  name: string
  // Start with the box open (a receipt that was just added)
  startEditing: boolean
  // When the box closes. `viaEnter` is false for Escape and clicking away.
  onDone: (typed: string, viaEnter: boolean) => void
}

// The receipt's name, printed as a heading; click to edit
export default function ReceiptName({ name, startEditing, onDone }: ReceiptNameProps) {
  const [editing, setEditing] = useState(startEditing)
  const [value, setValue] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)
  // Set when Enter closes the box
  const enterPressed = useRef(false)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  // Runs on blur; Enter and Escape blur the box so there's only one path
  const handleBlur = () => {
    const viaEnter = enterPressed.current
    enterPressed.current = false
    setEditing(false)
    onDone(value.trim(), viaEnter)
  }

  const startEdit = () => {
    setValue(name)
    setEditing(true)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="field receipt__name-input"
        value={value}
        aria-label="Receipt name"
        placeholder="Where? e.g. Bar night"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') enterPressed.current = true
          if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur()
        }}
        onBlur={handleBlur}
      />
    )
  }

  return (
    <h3
      className="print-heading receipt__name"
      tabIndex={0}
      title="Rename"
      onClick={startEdit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          startEdit()
        }
      }}
    >
      {name}
    </h3>
  )
}
