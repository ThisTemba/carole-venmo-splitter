import { useState, useEffect, useCallback } from "react";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

function EventItemForm({ people, itemData, setItemData, onDelete }) {
  const [what, setWhat] = useState(itemData.what);
  const [howMuch, setHowMuch] = useState(itemData.howMuch);
  const [who, setWho] = useState(itemData.who);
  const handleSave = useCallback(() => {
    setItemData({
      what,
      howMuch: Number(howMuch),
      who,
      editing: false,
    });
  }, [setItemData, what, howMuch, who]);

  useEffect(() => {
    setWho((prevWho) => prevWho.filter((name) => who.includes(name)));
    function handleClickOutside(e) {
      const form = document.getElementById("event-item-form");
      if (form && !form.contains(e.target)) {
        handleSave();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [who, handleSave]);

  const handleChipClick = (name) => {
    if (who.includes(name)) {
      setWho(who.filter((n) => n !== name));
    } else {
      setWho([...who, name]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <Grid container spacing={1} id="event-item-form">
      <Grid item xs={4}>
        <TextField
          label="What"
          value={what}
          size="small"
          onChange={(e) => setWhat(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
          autoFocus
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          label="How much"
          value={howMuch}
          onChange={(e) => setHowMuch(e.target.value)}
          type="number"
          InputProps={{
            inputProps: {
              min: 0,
              style: { textAlign: "left", paddingLeft: "12px" },
            },
            startAdornment: "$",
            onKeyPress: handleKeyPress,
          }}
          size="small"
          fullWidth
        />
      </Grid>
      <Grid item xs={4}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {people.map((name, index) => (
            <Chip
              key={index}
              label={name}
              onClick={() => handleChipClick(name)}
              color={who.includes(name) ? "primary" : "default"}
              size="small"
              onKeyPress={handleKeyPress}
              tabIndex={0}
            />
          ))}
        </Box>
      </Grid>
      <Grid item xs={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Box>
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Grid>
    </Grid>
  );
}

EventItemForm.propTypes = {
  people: PropTypes.arrayOf(PropTypes.string).isRequired,
  itemData: PropTypes.shape({
    what: PropTypes.string.isRequired,
    howMuch: PropTypes.number.isRequired,
    who: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  setItemData: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default EventItemForm;
