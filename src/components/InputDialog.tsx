import { useState } from 'react'
import { Button, Input } from '@chakra-ui/react'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
} from './ui/dialog'

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

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value)
      onOpenChange(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm()
    }
  }

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => {
        onOpenChange(e.open)
        if (e.open) setValue(defaultValue)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {label && <p style={{ marginBottom: '8px' }}>{label}</p>}
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {cancelLabel}
            </Button>
          </DialogActionTrigger>
          <Button onClick={handleConfirm} disabled={!value.trim()}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
