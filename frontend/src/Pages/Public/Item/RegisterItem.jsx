import {
  InputLabel,
  FormControl,
  Input,
  Button,
  Select,
  MenuItem,
  Grid,
  Box,
  makeStyles,
  Typography,
  Paper,
} from '@material-ui/core';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShowMessage } from '../../../Actions/actions';
const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '240px',
    marginBottom: '10px',
    marginTop: '30px',
  },
  box: {
    width: '340px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

const RegisterItem = (props) => {
  const at = useSelector((state) => state.app.auth.accessToken);
  const uid = useSelector((state) => state.app.auth.uId);
  const dispatch = useDispatch();

  const classes = useStyles();
  const [itemSelectList, setSelectList] = useState([]);
  const [item, setItem] = useState('');
  const [serial, setSerial] = useState('');

  useEffect(() => {
    Axios.get('http://localhost:3200/api/v1/item').then((result) => {
      console.log('items', result.data);
      setSelectList(result.data);
    });
  }, []);

  const findItem = () => {
    return Axios.get(`http://localhost:3200/api/v1/item/find/`, {
      params: {
        itemId: item,
        serial: serial,
      },
    })
      .then((result) => {
        if (result.data) {
          console.log('the serial exists');
          //Register Item
          Axios.post('http://localhost:3200/api/v1/item/register', {
            serial: serial,
            itemId: item,
            userId: uid,
          }).then((res) => {
            dispatch(ShowMessage('Registered'));
          });
        } else {
          dispatch(ShowMessage('Error Registering Product'));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(ShowMessage('Internal Error Occured'));
      });
  };

  return (
    <Paper className={classes.box}>
      <Typography variant="h5">Register new item</Typography>
      <FormControl className={classes.formControl}>
        <InputLabel>Item</InputLabel>
        <Select
          onChange={(e) => setItem(e.target.value)}
          value={item}
          disabled={itemSelectList.length == 0 ? true : false}
        >
          {itemSelectList.length > 0 &&
            itemSelectList.map((x, i) => (
              <MenuItem key={i} value={x.id}>
                {x.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel>Serial</InputLabel>
        <Input type="text" onChange={(e) => setSerial(e.target.value)} value={serial} />
      </FormControl>

      <Button variant="outlined" onClick={() => findItem()}>
        Register Item
      </Button>
    </Paper>
  );
};

export default RegisterItem;
