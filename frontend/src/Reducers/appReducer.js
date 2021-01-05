import { LOGIN_OK, LOGIN_FAIL, USER_DATA, LOGOUT_OK } from '../Actions/types';

const initState = {
  auth: {
    isLoggedIn: false,
    uID: '',
    accessToken: '',
    refreshToken: '',
    role: '',
    lastLoginDate: '',
  },
  user: {
    firstName: '',
    lastName: '',
    emailAddress: '',
  },
};

function appReducer(state = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_OK:
      return {
        ...state,
        auth: {
          accessToken: payload.access,
          refreshToken: payload.refresh,
          uId: payload.uID,
          role: payload.role,
          lastLoginDate: payload.lastLoginDate,
        },
        isLoggedIn: true,
      };
    case LOGIN_FAIL:
      return { ...state, isLoggedIn: false };
    case LOGOUT_OK:
      return { isLoggedIn: false };
    case USER_DATA:
      return {
        ...state,
        user: {
          firstName: payload.firstname,
          lastName: payload.lastname,
          emailAddress: payload.emailaddress,
          lastLoginDate: payload.lastlogindate,
        },
      };
    default:
      return state;
  }
}

export default appReducer;
