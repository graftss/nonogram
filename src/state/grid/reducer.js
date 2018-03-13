import { TYPES } from './actions';

const initialState = {
  filled: {},
};

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

    default: return state;
  }
}
