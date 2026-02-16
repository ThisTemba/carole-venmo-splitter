import { Tag } from "@chakra-ui/react";

interface PersonTagProps {
  person: string;
  selected: boolean;
  editable?: boolean;
  onToggle?: () => void;
}

export default function PersonTag({
  person,
  selected,
  editable = false,
  onToggle,
}: PersonTagProps) {
  return (
    <Tag.Root
      size="lg"
      variant={selected ? "surface" : "outline"}
      colorPalette={selected ? "blue" : undefined}
      cursor={editable ? "pointer" : "default"}
      onClick={editable ? onToggle : undefined}
    >
      <Tag.Label>{person}</Tag.Label>
    </Tag.Root>
  );
}
