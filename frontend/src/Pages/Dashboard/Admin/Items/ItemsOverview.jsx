import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Button,
  Card,
  CardContent,
  makeStyles,
} from '@material-ui/core';
import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AdminAddItemDialog from '../../../../Components/Item/AdminAddItemDialog';

const useStyles = makeStyles(() => ({
  card: {
    padding: '20px',
    marginBottom: '10px',
  },
}));

const ItemsOverview = () => {
  const [items, setItems] = useState([]);
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    Axios.get('http://localhost:3200/api/v1/item')
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleClick = (id) => {
    history.push(`/dashboard/item/${id}`);
  };

  const displayItems = () => {
    if (items.length === 0) {
      return <p>Loading</p>;
    } else {
      return (
        <Card className={classes.card}>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((x) => {
                    return (
                      <TableRow key={x.id} hover>
                        <TableCell>{x.name}</TableCell>
                        <TableCell onClick={() => handleClick(x.id)}>Edit</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <Box p={1}>
      <Typography variant="h6">Items Management</Typography>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="body1">Actions</Typography>
          <AdminAddItemDialog />
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardContent>
          {items.length === 0 && <p>No Data</p>}
          {items.length > 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((x) => {
                    return (
                      <TableRow key={x.id} hover>
                        <TableCell>{x.name}</TableCell>
                        <TableCell onClick={() => handleClick(x.id)}>Edit</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ItemsOverview;
