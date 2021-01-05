import {
  Button,
  Dialog,
  DialogContent,
  Select,
  Typography,
  MenuItem,
  DialogActions,
  FormControl,
  InputLabel,
  makeStyles,
} from '@material-ui/core';
import Axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { ShowMessage } from '../../Actions/actions';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '240px',
  },
}));
const AddInventoryDialog = (props) => {
  const classes = useStyles();
  const [open, toggleDialog] = useState(false);
  const [itemList, setItems] = useState([]);
  const [selectedItemId, setNewItem] = useState(-1);
  const warehouseId = props.data;
  const dispatch = useDispatch();
  const uId = useSelector((state) => state.app.auth.uId);

  useEffect(() => {
    Axios.get('/api/v1/item')
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const addNewInventory = (data) => {
    Axios.post('/api/v1/inventory', {
      itemId: selectedItemId,
      userId: uId,
      warehouseId: warehouseId,
    })
      .then((res) => {
        dispatch(ShowMessage('Created Inventory'));
      })
      .catch((err) => {
        console.log(err);
        dispatch(ShowMessage('Unable Inventory'));
      });
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={() => toggleDialog(true)}>
        Add Inventory
      </Button>
      <Dialog open={open} onClose={() => toggleDialog(false)}>
        <DialogContent>
          <Typography variant="h6">Add Item</Typography>
          <FormControl className={classes.form}>
            <InputLabel>Item List</InputLabel>
            <Select value={selectedItemId} onChange={(e) => setNewItem(e.target.value)}>
              <MenuItem value={-1}>Select Item</MenuItem>
              {itemList.length > 0 &&
                itemList.map((x, i) => {
                  return (
                    <MenuItem key={i} value={x.id}>
                      {x.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => addNewInventory()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

AddInventoryDialog.propTypes = {
  data: PropTypes.number,
};

export default AddInventoryDialog;
