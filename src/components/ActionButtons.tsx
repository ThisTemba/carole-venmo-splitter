import { useRef, useState } from 'react'
import { Flex, Button } from '@chakra-ui/react'
import { LuSave, LuFolderOpen, LuTrash, LuFlaskConical, LuFileText } from 'react-icons/lu'
import type { Event } from '../types'
import { downloadJSON, loadJSON, exportTotals, formatDate } from '../utils/fileExport'
import { eventsInit, peopleInit } from '../data/initState'
import ConfirmDialog from './ConfirmDialog'
import InputDialog from './InputDialog'

interface ActionButtonsProps {
  people: string[]
  events: Event[]
  checkedPeople: string[]
  setPeople: (people: string[]) => void
  setEvents: (events: Event[]) => void
  setCheckedPeople: (checked: string[]) => void
  canExport: boolean
}

export default function ActionButtons({
  people,
  events,
  checkedPeople,
  setPeople,
  setEvents,
  setCheckedPeople,
  canExport,
}: ActionButtonsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [exampleDialogOpen, setExampleDialogOpen] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)

  const handleSave = (filename: string) => {
    downloadJSON(people, events, checkedPeople, filename)
  }

  const handleLoad = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      loadJSON(file, setPeople, setEvents, setCheckedPeople)
    }
  }

  const handleClear = () => {
    setPeople([])
    setEvents([])
    setCheckedPeople([])
  }

  const handleExample = () => {
    setPeople(peopleInit)
    setEvents(eventsInit)
    setCheckedPeople([])
  }

  return (
    <>
      <Flex gap={2} flexWrap="wrap" justifyContent="center">
        <Button onClick={() => setSaveDialogOpen(true)} variant="outline">
          <LuSave />
          Save
        </Button>
        <Button onClick={handleLoad} variant="outline">
          <LuFolderOpen />
          Load
        </Button>
        <Button onClick={() => setExampleDialogOpen(true)} variant="outline">
          <LuFlaskConical />
          Example Data
        </Button>
        <Button onClick={() => exportTotals(people, events, checkedPeople)} disabled={!canExport} variant="outline">
          <LuFileText />
          Export Totals
        </Button>
        <Button onClick={() => setClearDialogOpen(true)} variant="outline">
          <LuTrash />
          Clear Data
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </Flex>

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
        colorPalette="red"
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
