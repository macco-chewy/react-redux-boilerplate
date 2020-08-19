import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { ZSConfigurationManager } from 'zs-common/dist/classes';

import createRootReducer from 'reducers';

const loggerMiddleware = createLogger();

const initialState = {};

// exports
export const history = createBrowserHistory();

export default function configureReduxStore(preloadedState) {
  // eslint-disable-next-line
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const middleware = [
    thunkMiddleware,
    ...(['development', 'local', 'test'].find((e) => e === process.env.NODE_ENV)
      ? [loggerMiddleware]
      : []),
  ];
  return createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancer(applyMiddleware(routerMiddleware(history), ...middleware)),
  );
}

export const store = configureReduxStore(initialState);

export const config = new ZSConfigurationManager(
  {
    amplify: {
      Auth: {
        region: process.env.COGNITO_REGION,
        userPoolId: process.env.COGNITO_USER_POOL_ID,
        userPoolWebClientId: process.env.COGNITO_CLIENT_ID,
        identityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
      },
      // API: {
      //   endpoints: [
      //     {
      //       name: 'consumer_api',
      //       endpoint: ENV.AWS_API_GATEWAY_ENDPOINT,
      //       key: ENV.AWS_API_GATEWAY_KEY,
      //       region: 'us-west-2',
      //     },
      //   ],
      // },
    },
  },
  {},
  0
);
