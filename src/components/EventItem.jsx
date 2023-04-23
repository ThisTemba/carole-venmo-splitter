import List from "@mui/material/List";
import PropTypes from "prop-types";
import EventItemForm from "./EventItemForm";
import EventItemData from "./EventItemData";

function EventItem({ index, people, itemData, setItemData, onDelete }) {
  const editing = itemData.editing;

  const handleSave = (itemData) => {
    setItemData(itemData);
  };

  return (
    <List
      sx={{
        textAlign: "left",
        pt: 0,
        pb: 1,
      }}
    >
      {editing ? (
        <EventItemForm
          people={people}
          itemData={itemData}
          setItemData={handleSave}
          onDelete={onDelete}
        />
      ) : (
        <EventItemData
          className="list-item"
          index={index}
          people={people}
          itemData={itemData}
          onDelete={onDelete}
          setItemData={setItemData}
        />
      )}
    </List>
  );
}

EventItem.propTypes = {
  itemData: PropTypes.shape({
    what: PropTypes.string.isRequired,
    howMuch: PropTypes.number.isRequired,
    who: PropTypes.arrayOf(PropTypes.string).isRequired,
    editing: PropTypes.bool,
  }).isRequired,
  people: PropTypes.arrayOf(PropTypes.string).isRequired,
  setItemData: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default EventItem;
