import { useState, useRef, useEffect, useCallback } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Grid,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";

function ListComponent({ list, setList, itemName }) {
  const [inputValue, setInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const inputRef = useRef(null);

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setList([...list, inputValue]);
    setInputValue("");
  }

  function handleDelete(index) {
    setList(list.filter((item, i) => i !== index));
    setEditingIndex(null);
    setEditingValue("");
  }

  function handleEdit(index) {
    setEditingIndex(index);
    setEditingValue(list[index]);
  }

  function handleEditKeyDown(event, index) {
    if (event.key === "Enter") {
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
      const newList = [...list];
      newList[index] = editingValue;
      setList(newList);
      setEditingIndex(null);
      setEditingValue("");
    },
    [list, editingValue, setList]
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
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
    <div>
      <Box sx={{ display: "flex" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              label={`Add ${itemName}`}
              value={inputValue}
              onChange={handleInputChange}
              fullWidth
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSubmit(event);
                }
              }}
              size="small"
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              type="submit"
              onClick={handleSubmit}
              tabIndex={-1}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>
      <List>
        {list.map((item, index) => (
          <ListItem key={index}>
            {editingIndex === index ? (
              <>
                <TextField
                  value={editingValue}
                  onChange={(event) => setEditingValue(event.target.value)}
                  onKeyDown={(event) => handleEditKeyDown(event, index)}
                  inputRef={inputRef}
                  onBlur={() => handleSaveEdit(index)}
                  size="small"
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </>
            ) : (
              <>
                <ListItemText
                  primary={item}
                  onClick={() => handleEdit(index)}
                  className="list-item"
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleDelete(index)} tabIndex={-1}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
}

ListComponent.propTypes = {
  list: PropTypes.arrayOf(PropTypes.string).isRequired,
  setList: PropTypes.func.isRequired,
  itemName: PropTypes.string.isRequired,
};

export default ListComponent;
