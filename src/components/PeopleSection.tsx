import { useState } from 'react'
import { Box, Heading, Input, Stack, Flex, Button } from '@chakra-ui/react'
import type { Event } from '../types'
import PersonItem from './PersonItem'

interface PeopleSectionProps {
  people: string[]
  setPeople: (people: string[]) => void
  events: Event[]
  setEvents: (events: Event[]) => void
  checkedPeople: string[]
  setCheckedPeople: (checked: string[]) => void
}

export default function PeopleSection({
  people,
  setPeople,
  events,
  setEvents,
  checkedPeople,
  setCheckedPeople,
}: PeopleSectionProps) {
  const [newPerson, setNewPerson] = useState('')

  const handleAdd = () => {
    if (newPerson.trim()) {
      setPeople([...people, newPerson.trim()])
      setNewPerson('')
    }
  }

  const handleEdit = (oldName: string, newName: string) => {
    setPeople(people.map(p => (p === oldName ? newName : p)))
    setEvents(
      events.map(event => ({
        ...event,
        items: event.items.map(item => ({
          ...item,
          who: item.who.map(w => (w === oldName ? newName : w)),
        })),
      }))
    )
    setCheckedPeople(checkedPeople.map(p => (p === oldName ? newName : p)))
  }

  const handleDelete = (name: string) => {
    setPeople(people.filter(p => p !== name))
    setEvents(
      events.map(event => ({
        ...event,
        items: event.items.map(item => ({
          ...item,
          who: item.who.filter(w => w !== name),
        })),
      }))
    )
    setCheckedPeople(checkedPeople.filter(p => p !== name))
  }

  return (
    <Box borderWidth={1} borderRadius="md" p={6} bg="bg">
      <Heading size="md" mb={4}>
        People
      </Heading>

      <Flex gap={2} mb={4}>
        <Input
          placeholder="Add person"
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          flex="1"
        />
        <Button onClick={handleAdd}>Add</Button>
      </Flex>

      {people.length === 0 ? (
        <Box color="fg.muted">No people added yet</Box>
      ) : (
        <Stack gap={2}>
          {people.map((person) => (
            <PersonItem
              key={person}
              name={person}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </Stack>
      )}
    </Box>
  )
}
