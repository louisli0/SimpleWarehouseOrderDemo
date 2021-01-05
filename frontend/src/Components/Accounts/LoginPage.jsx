import { Button, Input, InputLabel, FormControl, Paper, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Login } from '../../Actions/actions';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: ' 320px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
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

const LoginPage = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    console.log('loggedInSuccess?', props);
  }, [props]);

  const handleLogin = () => {
    dispatch(
      Login({
        email: email,
        password: password,
      })
    );
  };

  return (
    <Paper elevation={2} className={classes.container} p={2}>
      <FormControl className={classes.form}>
        <InputLabel>Email Address</InputLabel>
        <Input fullWidth onChange={(e) => setEmail(e.target.value)} value={email} />
      </FormControl>
      <FormControl className={classes.form}>
        <InputLabel>Password</InputLabel>
        <Input
          fullWidth
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </FormControl>
      <Button className={classes.button} variant="outlined" onClick={() => handleLogin()}>
        Login
      </Button>
    </Paper>
  );
};

export default LoginPage;
