import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

// import * as globalReducer from './global';
import { user } from './user';

export default (history) =>
  combineReducers({
    // global: combineReducers(globalReducer, {}),
    user,
    router: connectRouter(history),
  });
