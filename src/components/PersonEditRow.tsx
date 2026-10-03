import { useRef, useState } from "react";
import { Flex, IconButton, Input } from "@chakra-ui/react";
import { LuTrash } from "react-icons/lu";

interface PersonEditRowProps {
  person: string;
  onRename: (newName: string) => void;
  onDelete: () => void;
}

// A person's name box in Totals' "Edit people" mode. Saves on Enter or leaving
// the box; Escape undoes.
export default function PersonEditRow({ person, onRename, onDelete }: PersonEditRowProps) {
  const [value, setValue] = useState(person);
  // Escape blurs the box too; this tells save() to skip it
  const cancelled = useRef(false);

  const save = () => {
    const name = value.trim();
    if (!cancelled.current && name && name !== person) onRename(name);
    cancelled.current = false;
    // If the rename went through this row remounts under the new name; if it
    // was refused (name taken), this puts the old name back
    setValue(person);
  };

  return (
    <Flex gap={2} alignItems="center">
      <Input
        size="sm"
        value={value}
        aria-label={`Name for ${person}`}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Escape") cancelled.current = true;
          if (e.key === "Enter" || e.key === "Escape") e.currentTarget.blur();
        }}
      />
      <IconButton aria-label={`Remove ${person}`} size="sm" variant="ghost" colorPalette="red" onClick={onDelete}>
        <LuTrash />
      </IconButton>
    </Flex>
  );
}
