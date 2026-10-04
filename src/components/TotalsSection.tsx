import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  LuCheck,
  LuChevronDown,
  LuFileDown,
  LuImage,
  LuLoaderCircle,
  LuPencil,
  LuTrash2,
} from "react-icons/lu";
import type { Receipt } from "../types";
import {
  getItemsByPerson,
  sumItems,
  type PersonItem,
  getReceiptTotal,
} from "../utils/calculations";
import type { IncompleteItem } from "../utils/validation";
import { money, plural } from "../utils/text";
import { useConfirm } from "../hooks/useConfirm";
import { copyImage, copyText } from "../utils/share";
import NeedsAttention from "./NeedsAttention";
import PersonBreakdown from "./PersonBreakdown";
import PersonName from "./PersonName";
import Menu from "./ui/Menu";
import Slip from "./ui/Slip";

interface TotalsSectionProps {
  people: string[];
  receipts: Receipt[];
  onRenamePerson: (oldName: string, newName: string) => void;
  onDeletePerson: (name: string) => void;
  incompleteItems: IncompleteItem[];
  onOpenItem: (item: IncompleteItem) => void;
  onSaveRecord: () => Promise<void>;
  canSaveRecord: boolean;
}

// A word that stands in for a moment after something's copied
function useFlash(): [string | null, (what: string) => void] {
  const [flash, setFlash] = useState<string | null>(null);
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const show = (what: string) => {
    setFlash(what);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFlash(null), 1600);
  };
  return [flash, show];
}

interface PersonLineProps {
  person: string;
  total: string;
  items: PersonItem[];
  onRename: (name: string) => void;
  onDelete: () => void;
}

