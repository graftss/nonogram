import { assocPath } from 'ramda';

import { TYPES } from './actions';
import { indicesInRect } from '../../utils';

const initialState = {
  filled: {},
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

      return {
        ...state,
        dropTarget: index,
        dragging: true,
      };
    }

    case TYPES.GRID_END_DRAG: {
      const { index } = payload;
      const { dragSource } = state;

      const currentFill = state.filled[dragSource];
      const toggledIndices = indicesInRect(state.size, dragSource, index);

      return toggledIndices.reduce(setFill(!currentFill), state);
    }

    default: return state;
  }
}
