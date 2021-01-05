import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  TextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { ShowMessage } from '../../Actions/actions';

const AddItemSerial = (props) => {
  const at = useSelector((state) => state.app.auth.accessToken);
  const [open, toggleDialog] = useState(false);
  const [serial, setSerial] = useState('');
  const [item, setItem] = useState('');
  const dispatch = useDispatch();

  const sendData = () => {
    Axios.post(
      'http://localhost:3200/api/v1/item/serial',
      {
        serial: serial,
        itemId: props.itemId,
      },
      {}
    )
      .then((res) => {
        dispatch(ShowMessage('Added serial'));
      })
      .catch((err) => {
        dispatch(ShowMessage('Unable to add serial'));
      });
  };
  return (
    <React.Fragment>
      <Button onClick={() => toggleDialog(true)}>Add Serial</Button>
      <Dialog onClose={() => toggleDialog(false)} open={open}>
        <DialogTitle>Add New Serial</DialogTitle>
        <DialogContent>
          <TextField label="Serial" value={serial} onChange={(e) => setSerial(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => sendData()}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

AddItemSerial.propTypes = {
  itemId: PropTypes.number,
};
export default AddItemSerial;
