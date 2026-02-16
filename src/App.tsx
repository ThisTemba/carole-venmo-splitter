import { Box, Heading, Grid, Container } from "@chakra-ui/react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Event } from "./types";
import { canExport } from "./utils/validation";
import { exportTotals } from "./utils/fileExport";
import ActionButtons from "./components/ActionButtons";
import PeopleSection from "./components/PeopleSection";
import EventsSection from "./components/EventsSection";
import TotalsSection from "./components/TotalsSection";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [people, setPeople] = useLocalStorage<string[]>("people", []);
  const [events, setEvents] = useLocalStorage<Event[]>("events", []);
  const [checkedPeople, setCheckedPeople] = useLocalStorage<string[]>("cp", []);

  return (
    <>
      <Box minH="100vh" bg="gray.50">
        <Container maxW="1200px" py={8}>
          <Grid
            templateColumns={{ base: "1fr", md: "25% 75%" }}
            gap={6}
            mb={6}
            alignItems="start"
          >
            <Box gridColumn={{ base: "1", md: "1 / -1" }} p={6} borderRadius="md" bg="bg" borderWidth={1}>
              <Heading textAlign="center" size="3xl" mb={4}>
                Carole Venmo Splitter
              </Heading>
              <ActionButtons
                people={people}
                events={events}
                checkedPeople={checkedPeople}
                setPeople={setPeople}
                setEvents={setEvents}
                setCheckedPeople={setCheckedPeople}
                canExport={canExport(people, events)}
              />
            </Box>
            <PeopleSection
              people={people}
              setPeople={setPeople}
              events={events}
              setEvents={setEvents}
              checkedPeople={checkedPeople}
              setCheckedPeople={setCheckedPeople}
            />
            <EventsSection
              people={people}
              events={events}
              setEvents={setEvents}
            />
          </Grid>

          <TotalsSection
            people={people}
            events={events}
            checkedPeople={checkedPeople}
            setCheckedPeople={setCheckedPeople}
            onExport={() => exportTotals(people, events, checkedPeople)}
            canExport={canExport(people, events)}
          />
        </Container>
      </Box>
      <Toaster />
    </>
  );
}

export default App;
