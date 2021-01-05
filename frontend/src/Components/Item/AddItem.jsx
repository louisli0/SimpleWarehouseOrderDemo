import {
  Button,
  FormControl,
  Input,
  InputLabel,
  TextField,
  Paper,
  makeStyles,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ItemAdd } from '../../Actions/actions';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '20px',
  },
  form: {
    width: '200px',
    marginBottom: '20px',
  },
}));
const AddItem = (props) => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(
      ItemAdd({
        name: name,
        category: category,
        description: description,
      })
    );
  };

  return (
    <React.Fragment>
      <Paper elevation={2} className={classes.paper}>
        <p>Add new Item</p>
        <div className={classes.form}>
          <FormControl>
            <InputLabel>Name</InputLabel>
            <Input type="text" onChange={(e) => setName(e.target.value)} value={name} />
          </FormControl>
          <FormControl>
            <InputLabel>Category</InputLabel>
            <Input type="text" onChange={(e) => setCategory(e.target.value)} value={category} />
          </FormControl>
          <FormControl>
            <TextField
              multiline
              label="Description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
        </div>
        <Button variant="outlined" onClick={() => handleAdd()}>
          Add
        </Button>
      </Paper>
    </React.Fragment>
  );
};

export default AddItem;
