import axios from 'axios';
import { push } from 'connected-react-router';
import { addLeadingSlash } from 'history/PathUtils';
import { LOGIN_OK, LOGOUT_OK, LOGOUT_FAIL, USER_DATA, SHOW_MESSAGE, CLEAR_MESSAGE } from './types';

export const Login = (data) => (dispatch, getState) => {
  axios
    .post('/api/v1/user/login', {
      emailAddress: data.email,
      password: data.password,
    })
    .then((res) => {
      if (res.data === 'Login Failed') {
        dispatch({
          type: SHOW_MESSAGE,
          payload: 'Incorrect Email/Password combination',
        });
      }

      dispatch({
        type: SHOW_MESSAGE,
        payload: 'Logged in',
      });

      dispatch({
        type: LOGIN_OK,
        payload: {
          uID: res.data.uID,
          access: res.data.access,
          refresh: res.data.refresh,
          role: res.data.role,
          lastLoginDate: res.data.lastLoginDate,
        },
      });
      dispatch(GetUserData(res.data.uID, res.data.access));
      // Push to previous location?
    })
    .catch((err) => {
      if (err.response.status == 401) {
        dispatch({
          type: SHOW_MESSAGE,
          payload: 'Incorrect Email/Password combination',
        });
      } else {
        dispatch({
          type: SHOW_MESSAGE,
          payload: `Internal Error`,
        });
      }
    });
};

export const GetUserData = (id, at) => (dispatch) => {
  axios
    .post(`http://localhost:3200/api/v1/user/${id}`, {})
    .then((result) => {
      const { firstname, lastname, emailaddress } = result.data[0];
      console.log(result.data);
      dispatch({
        type: USER_DATA,
        payload: {
          firstname: firstname,
          lastname: lastname,
          emailaddress: emailaddress,
        },
      });
    })
    .catch((err) => {
      console.log('Get user data error', err);
    });
};

export const Logout = () => (dispatch, getState) => {
  console.log('Dispatch Logout');
  axios
    .post('/api/v1/user/logout', {
      data: getState().app.auth,
    })
    .then((res) => {
      if (res.status == 204) {
        console.log('Logout successfull');
      }
      dispatch({
        type: LOGOUT_OK,
        payload: null,
      });
      dispatch(push('/'));
    })
    .catch((err) => {
      console.log('Failed to logout', err);
      // Retry?
      return dispatch({
        type: LOGOUT_FAIL,
        payload: null,
      });
    });
};

export const ShowMessage = (data) => (dispatch) => {
  return dispatch({
    type: SHOW_MESSAGE,
    payload: data,
  });
};

export const ClearMessage = () => (dispatch) => {
  return dispatch({
    type: CLEAR_MESSAGE,
    payload: '',
  });
};

export const ItemAdd = (data) => (dispatch) => {
  axios
    .post('http://localhost:3200/api/v1/item/', {
      name: data.name,
      category: data.category,
      description: data.description,
    })
    .then((result) => {
      console.log('Item add success', result.data);
      dispatch({
        type: SHOW_MESSAGE,
        payload: 'Item Added',
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SHOW_MESSAGE,
        payload: 'Failed to add item',
      });
    });
};

export const RefreshToken = (data) => (dispatch) => {
  console.log('Refresh', data);
  try {
    axios
      .post(
        '/api/v1/user/refresh',
        {
          userId: data.uId,
          refreshToken: data.refreshToken,
        },
        {
          headers: {
            Authorization: data.accessToken,
          },
        }
      )
      .then((res) => {
        console.log(res.data);

        dispatch({
          type: LOGIN_OK,
          payload: {
            uID: res.data.uID,
            access: res.data.access,
            refresh: res.data.refresh,
            role: res.data.role,
            lastLoginDate: res.data.lastLoginDate,
          },
        });
        return true;
      })
      .catch((err) => {
        console.log('refresh error1', err);
        return false;
      });
  } catch (err) {
    console.log('refresh error2', err);
    return false;
  }
};
