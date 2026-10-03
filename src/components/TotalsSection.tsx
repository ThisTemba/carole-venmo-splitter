import { useState } from "react";
import { Box, Heading, Stack, Flex, Checkbox, Button, Accordion } from "@chakra-ui/react";
import type { Receipt } from "../types";
import { getTotalForPerson, getItemsForPerson } from "../utils/calculations";
import type { IncompleteItem } from "../utils/validation";
import { plural } from "../utils/text";
import { useConfirm } from "../hooks/useConfirm";
import NeedsAttention from "./NeedsAttention";
import PersonBreakdown from "./PersonBreakdown";
import PersonEditRow from "./PersonEditRow";

interface TotalsSectionProps {
  people: string[];
  receipts: Receipt[];
  checkedPeople: string[];
  setCheckedPeople: (checked: string[]) => void;
  onRenamePerson: (oldName: string, newName: string) => void;
  onDeletePerson: (name: string) => void;
  incompleteItems: IncompleteItem[];
  onOpenItem: (item: IncompleteItem) => void;
  onExport: () => void;
  canExport: boolean;
}

export default function TotalsSection({
  people,
  receipts,
  checkedPeople,
  setCheckedPeople,
  onRenamePerson,
  onDeletePerson,
  incompleteItems,
  onOpenItem,
  onExport,
  canExport,
}: TotalsSectionProps) {
  const [editingPeople, setEditingPeople] = useState(false);
  const { confirm, dialog } = useConfirm();

  // Ticked people are the only ones exported; nobody ticked exports everyone
  const exportCount = checkedPeople.filter((p) => people.includes(p)).length || people.length;
  const toggleExport = (person: string) =>
    setCheckedPeople(
      checkedPeople.includes(person) ? checkedPeople.filter((p) => p !== person) : [...checkedPeople, person],
    );

  const totals = people.map((person) => ({
    person,
    total: getTotalForPerson(person, receipts, people),
    items: getItemsForPerson(person, receipts, people),
  }));
  const grandTotal = totals.reduce((sum, { total }) => sum + parseFloat(total), 0);

  const handleDeletePerson = (name: string) => {
    const count = receipts.flatMap((r) => r.items).filter((item) => item.who.includes(name)).length;
    confirm({
      title: "Remove person?",
      message: count ? `${name} will be removed from ${plural(count, "item")}.` : `${name} isn't on any items yet.`,
      confirmLabel: "Remove",
      onConfirm: () => onDeletePerson(name),
    });
  };

  return (
    <Box borderWidth={1} borderRadius="md" p={6} bg="bg">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">Totals</Heading>
        {people.length > 0 && (
          <Button size="sm" variant={editingPeople ? "solid" : "ghost"} onClick={() => setEditingPeople(!editingPeople)}>
            {editingPeople ? "Done" : "Edit people"}
          </Button>
        )}
      </Flex>

      {people.length === 0 ? (
        <Box color="fg.muted">Add people to items on a receipt to see what everyone owes.</Box>
      ) : editingPeople ? (
        <Stack gap={2}>
          {people.map((person) => (
            <PersonEditRow
              key={person}
              person={person}
              onRename={(name) => onRenamePerson(person, name)}
              onDelete={() => handleDeletePerson(person)}
            />
          ))}
        </Stack>
      ) : (
        <>
          <NeedsAttention items={incompleteItems} onOpenItem={onOpenItem} />

          <Box fontSize="xs" color="fg.muted" mb={1}>
            Tick to export only some people
          </Box>
          <Accordion.Root collapsible multiple>
            {totals.map(({ person, total, items }) => (
              <Accordion.Item key={person} value={person}>
                <Accordion.ItemTrigger>
                  <Flex alignItems="center" gap={2} flex="1">
                    <Checkbox.Root
                      checked={checkedPeople.includes(person)}
                      aria-label={`Export ${person}`}
                      onCheckedChange={() => toggleExport(person)}
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
                    <PersonBreakdown items={items} total={total} />
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>

          <Flex justifyContent="space-between" fontWeight="bold" pt={3} pr={7}>
            <Box>Everyone</Box>
            <Box fontVariantNumeric="tabular-nums">${grandTotal.toFixed(2)}</Box>
          </Flex>

          <Button mt={4} onClick={onExport} disabled={!canExport} w="full">
            Export totals{exportCount < people.length ? ` (${exportCount} of ${people.length})` : ""}
          </Button>
        </>
      )}

      {dialog}
    </Box>
  );
}
