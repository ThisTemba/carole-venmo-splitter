import { useState } from "react";
import { Box, Heading, Grid, Container } from "@chakra-ui/react";
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
    <>
      <Box minH="100vh" bg="gray.50">
        <Container maxW="1200px" py={8}>
          <Box p={6} mb={6} borderRadius="md" bg="bg" borderWidth={1}>
            <Heading textAlign="center" size="3xl" mb={4}>
              Carole Venmo Splitter
            </Heading>
            <ActionButtons
              people={people}
              receipts={receipts}
              checkedPeople={checkedPeople}
              setPeople={setPeople}
              setReceipts={setReceipts}
              setCheckedPeople={setCheckedPeople}
            />
          </Box>

          <Grid
            templateColumns={{ base: "1fr", lg: "minmax(0, 1fr) 360px" }}
            gap={6}
            alignItems="start"
          >
            <ReceiptsSection
              people={people}
              onAddPerson={addPerson}
              receipts={receipts}
              setReceipts={setReceipts}
              editing={editing}
              setEditing={setEditing}
            />
            {/* Stays in view while scrolling long receipts */}
            <Box position={{ lg: "sticky" }} top={6}>
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
            </Box>
          </Grid>

          <HowItWorks />
        </Container>
      </Box>
      <Toaster />
    </>
  );
}

export default App;
