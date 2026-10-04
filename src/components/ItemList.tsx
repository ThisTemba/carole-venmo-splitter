import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import type { ReceiptItem } from "../types";

export interface IndexedItem {
  item: ReceiptItem;
  // Where the item sits in receipt.items
  idx: number;
}

interface ItemListProps {
  entries: IndexedItem[];
  // sortId: the row's id for dragging, passed to its useSortable
  renderRow: (entry: IndexedItem, sortId: string) => React.ReactNode;
  // The same items' indexes, in their new order
  onReorder: (order: number[]) => void;
}

// One group of a receipt's lines (items, or taxes, tips, and fees), reordered
// by dragging a line's handle, or from the keyboard: Space on the handle picks
// the line up, the arrow keys move it, and Space drops it
export default function ItemList({ entries, renderRow, onReorder }: ItemListProps) {
  const sensors = useSensors(
    // A small movement first, so a click on the handle isn't a drag
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );
  const ids = entries.map(({ idx }) => `item-${idx}`);

  const name = (id: UniqueIdentifier) => {
    const entry = entries[ids.indexOf(String(id))];
    return entry?.item.what.trim() || "this line";
  };
  const position = (id: UniqueIdentifier | undefined) => `${ids.indexOf(String(id)) + 1} of ${ids.length}`;
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${name(active.id)}, line ${position(active.id)}.`,
    onDragOver: ({ active, over }) => (over ? `${name(active.id)} moved to line ${position(over.id)}.` : undefined),
    onDragEnd: ({ active, over }) => (over ? `${name(active.id)} dropped at line ${position(over.id)}.` : undefined),
    onDragCancel: ({ active }) => `Moving ${name(active.id)} cancelled.`,
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const order = entries.map(({ idx }) => idx);
    onReorder(arrayMove(order, ids.indexOf(String(active.id)), ids.indexOf(String(over.id))));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      // Lines reach past their list on both sides, so only the axis is locked
      modifiers={[restrictToVerticalAxis]}
      accessibility={{
        announcements,
        screenReaderInstructions: {
          draggable: "To move a line, press Alt and the up or down arrow key on it.",
        },
      }}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="receipt__lines">{entries.map((entry, k) => renderRow(entry, ids[k]))}</div>
      </SortableContext>
    </DndContext>
  );
}
