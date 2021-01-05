import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  makeStyles,
  Button,
} from '@material-ui/core';
import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import AddInventoryDialog from '../../../../Components/Warehouse/AddInventoryDialog';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: '20px',
  },
}));

const WarehouseInventory = (data) => {
  const warehouseId = data.match.params.id;
  const [inventoryList, setInventory] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    Axios.get(`/api/v1/inventory/warehouse/${warehouseId}`)
      .then((res) => {
        console.log(res.data);
        setInventory(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleItemLink = (data) => {
    console.log(data);
  };
  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5">Inventory</Typography>
          <AddInventoryDialog data={warehouseId} />
        </CardContent>
      </Card>

      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6">Current Inventory</Typography>
          <List>
            {inventoryList.length > 0 &&
              inventoryList.map((x, i) => {
                return (
                  <ListItem key={i} onClick={() => handleItemLink(x.id)}>
                    {x.id} - {x.name}
                  </ListItem>
                );
              })}
          </List>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default WarehouseInventory;
