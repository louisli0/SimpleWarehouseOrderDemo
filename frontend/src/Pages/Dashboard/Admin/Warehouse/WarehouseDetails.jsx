import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import WarehouseRenameDialog from '../../../../Components/Warehouse/RenameDialog';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '10px',
    marginBottom: '10px',
  },
  mainPaper: {
    padding: '10px',
  },
}));
const WarehouseDetails = ({ match }) => {
  const classes = useStyles();
  const [warehouseId, setWarehouseId] = useState(match.params.id);
  const [warehouseData, setWarehouseData] = useState([]);
  const [inventoryList, setInventroy] = useState([]);
  const [assignedOrders, setOrders] = useState([]);

  useEffect(() => {
    Axios.get(`/api/v1/warehouse/${warehouseId}`)
      .then((res) => {
        console.log(res.data);
        setWarehouseData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleRemove = () => {
    Axios.delete(`/api/v1/warehouse/${warehouseId}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Paper className={classes.mainPaper}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={1} className={classes.paper}>
            <Typography variant="h6">{warehouseData.name}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={1} className={classes.paper}>
            <Typography variant="h6">Inventory</Typography>
            <Link
              to={`${warehouseId}/inventory`}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              <Button variant="outlined">GO TO</Button>
            </Link>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={1} className={classes.paper}>
            <Typography variant="h6">Orders</Typography>
            <Link to={`${warehouseId}/orders`} style={{ color: 'inherit', textDecoration: 'none' }}>
              <Button variant="outlined">GO TO</Button>
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevaton={1} className={classes.paper}>
            <Typography variant="h6">Actions</Typography>
            <WarehouseRenameDialog id={warehouseId} />
            <Button variant="outlined" color="primary" onClick={() => handleRemove()}>
              Remove
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

WarehouseDetails.propTypes = {
  match: PropTypes.object,
};

export default WarehouseDetails;