// ⌄ Name   $83.16 [⋯], one line of the slip. The amount copies for Venmo;
// the name, and the space up to the amount, opens what they had underneath; ⋯ copies their breakdown as an
// invoice image, renames, or removes them.
function PersonLine({
  person,
  total,
  items,
  onRename,
  onDelete,
}: PersonLineProps) {
  const [open, setOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [flash, showFlash] = useFlash();
  const [making, setMaking] = useState(false);
  const amount = money(parseFloat(total));

  const copyInvoice = async () => {
    setMaking(true);
    const result = await copyImage(person, items, total);
    setMaking(false);
    if (result === "copied") showFlash("image");
  };

  return (
    <li className="summary__item">
      <div className="summary__line">
        {renaming ? (
          <PersonName
            person={person}
            onRename={onRename}
            onDone={() => setRenaming(false)}
          />
        ) : (
          <button
            type="button"
            className="summary__name"
            aria-expanded={open}
            title={person}
            onClick={() => setOpen(!open)}
          >
            <LuChevronDown className="summary__chev" aria-hidden />
            <span className="summary__name-text">{person}</span>
          </button>
        )}
        <button
          type="button"
          className="summary__amount"
          aria-label={`Copy ${person}'s amount, ${amount}`}
          title="Copy amount"
          onClick={async () => {
            if (await copyText(total)) showFlash("amount");
          }}
        >
          {flash && (
            <span className="summary__copied" aria-hidden>
              {flash === "image" ? "Image copied" : "Copied"}
            </span>
          )}
          <span key={total} className="reink">
            {amount}
          </span>
        </button>
        <Menu
          label={`More for ${person}`}
          className="summary__more"
          triggerClassName="summary__more-btn"
          icon={making ? <LuLoaderCircle className="spin" aria-hidden /> : undefined}
          items={[
            {
              label: "Copy as image",
              icon: <LuImage aria-hidden />,
              onSelect: copyInvoice,
              disabled: making || !items.length,
            },
            { label: "Rename", icon: <LuPencil aria-hidden />, onSelect: () => setRenaming(true) },
            { label: "Remove", icon: <LuTrash2 aria-hidden />, onSelect: onDelete, danger: true },
          ]}
        />
        {/* Tells screen readers when something's been copied */}
        <span className="visually-hidden" role="status">
          {flash && "Copied"}
        </span>
      </div>
      {open && (
        <div className="summary__detail">
          {items.length ? (
            <PersonBreakdown items={items} />
          ) : (
            <p className="empty-print">Not on any items yet.</p>
          )}
        </div>
      )}
    </li>
  );
}

// The note drops into the envelope: a small lift, then down until only its
// top edge shows in the thumb notch (anything lower is hidden behind the
// kraft), and the envelope gives a little as it lands. `out` waits a
// beat, then slides it back up.
const NOTCH = 22;
function fileAway(note: HTMLElement, envelope: HTMLElement) {
  const height = note.offsetHeight;
  const mouth = envelope.getBoundingClientRect().top - note.getBoundingClientRect().top + NOTCH;
  // Everything below the mouth stays hidden, wherever the note has got to
  const at = (y: number) => ({
    transform: `translateY(${y}px)`,
    clipPath: `inset(-40px -40px ${Math.max(0, height - mouth + y)}px -40px)`,
  });
  // Resting with its top edge just inside, showing in the notch
  const fall = mouth - NOTCH + 7;
  const dropIn = note.animate(
    [
      { ...at(0), easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
      { ...at(-12), offset: 0.22, easing: "cubic-bezier(0.55, 0, 0.8, 0.2)" },
      at(fall),
    ],
    { duration: 300 + Math.min(fall, 700) * 0.45, fill: "forwards" },
  );
  const landed = dropIn.finished.then(
    () =>
      envelope.animate(
        [{ transform: "none" }, { transform: "translateY(5px)", offset: 0.3 }, { transform: "none" }],
        { duration: 320, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
      ).finished,
  );
  return {
    in: landed,
    out: async () => {
      await landed.catch(() => {});
      // A beat inside, so it reads as filed away
      await new Promise((resolve) => window.setTimeout(resolve, 380));
      const back = note.animate([at(fall), at(0)], {
        duration: 260 + Math.min(fall, 700) * 0.5,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      });
      dropIn.cancel();
      await back.finished;
    },
  };
}

// Who owes what, under the receipts: a note with everyone on it, most owed
// first, then the envelope with the payer's PDF record
export default function TotalsSection({
  people,
  receipts,
  onRenamePerson,
  onDeletePerson,
  incompleteItems,
  onOpenItem,
  onSaveRecord,
  canSaveRecord,
}: TotalsSectionProps) {
  const { confirm, dialog } = useConfirm();

  // Pinned 28px from the top of the window; when it's taller than the
  // window, pinned by its bottom instead, so none of it is ever out of reach
  const sectionRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const place = () => {
      const top = Math.min(28, window.innerHeight - el.offsetHeight - 28);
      el.style.setProperty("--owes-top", `${top}px`);
    };
    const observer = new ResizeObserver(place);
    observer.observe(el);
    window.addEventListener("resize", place);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
    };
  }, []);

  // Saving the record: the note drops into the envelope, the PDF is made,
  // then the note slides back out
  const envelopeRef = useRef<HTMLDivElement>(null);
  const [record, setRecord] = useState<"idle" | "saving" | "saved">("idle");
  const savedTimer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(savedTimer.current), []);
  const handleSaveRecord = async () => {
    setRecord("saving");
    window.clearTimeout(savedTimer.current);
    const note = sectionRef.current?.querySelector(".owes__summary")?.closest<HTMLElement>(".slip-wrap");
    const envelope = envelopeRef.current;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sink = note && envelope && !still ? fileAway(note, envelope) : null;
    let saved = false;
    try {
      await sink?.in;
      await onSaveRecord();
      saved = true;
    } finally {
      await sink?.out();
      setRecord(saved ? "saved" : "idle");
      if (saved) savedTimer.current = window.setTimeout(() => setRecord("idle"), 2400);
    }
  };

  // Who owes the most first; ties keep the People list's order. Worked out
  // once per change to the receipts or people, not on every render.
  const totals = useMemo(() => {
    const byPerson = getItemsByPerson(receipts, people);
    return people
      .map((person) => {
        const items = byPerson.get(person) ?? [];
        return { person, total: sumItems(items), items };
      })
      .sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
  }, [receipts, people]);
  const grandTotal = totals.reduce(
    (sum, { total }) => sum + parseFloat(total),
    0,
  );
  // Everything on the receipts should end up on someone's total
  const receiptsTotal = receipts.reduce(
    (sum, receipt) => sum + getReceiptTotal(receipt),
    0,
  );
  const unsplit = Math.round((receiptsTotal - grandTotal) * 100) / 100;

  const handleDeletePerson = (name: string) => {
    const count = receipts
      .flatMap((r) => r.items)
      .filter((item) => item.who.includes(name)).length;
    confirm({
      title: "Remove person?",
      message: count
        ? `${name} will be removed from ${plural(count, "item")}.`
        : `${name} isn't on any items yet.`,
      confirmLabel: "Remove",
      onConfirm: () => onDeletePerson(name),
    });
  };

  return (
    <section ref={sectionRef} className="owes" aria-label="Who owes what">
      <header className="owes__head">
        <h2 className="owes__title">Who owes what</h2>
        {people.length > 0 && (
          <p className="owes__sum">
            {plural(people.length, "person").replace("persons", "people")}
            {unsplit !== 0 && (
              <>
                {" · "}
                <span className="owes__off">
                  {money(unsplit)} on the receipts isn't split yet
                </span>
              </>
            )}
          </p>
        )}
      </header>

      {people.length === 0 ? (
        <p className="owes__empty">
          Add people to items on a receipt to see what everyone owes.
        </p>
      ) : (
        <>
          {incompleteItems.length > 0 && (
            <Slip slipClassName="owes__attention">
              <NeedsAttention items={incompleteItems} onOpenItem={onOpenItem} />
            </Slip>
          )}
          {/* Everyone on one slip */}
          <Slip
            openBottom
            slipClassName="owes__summary slip--note"
            aria-label="Summary"
          >
            <ol className="summary">
              {totals.map(({ person, total, items }) => (
                <PersonLine
                  key={person}
                  person={person}
                  total={total}
                  items={items}
                  onRename={(name) => onRenamePerson(person, name)}
                  onDelete={() => handleDeletePerson(person)}
                />
              ))}
            </ol>
            <p className="summary__total">
              <span>Total</span>
              <span key={grandTotal.toFixed(2)} className="reink">
                {money(grandTotal)}
              </span>
            </p>
          </Slip>

          {/* A record for the payer: every receipt, then who owes what */}
          <div ref={envelopeRef} className="envelope">
            <p className="envelope__label">
              For your records
              <small>
                {canSaveRecord
                  ? "Who owes what, every receipt, and what each person had"
                  : "Put someone on an item to save a record"}
              </small>
            </p>
            <button
              type="button"
              className="envelope__export"
              onClick={handleSaveRecord}
              disabled={!canSaveRecord || record === "saving"}
            >
              {record === "saved" ? <LuCheck aria-hidden /> : <LuFileDown aria-hidden />}
              {record === "saving" ? "Saving…" : record === "saved" ? "PDF downloaded" : "Save PDF record"}
            </button>
            <span className="visually-hidden" role="status">
              {record === "saved" && "PDF record downloaded"}
            </span>
          </div>
        </>
      )}

      {dialog}
    </section>
  );
}
