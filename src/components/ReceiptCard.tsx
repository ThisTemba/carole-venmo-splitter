import { useState } from 'react'
import { LuChevronDown, LuCircleHelp, LuPlus } from 'react-icons/lu'
import type { ItemField, Receipt, ReceiptItem } from '../types'
import { getReceiptPeople, getReceiptTotal, getSubtotal } from '../utils/calculations'
import { money, plural } from '../utils/text'
import { isBlankItem } from '../utils/validation'
import ReceiptItemRow from './ReceiptItemRow'
import ItemList, { type IndexedItem } from './ItemList'
import ReceiptName from './ReceiptName'
import ItemTypesDialog from './ItemTypesDialog'
import Slip from './ui/Slip'

interface ReceiptCardProps {
  receipt: Receipt
  people: string[]
  // Just added: start with the name box open
  isNew: boolean
  // Just added: it feeds out like a printed receipt
  printing?: boolean
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
  onMoveItem: (item: number, direction: -1 | 1) => void
  // Items (by index) in a new order, after dragging one
  onReorderItems: (order: number[]) => void
}

// Lines up with item prices
function SumLine({ label, amount, total }: { label: string; amount: number; total?: boolean }) {
  return (
    <div className={`sum-line ${total ? 'sum-line--total' : 'sum-line--sub'}`}>
      <span>{label}</span>
      <span>{money(amount)}</span>
    </div>
  )
}

// The next line, waiting to be printed: a faint "+ Add item ..... $0.00"
// in the receipt's own columns. The whole line is the button.
function AddLine({ label, onClick, title, children }: { label: string; onClick: () => void; title?: string; children?: React.ReactNode }) {
  return (
    <div className="add-line">
      <span className="add-line__what">
        <button type="button" className="add-line__btn" onClick={onClick} title={title}>
          <LuPlus aria-hidden />
          {label}
        </button>
        {children}
      </span>
      <span className="add-line__price" aria-hidden>
        {money(0)}
      </span>
    </div>
  )
}

// "Teresa, Barnard & Eda"
const listNames = (names: string[]) =>
  names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`

export default function ReceiptCard({
  receipt,
  people,
  isNew,
  printing,
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
  onMoveItem,
  onReorderItems,
}: ReceiptCardProps) {
  const [helpOpen, setHelpOpen] = useState(false)
  // Clip the items only while folded or folding, so the people suggestions
  // can spill over when open
  const collapsed = !!receipt.collapsed
  const [folding, setFolding] = useState(false)
  const [wasCollapsed, setWasCollapsed] = useState(collapsed)
  if (collapsed !== wasCollapsed) {
    setWasCollapsed(collapsed)
    setFolding(true)
  }

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

  const renderRow = ({ item, idx }: IndexedItem, sortId: string) => (
    <ReceiptItemRow
      key={idx}
      sortId={sortId}
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
      onMove={(direction) => onMoveItem(idx, direction)}
    />
  )

  return (
    <Slip as="article" tilt={tilt} className={`receipt ${printing ? 'receipt--printing' : ''}`} aria-label={receipt.name || 'New receipt'}>
      <header className="receipt__head">
        <button
          type="button"
          className="icon-btn receipt__fold"
          aria-label={collapsed ? 'Expand receipt' : 'Collapse receipt'}
          aria-expanded={!collapsed}
          onClick={onToggleCollapsed}
        >
          <LuChevronDown aria-hidden />
        </button>
        <ReceiptName name={receipt.name} startEditing={isNew} onDone={handleNameDone} />
        <span />
      </header>

      {itemCount > 0 && (
        <p className="receipt__meta">
          {plural(itemCount, 'item')}
          {namedPeople > 0 && ` · ${plural(namedPeople, 'person').replace('persons', 'people')}`}
        </p>
      )}

      {/* Folding hides only the items; the name, counts, and total stay put */}
      <div
        className={`receipt__body ${collapsed || folding ? 'receipt__body--clip' : ''}`}
        data-collapsed={collapsed}
        inert={collapsed}
        onTransitionEnd={(e) => e.target === e.currentTarget && setFolding(false)}
      >
        <div className="receipt__body-inner">
          <hr className="rule" />

          <ItemList entries={regularItems} renderRow={renderRow} onReorder={onReorderItems} />
          <AddLine label="Add item" onClick={() => onAddItem(false)} />

          <hr className="rule" />
          {feeItems.length > 0 && <SumLine label="Subtotal" amount={getSubtotal(receipt)} />}
          <ItemList entries={feeItems} renderRow={renderRow} onReorder={onReorderItems} />
          <AddLine
            label="Add tax, tip, or fee"
            onClick={() => onAddItem(true)}
            title="Split in proportion to what each person ordered"
          >
            <button
              type="button"
              className="icon-btn add-line__help"
              aria-label="What's the difference?"
              onClick={() => setHelpOpen(true)}
            >
              <LuCircleHelp aria-hidden />
            </button>
          </AddLine>
        </div>
      </div>

      {/* Folded, the notepad strip keeps who was on it */}
      {namedPeople > 0 && (
        <p className="receipt__who" data-shown={collapsed} aria-hidden={!collapsed} title={receiptPeople.join(', ')}>
          {listNames(receiptPeople)}
        </p>
      )}

      <hr className="rule rule--double" />
      <SumLine label="Total" amount={getReceiptTotal(receipt)} total />

      <footer className="receipt__foot">
        <button type="button" className="text-btn text-btn--danger" onClick={onDelete}>
          Delete receipt
        </button>
      </footer>
      <ItemTypesDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </Slip>
  )
}
