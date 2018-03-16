import {
  __,
  assoc,
  assocPath,
  compose,
  curry,
  init,
  last,
  merge,
  path,
  reduce,
  takeLast,
} from 'ramda';

import { TYPES } from './actions';
import { CELL_STATES } from '../constants';
import { indicesInRect } from '../../utils';

const toggleCellState = (activeCellState, cellState) => {
  switch (cellState) {
    case undefined:
    case CELL_STATES.EMPTY: return activeCellState;

    default: return CELL_STATES.EMPTY;
  }
};

const initialState = {
  cellStates: {},
  history: { past: [], future: [] },
  savedStates: {},
  dragStates: {},
  dragSource: undefined,
  dropTarget: undefined,
  activeCellState: CELL_STATES.UNFILLED,
  dragging: false,

  // data comprising a puzzle
  width: 10,
  height: 15,
  colors: { 1: 'black', 2: 'pink', 3: 'orange' },
  blocksV: [[2], [], [1], [1], [1], [1], [1], [1], [1], [1]],
  colorsV: [[2], [], [1], [3], [1], [3], [1], [1], [1], [1]],
  blocksH: [[1], [1], [1], [1, 1], [1, 4], [1], [1], [1], [1, 1], [1, 4], [1], [1], [1], [1, 1], [1, 4]],
  colorsH: [[2], [2], [1], [3, 3], [1, 1], [2], [2], [1], [3, 3], [1, 1], [2], [2], [1], [3, 3], [1, 1]],
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
  const newPast = takeLast(30, state.history.past.concat(cellStates));
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
      const { activeCellState, dragSource, width } = state;

      const cellState = state.cellStates[dragSource];
      const indices = indicesInRect(width, dragSource, index);
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
      const { activeCellState, cellStates, dragSource, dropTarget, width } = state;

      const cellState = state.cellStates[dragSource];
      const indices = indicesInRect(width, dragSource, dropTarget);
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

    case TYPES.GRID_SAVE_STATE: {
      const { index } = payload;
      const { cellStates } = state;

      return assocPath(['savedStates', index], cellStates, state);
    }

    case TYPES.GRID_LOAD_STATE: {
      const { index } = payload;
      const { dragging } = state;
      const cellStates = path(['savedStates', index], state);

      if (dragging) return state;

      const updates = {
        cellStates,
        history: initialState.history,
      };

      return merge(state, updates);
    }

    default: return state;
  }
}
