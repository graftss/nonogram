import { routerReducer as router } from 'react-router-redux';
import { combineReducers } from 'redux';

import grid from './grid/reducer';

export default combineReducers({
  grid,
  router,
});
