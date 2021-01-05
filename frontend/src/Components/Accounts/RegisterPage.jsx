import { Button, Box, Paper, makeStyles, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Axios from 'axios';
import { ShowMessage } from '../../Actions/actions';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: ' 320px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  paper: {
    width: '320px',
  },
  form: {
    marginTop: '10px',
    paddingBottom: '10px',
  },
}));

const RegisterPage = () => {
  const [firstName, handleFirstName] = useState('');
  const [lastName, handleLastName] = useState('');
  const [emailAddress, handleEmail] = useState('');
  const [password, handlePassword] = useState('');
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleRegister = () => {
    Axios.post('/api/v1/user/register', {
      emailAddress: emailAddress,
      firstName: firstName,
      lastName: lastName,
      password: password,
    })
      .then((res) => {
        console.log(res);
        dispatch(ShowMessage('Registered'));
        reset();
      })
      .catch((err) => {
        dispatch(ShowMessage('Unable to register'));
      });
  };

  const reset = () => {
    handleFirstName('');
    handleLastName('');
    handleEmail('');
    handlePassword('');
  };

  return (
    <Paper elevation={2} className={classes.container} p={3}>
      <Box p={3}>
        <TextField
          fullWidth
          label="First Name"
          value={firstName}
          onChange={(e) => handleFirstName(e.target.value)}
        />

        <TextField
          fullWidth
          label="Last Name"
          value={lastName}
          onChange={(e) => handleLastName(e.target.value)}
        />

        <TextField
          fullWidth
          label="Email Address"
          onChange={(e) => handleEmail(e.target.value)}
          value={emailAddress}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          onChange={(e) => handlePassword(e.target.value)}
          value={password}
        />
        <Button
          className={classes.button}
          color="secondary"
          variant="outlined"
          onClick={() => reset()}
        >
          Reset
        </Button>

        <Button className={classes.button} variant="outlined" onClick={() => handleRegister()}>
          Register
        </Button>
      </Box>
    </Paper>
  );
};

export default RegisterPage;
