import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: '10px',
    width: '300px',
  },
}));
const AddItemDialog = (props) => {
  const classes = useStyles();
  const uID = useSelector((state) => state.app.auth.uId);
  const at = useSelector((state) => state.app.auth.accessToken);

  const [open, toggleDialog] = useState(false);
  const [registeredItems, setItems] = useState([]);
  const [selectedItems, setSelected] = useState([]);

  useEffect(() => {
    Axios.get('http://localhost:3200/api/v1/item/registered', {
      params: {
        uID: uID,
      },
    })
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.log('error getting data', err);
      });
  }, []);

  const sendData = () => {
    props.updateItems(selectedItems);
    toggleDialog(false);
  };

  const reset = () => {
    setSelected([]);
  };

  const addItem = (e) => {
    let index = selectedItems.findIndex((x) => x.id === e.id);
    if (index == -1) {
      let tmp = [...selectedItems];
      tmp.push(e);
      setSelected(tmp);
    }
  };

  const removeItems = (e) => {
    let index = selectedItems.findIndex((x) => x.id === e);
    let tmp = [...selectedItems];
    tmp.splice(index, 1);
    setSelected(tmp);
  };

  return (
    <React.Fragment>
      <Button onClick={() => toggleDialog(true)}>Add item</Button>
      <Dialog open={open} onClose={() => toggleDialog(false)}>
        <DialogTitle>Add items</DialogTitle>
        <DialogContent>
          <Paper elevation={2} m={2} p={2} className={classes.paper}>
            <Typography variant="subtitle1">Registered Items</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Serial #</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registeredItems.length > 0 &&
                  registeredItems.map((x, i) => {
                    return (
                      <TableRow hover key={x.id} onClick={() => addItem(x)}>
                        <TableCell>{x.name}</TableCell>
                        <TableCell>{x.serialnumber}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Paper>
          <Paper elevation={2} p={2} className={classes.paper}>
            <Typography variant="subtitle1">Selected</Typography>
            <List>
              {selectedItems.length > 0 &&
                selectedItems.map((x, i) => {
                  return (
                    <ListItem key={i} button onClick={() => removeItems(x.id)}>
                      <ListItemText>
                        {x.name} - {x.serialnumber}
                      </ListItemText>
                    </ListItem>
                  );
                })}
            </List>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={() => reset()}>
            Reset
          </Button>
          <Button variant="outlined" color="primary" onClick={() => sendData()}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

AddItemDialog.propTypes = {
  updateItems: PropTypes.func,
};

export default AddItemDialog;
