import { Box, Button, Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CreatedTicketTable from '../../../Components/CreatedTicketTable';

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: 'column',
  },
}));

const UserTicketOverview = (props) => {
  const uID = useSelector((state) => state.app.auth.uId);
  const classes = useStyles();

  useEffect(() => {
    // Get Open Tickets
    Axios.get('http://localhost:3200/api/v1/ticket/', {
      params: {
        uId: uID,
      },
    })
      .then((res) => {
        setOpen(res.data);
      })
      .catch((err) => {
        console.log('Error getting tickets', err);
      });
  }, []);

  return (
    <React.Fragment>
      <Box className={classes.container}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5">Tickets</Typography>
                <Link to="/user/ticket/create" style={{ textDecoration: 'none' }}>
                  <Button variant="outlined">Create</Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <CreatedTicketTable />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default UserTicketOverview;
