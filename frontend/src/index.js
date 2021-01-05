import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import configureStore, { history } from './store';
import { loadState, saveState } from './localstorage';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import { RefreshToken } from './Actions/actions';
require('lodash.throttle');
import './index.css';
import Dashboard from './Routes/DashboardRoutes';
import PublicRoutes from './Routes/PublicRoutes';
import UserRoutes from './Routes/UserRoutes';
import Error from './Pages/Error';
import Message from './Components/Message';

const persistState = loadState();
const store = configureStore(persistState);
store.subscribe(() => {
  saveState(store.getState());
}, 1000);

axios.interceptors.request.use(
  (config) => {
    const { accessToken } = loadState().app.auth;
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
      return config;
    } else {
      return config;
    }
  },
  (error) => {
    console.log('Request intercept error');
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (err) {
    const lastRequest = err.config;
    if (err.response.status == 403) {
      const { uId, accessToken, refreshToken } = loadState().app.auth;
      if (refreshToken && accessToken && uId) {
        //Is Token Expired?

        console.log('Attempting refresh token');
        let a = store.dispatch(
          RefreshToken({
            accessToken: accessToken,
            uId: uId,
            refreshToken: refreshToken,
          })
        );

        if (a) {
          console.log('refresh ok');
          return axios.request(lastRequest);
        } else {
          console.log('refresh fail');
          return Promise.reject(err);
        }
      }
    }
    console.log(' interceptor Return error');
    return Promise.reject(err);
  }
);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4C5454',
    },
    secondary: {
      main: '#FF715B',
    },
    error: {
      main: '#FF2605',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/user" component={UserRoutes} />
            <Route path="/" component={PublicRoutes} />
            <Route component={Error} />
          </Switch>
        </ConnectedRouter>
        <Message />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
