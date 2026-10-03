import { useRef, useState } from 'react'
import { Flex, Button, IconButton, Menu, Portal } from '@chakra-ui/react'
import { LuSave, LuFolderOpen, LuTrash, LuFlaskConical, LuEllipsis } from 'react-icons/lu'
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
      <Flex gap={2} flexWrap="wrap" justifyContent="center">
        <Button onClick={() => setSaveDialogOpen(true)} variant="outline">
          <LuSave />
          Save
        </Button>
        <Button onClick={handleLoad} variant="outline">
          <LuFolderOpen />
          Load
        </Button>
        {/* Less common actions, kept out of the way */}
        <Menu.Root
          onSelect={({ value }) => (value === 'example' ? setExampleDialogOpen(true) : setClearDialogOpen(true))}
        >
          <Menu.Trigger asChild>
            <IconButton aria-label="More actions" variant="outline">
              <LuEllipsis />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="example">
                  <LuFlaskConical />
                  Load example data
                </Menu.Item>
                <Menu.Item value="clear" color="fg.error">
                  <LuTrash />
                  Clear all data
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
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
