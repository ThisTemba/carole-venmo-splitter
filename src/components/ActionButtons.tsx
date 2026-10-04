import { useEffect, useRef, useState } from 'react'
import { LuSave, LuFolderOpen, LuTrash2, LuFlaskConical, LuEllipsis } from 'react-icons/lu'
import type { Receipt } from '../types'
import { downloadJSON, loadJSON, formatDate } from '../utils/fileExport'
import { receiptsInit, peopleInit } from '../data/initState'
import ConfirmDialog from './ConfirmDialog'
import InputDialog from './InputDialog'

interface ActionButtonsProps {
  people: string[]
  receipts: Receipt[]
  checkedPeople: string[]
  setPeople: (people: string[]) => void
  setReceipts: (receipts: Receipt[]) => void
  setCheckedPeople: (checked: string[]) => void
}

// The "⋯" menu: closes on a pick, a click elsewhere, or Escape
function MoreMenu({ onExample, onClear }: { onExample: () => void; onClear: () => void }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    rootRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus()
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
    const items = [...(rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])]
    const i = items.indexOf(document.activeElement as HTMLButtonElement)
    if (e.key === 'Escape') {
      setOpen(false)
      triggerRef.current?.focus()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[(i + 1) % items.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[(i - 1 + items.length) % items.length]?.focus()
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div className="menu" ref={rootRef} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        className="desk-btn desk-btn--icon"
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <LuEllipsis aria-hidden />
      </button>
      {open && (
        <ul className="menu__list" role="menu">
          <li role="none">
            <button type="button" role="menuitem" className="menu__item" onClick={() => pick(onExample)}>
              <LuFlaskConical aria-hidden />
              Load example data
            </button>
          </li>
          <li role="none">
            <button type="button" role="menuitem" className="menu__item menu__item--danger" onClick={() => pick(onClear)}>
              <LuTrash2 aria-hidden />
              Clear all data
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}

export default function ActionButtons({
  people,
  receipts,
  checkedPeople,
  setPeople,
  setReceipts,
  setCheckedPeople,
}: ActionButtonsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [exampleDialogOpen, setExampleDialogOpen] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)

  const handleSave = (filename: string) => {
    downloadJSON(people, receipts, checkedPeople, filename)
  }

  const handleLoad = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      loadJSON(file, setPeople, setReceipts, setCheckedPeople)
    }
    // Loading the same file again still works
    e.target.value = ''
  }

  const handleClear = () => {
    setPeople([])
    setReceipts([])
    setCheckedPeople([])
  }

  const handleExample = () => {
    setPeople(peopleInit)
    setReceipts(receiptsInit)
    setCheckedPeople([])
  }

  return (
    <>
      <div className="desk-actions">
        <button type="button" className="desk-btn" onClick={() => setSaveDialogOpen(true)}>
          <LuSave aria-hidden />
          Save
        </button>
        <button type="button" className="desk-btn" onClick={handleLoad}>
          <LuFolderOpen aria-hidden />
          Load
        </button>
        {/* Less common actions, kept out of the way */}
        <MoreMenu onExample={() => setExampleDialogOpen(true)} onClear={() => setClearDialogOpen(true)} />
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} hidden />
      </div>

      <InputDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        title="Save Data"
        label="Enter filename (without .json):"
        defaultValue={`carole-${formatDate()}`}
        confirmLabel="Save"
        onConfirm={handleSave}
      />

      <ConfirmDialog
        open={clearDialogOpen}
        onOpenChange={setClearDialogOpen}
        title="Clear All Data"
        message="Are you sure you want to clear all data? This action cannot be undone."
        confirmLabel="Clear"
        danger
        onConfirm={handleClear}
      />

      <ConfirmDialog
        open={exampleDialogOpen}
        onOpenChange={setExampleDialogOpen}
        title="Load Example Data"
        message="This will replace all current data with example data. Continue?"
        confirmLabel="Load"
        onConfirm={handleExample}
      />
    </>
  )
}
