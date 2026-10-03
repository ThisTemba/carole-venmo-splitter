import type { ItemField, Receipt, ReceiptItem } from "../types";

export function canExport(people: string[], receipts: Receipt[]): boolean {
  if (people.length === 0) return false;
  if (receipts.length === 0) return false;

  const hasReceiptWithItem = receipts.some((receipt) => receipt.items.length > 0);
  if (!hasReceiptWithItem) return false;

  const hasItemWithPerson = receipts.some((receipt) =>
    receipt.items.some((item) => item.everyone || item.who.length > 0),
  );

  return hasItemWithPerson;
}

// A row with no name and no price; removed instead of warned about
export function isBlankItem(item: ReceiptItem): boolean {
  return !item.what.trim() && item.howMuch === 0;
}

// How each field is named in "Missing: ..." warnings
const FIELD_LABELS: Record<ItemField, string> = { what: "name", howMuch: "price", who: "person" };

export function getMissingFields(item: ReceiptItem): ItemField[] {
  const missing: ItemField[] = [];
  if (!item.what.trim()) missing.push("what");
  if (item.howMuch === 0) missing.push("howMuch");
  if (!item.everyone && item.who.length === 0) missing.push("who");
  return missing;
}

// e.g. "price, person"
export const describeMissing = (missing: ItemField[]) => missing.map((field) => FIELD_LABELS[field]).join(", ");

export interface IncompleteItem {
  receiptIndex: number;
  itemIndex: number;
  receipt: Receipt;
  item: ReceiptItem;
  missing: ItemField[];
}

// Items missing a name, price, or person, skipping the open row (it may still
// be in progress) and blank rows (they get removed when closed)
export function getIncompleteItems(
  receipts: Receipt[],
  open: { receipt: number; item: number } | null,
): IncompleteItem[] {
  return receipts.flatMap((receipt, r) =>
    receipt.items
      .map((item, i) => ({ receiptIndex: r, itemIndex: i, receipt, item, missing: getMissingFields(item) }))
      .filter(
        ({ item, itemIndex, missing }) =>
          missing.length > 0 && !isBlankItem(item) && !(open?.receipt === r && open.item === itemIndex),
      ),
  );
}
