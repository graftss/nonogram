import { assocPath } from 'ramda';

import { TYPES } from './actions';
import { CELL_STATES } from '../constants';
import validate from './validate';
import { indicesInRect } from '../../utils';

const toggleCellState = (activeCellState, cellState) => {
  switch (cellState) {
    case CELL_STATES.FILLED:
    case CELL_STATES.UNFILLED: return CELL_STATES.EMPTY;

    case CELL_STATES.EMPTY:
    default: return activeCellState;
  }
};

const initialState = {
  cellStates: {},
  dragStates: {},
  size: 10,
  dragSource: undefined,
  dropTarget: undefined,
  activeCellState: CELL_STATES.FILLED,
  dragging: false,
  constraintsV: [[1, 2], [1], [1], [1], [1], [1, 3, 5, 7], [1], [1], [1], [1]],
  // constraintsH: [[0, 0, 1], [0, 1, 2], [1, 2, 3], [0, 0, 1], [0, 0, 1], [0, 0, 1], [1, 7, 9], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
  constraintsH: [[1], [1, 2], [1, 2, 3], [1], [1], [1], [1, 7, 9], [1], [1], [1]],
};

const toggleFill = (state, index) => {
  const currentFill = state.cellStates[index];
  return assocPath(
    ['cellStates', index],
    toggleCellState(state.activeCellState, currentFill),
    state,
  );
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

      const nextState = toggleFill(state, index);
      validate(state);
      return nextState;
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
      const { activeCellState, dragSource, size } = state;

      const cellState = state.cellStates[dragSource];
      const indices = indicesInRect(size, dragSource, index);
      state.dragStates = {};

      const reducer = setDragFill(toggleCellState(activeCellState, cellState));

      return {
        ...indices.reduce(reducer, state),
        dropTarget: index,
        dragging: true,
      };
    }

    case TYPES.GRID_END_DRAG: {
      const { index } = payload;
      const { activeCellState, dragSource, size } = state;

      const cellState = state.cellStates[dragSource];
      const indices = indicesInRect(size, dragSource, index);

      const reducer = setFill(toggleCellState(activeCellState, cellState));

      return {
        ...indices.reduce(reducer, state),
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

    case TYPES.GRID_SET_ACTIVE_CELL_STATE: {
      const { cellState } = payload;

      return { ...state, activeCellState: cellState };
    }

    default: return state;
  }
}
