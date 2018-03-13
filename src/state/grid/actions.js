import { argCreator, keyMirror } from '../../utils';

export const TYPES = keyMirror([
  'GRID_TOGGLE_CELL',
]);

export const toggleCell = argCreator(TYPES.GRID_TOGGLE_CELL, ['index']);
