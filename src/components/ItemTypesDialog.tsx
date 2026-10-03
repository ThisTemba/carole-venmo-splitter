import { Box, Button, Stack, Table, Text } from '@chakra-ui/react'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
} from './ui/dialog'

interface ItemTypesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const exampleRows = [
  { label: 'Sushi platter ($40)', maya: '$40', omar: '—' },
  { label: 'Ramen ($10)', maya: '—', omar: '$10' },
  { label: '$10 tip as an item', maya: '$5', omar: '$5', muted: true },
  { label: '$10 tip as a tax, tip, or fee', maya: '$8', omar: '$2', bold: true },
]

function ItemTypesExplainer() {
  return (
    <Stack gap={4}>
      <Box>
        <Text mb={2}>
          Taxes, tips, and fees split differently from regular items. Say Maya and
          Omar go out for sushi. Maya gets a $40 platter, Omar gets a $10 bowl of
          ramen, and they leave a $10 tip. Here's how the tip splits each way:
        </Text>
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader />
              <Table.ColumnHeader textAlign="end">Maya</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Omar</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {exampleRows.map((row) => (
              <Table.Row
                key={row.label}
                color={row.muted ? 'fg.muted' : undefined}
                fontWeight={row.bold ? 'bold' : undefined}
              >
                <Table.Cell>{row.label}</Table.Cell>
                <Table.Cell textAlign="end">{row.maya}</Table.Cell>
                <Table.Cell textAlign="end">{row.omar}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <Text mt={2} fontSize="sm" color="fg.muted">
          Maya ordered 80% of the food, so Maya pays 80% of the tip.
        </Text>
      </Box>
      <Box>
        <Text fontWeight="bold">Item</Text>
        <Text>Something people ordered. Split evenly between everyone on it.</Text>
      </Box>
      <Box>
        <Text fontWeight="bold">Tax, tip, or fee</Text>
        <Text>
          A charge on top of the bill. Split by how much each person ordered, so a
          bigger order pays a bigger share. Listed under the subtotal.
        </Text>
      </Box>
    </Stack>
  )
}

export default function ItemTypesDialog({ open, onOpenChange }: ItemTypesDialogProps) {
  return (
    <DialogRoot open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Items vs. taxes, tips, and fees</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <ItemTypesExplainer />
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button onClick={() => onOpenChange(false)}>Got it</Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
