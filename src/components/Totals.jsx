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

function Totals({ events, people, checkedPeople, setCheckedPeople }) {
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

  function generateReceipts(people, events) {
    const receipts = {};
    for (const person of people) {
      const itemsByPerson = [];
      for (const event of events) {
        for (const item of event.items) {
          if (item.who.includes(person)) {
            const itemCostPerPerson = item.howMuch / item.who.length;
            const itemName = event.name + " - " + item.what;
            itemsByPerson.push({ [itemName]: itemCostPerPerson.toFixed(2) });
          }
        }
      }
      receipts[person] = {
        items: itemsByPerson,
        total: getTotalForPerson(person),
      };
    }
    return receipts;
  }

  const receipts = generateReceipts(people, events);
  console.log(receipts);
  const onExport = () => {
    // convert receipts into a nicely formatted text file
    const receipts = generateReceipts(people, events);
    const text = Object.keys(receipts)
      .map((person) => {
        const items = receipts[person].items
          .map((item) => {
            const itemName = Object.keys(item)[0];
            const itemCost = item[itemName];
            return `$${itemCost} - ${itemName}`;
          })
          .join("\n");
        const personTotal = receipts[person].total;
        return `${person} - Total: $${personTotal}\n${items}\n`;
      })
      .join("\n");
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "receipts.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Button variant="contained" onClick={onExport} sx={{ mb: 1 }}>
        Export
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
                    <Typography variant="h6" fontSize={16}>
                      {event.name}
                    </Typography>
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
};

export default Totals;
