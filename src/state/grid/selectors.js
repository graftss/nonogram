import { curry, path, prop, zip, zipWith } from 'ramda';
import { createSelector, createStructuredSelector } from 'reselect';

import validate from './validate';
import {
  longestEltLength,
  pad,
  rotateMatrix,
} from '../../utils';

export const cellStates = prop('cellStates');

export const cellState = curry(
  (state, index) => {
    const dragState = state.dragStates[index];
    return dragState === undefined ? state.cellStates[index] : dragState;
  }
);

export const focusedCell = prop('focused');

export const gridWidth = path(['puzzle', 'width']);

export const gridHeight = path(['puzzle', 'height']);

export const gridColors = path(['puzzle', 'colors']);

export const gridColor = curry((state, id) => gridColors(state)[id]);

export const cellColor = curry(
  (state, index) => gridColors(state)[cellState(state, index)]
);

export const blocksH = path(['puzzle', 'blocksH']);

export const blocksV = path(['puzzle', 'blocksV']);

export const colorsH = path(['puzzle', 'colorsH']);

export const colorsV = path(['puzzle', 'colorsV']);

export const constraintsH = createStructuredSelector({
  blocks: blocksH,
  colors: colorsH,
});

export const constraintsV = createStructuredSelector({
  blocks: blocksV,
  colors: colorsV,
});

export const constraintWidth = state => longestEltLength(blocksH(state));

export const constraintHeight = state => longestEltLength(blocksV(state));

export const fullWidth = state => gridWidth(state) + constraintWidth(state);

export const fullHeight = state => gridHeight(state) + constraintHeight(state);

const padLeftMap = (length, array) => array.map(row => pad(length, null, true, row));

// const addFocusFlag = c => c && [...c, true];

export const normalizedConstraints = createSelector(
  gridWidth,
  constraintWidth,
  fullWidth,
  constraintHeight,
  constraintsH,
  constraintsV,
  (gridWidth, constraintWidth, fullWidth, constraintHeight, constraintsH, constraintsV) => {
    const zippedH = zipWith(zip, constraintsH.blocks, constraintsH.colors);
    const normalizedH = padLeftMap(constraintWidth, zippedH);

    const zippedV = zipWith(zip, constraintsV.blocks, constraintsV.colors);
    const paddedV = padLeftMap(constraintHeight, zippedV);
    const orientedV = rotateMatrix(paddedV);
    const normalizedV = padLeftMap(fullWidth, orientedV);

    return { h: normalizedH, v: normalizedV };
  }
);

export const activeCellState = prop('activeCellState');

export const isValid = validate;

export const canUndo = state => state.history.past.length > 0;

export const canRedo = state => state.history.future.length > 0;

export const gridDragSource = prop('dragSource');

export const gridDropTarget = prop('dropTarget');

export const gridDragging = prop('dragging');

export const startTime = prop('startTime');
