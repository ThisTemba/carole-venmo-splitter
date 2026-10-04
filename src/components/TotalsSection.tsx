import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  LuCheck,
  LuChevronDown,
  LuCopy,
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
// the name, and the space up to the amount, opens what they had underneath; ⋯ copies the amount or their
// breakdown as an invoice image, renames, or removes them.
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

  // What they had takes whole lines of the paper, rounded up, so the rows
  // below it stay written on lines
  const detailRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const detail = detailRef.current;
    const content = detail?.firstElementChild;
    if (!detail || !content) return;
    const fit = () => {
      const rule = parseFloat(getComputedStyle(detail).getPropertyValue("--rule")) || 32;
      // Its bottom, and a little room under it
      const needed = content.getBoundingClientRect().bottom - detail.getBoundingClientRect().top + 8;
      detail.style.height = `${Math.ceil(needed / rule) * rule}px`;
    };
    const observer = new ResizeObserver(fit);
    observer.observe(content);
    return () => observer.disconnect();
  }, [open]);

  const copyAmount = async () => {
    if (await copyText(total)) showFlash("amount");
  };

  const copyInvoice = async () => {
    setMaking(true);
    const result = await copyImage(person, items, total);
    setMaking(false);
    if (result === "copied") showFlash("image");
  };

  return (
    <li className="summary__item" data-person={person}>
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
          onClick={copyAmount}
        >
          {flash && (
            <span className="summary__copied" aria-hidden>
              {flash === "image" ? "Image copied" : "Copied"}
            </span>
          )}
          {amount}
        </button>
        <Menu
          label={`More for ${person}`}
          className="summary__more"
          triggerClassName="summary__more-btn"
          icon={making ? <LuLoaderCircle className="spin" aria-hidden /> : undefined}
          items={[
            { label: "Copy amount", icon: <LuCopy aria-hidden />, onSelect: copyAmount },
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
        <div ref={detailRef} className="summary__detail">
          {items.length ? (
            <PersonBreakdown
              person={person}
              items={items}
              footer={
                <button
                  type="button"
                  className="print-btn"
                  onClick={copyInvoice}
                  disabled={making}
                >
                  {making ? <LuLoaderCircle className="spin" aria-hidden /> : <LuImage aria-hidden />}
                  {flash === "image" ? "Image copied" : "Copy as image"}
                </button>
              }
            />
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
      // The note's lines start where its list of people does
      const list = el.querySelector<HTMLElement>(".owes__summary > .summary");
      list?.parentElement?.style.setProperty("--lines-top", `${list.offsetTop}px`);
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
  // When someone's total moves them up or down the list, the rows slide to
  // their new places rather than jumping. Where each row sat is kept up to
  // date as the list changes size (a breakdown opening), so the slide starts
  // from where it was actually seen.
  const listRef = useRef<HTMLOListElement>(null);
  const rowTops = useRef(new Map<string, number>());
  const rowOrder = totals.map(({ person }) => person).join("\n");
  const shownOrder = useRef(rowOrder);
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const rows = [...list.children] as HTMLElement[];
    const measure = () => new Map(rows.map((row) => [row.dataset.person ?? "", row.offsetTop]));
    const before = rowTops.current;
    const after = measure();
    rowTops.current = after;
    const reordered = shownOrder.current !== rowOrder;
    shownOrder.current = rowOrder;
    if (reordered && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const moves = rows
        .map((row) => ({ row, by: (before.get(row.dataset.person ?? "") ?? NaN) - (after.get(row.dataset.person ?? "") ?? NaN) }))
        .filter(({ by }) => by)
        // The one going furthest passes over the rest
        .sort((a, b) => Math.abs(a.by) - Math.abs(b.by));
      moves.forEach(({ row, by }, i) => {
        row.classList.add("summary__item--moving");
        row.style.zIndex = String(i + 1);
        row
          .animate([{ translate: `0 ${by}px` }, { translate: "0 0" }], {
            duration: 560,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          })
          .finished.catch(() => {})
          .finally(() => {
            row.classList.remove("summary__item--moving");
            row.style.zIndex = "";
          });
      });
    }
    const observer = new ResizeObserver(() => (rowTops.current = measure()));
    observer.observe(list);
    return () => observer.disconnect();
  }, [rowOrder]);

  const grandTotal = totals.reduce(
    (sum, { total }) => sum + parseFloat(total),
    0,
  );
  // Everything on the receipts should end up on someone's total
  const receiptsTotal = receipts.reduce(
    (sum, receipt) => sum + getReceiptTotal(receipt),
    0,
  );
  // Only once an item's been left with nobody on it, not while it's still
  // being filled in (the same items Needs attention lists)
  const unsplit = incompleteItems.some(({ missing }) => missing.includes("who"))
    ? Math.round((receiptsTotal - grandTotal) * 100) / 100
    : 0;

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
      {people.length === 0 ? (
        <header className="owes__head">
          <h2 className="owes__title">Who owes what</h2>
          <p className="owes__empty">
            Add people to items on a receipt to see what everyone owes.
          </p>
        </header>
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
            <header className="note-head">
              <h2 className="print-heading">Who owes what</h2>
              <p className="note-head__sum">
                {plural(people.length, "person").replace("persons", "people")}
                {unsplit !== 0 && (
                  <>
                    {" · "}
                    <span className="note-head__off">
                      {money(unsplit)} on the receipts isn't split yet
                    </span>
                  </>
                )}
              </p>
            </header>
            {/* Penned on the note, pointing down at the first amount */}
            <p className="copy-hint">
              <span>
                <span className="copy-hint__click">click</span>
                <span className="copy-hint__tap">tap</span> to copy
              </span>
              <svg className="copy-hint__arrow" viewBox="0 0 28 30" aria-hidden>
                <path d="M2 6c10-3 19 1 21 16" />
                <path d="M17 17l6 7 3-9" />
              </svg>
            </p>
            <ol ref={listRef} className="summary">
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
              {/* Ruled off by hand */}
              <svg className="summary__rule" viewBox="0 0 300 6" preserveAspectRatio="none" aria-hidden>
                <path d="M1 3.6C60 2.4 118 2.2 170 2.9s92 1.4 128 .3" />
              </svg>
              <span>Total</span>
              <span className="summary__grand">
                {money(grandTotal)}
                {/* Underlined in pen, like the note above the amounts */}
                <svg className="summary__pen" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 6.5C22 4 48 3.2 70 4.2s22 1.6 27 .8" />
                  <path d="M10 8.6C34 7 62 6.8 90 7.6" />
                </svg>
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
