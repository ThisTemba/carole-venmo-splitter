import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { usePeopleActions } from "./hooks/usePeopleActions";
import type { Editing, Receipt } from "./types";
import { canExport, getIncompleteItems, type IncompleteItem } from "./utils/validation";
import { saveRecord } from "./utils/record";
import ActionButtons from "./components/ActionButtons";
import ReceiptsSection from "./components/ReceiptsSection";
import TotalsSection from "./components/TotalsSection";
import HowItWorks from "./components/HowItWorks";
import TitleNote from "./components/TitleNote";
import { Toaster } from "./components/ui/toaster";

const blankReceipt = (): Receipt => ({ name: "", items: [] });

function App() {
  const [people, setPeople] = useLocalStorage<string[]>("people", []);
  // The open item row; here so Totals can open rows too
  const [editing, setEditing] = useState<Editing | null>(null);
  const [receipts, setStoredReceipts] = useLocalStorage<Receipt[]>("receipts", [blankReceipt()], "events");
  // Never a bare desk: clearing or deleting the last receipt leaves a fresh one
  const setReceipts = useCallback<React.Dispatch<React.SetStateAction<Receipt[]>>>(
    (next) =>
      setStoredReceipts((prev) => {
        const updated = typeof next === "function" ? next(prev) : next;
        return updated.length ? updated : [blankReceipt()];
      }),
    [setStoredReceipts],
  );
  // Bumped when the whole desk is replaced (clear, load, example), so the
  // receipts start over, with a blank one's name box ready
  const [desk, setDesk] = useState(0);
  const replaceReceipts = (next: Receipt[]) => {
    setReceipts(next);
    setEditing(null);
    setDesk((d) => d + 1);
  };
  const { addPerson, renamePerson, deletePerson } = usePeopleActions(
    people,
    setPeople,
    setReceipts,
  );
  const incompleteItems = getIncompleteItems(receipts, editing);

  // Typing hides hover highlights, so a row under a resting pointer doesn't
  // light up beside the one being typed in. Moving the mouse brings them back.
  useEffect(() => {
    const root = document.documentElement;
    const onKey = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey) root.dataset.typing = "";
    };
    const onMove = () => delete root.dataset.typing;
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointermove", onMove);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointermove", onMove);
    };
  }, []);

  // From Totals' "needs attention" list: open the row at the first missing field
  const handleOpenItem = ({ receiptIndex: r, itemIndex: i, missing }: IncompleteItem) => {
    setReceipts((prev) => prev.map((receipt, j) => (j === r ? { ...receipt, collapsed: undefined } : receipt)));
    setEditing({ receipt: r, item: i, field: missing[0] });
  };

  return (
    <>
      <div className="page">
        <header className="desk-head">
          <TitleNote />
          <ActionButtons
            people={people}
            receipts={receipts}
            setPeople={setPeople}
            setReceipts={replaceReceipts}
          />
        </header>

        <main className="layout">
          <ReceiptsSection
            key={desk}
            people={people}
            onAddPerson={addPerson}
            receipts={receipts}
            setReceipts={setReceipts}
            editing={editing}
            setEditing={setEditing}
          />
          {/* Under the receipts: each person's slip, ready to send */}
          <TotalsSection
            people={people}
            receipts={receipts}
            onRenamePerson={renamePerson}
            onDeletePerson={deletePerson}
            incompleteItems={incompleteItems}
            onOpenItem={handleOpenItem}
            onSaveRecord={() => saveRecord(people, receipts)}
            canSaveRecord={canExport(people, receipts)}
          />
        </main>

        <HowItWorks />
      </div>
      <Toaster />
    </>
  );
}

export default App;
