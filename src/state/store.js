import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';

import reducer from './reducer';

export default ({ history }) => (
  createStore(
    reducer,
    applyMiddleware(
      routerMiddleware(history),
      logger,
    )
  )
);
