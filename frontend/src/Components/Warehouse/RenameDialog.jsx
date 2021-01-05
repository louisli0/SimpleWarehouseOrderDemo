import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  FormControl,
  InputLabel,
  Input,
  DialogActions,
} from '@material-ui/core';
import Axios from 'axios';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  warehouse: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const WarehouseRenameDialog = (props) => {
  const uId = useSelector((state) => state.app.auth.uId);
  const [open, toggleDialog] = useState(false);
  const [name, handleName] = useState('');
  const classes = useStyles();

  function handleAdd() {
    Axios.put(`/api/v1/warehouse/${props.id}`, {
      id: props.id,
      name: name,
      userId: uId,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <React.Fragment>
      <Button variant="outlined" color="primary" onClick={() => toggleDialog(true)}>
        Rename Warehouse
      </Button>
      <Dialog open={open} onClose={() => toggleDialog(false)} maxWidth={'lg'}>
        <DialogTitle>Rename Warehouse</DialogTitle>
        <DialogContent>
          <div className={classes.loginForm}>
            <FormControl>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input id="name" onChange={(e) => handleName(e.target.value)} value={name} />
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleAdd()}>Rename</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

WarehouseRenameDialog.propTypes = {
  id: PropTypes.string,
};

export default WarehouseRenameDialog;
