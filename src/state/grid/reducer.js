import {
  __,
  assoc,
  assocPath,
  compose,
  curry,
  init,
  last,
  merge,
  reduce,
  takeLast,
} from 'ramda';

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
  history: { past: [], future: [] },
  currentHistoryIndex: -1,
  dragStates: {},
  size: 4,
  dragSource: undefined,
  dropTarget: undefined,
  activeCellState: CELL_STATES.FILLED,
  dragging: false,
  constraintsV: [[2], [], [1], [1], [1], [1], [1], [1], [1], [1]],
  constraintsH: [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
};

const toggleFill = curry((index, state) => {
  const currentFill = state.cellStates[index];
  return assocPath(
    ['cellStates', index],
    toggleCellState(state.activeCellState, currentFill),
    state,
  );
});

const setFill = fill => (state, index) => (
  assocPath(['cellStates', index], fill, state)
);

const setDragFill = fill => (s, i) => assocPath(['dragStates', i], fill, s);

const addPastHistory = curry((cellStates, state) => {
  const newPast = takeLast(10, state.history.past.concat(cellStates));
  const newHistory = { past: newPast, future: [] };

  return assoc('history', newHistory, state);
});

const undoHistory = state => {
  const { history, cellStates } = state;

  if (history.past.length === 0) return state;

  const newHistory = {
    past: init(history.past),
    future: [cellStates, ...history.future],
  };

  return merge(state, {
    history: newHistory,
    cellStates: last(history.past),
  });
};

const redoHistory = state => {
  const { history, cellStates } = state;

  if (history.future.length === 0) return state;

  const newHistory = {
    past: [...history.past, cellStates],
    future: history.future.slice(1),
  };

  return merge(state, {
    history: newHistory,
    cellStates: history.future[0],
  });
};

const clearFuture = state => (
  assocPath(['history', 'future'], [], state)
);

export default (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case TYPES.GRID_TOGGLE_CELL: {
      const { index } = payload;

      return compose(
        addPastHistory(state.cellStates),
        toggleFill(index),
      )(state);
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

    case TYPES.GRID_CANCEL_DRAG: {
      const { activeCellState, cellStates, dragSource, dropTarget, size } = state;

      const cellState = state.cellStates[dragSource];
      const indices = indicesInRect(size, dragSource, dropTarget);
      const reducer = setFill(toggleCellState(activeCellState, cellState));

      const updates = {
        dragStates: {},
        dragging: false,
      };

      return compose(
        reduce(reducer, __, indices),
        merge(__, updates),
        addPastHistory(cellStates),
      )(state);
    }

    case TYPES.GRID_SET_ACTIVE_CELL_STATE: {
      const { cellState } = payload;

      return assoc('activeCellState', cellState, state);
    }

    case TYPES.GRID_UNDO: {
      return undoHistory(state);
    }

    case TYPES.GRID_REDO: {
      return redoHistory(state);
    }

    default: return state;
  }
}
