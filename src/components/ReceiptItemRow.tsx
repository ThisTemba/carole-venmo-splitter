import { useRef, useEffect, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import type { ItemField, ReceiptItem } from "../types";
import { describeMissing, getMissingFields, isBlankItem } from "../utils/validation";
import { EVERYONE } from "../utils/people";
import { blurActive } from "../utils/dom";
import { money } from "../utils/text";
import PersonTag from "./PersonTag";
import PeopleInput from "./PeopleInput";

interface ReceiptItemRowProps {
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
}

export default function ReceiptItemRow({
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
}: ReceiptItemRowProps) {
  const whatInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const whoInputRef = useRef<HTMLInputElement>(null);
  // A line just added feeds out of the printer
  const [isNew] = useState(() => editing && isBlankItem(item));

  const focus = (field: ItemField) => {
    const refs = { what: whatInputRef, howMuch: priceInputRef, who: whoInputRef };
    refs[field].current?.focus();
  };

  useEffect(() => {
    if (editing) focus(focusField ?? "what");
  }, [editing, focusField]);

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

  return (
    <div
      className={`line ${isNew ? "feed" : ""}`}
      data-editing={editing}
      data-warn={showWarning}
      onBlur={handleBlur}
    >
      {showWarning && <div className="line__warn">** Missing: {describeMissing(missing)} **</div>}
      <div className="line__main">
        {editing ? (
          <input
            ref={whatInputRef}
            className="field"
            value={item.what}
            aria-label="What was it"
            placeholder={item.proportional ? "Tax, tip, or fee" : "What was it?"}
            onChange={(e) => onChange({ ...item, what: e.target.value })}
            onKeyDown={handleKeyDown("howMuch")}
          />
        ) : (
          <div className="line__what" onClick={() => onStartEdit("what")}>
            <span className={`line__what-text ${item.what ? "" : "line__what--empty"}`}>
              {item.what || "(no item name)"}
            </span>
          </div>
        )}

        {editing ? (
          <input
            ref={priceInputRef}
            className="field field--price"
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

        <button type="button" className="icon-btn icon-btn--danger line__del" aria-label="Delete item" onClick={onDelete}>
          <LuTrash2 aria-hidden />
        </button>
      </div>

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
        <div className="line__who" onClick={() => onStartEdit("who")}>
          {item.everyone ? (
            <span title={receiptPeople.join(", ")}>
              <PersonTag person={EVERYONE} />
            </span>
          ) : item.who.length ? (
            people
              .filter((person) => item.who.includes(person))
              .map((person) => <PersonTag key={person} person={person} />)
          ) : (
            <span className="line__who-empty">Who had it?</span>
          )}
        </div>
      )}
    </div>
  );
}
