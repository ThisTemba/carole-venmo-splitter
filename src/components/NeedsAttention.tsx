import { Alert, Box, List } from "@chakra-ui/react";
import { describeMissing, type IncompleteItem } from "../utils/validation";
import { plural } from "../utils/text";

interface NeedsAttentionProps {
  items: IncompleteItem[];
  onOpenItem: (item: IncompleteItem) => void;
}

// Incomplete items in Totals; clicking one opens it
export default function NeedsAttention({ items, onOpenItem }: NeedsAttentionProps) {
  if (items.length === 0) return null;
  return (
    <Alert.Root status="warning" mb={4} size="sm">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>
          {plural(items.length, "item")} need{items.length > 1 ? "" : "s"} attention
        </Alert.Title>
        <Alert.Description>
          <List.Root as="ul" gap={1} mt={1}>
            {items.map((incomplete) => (
              <List.Item key={`${incomplete.receiptIndex}-${incomplete.itemIndex}`} fontSize="xs">
                <Box
                  as="button"
                  textAlign="left"
                  textDecoration="underline"
                  cursor="pointer"
                  onClick={() => onOpenItem(incomplete)}
                >
                  {incomplete.receipt.name}: {incomplete.item.what || "Unnamed item"} (no{" "}
                  {describeMissing(incomplete.missing)})
                </Box>
              </List.Item>
            ))}
          </List.Root>
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}
