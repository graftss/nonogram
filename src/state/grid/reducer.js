import { __, assoc, assocPath, compose, curry, merge, reduce } from 'ramda';

import { TYPES } from './actions';
import { CELL_STATES } from '../constants';
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
  size: 4,
  dragSource: undefined,
  dropTarget: undefined,
  activeCellState: CELL_STATES.FILLED,
  dragging: false,
  constraintsV: [[2], [], [1], [1], [1], [1], [1], [1], [1], [1]],
  constraintsH: [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
};

const toggleFill = (index, state) => {
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

      return toggleFill(index, state);
    }

    case TYPES.GRID_BEGIN_DRAG: {
      const { index } = payload;

      return assoc('dragSource', index, state);
    }

    case TYPES.GRID_DRAG_OVER: {
      const { index } = payload;
      const { activeCellState, dragSource, size } = state;

      const cellState = state.cellStates[dragSource];
      const indices = indicesInRect(size, dragSource, index);
      const reducer = setDragFill(toggleCellState(activeCellState, cellState));

      const updates = {
        dropTarget: index,
        dragging: true,
        dragStates: {},
      };

      return compose(
        reduce(reducer, __, indices),
        merge(__, updates),
      )(state);
    }

    case TYPES.GRID_END_DRAG: {
      const { index } = payload;
      const { activeCellState, dragSource, size } = state;

      const cellState = state.cellStates[dragSource];
      const indices = indicesInRect(size, dragSource, index);
      const reducer = setFill(toggleCellState(activeCellState, cellState));

      const updates = {
        dragStates: {},
        dragging: false,
      };

      return compose(
        reduce(reducer, __, indices),
        merge(__, updates),
      )(state);
    }

    case TYPES.GRID_CANCEL_DRAG: {
      const updates = {
        dragging: false,
        dragStates: {},
      };

      return merge(state, updates);
    }

    case TYPES.GRID_SET_ACTIVE_CELL_STATE: {
      const { cellState } = payload;

      return assoc('activeCellState', cellState, state);
    }

    default: return state;
  }
}
