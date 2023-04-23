import { useState } from "react";
import PropTypes from "prop-types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Checkbox,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function Totals({ events, people, checkedPeople, setCheckedPeople, onExport }) {
  const [expandedPerson, setExpandedPerson] = useState(null);

  const handleAccordionChange = (person) => {
    setExpandedPerson(person === expandedPerson ? null : person);
  };

  // Calculate how much each person owes per item
  function getTotalForPerson(person) {
    const totalsByPerson = {};
    events.forEach((event) => {
      event.items.forEach((item) => {
        if (item.who.includes(person)) {
          const itemCostPerPerson = item.howMuch / item.who.length;
          totalsByPerson[person] =
            (totalsByPerson[person] || 0) + itemCostPerPerson;
        }
      });
    });
    return (totalsByPerson[person] || 0).toFixed(2);
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        variant="contained"
        onClick={onExport}
        sx={{ mb: 1 }}
        color="success"
      >
        Export Totals
      </Button>
      {people.map((person) => (
        <Accordion
          key={person}
          expanded={expandedPerson === person}
          onChange={() => handleAccordionChange(person)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography>
                <Checkbox
                  onClick={(e) => e.stopPropagation()}
                  checked={checkedPeople.includes(person)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked) {
                      setCheckedPeople([...checkedPeople, person]);
                    }
                    if (!checked) {
                      setCheckedPeople(
                        checkedPeople.filter((p) => p !== person)
                      );
                    }
                  }}
                />
                {person}
                {/* align span right using auto margin */}
              </Typography>
              {/* vertically align next typo */}
              <Typography sx={{ alignSelf: "center", mr: 1 }}>
                $ {getTotalForPerson(person)}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List sx={{ width: "100%" }}>
              {events.map((event) => {
                const itemsByPersonInEvent = event.items.filter((item) =>
                  item.who.includes(person)
                );
                if (itemsByPersonInEvent.length === 0) {
                  return null;
                }
                return (
                  <Box key={event.name} sx={{ width: "100%" }}>
                    <Typography variant="h6">{event.name}</Typography>
                    <Divider sx={{ my: 1 }} />
                    {itemsByPersonInEvent.map((item) => {
                      if (!item.who.includes(person)) {
                        return null;
                      }
                      const itemCostPerPerson = item.howMuch / item.who.length;
                      return (
                        <ListItem key={item.what}>
                          <ListItemText primary={`${item.what}`} />
                          <Typography>
                            ${itemCostPerPerson.toFixed(2)}
                          </Typography>
                        </ListItem>
                      );
                    })}
                  </Box>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

Totals.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          what: PropTypes.string.isRequired,
          howMuch: PropTypes.number.isRequired,
          who: PropTypes.arrayOf(PropTypes.string).isRequired,
          editing: PropTypes.bool,
        })
      ).isRequired,
    })
  ).isRequired,
  people: PropTypes.arrayOf(PropTypes.string).isRequired,
  checkedPeople: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCheckedPeople: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
};

export default Totals;
