import { Card, CardContent, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { List, ListItem, makeStyles } from '@material-ui/core';
import WarehouseAddDialog from '../../../../Components/Warehouse/AddDialog';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: '20px',
  },
}));

const WarehouseOverview = (props) => {
  const [warehouseList, setwarehouse] = useState([]);
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    axios
      .get('/api/v1/warehouse')
      .then((res) => {
        console.log('warehouse', res.data);
        setwarehouse(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleLink = (data) => {
    history.push(`warehouse/${data}`);
  };

  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6">Warehouse Management</Typography>
          <WarehouseAddDialog />
        </CardContent>
      </Card>

      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6">Warehouse Details</Typography>
          <List>
            {warehouseList.length > 0 &&
              warehouseList.map((x, i) => {
                return (
                  <ListItem key={x.id} button onClick={() => handleLink(x.id)}>
                    {x.name}
                  </ListItem>
                );
              })}
          </List>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default WarehouseOverview;
