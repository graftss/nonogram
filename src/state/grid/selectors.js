import { curry, prop, zip, zipWith } from 'ramda';

import validate from './validate';
import { longestEltLength, pad, rotateMatrix } from '../../utils';

export const cellStates = prop('cellStates');

export const cellState = curry(
  (state, index) => {
    const dragState = state.dragStates[index];
    return dragState === undefined ? state.cellStates[index] : dragState;
  }
);

export const gridWidth = prop('width');

export const gridHeight = prop('height');

export const gridColors = prop('colors');

export const gridColor = curry((state, id) => gridColors(state)[id]);

export const cellColor = curry(
  (state, index) => gridColors(state)[cellState(state, index)]
);

export const constraintsH = state => ({ blocks: state.blocksH, colors: state.colorsH });

export const constraintsV = state => ({ blocks: state.blocksV, colors: state.colorsV });

export const constraintWidth = state => longestEltLength(constraintsH(state).blocks);

export const constraintHeight = state => longestEltLength(constraintsV(state).blocks);

export const fullWidth = state => gridWidth(state) + constraintWidth(state);

export const fullHeight = state => gridHeight(state) + constraintHeight(state);

const padLeftMap = (length, array) => array.map(row => pad(length, null, true, row));

export const normalizedConstraints = state => {
  const ch = constraintsH(state);
  const zippedH = zipWith(zip, ch.blocks, ch.colors);
  const normalizedH = padLeftMap(constraintWidth(state), zippedH);

  const cv = constraintsV(state);
  const zippedV = zipWith(zip, cv.blocks, cv.colors);
  const paddedV = padLeftMap(constraintHeight(state), zippedV);
  const orientedV = rotateMatrix(paddedV);
  const normalizedV = padLeftMap(fullWidth(state), orientedV);

  return { h: normalizedH, v: normalizedV };
};

export const activeCellState = prop('activeCellState');

export const isValid = validate;

export const canUndo = state => state.history.past.length > 0;

export const canRedo = state => state.history.future.length > 0;

export const gridDragSource = prop('dragSource');

export const gridDropTarget = prop('dropTarget');

export const gridDragging = prop('dragging');
