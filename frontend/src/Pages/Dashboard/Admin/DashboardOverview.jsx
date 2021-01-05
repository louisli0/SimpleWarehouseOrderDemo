import React from 'react';
import { useState, useEffect } from 'react';
import { Grid, makeStyles, Paper } from '@material-ui/core';
import { useSelector } from 'react-redux';
import AssignedTable from '../../../Components/AssignedTable';
import NonAssignedTable from '../../../Components/NonAssignedTable2';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '20px',
  },
}));

const DashboardOverview = (props) => {
  const lastLogin = useSelector((state) => state.app.auth.lastLoginDate);
  const classes = useStyles();

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <span>Last Login: {new Date(`${lastLogin}`).toLocaleString()}</span>
          <Paper className={classes.paper}>
            <AssignedTable />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <NonAssignedTable />
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default DashboardOverview;
