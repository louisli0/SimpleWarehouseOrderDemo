import { makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '20px',
  },
}));
const About = (props) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Typography variant="body1">About</Typography>
      </Paper>
    </React.Fragment>
  );
};

export default About;
