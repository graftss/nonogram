import { assocPath } from 'ramda';

import { TYPES } from './actions';

const initialState = {
  filled: {},
  size: 10,
  dragSource: undefined,
  dropTarget: undefined,
  dragging: false,
};

const indexToCoords = (size, index) => [index % size, Math.floor(index / size)];
const coordsToIndex = (size, coords) => coords[0] + coords[1] * size;

const indicesInRect = (size, source, target) => {
  const sourceCoords = indexToCoords(size, source);
  const targetCoords = indexToCoords(size, target);

  const xRange = [
    Math.min(sourceCoords[0], targetCoords[0]),
    Math.max(sourceCoords[0], targetCoords[0]),
  ];

  const yRange = [
    Math.min(sourceCoords[1], targetCoords[1]),
    Math.max(sourceCoords[1], targetCoords[1]),
  ];

  const result = [];

  for (let x = xRange[0]; x <= xRange[1]; x++) {
    for (let y = yRange[0]; y <= yRange[1]; y++) {
      result.push(coordsToIndex(size, [x, y]));
    }
  }

  return result;
};

const toggleFill = (state, index) => {
  const currentFill = state.filled[index];
  return assocPath(['filled', index], !currentFill, state);
};

const setFill = fill => (state, index) => assocPath(['filled', index], fill, state);

export default (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case TYPES.GRID_TOGGLE_CELL: {
      const { index } = payload;

      return {
        ...state,
        filled: { ...state.filled, [index]: !state.filled[index] },
      };
    }

    case TYPES.GRID_BEGIN_DRAG: {
      const { index } = payload;

      return {
        ...state,
        dragSource: index,
      };
    }

    case TYPES.GRID_DRAG_OVER: {
      const { index } = payload;

      return {
        ...state,
        dropTarget: index,
        dragging: true,
      };
    }

    case TYPES.GRID_END_DRAG: {
      const { index } = payload;
      const { dragSource } = state;

      const currentFill = state.filled[dragSource];
      const toggledIndices = indicesInRect(state.size, dragSource, index);

      return toggledIndices.reduce(setFill(!currentFill), state);
    }

    default: return state;
  }
}
