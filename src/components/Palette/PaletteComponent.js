import React from 'react';
import { Icon } from 'semantic-ui-react';

const getClassName = (activeCellState, data) => [
  'palette',
  data.className,
  activeCellState === data.cellState ? 'palette-active' : '',
].join(' ');

export default ({
  activeCellState,
  canRedo,
  canUndo,
  colors,
  palette,
  redo,
  setActiveCellState,
  undo,
}) => (
  <div className="palette-container">
    {palette.map((data, index) => (
      <div key={data.cellState}>
        <span className="palette-hotkey">{index + 1} </span>
        <div
          style={{ backgroundColor: data.color }}
          className={getClassName(activeCellState, data)}
          onClick={() => setActiveCellState(data.cellState)}
        >
        </div>
      </div>
    ))}
    <div style={{ marginTop: '20px' }}>
      <div>
        <span className="palette-action">
          <Icon
            disabled={!canUndo}
            fitted
            onClick={undo}
            name="arrow left"
            size="large"
          />
        </span>
      </div>
      <div>
        <span className="palette-action">
          <Icon
            disabled={!canRedo}
            fitted
            onClick={redo}
            name="arrow right"
            size="large"
          />
        </span>
      </div>
    </div>
  </div>
);
