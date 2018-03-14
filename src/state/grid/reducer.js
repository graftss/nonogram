import { assocPath } from 'ramda';

import { TYPES } from './actions';
import { indicesInRect } from '../../utils';

const initialState = {
  filled: {},
  dragFilled: {},
  size: 10,
  dragSource: undefined,
  dropTarget: undefined,
  dragging: false,
};

const toggleFill = (state, index) => {
  const currentFill = state.filled[index];
  return assocPath(['filled', index], !currentFill, state);
};

const setFill = fill => (state, index) => assocPath(['filled', index], fill, state);
const setDragFill = fill => (s, i) => assocPath(['dragFilled', i], fill, s);

export default (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case TYPES.GRID_TOGGLE_CELL: {
      const { index } = payload;

      return {
        ...state,
        filled: { ...state.filled, [index]: !state.filled[index] },
      };
    }

    case TYPES.GRID_BEGIN_DRAG: {
      const { index } = payload;

      return {
        ...state,
        dragSource: index,
      };
    }

    case TYPES.GRID_DRAG_OVER: {
      const { index } = payload;
      const { dragSource, size } = state;

      const currentFill = state.filled[dragSource];
      const indices = indicesInRect(size, dragSource, index);
      state.dragFilled = {};

      return {
        ...indices.reduce(setDragFill(!currentFill), state),
        dropTarget: index,
        dragging: true,
      };
    }

    case TYPES.GRID_END_DRAG: {
      const { index } = payload;
      const { dragSource, size } = state;

      const currentFill = state.filled[dragSource];
      const indices = indicesInRect(size, dragSource, index);

      return {
        ...indices.reduce(setFill(!currentFill), state),
        dragging: false,
        dragFilled: {},
      };
    }

    default: return state;
  }
}
