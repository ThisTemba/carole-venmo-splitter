import { useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { usePeopleActions } from "./hooks/usePeopleActions";
import type { Editing, Receipt } from "./types";
import { canExport, getIncompleteItems, type IncompleteItem } from "./utils/validation";
import { exportTotals } from "./utils/fileExport";
import ActionButtons from "./components/ActionButtons";
import ReceiptsSection from "./components/ReceiptsSection";
import TotalsSection from "./components/TotalsSection";
import HowItWorks from "./components/HowItWorks";
import { Toaster } from "./components/ui/toaster";
import { PeopleInkContext } from "./utils/ink";

function App() {
  const [people, setPeople] = useLocalStorage<string[]>("people", []);
  const [receipts, setReceipts] = useLocalStorage<Receipt[]>("receipts", [], "events");
  const [checkedPeople, setCheckedPeople] = useLocalStorage<string[]>("cp", []);
  // The open item row; here so Totals can open rows too
  const [editing, setEditing] = useState<Editing | null>(null);
  const { addPerson, renamePerson, deletePerson } = usePeopleActions(
    people,
    setPeople,
    setReceipts,
    setCheckedPeople,
  );
  const incompleteItems = getIncompleteItems(receipts, editing);

  // From Totals' "needs attention" list: open the row at the first missing field
  const handleOpenItem = ({ receiptIndex: r, itemIndex: i, missing }: IncompleteItem) => {
    setReceipts((prev) => prev.map((receipt, j) => (j === r ? { ...receipt, collapsed: undefined } : receipt)));
    setEditing({ receipt: r, item: i, field: missing[0] });
  };

  return (
    <PeopleInkContext.Provider value={people}>
      <div className="page">
        <header className="desk-head">
          <h1 className="tape">Carole Venmo Splitter</h1>
          <ActionButtons
            people={people}
            receipts={receipts}
            checkedPeople={checkedPeople}
            setPeople={setPeople}
            setReceipts={setReceipts}
            setCheckedPeople={setCheckedPeople}
          />
        </header>

        <main className="layout">
          <ReceiptsSection
            people={people}
            onAddPerson={addPerson}
            receipts={receipts}
            setReceipts={setReceipts}
            editing={editing}
            setEditing={setEditing}
          />
          {/* Stays in view while scrolling long receipts */}
          <TotalsSection
            people={people}
            receipts={receipts}
            checkedPeople={checkedPeople}
            setCheckedPeople={setCheckedPeople}
            onRenamePerson={renamePerson}
            onDeletePerson={deletePerson}
            incompleteItems={incompleteItems}
            onOpenItem={handleOpenItem}
            onExport={() => exportTotals(people, receipts, checkedPeople)}
            canExport={canExport(people, receipts)}
          />
        </main>

        <HowItWorks />
      </div>
      <Toaster />
    </PeopleInkContext.Provider>
  );
}

export default App;
