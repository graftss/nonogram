import { curry, equals, props, range } from 'ramda';

import { CELL_STATES } from '../constants';

const row = curry((size, cellStates, index) => (
  props(range(0, size).map(i => i + size * index), cellStates)
));

const column = curry((size, cellStates, index) => (
  props(range(0, size).map(i => i * size + index), cellStates)
));

const isFilled = state => ![CELL_STATES.EMPTY, CELL_STATES.UNFILLED].includes(state);

export const validateSegment = (cellStates, constraint) => {
  const blocks = [];
  let currentBlock = { state: cellStates[0], length: 1 };

  for (let state of cellStates.slice(1)) {
    if (state === currentBlock.state) {
      currentBlock.length += 1;
    } else {
      blocks.push(currentBlock);
      currentBlock = { state, length: 1 };
    }
  }

  blocks.push(currentBlock);

  const observedConstraint = blocks
    .filter(block => isFilled(block.state))
    .map(block => block.length);

  return equals(constraint, observedConstraint);
};

export default ({
  size,
  cellStates,
  constraintsH,
  constraintsV,
}) => {


};
