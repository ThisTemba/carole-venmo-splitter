import { useState, useRef, useEffect } from 'react'
import { Box, Input, Button, Stack } from '@chakra-ui/react'
import type { Event, EventItem } from '../types'
import { getEventTotal } from '../utils/calculations'
import EventItemRow from './EventItemRow'

interface EventCardProps {
  event: Event
  people: string[]
  onEditName: (name: string) => void
  onDelete: () => void
  onUpdate: (event: Event) => void
}

export default function EventCard({
  event,
  people,
  onEditName,
  onDelete,
  onUpdate,
}: EventCardProps) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(event.name)
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null)
  const [focusField, setFocusField] = useState<"what" | "howMuch" | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editing])

  const handleSave = () => {
    if (editValue.trim() && editValue !== event.name) {
      onEditName(editValue.trim())
    }
    setEditing(false)
  }

  const handleAddItem = () => {
    const newItem: EventItem = { what: '', howMuch: 0, who: [] }
    onUpdate({
      ...event,
      items: [...event.items, newItem],
    })
    setEditingItemIndex(event.items.length)
    setFocusField("what")
  }

  const handleStartEdit = (index: number, field: "what" | "howMuch") => {
    setEditingItemIndex(index)
    setFocusField(field)
  }

  const handleUpdateItem = (index: number, item: EventItem) => {
    const updated = [...event.items]
    updated[index] = item
    onUpdate({ ...event, items: updated })
  }

  const handleSaveItem = () => {
    setEditingItemIndex(null)
    setFocusField(null)
  }

  const handleDeleteItem = (index: number) => {
    onUpdate({
      ...event,
      items: event.items.filter((_, i) => i !== index),
    })
  }

  return (
    <Box borderWidth={1} borderRadius="md" p={4} position="relative">
      {/* Delete button in top right */}
      <Button
        size="sm"
        variant="ghost"
        colorPalette="red"
        onClick={onDelete}
        position="absolute"
        top={2}
        right={2}
      >
        Delete Event
      </Button>

      {/* Event name */}
      {editing ? (
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          onBlur={handleSave}
          mb={2}
        />
      ) : (
        <Box
          fontSize="lg"
          fontWeight="bold"
          cursor="pointer"
          onClick={() => setEditing(true)}
          mb={2}
        >
          {event.name} • ${getEventTotal(event)}
        </Box>
      )}

      {/* Items list */}
      <Stack gap={0} mb={2}>
        {event.items.map((item, idx) => (
          <EventItemRow
            key={idx}
            index={idx}
            item={item}
            people={people}
            editing={editingItemIndex === idx}
            focusField={editingItemIndex === idx ? focusField : null}
            onChange={(updated) => handleUpdateItem(idx, updated)}
            onStartEdit={(field) => handleStartEdit(idx, field)}
            onSave={handleSaveItem}
            onDelete={() => handleDeleteItem(idx)}
          />
        ))}
      </Stack>

      {/* Add button */}
      <Button size="sm" variant="outline" onClick={handleAddItem}>
        Add event item
      </Button>
    </Box>
  )
}
