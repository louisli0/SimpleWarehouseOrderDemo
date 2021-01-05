import { AppBar, CssBaseline, makeStyles, Toolbar } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    fontWeight: 300,
    textTransform: 'uppercase',
  },
  spacer: {
    flexGrow: 1,
  },
  button: {
    marginRight: '5px',
  },
}));

export default function Header() {
  const isLoggedIn = useSelector((state) => state.app.auth.isLoggedIn);
  const classes = useStyles();
  const history = useHistory();

  const handleLogin = () => {
    history.push('/login');
  };
  const handleRegister = () => {
    history.push('/register');
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            <h2 className={classes.title}>Dispatch</h2>
          </Link>
          <div className={classes.spacer}></div>
          <Button
            className={classes.button}
            variant="outlined"
            color="inherit"
            onClick={() => handleLogin()}
          >
            Login
          </Button>
          <Button
            className={classes.button}
            variant="outlined"
            color="inherit"
            onClick={() => handleRegister()}
          >
            Register
          </Button>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
