import { SHOW_MESSAGE, CLEAR_MESSAGE } from '../Actions/types';

const initState = {
  message: '',
  open: false,
};

function messageReducer(state = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case SHOW_MESSAGE:
      return { ...state, message: payload, open: true };
    case CLEAR_MESSAGE:
      return { ...state, message: '', open: false };
    default:
      return state;
  }
}

export default messageReducer;
