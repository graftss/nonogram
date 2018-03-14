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
