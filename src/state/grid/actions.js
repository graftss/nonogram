import { argCreator, constantCreator, keyMirror } from '../../utils';

export const TYPES = keyMirror([
  'GRID_BEGIN_DRAG',
  'GRID_CANCEL_DRAG',
  'GRID_DRAG_OVER',
  'GRID_FOCUS_CELL',
  'GRID_LOAD_STATE',
  'GRID_REDO',
  'GRID_SAVE_STATE',
  'GRID_SET_ACTIVE_CELL_STATE',
  'GRID_SET_START_TIME',
  'GRID_TOGGLE_CELL',
  'GRID_TOGGLE_RECT',
  'GRID_UNDO',
  'GRID_UNFOCUS_CELL',
]);

export const toggleCell = argCreator(TYPES.GRID_TOGGLE_CELL, ['index']);

export const focusCell = argCreator(TYPES.GRID_FOCUS_CELL, ['index']);

export const unfocusCell = constantCreator(TYPES.GRID_UNFOCUS_CELL);

export const toggleRect = argCreator(
  TYPES.GRID_TOGGLE_RECT,
  ['sourceIndex', 'targetIndex'],
);

export const beginDrag = argCreator(TYPES.GRID_BEGIN_DRAG, ['index']);

export const dragOver = argCreator(TYPES.GRID_DRAG_OVER, ['index']);

export const cancelDrag = constantCreator(TYPES.GRID_CANCEL_DRAG);

export const setActiveCellState = argCreator(
  TYPES.GRID_SET_ACTIVE_CELL_STATE,
  ['cellState']
);

export const undo = constantCreator(TYPES.GRID_UNDO);

export const redo = constantCreator(TYPES.GRID_REDO);

export const saveState = argCreator(TYPES.GRID_SAVE_STATE, ['index']);

export const loadState = argCreator(TYPES.GRID_LOAD_STATE, ['index']);

export const setStartTime = argCreator(TYPES.GRID_SET_START_TIME, ['time']);
