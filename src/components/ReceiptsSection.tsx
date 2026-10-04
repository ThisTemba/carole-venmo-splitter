import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { tornOutline } from "../utils/tear";
import { LuPlus } from "react-icons/lu";
import type { Editing, Receipt, ReceiptItem } from "../types";
import { isBlankItem } from "../utils/validation";
import { afterPointerRelease } from "../utils/dom";
import { plural } from "../utils/text";
import { useConfirm } from "../hooks/useConfirm";
import ReceiptCard from "./ReceiptCard";

interface ReceiptsSectionProps {
  people: string[];
  onAddPerson: (name: string) => void;
  receipts: Receipt[];
  setReceipts: React.Dispatch<React.SetStateAction<Receipt[]>>;
  // The open item row; lives in App so Totals can open rows too
  editing: Editing | null;
  setEditing: React.Dispatch<React.SetStateAction<Editing | null>>;
}

const blankItem = (): ReceiptItem => ({ what: "", howMuch: 0, who: [] });

// "Add receipt": the outline of the next receipt, traced on the desk, with a torn
// bottom like the real ones
function AddReceipt({ onClick }: { onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const height = 108;

  return (
    <button ref={ref} type="button" className="blank-slip" onClick={onClick}>
      {width > 0 && (
        <svg className="blank-slip__outline" width={width} height={height + 12} aria-hidden>
          <path d={tornOutline(7, width - 2, height)} transform="translate(1 1)" />
        </svg>
      )}
      <LuPlus aria-hidden />
      Add receipt
    </button>
  );
}

export default function ReceiptsSection({
  people,
  onAddPerson,
  receipts,
  setReceipts,
  editing,
  setEditing,
}: ReceiptsSectionProps) {
  // The receipt just added, which opens with its name box ready. A fresh
  // desk starts with one, ready the same way.
  const [newReceipt, setNewReceipt] = useState<number | null>(() =>
    receipts.length === 1 && !receipts[0].name && receipts[0].items.length === 0 ? 0 : null,
  );
  // The receipt that's printing out of the desk's printer, just added
  const [printing, setPrinting] = useState<number | null>(null);
  const printTimer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(printTimer.current), []);
  const { confirm, dialog } = useConfirm();

  const updateReceipt = (r: number, fn: (receipt: Receipt) => Receipt) =>
    setReceipts((prev) => prev.map((receipt, i) => (i === r ? fn(receipt) : receipt)));

  const updateItem = (r: number, i: number, updated: ReceiptItem) =>
    updateReceipt(r, (receipt) => ({
      ...receipt,
      items: receipt.items.map((item, j) => (j === i ? updated : item)),
    }));

  const removeItem = (r: number, i: number) => {
    updateReceipt(r, (receipt) => ({ ...receipt, items: receipt.items.filter((_, j) => j !== i) }));
    // Keep the open row pointing at the same item
    setEditing((cur) => {
      if (!cur || cur.receipt !== r || cur.item < i) return cur;
      return cur.item === i ? null : { ...cur, item: cur.item - 1 };
    });
  };

  // Set for a moment while Add receipt is clicked. Clicking it takes focus
  // from a new receipt's name box first, and that receipt is then kept, not
  // removed as untouched: adding two in a row means wanting two.
  const adding = useRef(false);

  // Opens with the name box ready to type into; Enter then starts the first item
  const handleAddReceipt = () => {
    adding.current = true;
    // After a name box left for this click has had its say (see afterPointerRelease)
    window.setTimeout(() => (adding.current = false), 0);
    setReceipts((prev) => [...prev, { name: "", items: [] }]);
    setNewReceipt(receipts.length);
    setPrinting(receipts.length);
    window.clearTimeout(printTimer.current);
    printTimer.current = window.setTimeout(() => setPrinting(null), 900);
    setEditing(null);
  };

  // A new receipt left unnamed is removed if it's empty, otherwise given a name
  const handleAbandonReceipt = (r: number) =>
    afterPointerRelease(() => {
      const forAnother = adding.current;
      setReceipts((prev) => {
        const receipt = prev[r];
        if (!receipt || receipt.name) return prev;
        // Left for another new receipt: keep it, still unnamed
        if (forAnother && receipt.items.length === 0) return prev;
        // Untouched: nothing to keep
        if (receipt.items.length === 0) return prev.filter((_, i) => i !== r);
        // Leaving the name for its first line (clicking Add item): keep it,
        // still unnamed. A line left blank removes itself.
        if (receipt.items.every(isBlankItem)) return prev;
        return prev.map((x, i) => (i === r ? { ...x, name: "Untitled receipt" } : x));
      });
      // Only if it's still this one: Add receipt may have moved on to the next
      setNewReceipt((cur) => (cur === r ? null : cur));
    });

  const handleAddItem = (r: number, proportional: boolean) => {
    const receipt = receipts[r];
    // Taxes, tips, and fees start as everyone on the receipt
    const item = proportional ? { ...blankItem(), proportional, everyone: true } : blankItem();
    updateReceipt(r, (receipt) => ({ ...receipt, items: [...receipt.items, item] }));
    setEditing({ receipt: r, item: receipt.items.length, field: "what" });
  };

  const handleLeaveItem = (r: number, i: number) => {
    const blank = isBlankItem(receipts[r].items[i]);
    afterPointerRelease(() => {
      // The click may have opened another row; only close this one
      setEditing((cur) => (cur?.receipt === r && cur.item === i ? null : cur));
      if (blank) removeItem(r, i);
    });
  };

  // Tab or Enter at the end of a row moves on to the next row of the same
  // kind, like a spreadsheet; from the last one, it starts a new row
  const handleNextItem = (r: number, i: number) => {
    const items = receipts[r].items;
    const item = items[i];
    const next = items.findIndex((other, j) => j > i && !!other.proportional === !!item.proportional);
    if (next !== -1) setEditing({ receipt: r, item: next, field: "what" });
    else if (!isBlankItem(item)) handleAddItem(r, !!item.proportional);
  };

  // Puts one group's items in a new order. They keep the places in the list
  // they had between them, so the other group's items don't move.
  const handleReorderItems = (r: number, order: number[]) => {
    const places = [...order].sort((a, b) => a - b);
    updateReceipt(r, (receipt) => {
      const items = [...receipt.items];
      places.forEach((place, k) => (items[place] = receipt.items[order[k]]));
      return { ...receipt, items };
    });
    // The open row's index would now point at a different item
    setEditing((cur) => (cur?.receipt === r ? null : cur));
  };

  // Swaps a line with its neighbour in the same group (items, or taxes,
  // tips, and fees)
  const handleMoveItem = (r: number, i: number, direction: -1 | 1) => {
    const items = receipts[r].items;
    const kind = !!items[i].proportional;
    const same = items.map((item, j) => (!!item.proportional === kind ? j : -1)).filter((j) => j !== -1);
    const k = same.indexOf(i) + direction;
    if (k < 0 || k >= same.length) return;
    const order = [...same];
    [order[k], order[k - direction]] = [order[k - direction], order[k]];
    handleReorderItems(r, order);
  };

  const handleToggleCollapsed = (r: number) => {
    updateReceipt(r, (receipt) => ({ ...receipt, collapsed: !receipt.collapsed || undefined }));
    setEditing((cur) => (cur?.receipt === r ? null : cur));
  };

  const handleDeleteReceipt = (r: number) => {
    const { name, items } = receipts[r];
    confirm({
      title: "Delete receipt?",
      message: `${name ? `"${name}"` : "This receipt"} and its ${plural(items.length, "item")} will be deleted. This can't be undone.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        setReceipts((prev) => prev.filter((_, j) => j !== r));
        setEditing(null);
      },
    });
  };

  // Blank rows go without asking
  const handleDeleteItem = (r: number, i: number) => {
    const item = receipts[r].items[i];
    if (isBlankItem(item)) return removeItem(r, i);
    confirm({
      title: "Delete item?",
      message: `"${item.what.trim() || "This item"}" will be removed from "${receipts[r].name}".`,
      confirmLabel: "Delete",
      onConfirm: () => removeItem(r, i),
    });
  };

  return (
    <section className="receipts" aria-labelledby="receipts-heading">
      <h2 id="receipts-heading" className="visually-hidden">
        Receipts
      </h2>
      {receipts.map((receipt, r) => (
        <ReceiptCard
          key={r}
          receipt={receipt}
          people={people}
          isNew={newReceipt === r}
          printing={printing === r}
          tilt={r % 2 ? 0.45 : -0.35}
          onAddPerson={onAddPerson}
          editing={editing?.receipt === r ? { item: editing.item, field: editing.field } : null}
          onRename={(name) => updateReceipt(r, (receipt) => ({ ...receipt, name }))}
          onAbandon={() => handleAbandonReceipt(r)}
          onDelete={() => handleDeleteReceipt(r)}
          onToggleCollapsed={() => handleToggleCollapsed(r)}
          onStartEdit={(i, field) => setEditing({ receipt: r, item: i, field })}
          onLeaveItem={(i) => handleLeaveItem(r, i)}
          onUpdateItem={(i, updated) => updateItem(r, i, updated)}
          onAddItem={(proportional) => handleAddItem(r, proportional)}
          onNextItem={(i) => handleNextItem(r, i)}
          onDeleteItem={(i) => handleDeleteItem(r, i)}
          onMoveItem={(i, direction) => handleMoveItem(r, i, direction)}
          onReorderItems={(order) => handleReorderItems(r, order)}
        />
      ))}

      <AddReceipt onClick={handleAddReceipt} />

      {dialog}
    </section>
  );
}
