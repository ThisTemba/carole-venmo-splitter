import { Tag } from "@chakra-ui/react";

interface PersonTagProps {
  person: string;
  onRemove?: () => void;
}

export default function PersonTag({ person, onRemove }: PersonTagProps) {
  return (
    <Tag.Root size="lg" variant="surface" colorPalette="blue">
      <Tag.Label>{person}</Tag.Label>
      {onRemove && (
        <Tag.EndElement>
          <Tag.CloseTrigger
            aria-label={`Remove ${person}`}
            // Mouse only: Tab goes straight to the text box, where Backspace removes
            tabIndex={-1}
            // Keep focus in the people box so the row stays open
            onMouseDown={(e) => e.preventDefault()}
            onClick={onRemove}
          />
        </Tag.EndElement>
      )}
    </Tag.Root>
  );
}
