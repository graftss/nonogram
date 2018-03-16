import { curry, equals, props, range } from 'ramda';

import { CELL_STATES } from '../constants';

const row = curry((width, cellStates, index) => (
  props(range(0, width).map(i => i + width * index), cellStates)
));

const column = curry((width, height, cellStates, index) => (
  props(range(0, height).map(i => i * width + index), cellStates)
));

const isFilled = state => (
  ![CELL_STATES.EMPTY, CELL_STATES.UNFILLED, undefined].includes(state)
);

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
  cellStates,
  constraintsH,
  constraintsV,
  height,
  width,
}) => {
  const getRow = row(width, cellStates);
  const getColumn = column(width, height, cellStates);

  const checkRow = index => validateSegment(getRow(index), constraintsH[index]);
  const checkColumn = index => validateSegment(getColumn(index), constraintsV[index]);

  for (let i = 0; i < width; i++) {
    if (!checkColumn(i)) return false;
  }

  for (let i = 0; i < height; i++) {
    if (!checkRow(i)) return false;
  }

  return true;
};
