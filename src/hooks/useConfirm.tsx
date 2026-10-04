import { useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'

interface ConfirmRequest {
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
}

// A destructive-action confirmation. Render `dialog` once, then call confirm().
export function useConfirm() {
  // Kept after closing so the dialog doesn't go blank while it animates out
  const [request, setRequest] = useState<ConfirmRequest | null>(null)
  const [open, setOpen] = useState(false)

  const confirm = (next: ConfirmRequest) => {
    setRequest(next)
    setOpen(true)
  }

  const dialog = (
    <ConfirmDialog
      open={open}
      onOpenChange={setOpen}
      title={request?.title ?? ''}
      message={request?.message ?? ''}
      confirmLabel={request?.confirmLabel}
      danger
      onConfirm={() => request?.onConfirm()}
    />
  )

  return { confirm, dialog }
}
