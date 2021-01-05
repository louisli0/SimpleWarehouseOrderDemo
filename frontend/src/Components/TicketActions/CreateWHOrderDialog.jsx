import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  MenuItem,
  Typography,
  InputLabel,
  Select,
  makeStyles,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Input,
} from '@material-ui/core';
import React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '120px',
  },
}));
const CreateWHGOrderDialog = (props) => {
  const classes = useStyles();
  const [itemId, setItem] = useState(-1);
  const [open, toggleDialog] = useState(false);
  const [inventoryList, setInventory] = useState([]);
  const [itemLocation, setItemLocation] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const uId = useSelector((state) => state.app.auth.uId);

  useEffect(() => {
    setInventory(props.data);

    if (itemId != -1) {
      Axios.get(`/api/v1/inventory/item/${itemId}`)
        .then((res) => {
          setItemLocation(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [props.data, itemId]);

  const allocateItem = (inventoryId) => {
    Axios.post('/api/v1/orderWH/', {
      userId: uId,
      ticketId: props.id,
      quantity: quantity,
      itemid: itemId,
      inventoryid: inventoryId,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={() => toggleDialog(true)}>
        Warehouse Order
      </Button>
      <Dialog open={open} onClose={() => toggleDialog(false)}>
        <DialogContent>
          <Typography variant="h6">New Warehouse Order</Typography>
          {/* Inventory Select */}
          <FormControl className={classes.formControl}>
            <InputLabel>Ticketed Items</InputLabel>
            <Select value={itemId} onChange={(e) => setItem(e.target.value)}>
              <MenuItem value={-1}>Select Item</MenuItem>
              {inventoryList.length > 0 &&
                inventoryList.map((x, i) => {
                  console.log(x);
                  return (
                    <MenuItem key={i} value={x.itemid} name={x.id}>
                      {x.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>

          {itemLocation.length == 0 && <p>Select an Item / No Data</p>}
          {itemLocation.length > 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Qty.</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemLocation.map((x, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{x.name}</TableCell>
                      <TableCell>
                        <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined" onClick={() => allocateItem(x.id)}>
                          Allocate
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined">Create</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

CreateWHGOrderDialog.propTypes = {
  data: PropTypes.array,
  id: PropTypes.number,
};

export default CreateWHGOrderDialog;
