import ListItemText from "@mui/material/ListItemText";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

function EventItemData({ index, people, itemData, onDelete, setItemData }) {
  const { who, what, howMuch } = itemData;
  const onClickField = () => setItemData({ ...itemData, editing: true });
  return (
    <Grid container spacing={1}>
      <Grid item xs={4} onClick={onClickField}>
        <ListItemText primary={`${index + 1}. ${what}`} />
      </Grid>
      <Grid item xs={2} onClick={onClickField}>
        <ListItemText>${howMuch.toFixed(2)}</ListItemText>
      </Grid>
      <Grid item xs={4} onClick={onClickField}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {people
            .filter((p) => who.includes(p))
            .map((name, index) => (
              <Chip key={index} label={name} color={"primary"} size="small" />
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

EventItemData.propTypes = {
  itemData: PropTypes.shape({
    what: PropTypes.string.isRequired,
    howMuch: PropTypes.number.isRequired,
    who: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  people: PropTypes.arrayOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,
  deleteButton: PropTypes.element.isRequired,
  setItemData: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default EventItemData;
