import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";

function EventForm({ topInput, setTopInput, setEvents }) {
  function handleAdd(e) {
    e.preventDefault();
    const newEvent = {
      name: topInput,
      items: [],
    };
    setEvents((events) => [...events, newEvent]);
    setTopInput("");
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <TextField
            label={"Add event"}
            value={topInput}
            onChange={(e) => setTopInput(e.target.value)}
            fullWidth
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAdd(e);
              }
            }}
            size="small"
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            type="submit"
            onClick={handleAdd}
            tabIndex={-1}
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

EventForm.propTypes = {
  topInput: PropTypes.string.isRequired,
  setTopInput: PropTypes.func.isRequired,
  setEvents: PropTypes.func.isRequired,
};

export default EventForm;
