import { curry, path } from 'ramda';

export const isCellFilled = curry(
  (state, index) => !!path(['filled', index], state)
);
