import { useRef, useState } from 'react'
import { LuSave, LuFolderOpen, LuTrash2, LuFlaskConical } from 'react-icons/lu'
import type { Receipt } from '../types'
import { downloadJSON, loadJSON, fileName } from '../utils/fileExport'
import { receiptsInit, peopleInit } from '../data/initState'
import ConfirmDialog from './ConfirmDialog'
import InputDialog from './InputDialog'
import Menu from './ui/Menu'

interface ActionButtonsProps {
  people: string[]
  receipts: Receipt[]
  setPeople: (people: string[]) => void
  setReceipts: (receipts: Receipt[]) => void
}

export default function ActionButtons({
  people,
  receipts,
  setPeople,
  setReceipts,
}: ActionButtonsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [exampleDialogOpen, setExampleDialogOpen] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)

  const handleSave = (filename: string) => {
    downloadJSON(people, receipts, filename)
  }

  const handleLoad = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      loadJSON(file, setPeople, setReceipts)
    }
    // Loading the same file again still works
    e.target.value = ''
  }

  const handleClear = () => {
    setPeople([])
    setReceipts([])
  }

  const handleExample = () => {
    setPeople(peopleInit)
    setReceipts(receiptsInit)
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
        <Menu
          label="More actions"
          triggerClassName="desk-btn desk-btn--icon"
          items={[
            { label: 'Load example data', icon: <LuFlaskConical aria-hidden />, onSelect: () => setExampleDialogOpen(true) },
            { label: 'Clear all data', icon: <LuTrash2 aria-hidden />, onSelect: () => setClearDialogOpen(true), danger: true },
          ]}
        />
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} hidden />
      </div>

      <InputDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        title="Save Data"
        label="Enter filename (without .json):"
        defaultValue={fileName(receipts, 'carole')}
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
