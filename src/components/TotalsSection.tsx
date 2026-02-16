import { Box, Heading, Stack, Flex, Checkbox, Button, Accordion } from "@chakra-ui/react";
import type { Event } from "../types";
import { getTotalForPerson, getItemsForPerson, groupItemsByEvent } from "../utils/calculations";

interface TotalsSectionProps {
  people: string[];
  events: Event[];
  checkedPeople: string[];
  setCheckedPeople: (checked: string[]) => void;
  onExport: () => void;
  canExport: boolean;
}

export default function TotalsSection({
  people,
  events,
  checkedPeople,
  setCheckedPeople,
  onExport,
  canExport,
}: TotalsSectionProps) {
  const handleToggle = (person: string) => {
    if (checkedPeople.includes(person)) {
      setCheckedPeople(checkedPeople.filter((p) => p !== person));
    } else {
      setCheckedPeople([...checkedPeople, person]);
    }
  };

  if (people.length === 0) {
    return (
      <Box maxW="600px" mx="auto">
        <Box borderWidth={1} borderRadius="md" p={6} textAlign="center">
          <Heading size="md" mb={4}>
            Totals
          </Heading>
          <Box color="fg.muted">No people added yet</Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box maxW="400px" mx="auto">
      <Box borderWidth={1} borderRadius="md" p={6} bg="bg">
        <Heading size="md" mb={4} textAlign="center">
          Totals
        </Heading>

        <Accordion.Root collapsible multiple>
        {people.map((person) => {
          const total = getTotalForPerson(person, events);
          const items = getItemsForPerson(person, events);

          return (
            <Accordion.Item key={person} value={person}>
              <Accordion.ItemTrigger>
                <Flex alignItems="center" gap={2} flex="1">
                  <Checkbox.Root
                    checked={checkedPeople.includes(person)}
                    onCheckedChange={() => handleToggle(person)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                  <Box flex="1" textAlign="left">
                    {person}
                  </Box>
                  <Box fontWeight="bold">${total}</Box>
                  <Accordion.ItemIndicator />
                </Flex>
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <Box fontFamily="mono" fontSize="sm" px={8}>
                    {Object.entries(groupItemsByEvent(items)).map(([eventName, eventItems]) => (
                      <Box key={eventName} mb={3}>
                        <Box textAlign="center" borderBottom="1px dashed" borderColor="border" pb={1} mb={2}>{eventName}</Box>
                        <Stack gap={1}>
                          {eventItems.map((item, idx) => (
                            <Flex key={idx} justifyContent="space-between">
                              <Box>{item.item.what}</Box>
                              <Box>${item.share}</Box>
                            </Flex>
                          ))}
                        </Stack>
                        {eventItems.length > 1 && (
                          <Box borderTop="1px dashed" borderColor="border" mt={2} pt={1}>
                            <Flex justifyContent="space-between" fontWeight="bold">
                              <Box>Subtotal</Box>
                              <Box>${eventItems.reduce((sum, item) => sum + parseFloat(item.share), 0).toFixed(2)}</Box>
                            </Flex>
                          </Box>
                        )}
                      </Box>
                    ))}
                    <Box borderTop="2px solid" borderColor="border.emphasized" mt={2} pt={2}>
                      <Flex justifyContent="space-between" fontWeight="bold" fontSize="md">
                        <Box>TOTAL</Box>
                        <Box>${total}</Box>
                      </Flex>
                    </Box>
                  </Box>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          );
        })}
        </Accordion.Root>

        <Button mt={4} onClick={onExport} disabled={!canExport} w="full">
          Export Totals
        </Button>
      </Box>
    </Box>
  );
}
