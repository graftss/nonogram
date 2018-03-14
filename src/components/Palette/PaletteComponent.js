import React from 'react';

const getClassName = (activeCellState, data) => [
  'palette',
  data.className,
  activeCellState === data.cellState ? 'palette-active' : '',
].join(' ');

export default ({
  activeCellState,
  palette,
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
