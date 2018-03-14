import { curry, path, prop } from 'ramda';

export const isCellFilled = curry(
  (state, index) => !!path(['filled', index], state)
)

export const gridSize = prop('size');
