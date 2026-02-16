import { Button } from '@chakra-ui/react'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
} from './ui/dialog'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  colorPalette?: string
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  colorPalette = 'blue',
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <DialogRoot open={open} onOpenChange={(e) => onOpenChange(e.open)} role="alertdialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{message}</DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {cancelLabel}
            </Button>
          </DialogActionTrigger>
          <Button colorPalette={colorPalette} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
