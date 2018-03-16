import { curry, equals, props, range } from 'ramda';

import { CELL_STATES } from '../constants';
import * as selectors from './selectors';

const row = curry((width, cellStates, index) => (
  props(range(0, width).map(i => i + width * index), cellStates)
));

const column = curry((width, height, cellStates, index) => (
  props(range(0, height).map(i => i * width + index), cellStates)
));

const isFilled = state => (
  ![CELL_STATES.EMPTY, CELL_STATES.UNFILLED, undefined].includes(state)
);

export const validateSegment = (cellStates, validBlocks, validColors) => {
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

  const observedConstraint = blocks.filter(block => isFilled(block.state));
  const observedBlocks = observedConstraint.map(b => b.length);
  const observedColors = observedConstraint.map(b => b.state);

  return equals(observedBlocks, validBlocks) &&
    equals(observedColors, validColors);
};

export default state => {
  const width = selectors.gridWidth(state);
  const height = selectors.gridHeight(state);
  const cellStates = selectors.cellStates(state);
  const constraintsH = selectors.constraintsH(state);
  const constraintsV = selectors.constraintsV(state);

  const getRow = row(width, cellStates);
  const getColumn = column(width, height, cellStates);

  const checkRow = index => validateSegment(
    getRow(index),
    constraintsH.blocks[index],
    constraintsH.colors[index],
  );

  const checkColumn = index => validateSegment(
    getColumn(index),
    constraintsV.blocks[index],
    constraintsV.colors[index],
  );

  for (let i = 0; i < width; i++) {
    if (!checkColumn(i)) return false;
  }

  for (let i = 0; i < height; i++) {
    if (!checkRow(i)) return false;
  }

  return true;
};
