import { argCreator, constantCreator, keyMirror } from '../../utils';

export const TYPES = keyMirror([
  'GRID_BEGIN_DRAG',
  'GRID_CANCEL_DRAG',
  'GRID_DRAG_OVER',
  'GRID_END_DRAG',
  'GRID_REDO',
  'GRID_SET_ACTIVE_CELL_STATE',
  'GRID_TOGGLE_CELL',
  'GRID_TOGGLE_RECT',
  'GRID_UNDO',
]);

export const toggleCell = argCreator(TYPES.GRID_TOGGLE_CELL, ['index']);

export const toggleRect = argCreator(
  TYPES.GRID_TOGGLE_RECT,
  ['sourceIndex', 'targetIndex'],
);

export const beginDrag = argCreator(TYPES.GRID_BEGIN_DRAG, ['index']);

export const dragOver = argCreator(TYPES.GRID_DRAG_OVER, ['index']);

export const endDrag = argCreator(TYPES.GRID_END_DRAG, ['index']);

export const cancelDrag = constantCreator(TYPES.GRID_CANCEL_DRAG);

export const setActiveCellState = argCreator(
  TYPES.GRID_SET_ACTIVE_CELL_STATE,
  ['cellState']
);

export const undo = constantCreator(TYPES.GRID_UNDO);

export const redo = constantCreator(TYPES.GRID_REDO);
