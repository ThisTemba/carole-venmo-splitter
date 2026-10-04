import { useState } from "react";
import { LuCheck, LuChevronDown, LuDownload } from "react-icons/lu";
import type { Receipt } from "../types";
import { getTotalForPerson, getItemsForPerson, getReceiptTotal } from "../utils/calculations";
import type { IncompleteItem } from "../utils/validation";
import { money, plural } from "../utils/text";
import { useConfirm } from "../hooks/useConfirm";
import NeedsAttention from "./NeedsAttention";
import PersonBreakdown from "./PersonBreakdown";
import PersonEditRow from "./PersonEditRow";
import Slip from "./ui/Slip";
import PersonTag from "./PersonTag";

interface TotalsSectionProps {
  people: string[];
  receipts: Receipt[];
  checkedPeople: string[];
  setCheckedPeople: (checked: string[]) => void;
  onRenamePerson: (oldName: string, newName: string) => void;
  onDeletePerson: (name: string) => void;
  incompleteItems: IncompleteItem[];
  onOpenItem: (item: IncompleteItem) => void;
  onExport: () => void;
  canExport: boolean;
}

interface TallyRowProps {
  person: string;
  total: string;
  items: ReturnType<typeof getItemsForPerson>;
  checked: boolean;
  onToggleChecked: () => void;
}

// NAME ........ $83.16, the name stamped in the person's ink; opens to their breakdown
function TallyRow({ person, total, items, checked, onToggleChecked }: TallyRowProps) {
  const [open, setOpen] = useState(false);
  return (
    <li className="tally__row">
      <input type="checkbox" className="check" checked={checked} aria-label={`Export ${person}`} onChange={onToggleChecked} />
      <button type="button" className="tally__toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="tally__name">
          <PersonTag person={person} />
        </span>
        <span className="tally__leader" aria-hidden />
        <span key={total} className="tally__amount reink">
          {money(parseFloat(total))}
        </span>
        <LuChevronDown className="tally__chev" aria-hidden />
      </button>
      {open && (
        <div className="tally__detail">
          <PersonBreakdown items={items} total={total} />
        </div>
      )}
    </li>
  );
}

export default function TotalsSection({
  people,
  receipts,
  checkedPeople,
  setCheckedPeople,
  onRenamePerson,
  onDeletePerson,
  incompleteItems,
  onOpenItem,
  onExport,
  canExport,
}: TotalsSectionProps) {
  const [editingPeople, setEditingPeople] = useState(false);
  const { confirm, dialog } = useConfirm();

  // Ticked people are the only ones exported; nobody ticked exports everyone
  const exportCount = checkedPeople.filter((p) => people.includes(p)).length || people.length;
  const toggleExport = (person: string) =>
    setCheckedPeople(
      checkedPeople.includes(person) ? checkedPeople.filter((p) => p !== person) : [...checkedPeople, person],
    );

  const totals = people.map((person) => ({
    person,
    total: getTotalForPerson(person, receipts, people),
    items: getItemsForPerson(person, receipts, people),
  }));
  const grandTotal = totals.reduce((sum, { total }) => sum + parseFloat(total), 0);
  // Everything on the receipts should end up on someone's total
  const receiptsTotal = receipts.reduce((sum, receipt) => sum + getReceiptTotal(receipt), 0);
  const unsplit = Math.round((receiptsTotal - grandTotal) * 100) / 100;

  const handleDeletePerson = (name: string) => {
    const count = receipts.flatMap((r) => r.items).filter((item) => item.who.includes(name)).length;
    confirm({
      title: "Remove person?",
      message: count ? `${name} will be removed from ${plural(count, "item")}.` : `${name} isn't on any items yet.`,
      confirmLabel: "Remove",
      onConfirm: () => onDeletePerson(name),
    });
  };

  const showTally = people.length > 0 && !editingPeople;

  return (
    <aside className="totals-col" aria-label="Totals">
      <Slip tilt={0.5} openBottom={showTally} slipClassName="totals-slip" className="totals-wrap">
        <div className={`totals-slip__scroll ${showTally ? "" : "totals-slip__scroll--closed"}`}>
          <div className="totals-slip__head">
            <span />
            <h2 className="print-heading">Totals</h2>
            {people.length > 0 ? (
              <button type="button" className="text-btn" onClick={() => setEditingPeople(!editingPeople)}>
                {editingPeople ? "Done" : "Edit people"}
              </button>
            ) : (
              <span />
            )}
          </div>
          <hr className="rule" />

          {people.length === 0 ? (
            <p className="empty-print">Add people to items on a receipt to see what everyone owes.</p>
          ) : editingPeople ? (
            <div className="edit-rows">
              {people.map((person) => (
                <PersonEditRow
                  key={person}
                  person={person}
                  onRename={(name) => onRenamePerson(person, name)}
                  onDelete={() => handleDeletePerson(person)}
                />
              ))}
            </div>
          ) : (
            <>
              <NeedsAttention items={incompleteItems} onOpenItem={onOpenItem} />
              <p className="totals-note">Tick to export only some people</p>
              <ul className="tally">
                {totals.map(({ person, total, items }) => (
                  <TallyRow
                    key={person}
                    person={person}
                    total={total}
                    items={items}
                    checked={checkedPeople.includes(person)}
                    onToggleChecked={() => toggleExport(person)}
                  />
                ))}
              </ul>

            </>
          )}
        </div>
        {/* Always in view above the envelope: the grand total, and proof it adds up */}
        {showTally && (
          <div className="totals-slip__foot">
            <hr className="rule rule--double" />
            <div className="everyone-line">
              <span>Everyone</span>
              <span key={grandTotal.toFixed(2)} className="reink">
                {money(grandTotal)}
              </span>
            </div>
            {unsplit === 0 ? (
              <p className="adds-up">
                <LuCheck aria-hidden />
                Matches the receipts
              </p>
            ) : (
              <p className="adds-up adds-up--off">{money(unsplit)} on the receipts isn't split yet</p>
            )}
          </div>
        )}
      </Slip>

      {showTally && (
        <div className="envelope">
          <p className="envelope__label">
            Who owes what
            <small>
              {plural(people.length, "person").replace("persons", "people")} · {money(grandTotal)}
            </small>
          </p>
          <button type="button" className="envelope__export" onClick={onExport} disabled={!canExport}>
            <LuDownload aria-hidden />
            Export totals{exportCount < people.length ? ` (${exportCount} of ${people.length})` : ""}
          </button>
        </div>
      )}

      {dialog}
    </aside>
  );
}
