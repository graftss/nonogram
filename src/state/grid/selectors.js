import { curry, prop } from 'ramda';

import validate from './validate';
import { longestEltLength, pad, rotateMatrix } from '../../utils';

export const cellState = curry(
  (state, index) => {
    const dragState = state.dragStates[index];
    return dragState === undefined ? state.cellStates[index] : dragState;
  }
);

export const gridWidth = prop('width');

export const gridHeight = prop('height');

export const constraintsH = prop('constraintsH');

export const constraintsV = prop('constraintsV');

export const constraintWidth = state => longestEltLength(constraintsH(state));

export const constraintHeight = state => longestEltLength(constraintsV(state));

export const fullWidth = state => gridWidth(state) + constraintWidth(state);

export const fullHeight = state => gridHeight(state) + constraintHeight(state);

export const normalizedConstraints = state => {
  const width = constraintWidth(state);
  const ch = constraintsH(state);
  const normalizedH = ch.map(row => pad(width, null, true, row));

  const height = constraintHeight(state);
  const cv = constraintsV(state);
  const paddedV = cv.map(row => pad(height, null, true, row));
  const orientedV = rotateMatrix(paddedV);

  const normalizedVWidth = fullWidth(state);
  const normalizedV = orientedV.map(row => pad(normalizedVWidth, null, true, row));

  return { h: normalizedH, v: normalizedV };
};

export const activeCellState = prop('activeCellState');

export const isValid = validate;

export const canUndo = state => state.history.past.length > 0;

export const canRedo = state => state.history.future.length > 0;

export const gridDragSource = prop('dragSource');

export const gridDropTarget = prop('dropTarget');

export const gridDragging = prop('dragging');
