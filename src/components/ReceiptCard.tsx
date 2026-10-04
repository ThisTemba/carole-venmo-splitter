import { useState } from 'react'
import { LuChevronDown, LuChevronRight, LuCircleHelp, LuPlus } from 'react-icons/lu'
import type { ItemField, Receipt, ReceiptItem } from '../types'
import { getReceiptPeople, getReceiptTotal, getSubtotal } from '../utils/calculations'
import { money, plural } from '../utils/text'
import { isBlankItem } from '../utils/validation'
import ReceiptItemRow from './ReceiptItemRow'
import ReceiptName from './ReceiptName'
import ItemTypesDialog from './ItemTypesDialog'
import Slip from './ui/Slip'

interface ReceiptCardProps {
  receipt: Receipt
  people: string[]
  // Just added: start with the name box open
  isNew: boolean
  // Alternate receipts lean the other way on the desk
  tilt: number
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

// Lines up with item prices
function SumLine({ label, amount, total }: { label: string; amount: number; total?: boolean }) {
  return (
    <div className={`sum-line ${total ? 'sum-line--total' : ''}`}>
      <span>{label}</span>
      <span>{money(amount)}</span>
      <span />
    </div>
  )
}

export default function ReceiptCard({
  receipt,
  people,
  isNew,
  tilt,
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
  // Not counting the row being typed into
  const itemCount = receipt.items.filter((item) => !isBlankItem(item)).length
  const namedPeople = receipt.items.some((item) => item.who.length || item.everyone) ? receiptPeople.length : 0

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
    <Slip as="article" tilt={tilt} className={`receipt ${isNew ? 'feed' : ''}`} aria-label={receipt.name || 'New receipt'}>
      <header className="receipt__head">
        <button
          type="button"
          className="icon-btn"
          aria-label={receipt.collapsed ? 'Expand receipt' : 'Collapse receipt'}
          aria-expanded={!receipt.collapsed}
          onClick={onToggleCollapsed}
        >
          {receipt.collapsed ? <LuChevronRight aria-hidden /> : <LuChevronDown aria-hidden />}
        </button>
        <ReceiptName name={receipt.name} startEditing={isNew} onDone={handleNameDone} />
        <span />
      </header>

      {receipt.collapsed ? (
        <p className="receipt__summary">
          {plural(receipt.items.length, 'item')} · {money(getReceiptTotal(receipt))}
        </p>
      ) : (
        <>
          {itemCount > 0 && (
            <p className="receipt__meta">
              {plural(itemCount, 'item')}
              {namedPeople > 0 && ` · ${plural(namedPeople, 'person').replace('persons', 'people')}`}
            </p>
          )}
          <hr className="rule" />

          {regularItems.map(renderRow)}
          <div className="receipt__adds">
            <button type="button" className="print-btn" onClick={() => onAddItem(false)}>
              <LuPlus aria-hidden />
              Add item
            </button>
          </div>

          <hr className="rule" />
          {feeItems.length > 0 && <SumLine label="Subtotal" amount={getSubtotal(receipt)} />}
          {feeItems.map(renderRow)}
          <div className="receipt__adds">
            <button
              type="button"
              className="print-btn"
              onClick={() => onAddItem(true)}
              title="Split in proportion to what each person ordered"
            >
              <LuPlus aria-hidden />
              Add tax, tip, or fee
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="What's the difference?"
              onClick={() => setHelpOpen(true)}
            >
              <LuCircleHelp aria-hidden />
            </button>
          </div>

          <hr className="rule rule--double" />
          <SumLine label="Total" amount={getReceiptTotal(receipt)} total />
        </>
      )}

      <footer className={`receipt__foot ${receipt.collapsed ? 'receipt__foot--tight' : ''}`}>
        <button type="button" className="text-btn text-btn--danger" onClick={onDelete}>
          Delete receipt
        </button>
      </footer>
      <ItemTypesDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </Slip>
  )
}
