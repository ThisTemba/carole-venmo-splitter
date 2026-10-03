import { useState } from 'react'
import { Box, Button, Stack, Flex, IconButton, Grid } from '@chakra-ui/react'
import { LuChevronDown, LuChevronRight, LuCircleHelp, LuPlus } from 'react-icons/lu'
import type { ItemField, Receipt, ReceiptItem } from '../types'
import { getReceiptPeople, getReceiptTotal, getSubtotal } from '../utils/calculations'
import { plural } from '../utils/text'
import ReceiptItemRow, { ROW_COLUMNS } from './ReceiptItemRow'
import ReceiptName from './ReceiptName'
import ItemTypesDialog from './ItemTypesDialog'

interface ReceiptCardProps {
  receipt: Receipt
  people: string[]
  // Just added: start with the name box open
  isNew: boolean
  onAddPerson: (name: string) => void
  editing: { item: number; field: ItemField } | null
  onRename: (name: string) => void
  // A new receipt was left without a name
  onAbandon: () => void
  onDelete: () => void
  onToggleCollapsed: () => void
  onStartEdit: (item: number, field: ItemField) => void
  onLeaveItem: (item: number) => void
  onUpdateItem: (item: number, updated: ReceiptItem) => void
  onAddItem: (proportional: boolean) => void
  onNextItem: (item: number) => void
  onDeleteItem: (item: number) => void
}

function TotalLine({ label, amount, bold }: { label: string; amount: number; bold?: boolean }) {
  return (
    <Grid templateColumns={ROW_COLUMNS} gap={4} px={2} py={2} fontWeight={bold ? 'bold' : 'medium'}>
      <Box>{label}</Box>
      <Box textAlign="right" fontVariantNumeric="tabular-nums">
        ${amount.toFixed(2)}
      </Box>
    </Grid>
  )
}

export default function ReceiptCard({
  receipt,
  people,
  isNew,
  onAddPerson,
  editing,
  onRename,
  onAbandon,
  onDelete,
  onToggleCollapsed,
  onStartEdit,
  onLeaveItem,
  onUpdateItem,
  onAddItem,
  onNextItem,
  onDeleteItem,
}: ReceiptCardProps) {
  const [helpOpen, setHelpOpen] = useState(false)

  const handleNameDone = (name: string, viaEnter: boolean) => {
    if (!name) {
      if (!receipt.name) onAbandon()
      return
    }
    if (name !== receipt.name) onRename(name)
    // Enter on a new receipt's name moves on to its first item
    if (viaEnter && receipt.items.length === 0) onAddItem(false)
  }

  // Keep each item's index into receipt.items, since rows are grouped by type
  const indexed = receipt.items.map((item, idx) => ({ item, idx }))
  const regularItems = indexed.filter(({ item }) => !item.proportional)
  const feeItems = indexed.filter(({ item }) => item.proportional)

  const receiptPeople = getReceiptPeople(receipt, people)

  const renderRow = ({ item, idx }: { item: ReceiptItem; idx: number }) => (
    <ReceiptItemRow
      key={idx}
      item={item}
      people={people}
      receiptPeople={receiptPeople}
      onAddPerson={onAddPerson}
      editing={editing?.item === idx}
      focusField={editing?.item === idx ? editing.field : null}
      onChange={(updated) => onUpdateItem(idx, updated)}
      onStartEdit={(field) => onStartEdit(idx, field)}
      onLeave={() => onLeaveItem(idx)}
      onNext={() => onNextItem(idx)}
      onDelete={() => onDeleteItem(idx)}
    />
  )

  return (
    <Box borderWidth={1} borderRadius="md" p={4}>
      <Flex alignItems="center" gap={2} mb={receipt.collapsed ? 0 : 2}>
        <IconButton
          aria-label={receipt.collapsed ? 'Expand receipt' : 'Collapse receipt'}
          aria-expanded={!receipt.collapsed}
          size="sm"
          variant="ghost"
          ml={-2}
          onClick={onToggleCollapsed}
        >
          {receipt.collapsed ? <LuChevronRight /> : <LuChevronDown />}
        </IconButton>
        <ReceiptName name={receipt.name} startEditing={isNew} onDone={handleNameDone} />
        {receipt.collapsed && (
          <Box color="fg.muted" fontSize="sm" whiteSpace="nowrap">
            {plural(receipt.items.length, 'item')} · ${getReceiptTotal(receipt).toFixed(2)}
          </Box>
        )}
        <Box flex="1" />
        <Button size="sm" variant="ghost" colorPalette="red" onClick={onDelete} flexShrink={0}>
          Delete receipt
        </Button>
      </Flex>

      {!receipt.collapsed && (
        <>
          <Stack gap={0}>{regularItems.map(renderRow)}</Stack>
          <Box mt={2} mb={3}>
            <Button size="sm" variant="outline" onClick={() => onAddItem(false)}>
              <LuPlus />
              Add item
            </Button>
          </Box>

          <Box borderTop="1px dashed" borderColor="border.emphasized" pt={1}>
            {feeItems.length > 0 && <TotalLine label="Subtotal" amount={getSubtotal(receipt)} />}
            <Stack gap={0}>{feeItems.map(renderRow)}</Stack>
            <Flex gap={2} alignItems="center" mt={2} mb={3}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddItem(true)}
                title="Split in proportion to what each person ordered"
              >
                <LuPlus />
                Add tax, tip, or fee
              </Button>
              <IconButton
                aria-label="What's the difference?"
                size="sm"
                variant="ghost"
                color="fg.muted"
                onClick={() => setHelpOpen(true)}
              >
                <LuCircleHelp />
              </IconButton>
            </Flex>
          </Box>

          <Box borderTop="2px solid" borderColor="border.emphasized">
            <TotalLine label="Total" amount={getReceiptTotal(receipt)} bold />
          </Box>
        </>
      )}
      <ItemTypesDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </Box>
  )
}
