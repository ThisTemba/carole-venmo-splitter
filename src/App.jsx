import "./App.css";
import List from "./components/List";
import EventList from "./components/EventList";
import Totals from "./components/Totals";
import { Grid } from "@mui/material";
import useLocalStorage from "./hooks/useLocalStorage";
import Button from "@mui/material/Button";
import { eventsInit, peopleInit } from "./initState";

function App() {
  const [people, setPeople] = useLocalStorage("people", []);
  const [events, setEvents] = useLocalStorage("events", []);
  const [checkedPeople, setCheckedPeople] = useLocalStorage("cp", []);

  const onClear = () => {
    setEvents([]);
    setPeople([]);
    setCheckedPeople([]);
  };

  const getTotalsAvailable = (events, people) => {
    if (!events.length || !people.length) return false;
    if (events[0].items.length === 0) return false;
    const firstItem = events[0].items[0];
    if (!firstItem.who.length) return false;
    return true;
  };

  const removePersonFromEvents = (person) => {
    const newEvents = events.map((event) => {
      const newItems = event.items.map((item) => {
        const newWho = item.who.filter((who) => who !== person);
        return { ...item, who: newWho };
      });
      return { ...event, items: newItems };
    });
    setEvents(newEvents);
  };

  const editPersonInEvents = (oldPerson, newPerson) => {
    const newEvents = events.map((event) => {
      const newItems = event.items.map((item) => {
        const newWho = item.who.map((who) => {
          if (who === oldPerson) return newPerson;
          return who;
        });
        return { ...item, who: newWho };
      });
      return { ...event, items: newItems };
    });
    setEvents(newEvents);
  };

  const handleEditPeople = (newPeople) => {
    if (newPeople.length < people.length) {
      const removedPerson = people.find(
        (person) => !newPeople.includes(person)
      );
      removePersonFromEvents(removedPerson);
      setCheckedPeople(checkedPeople.filter((p) => p !== removedPerson));
    }
    if (newPeople.length === people.length) {
      const editedPerson = people.find(
        (person, index) => person !== newPeople[index]
      );
      editPersonInEvents(editedPerson, newPeople[people.indexOf(editedPerson)]);
      setCheckedPeople(
        checkedPeople.map((p) => {
          if (p === editedPerson)
            return newPeople[people.indexOf(editedPerson)];
          return p;
        })
      );
    }

    setPeople(newPeople);
    // if fewer people, remove them from events
  };

  return (
    <>
      <h1>Carole Venmo Splitter</h1>
      <Button variant="contained" onClick={onClear} sx={{ m: 1 }}>
        Clear
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          setEvents(eventsInit);
          setPeople(peopleInit);
        }}
        sx={{ m: 1 }}
        color="secondary"
      >
        Example
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <div className="card">
            <h2>People</h2>
            <List list={people} setList={handleEditPeople} itemName="person" />
          </div>
        </Grid>
        <Grid item xs={9}>
          <div className="card">
            <h2>Events</h2>
            <EventList events={events} setEvents={setEvents} people={people} />
          </div>
        </Grid>
      </Grid>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h2>Totals</h2>
        {getTotalsAvailable(events, people) ? (
          <Totals
            events={events}
            people={people}
            checkedPeople={checkedPeople}
            setCheckedPeople={setCheckedPeople}
          />
        ) : (
          <p>Enter some events and people to see totals</p>
        )}
      </div>
    </>
  );
}

export default App;
