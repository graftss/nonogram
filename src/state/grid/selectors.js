import { curry, path, prop } from 'ramda';

export const isCellFilled = curry(
  (state, index) => {
    const dragFilled = state.dragFilled[index];
    return dragFilled === undefined ? state.filled[index] : dragFilled;
  }
)

export const gridSize = prop('size');
