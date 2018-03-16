import { curry, prop } from 'ramda';

import validate from './validate';

export const cellState = curry(
  (state, index) => {
    const dragState = state.dragStates[index];
    return dragState === undefined ? state.cellStates[index] : dragState;
  }
);

export const gridSize = prop('size');

export const constraintsV = prop('constraintsV');

export const constraintsH = prop('constraintsH');

export const activeCellState = prop('activeCellState');

export const isValid = validate;

export const canUndo = state => state.history.past.length > 0;

export const canRedo = state => state.history.future.length > 0;

export const gridDragSource = prop('dragSource');

export const gridDropTarget = prop('dropTarget');

export const gridDragging = prop('dragging');
