import { useState } from 'react'
import Dialog from './ui/Dialog'

interface InputDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  label?: string
  defaultValue?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: (value: string) => void
}

export default function InputDialog({
  open,
  onOpenChange,
  title,
  label,
  defaultValue = '',
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
}: InputDialogProps) {
  const [value, setValue] = useState(defaultValue)
  // Starts fresh each time it opens
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setValue(defaultValue)
  }

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value)
      onOpenChange(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      actions={
        <>
          <button className="print-btn" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </button>
          <button className="print-btn print-btn--solid" onClick={handleConfirm} disabled={!value.trim()}>
            {confirmLabel}
          </button>
        </>
      }
    >
      <label>
        {label && <p>{label}</p>}
        <input
          className="field"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleConfirm()
          }}
          onFocus={(e) => e.target.select()}
          autoFocus
        />
      </label>
    </Dialog>
  )
}
