import { useRef, useEffect } from "react";
import { LuGripVertical, LuTrash2 } from "react-icons/lu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ItemField, ReceiptItem } from "../types";
import { describeMissing, getMissingFields, isBlankItem } from "../utils/validation";
import { EVERYONE } from "../utils/people";
import { blurActive } from "../utils/dom";
import { money } from "../utils/text";
import PeopleInput from "./PeopleInput";

interface ReceiptItemRowProps {
  // Its id in the receipt's list of lines, for dragging
  sortId: string;
  item: ReceiptItem;
  people: string[];
  // Who "Everyone on this receipt" currently means
  receiptPeople: string[];
  editing: boolean;
  focusField: ItemField | null;
  onChange: (item: ReceiptItem) => void;
  onAddPerson: (name: string) => void;
  onStartEdit: (field: ItemField) => void;
  // Focus left the row
  onLeave: () => void;
  // Done with the people box (Enter with nothing typed, or Tab)
  onNext: () => void;
  onDelete: () => void;
  // Swap with the line above (-1) or below (1) in its group
  onMove: (direction: -1 | 1) => void;
}

export default function ReceiptItemRow({
  sortId,
  item,
  people,
  receiptPeople,
  editing,
  focusField,
  onChange,
  onAddPerson,
  onStartEdit,
  onLeave,
  onNext,
  onDelete,
  onMove,
}: ReceiptItemRowProps) {
  const whatInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const whoInputRef = useRef<HTMLInputElement>(null);
  const whatRef = useRef<HTMLDivElement>(null);
  const { listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: sortId,
  });

  const focus = (field: ItemField) => {
    const refs = { what: whatInputRef, howMuch: priceInputRef, who: whoInputRef };
    refs[field].current?.focus();
  };

  // Opened from the keyboard, the name comes up selected, so typing replaces
  // it; opened with a click, it's left as is to fix a letter
  const clicked = useRef(false);
  useEffect(() => {
    if (!editing) return;
    const field = focusField ?? "what";
    focus(field);
    if (field === "what" && !clicked.current) whatInputRef.current?.select();
    clicked.current = false;
  }, [editing, focusField]);

  // Closing the row with Escape leaves focus nowhere; put it back on the
  // row, so tabbing carries on from here
  const escaped = useRef(false);
  useEffect(() => {
    if (!editing && escaped.current) {
      escaped.current = false;
      if (document.activeElement === document.body) whatRef.current?.focus();
    }
  }, [editing]);

  // Alt+↑/↓ on a line moves it, and focus goes with it to its new spot
  const handleMoveKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const direction = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0;
    if (!e.altKey || !direction) return;
    e.preventDefault();
    const line = e.currentTarget.closest(".line");
    const target = direction < 0 ? line?.previousElementSibling : line?.nextElementSibling;
    if (!target) return;
    onMove(direction);
    requestAnimationFrame(() => target.querySelector<HTMLElement>(".line__what")?.focus());
  };

  // Only warn once the row has been left incomplete; blank rows get removed instead
  const missing = getMissingFields(item);
  const showWarning = !editing && !isBlankItem(item) && missing.length > 0;

  // Enter moves name → price → people; Escape closes the row
  const handleKeyDown = (next: ItemField) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      focus(next);
    } else if (e.key === "Escape") {
      blurActive();
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (editing && !e.currentTarget.contains(e.relatedTarget as Node | null)) onLeave();
  };

  // Item and price read left to right like a receipt line, then who had it
  return (
    <div
      ref={setNodeRef}
      className="line"
      style={{ transform: CSS.Translate.toString(transform), transition }}
      data-editing={editing}
      data-warn={showWarning}
      data-dragging={isDragging}
      onBlur={handleBlur}
      onKeyDownCapture={(e) => {
        if (e.key === "Escape") escaped.current = true;
      }}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        className="line__grip"
        {...listeners}
        // Mouse and touch only; from the keyboard, Alt+↑/↓ on the line moves it
        tabIndex={-1}
        aria-hidden
      >
        <LuGripVertical aria-hidden />
      </button>
      {showWarning && <div className="line__warn">** Missing: {describeMissing(missing)} **</div>}
      <div className="line__main">
        {editing ? (
          <input
            ref={whatInputRef}
            className="field line__what-field"
            value={item.what}
            aria-label="What was it"
            placeholder={item.proportional ? "Tax, tip, or fee" : "What was it?"}
            onChange={(e) => onChange({ ...item, what: e.target.value })}
            onKeyDown={handleKeyDown("howMuch")}
          />
        ) : (
          // One tab stop per row: Enter or Space opens it for editing
          <div
            ref={whatRef}
            className="line__what"
            role="button"
            tabIndex={0}
            aria-label={`Edit ${item.what.trim() || "this item"}`}
            onClick={() => {
              clicked.current = true;
              onStartEdit("what");
            }}
            aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onStartEdit("what");
              } else handleMoveKey(e);
            }}
          >
            <span className={`line__what-text ${item.what ? "" : "line__what--empty"}`}>
              {item.what || "(no item name)"}
            </span>
          </div>
        )}

        {editing ? (
          <input
            ref={priceInputRef}
            className="field field--price line__price-field"
            type="number"
            inputMode="decimal"
            step="0.01"
            aria-label="How much"
            placeholder="0.00"
            value={item.howMuch || ""}
            onChange={(e) => onChange({ ...item, howMuch: parseFloat(e.target.value) || 0 })}
            onKeyDown={handleKeyDown("who")}
          />
        ) : (
          <div className="line__price" onClick={() => onStartEdit("howMuch")}>
            {money(item.howMuch)}
          </div>
        )}

        {editing ? (
          <div className="line__who line__who--edit">
            <PeopleInput
              people={people}
              who={item.who}
              everyone={!!item.everyone}
              onChange={(who, everyone) => onChange({ ...item, who, everyone: everyone || undefined })}
              onAddPerson={onAddPerson}
              // A blank row has nothing to move on from, so just close it
              onNext={() => (isBlankItem(item) ? blurActive() : onNext())}
              onEscape={blurActive}
              inputRef={whoInputRef}
            />
          </div>
        ) : (
          // Plain names, easy to check against the receipt
          <div className="line__who" onClick={() => onStartEdit("who")}>
            {item.everyone ? (
              <span className="line__names line__names--everyone" title={receiptPeople.join(", ")}>
                {EVERYONE}
              </span>
            ) : item.who.length ? (
              <span className="line__names">
                {people.filter((person) => item.who.includes(person)).join(", ")}
              </span>
            ) : (
              <span className="line__who-empty">Who had it?</span>
            )}
          </div>
        )}

        <button type="button" className="icon-btn icon-btn--danger line__del" aria-label="Delete item" onClick={onDelete}>
          <LuTrash2 aria-hidden />
        </button>
      </div>
    </div>
  );
}
