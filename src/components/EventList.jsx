import { useState, useRef, useEffect, useCallback } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import EventItem from "./EventItem";
import EventForm from "./EventForm";

function EventList({ events, setEvents, people }) {
  const [topInput, setTopInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const inputRef = useRef(null);

  function handleDelete(index) {
    setEvents(events.filter((item, i) => i !== index));
    setEditingIndex(null);
    setEditingValue("");
  }

  function handleEdit(index) {
    setEditingIndex(index);
    setEditingValue(events[index].name);
  }

  function handleEditKeyDown(e, index) {
    if (e.key === "Enter") {
      handleSaveEdit(index);
    }
  }

  useEffect(() => {
    if (inputRef.current && editingIndex !== null) {
      inputRef.current.focus();
    }
  }, [editingIndex]);

  const handleSaveEdit = useCallback(
    (index) => {
      const newList = [...events];
      newList[index].name = editingValue;
      setEvents(newList);
      setEditingIndex(null);
      setEditingValue("");
    },
    [events, editingValue, setEvents]
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        handleSaveEdit(editingIndex);
      }
    }
    if (editingIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingIndex, handleSaveEdit]);

  return (
    <>
      <EventForm
        topInput={topInput}
        setTopInput={setTopInput}
        setEvents={setEvents}
      />
      <List>
        {events.map((event, eventIdx) => (
          <div key={eventIdx}>
            <ListItem key={eventIdx}>
              {editingIndex === eventIdx ? (
                <>
                  <TextField
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, eventIdx)}
                    inputRef={inputRef}
                    onBlur={() => handleSaveEdit(eventIdx)}
                    size="small"
                  />
                </>
              ) : (
                <>
                  <ListItemText
                    primary={`${eventIdx + 1}. ${event.name}`}
                    onClick={() => handleEdit(eventIdx)}
                    className="list-item"
                  />
                </>
              )}
              <ListItemSecondaryAction>
                <Button
                  onClick={() => handleDelete(eventIdx)}
                  color="error"
                  variant="outlined"
                  // size="small"
                  tabIndex={-1}
                >
                  Delete Event
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            <Box sx={{ pl: 5 }}>
              {event.items.map((itemData, itemIdx) => (
                <EventItem
                  key={itemIdx}
                  index={itemIdx}
                  people={people}
                  itemData={itemData}
                  setItemData={(itemData) => {
                    setEvents((events) => {
                      const newEvents = [...events];
                      newEvents[eventIdx].items[itemIdx] = itemData;
                      return newEvents;
                    });
                  }}
                  onDelete={() => {
                    setEvents((events) => {
                      const newEvents = [...events];
                      newEvents[eventIdx].items = newEvents[
                        eventIdx
                      ].items.filter((item, i) => i !== itemIdx);
                      return newEvents;
                    });
                  }}
                />
              ))}
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                // set color to green 500
                // sx={{ m: 1, width: "100%" }}
                size="small"
                onClick={() => {
                  setEvents((events) => {
                    const newEvents = [...events];
                    newEvents[eventIdx].items.push({
                      who: [],
                      howMuch: 0,
                      what: "",
                      editing: true,
                    });
                    return newEvents;
                  });
                }}
              >
                Add event item
              </Button>
            </Box>
          </div>
        ))}
      </List>
    </>
  );
}

EventList.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          who: PropTypes.arrayOf(PropTypes.string).isRequired,
          howMuch: PropTypes.number.isRequired,
          what: PropTypes.string.isRequired,
          editing: PropTypes.bool,
        })
      ),
    })
  ).isRequired,
  setEvents: PropTypes.func.isRequired,
  people: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default EventList;
