import React from 'react';

import { CELL_STATES } from '../../state/constants';

const palette = [
  { className: 'palette-filled', cellState: CELL_STATES.FILLED },
  { className: 'palette-unfilled', cellState: CELL_STATES.UNFILLED },
];

const getClassName = (activeCellState, data) => [
  'palette',
  data.className,
  activeCellState === data.cellState ? 'palette-active' : '',
].join(' ');

export default ({
  activeCellState,
  setActiveCellState,
}) => (
  <div className="palette-container">
    {palette.map(data => (
      <div
        key={data.cellState}
        className={getClassName(activeCellState, data)}
        onClick={() => setActiveCellState(data.cellState)}
      >
      </div>
    ))}
  </div>
);
