import { useRef, useEffect } from "react";
import { Box, IconButton, Grid, Flex, Input } from "@chakra-ui/react";
import { LuTrash } from "react-icons/lu";
import type { EventItem } from "../types";
import PersonTag from "./PersonTag";

interface EventItemRowProps {
  index: number;
  item: EventItem;
  people: string[];
  editing: boolean;
  focusField: "what" | "howMuch" | null;
  onChange: (item: EventItem) => void;
  onStartEdit: (field: "what" | "howMuch") => void;
  onSave: () => void;
  onDelete: () => void;
}

export default function EventItemRow({
  index,
  item,
  people,
  editing,
  focusField,
  onChange,
  onStartEdit,
  onSave,
  onDelete,
}: EventItemRowProps) {
  const whatInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && focusField === "what" && whatInputRef.current) {
      whatInputRef.current.focus();
    } else if (editing && focusField === "howMuch" && priceInputRef.current) {
      priceInputRef.current.focus();
    }
  }, [editing, focusField]);

  // Check what's missing
  const missingName = !item.what.trim();
  const missingPrice = item.howMuch === 0;
  const missingPerson = item.who.length === 0;
  const isIncomplete = missingName || missingPrice || missingPerson;

  const warningMessage = () => {
    const missing = [];
    if (missingName) missing.push("item name");
    if (missingPrice) missing.push("price");
    if (missingPerson) missing.push("person");
    return `⚠ Missing: ${missing.join(", ")}`;
  };

  const handleTogglePerson = (person: string) => {
    const isAssigned = item.who.includes(person);
    if (isAssigned) {
      onChange({ ...item, who: item.who.filter((p) => p !== person) });
    } else {
      onChange({ ...item, who: [...item.who, person] });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      onSave();
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!editing) return;
    // Check if the new focus target is outside this row
    const currentTarget = e.currentTarget;

    // Use setTimeout to ensure the relatedTarget is properly set
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        onSave();
      }
    }, 0);
  };

  return (
    <Box>
      {isIncomplete && (
        <Box fontSize="xs" color="orange.600" mb={1} fontWeight="medium">
          {warningMessage()}
        </Box>
      )}
      <Grid
        templateColumns="2fr 1fr 3fr auto"
        gap={4}
        alignItems="center"
        py={2}
        px={2}
        borderRadius="md"
        bg={isIncomplete ? "orange.50" : undefined}
        _hover={{ bg: isIncomplete ? "orange.100" : "bg.muted" }}
        onBlur={handleBlur}
      >
        {editing ? (
          <Input
            ref={whatInputRef}
            value={item.what}
            onChange={(e) => onChange({ ...item, what: e.target.value })}
            onKeyDown={handleKeyDown}
            size="sm"
          />
        ) : (
          <Box cursor="pointer" onClick={() => onStartEdit("what")}>
            {index + 1}. {item.what || "(no item name)"}
          </Box>
        )}

        {editing ? (
          <Input
            ref={priceInputRef}
            type="number"
            value={item.howMuch || ""}
            onChange={(e) =>
              onChange({ ...item, howMuch: parseFloat(e.target.value) || 0 })
            }
            onKeyDown={handleKeyDown}
            size="sm"
          />
        ) : (
          <Box cursor="pointer" onClick={() => onStartEdit("howMuch")}>
            ${item.howMuch.toFixed(2)}
          </Box>
        )}

        <Flex
          gap={2}
          flexWrap="wrap"
          minH="32px"
          alignItems="center"
          onMouseDown={(e) => editing && e.preventDefault()}
          onClick={() => {
            if (!editing) {
              onStartEdit("what");
            }
          }}
          cursor={!editing ? "pointer" : "default"}
          tabIndex={editing ? 0 : undefined}
        >
          {editing
            ? people.map((person) => (
                <PersonTag
                  key={person}
                  person={person}
                  selected={item.who.includes(person)}
                  editable={true}
                  onToggle={() => handleTogglePerson(person)}
                />
              ))
            : people
                .filter((person) => item.who.includes(person))
                .map((person) => (
                  <PersonTag key={person} person={person} selected={true} />
                ))}
        </Flex>

        <IconButton
          aria-label="Delete item"
          size="sm"
          variant="ghost"
          colorPalette="red"
          onClick={onDelete}
        >
          <LuTrash />
        </IconButton>
      </Grid>
    </Box>
  );
}
