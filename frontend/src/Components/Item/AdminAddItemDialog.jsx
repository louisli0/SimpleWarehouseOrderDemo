import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  makeStyles,
} from '@material-ui/core';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { ShowMessage } from '../../Actions/actions';

const useStyles = makeStyles(() => ({
  input: {
    marginBottom: '10px',
  },
}));

const AdminAddItemDialog = (props) => {
  const uID = useSelector((state) => state.app.auth.uId);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, toggleDialog] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const reset = () => {
    setName('');
    setDescription('');
    toggleDialog(false);
  };

  const sendData = () => {
    Axios.post('http://localhost:3200/api/v1/item', {
      name: name,
      description: description,
      category: category,
      userId: uID,
    })
      .then((res) => {
        console.log(res);
        dispatch(ShowMessage(`Created ${name}`));
      })
      .catch((err) => {
        console.log(err);
        dispatch(ShowMessage(`Unable to create ${name}`));
      });
  };
  return (
    <React.Fragment>
      <Button onClick={() => toggleDialog(true)}>Create New Item</Button>
      <Dialog open={open} onClose={() => toggleDialog(false)}>
        <DialogTitle>Add new item</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              label="Name"
              className={classes.input}
              fullWidth
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              value={name}
            />
            <TextField
              label="Category"
              className={classes.input}
              fullWidth
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              value={category}
            />
            <TextField
              label="Description"
              className={classes.input}
              fullWidth
              multiline
              rows={5}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              value={description}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={() => reset()}>
            Cancel
          </Button>
          <Button variant="outlined" color="primary" onClick={() => sendData()}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

AdminAddItemDialog.propTypes = {
  updateItems: PropTypes.func,
};

export default AdminAddItemDialog;
