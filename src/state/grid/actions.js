import { argCreator, constantCreator, keyMirror } from '../../utils';

export const TYPES = keyMirror([
  'GRID_BEGIN_DRAG',
  'GRID_CANCEL_DRAG',
  'GRID_DRAG_OVER',
  'GRID_END_DRAG',
  'GRID_TOGGLE_CELL',
  'GRID_TOGGLE_RECT',
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
