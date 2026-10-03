import { useRef, useEffect } from "react";
import { Box, IconButton, Grid, Flex, Input } from "@chakra-ui/react";
import { LuTrash } from "react-icons/lu";
import type { ItemField, ReceiptItem } from "../types";
import { describeMissing, getMissingFields, isBlankItem } from "../utils/validation";
import { EVERYONE } from "../utils/people";
import { blurActive } from "../utils/dom";
import PersonTag from "./PersonTag";
import PeopleInput from "./PeopleInput";

// Shared with the subtotal and total lines so their amounts line up with prices
export const ROW_COLUMNS = "2fr 1fr 3fr 36px"; // last column fits the delete button

interface ReceiptItemRowProps {
  item: ReceiptItem;
  people: string[];
  // Who "Everyone on this receipt" currently means
  receiptPeople: string[];
  editing: boolean;
  focusField: ItemField | null;
  onChange: (item: ReceiptItem) => void;
  onAddPerson: (name: string) => void;
  onStartEdit: (field: ItemField) => void;
  // Focus left the row
  onLeave: () => void;
  // Done with the people box (Enter with nothing typed, or Tab)
  onNext: () => void;
  onDelete: () => void;
}

export default function ReceiptItemRow({
  item,
  people,
  receiptPeople,
  editing,
  focusField,
  onChange,
  onAddPerson,
  onStartEdit,
  onLeave,
  onNext,
  onDelete,
}: ReceiptItemRowProps) {
  const whatInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const whoInputRef = useRef<HTMLInputElement>(null);

  const focus = (field: ItemField) => {
    const refs = { what: whatInputRef, howMuch: priceInputRef, who: whoInputRef };
    refs[field].current?.focus();
  };

  useEffect(() => {
    if (editing) focus(focusField ?? "what");
  }, [editing, focusField]);

  // Only warn once the row has been left incomplete; blank rows get removed instead
  const missing = getMissingFields(item);
  const showWarning = !editing && !isBlankItem(item) && missing.length > 0;

  // Enter moves name → price → people; Escape closes the row
  const handleKeyDown = (next: ItemField) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      focus(next);
    } else if (e.key === "Escape") {
      blurActive();
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (editing && !e.currentTarget.contains(e.relatedTarget as Node | null)) onLeave();
  };

  return (
    <Box>
      {showWarning && (
        <Box fontSize="xs" color="orange.600" mb={1} fontWeight="medium">
          ⚠ Missing: {describeMissing(missing)}
        </Box>
      )}
      <Grid
        templateColumns={ROW_COLUMNS}
        gap={4}
        alignItems="center"
        py={2}
        px={2}
        borderRadius="md"
        bg={showWarning ? "orange.50" : undefined}
        _hover={{ bg: showWarning ? "orange.100" : "bg.muted" }}
        onBlur={handleBlur}
      >
        {editing ? (
          <Input
            ref={whatInputRef}
            value={item.what}
            placeholder={item.proportional ? "Tax, tip, or fee" : "What was it?"}
            onChange={(e) => onChange({ ...item, what: e.target.value })}
            onKeyDown={handleKeyDown("howMuch")}
            size="sm"
          />
        ) : (
          <Box cursor="pointer" onClick={() => onStartEdit("what")}>
            {item.what || "(no item name)"}
          </Box>
        )}

        {editing ? (
          <Input
            ref={priceInputRef}
            type="number"
            placeholder="0.00"
            textAlign="right"
            value={item.howMuch || ""}
            onChange={(e) =>
              onChange({ ...item, howMuch: parseFloat(e.target.value) || 0 })
            }
            onKeyDown={handleKeyDown("who")}
            size="sm"
          />
        ) : (
          <Box
            cursor="pointer"
            onClick={() => onStartEdit("howMuch")}
            textAlign="right"
            fontVariantNumeric="tabular-nums"
          >
            ${item.howMuch.toFixed(2)}
          </Box>
        )}

        {editing ? (
          <PeopleInput
            people={people}
            who={item.who}
            everyone={!!item.everyone}
            onChange={(who, everyone) => onChange({ ...item, who, everyone: everyone || undefined })}
            onAddPerson={onAddPerson}
            // A blank row has nothing to move on from, so just close it
            onNext={() => (isBlankItem(item) ? blurActive() : onNext())}
            onEscape={blurActive}
            inputRef={whoInputRef}
          />
        ) : (
          <Flex
            gap={2}
            flexWrap="wrap"
            minH="32px"
            alignItems="center"
            cursor="pointer"
            onClick={() => onStartEdit("who")}
          >
            {item.everyone ? (
              <Box title={receiptPeople.join(", ")}>
                <PersonTag person={EVERYONE} />
              </Box>
            ) : (
              people
                .filter((person) => item.who.includes(person))
                .map((person) => <PersonTag key={person} person={person} />)
            )}
          </Flex>
        )}

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
