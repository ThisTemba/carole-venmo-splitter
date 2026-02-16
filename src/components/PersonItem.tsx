import { useState, useRef, useEffect } from 'react'
import { Box, Input, IconButton } from '@chakra-ui/react'
import { LuTrash } from 'react-icons/lu'

interface PersonItemProps {
  name: string
  onEdit: (oldName: string, newName: string) => void
  onDelete: (name: string) => void
}

export default function PersonItem({ name, onEdit, onDelete }: PersonItemProps) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editing])

  const handleStartEdit = () => {
    setEditValue(name)
    setEditing(true)
  }

  const handleSave = () => {
    if (editValue.trim() && editValue !== name) {
      onEdit(name, editValue.trim())
    }
    setEditing(false)
  }

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {editing ? (
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          onBlur={handleSave}
          flex="1"
        />
      ) : (
        <Box flex="1" cursor="pointer" onClick={handleStartEdit}>
          {name}
        </Box>
      )}
      <IconButton
        aria-label="Delete person"
        size="sm"
        variant="ghost"
        colorPalette="red"
        onClick={() => onDelete(name)}
      >
        <LuTrash />
      </IconButton>
    </Box>
  )
}
