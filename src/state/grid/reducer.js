import { assocPath } from 'ramda';

import { TYPES } from './actions';
import { CELL_STATES } from '../constants';
import { indicesInRect } from '../../utils';

const toggleCellState = cellState => {
  switch (cellState) {
    case CELL_STATES.EMPTY: return CELL_STATES.FILLED;

    case CELL_STATES.FILLED:
    case CELL_STATES.UNFILLED: return CELL_STATES.EMPTY;

    default: return CELL_STATES.FILLED;
  }
};

const initialState = {
  cellStates: {},
  dragStates: {},
  size: 10,
  dragSource: undefined,
  dropTarget: undefined,
  dragging: false,
};

const toggleFill = (state, index) => {
  const currentFill = state.cellStates[index];
  return assocPath(['cellStates', index], toggleCellState(currentFill), state);
};

const setFill = fill => (state, index) => (
  assocPath(['cellStates', index], fill, state)
);

const setDragFill = fill => (s, i) => assocPath(['dragStates', i], fill, s);

export default (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case TYPES.GRID_TOGGLE_CELL: {
      const { index } = payload;

      return toggleFill(state, index);
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

      const cellState = state.cellStates[dragSource];
      const indices = indicesInRect(size, dragSource, index);
      state.dragStates = {};

      return {
        ...indices.reduce(setDragFill(toggleCellState(cellState)), state),
        dropTarget: index,
        dragging: true,
      };
    }

    case TYPES.GRID_END_DRAG: {
      const { index } = payload;
      const { dragSource, size } = state;

      const cellState = state.cellStates[dragSource];
      const indices = indicesInRect(size, dragSource, index);

      return {
        ...indices.reduce(setFill(toggleCellState(cellState)), state),
        dragging: false,
        dragStates: {},
      };
    }

    case TYPES.GRID_CANCEL_DRAG: {
      return {
        ...state,
        dragging: false,
        dragStates: {},
      };
    }

    default: return state;
  }
}
