import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import appReducer from './appReducer';
import messageReducer from './messageReducer';

const createRootReducer = (history) =>
  combineReducers({
    app: appReducer,
    msg: messageReducer,
    router: connectRouter(history),
  });

export default createRootReducer;
