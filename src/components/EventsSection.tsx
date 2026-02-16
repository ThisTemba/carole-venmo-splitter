import { useState } from "react";
import {
  Box,
  Heading,
  Input,
  Stack,
  Flex,
  Button,
  List,
  Alert,
} from "@chakra-ui/react";
import type { Event } from "../types";
import EventCard from "./EventCard";

interface EventsSectionProps {
  people: string[];
  events: Event[];
  setEvents: (events: Event[]) => void;
}

export default function EventsSection({
  people,
  events,
  setEvents,
}: EventsSectionProps) {
  const [newEvent, setNewEvent] = useState("");

  // Aggregate incomplete items
  const incompleteItems = events.flatMap((event, eventIdx) =>
    event.items
      .map((item, itemIdx) => ({
        eventName: event.name,
        eventIdx,
        itemIdx,
        itemName: item.what || "(unnamed)",
        missing: {
          name: !item.what.trim(),
          price: item.howMuch === 0,
          person: item.who.length === 0,
        },
      }))
      .filter(
        (item) =>
          item.missing.name || item.missing.price || item.missing.person,
      ),
  );

  const handleAdd = () => {
    if (newEvent.trim()) {
      setEvents([...events, { name: newEvent.trim(), items: [] }]);
      setNewEvent("");
    }
  };

  const handleEditEvent = (index: number, newName: string) => {
    const updated = [...events];
    updated[index] = { ...updated[index], name: newName };
    setEvents(updated);
  };

  const handleDeleteEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const handleUpdateEvent = (index: number, updatedEvent: Event) => {
    const updated = [...events];
    updated[index] = updatedEvent;
    setEvents(updated);
  };

  return (
    <Box borderWidth={1} borderRadius="md" p={6} bg="bg">
      <Heading size="md" mb={4}>
        Events
      </Heading>

      <Flex gap={2} mb={4}>
        <Input
          placeholder="Add event"
          value={newEvent}
          onChange={(e) => setNewEvent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          flex="1"
        />
        <Button onClick={handleAdd}>Add</Button>
      </Flex>

      {incompleteItems.length > 0 && (
        <Alert.Root status="warning" mb={4}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>
              {incompleteItems.length} incomplete item
              {incompleteItems.length > 1 ? "s" : ""}
            </Alert.Title>
            <Alert.Description>
              <List.Root as="ul" gap={1} mt={2}>
                {incompleteItems.map((item, idx) => {
                  const missing = [];
                  if (item.missing.name) missing.push("name");
                  if (item.missing.price) missing.push("price");
                  if (item.missing.person) missing.push("person");
                  return (
                    <List.Item key={idx} fontSize="xs">
                      No {missing.join(", ")} - {item.eventName} |{" "}
                      {item.itemName}
                    </List.Item>
                  );
                })}
              </List.Root>
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      {events.length === 0 ? (
        <Box color="fg.muted">No events added yet</Box>
      ) : (
        <Stack gap={4}>
          {events.map((event, idx) => (
            <EventCard
              key={idx}
              event={event}
              people={people}
              onEditName={(name) => handleEditEvent(idx, name)}
              onDelete={() => handleDeleteEvent(idx)}
              onUpdate={(updated) => handleUpdateEvent(idx, updated)}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
