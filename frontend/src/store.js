import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from './Reducers';

export const history = createBrowserHistory();

export default function configureStore(persistedState) {
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    createRootReducer(history),
    persistedState,
    composeEnhancer(applyMiddleware(routerMiddleware(history), thunk))
  );
  return store;
}
