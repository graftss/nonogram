import React from 'react';
import { Button } from 'semantic-ui-react';

import Timer from './Timer';

const getClassName = (activeCellState, data) => [
  'palette-color',
  data.className,
  activeCellState === data.cellState ? 'palette-active' : '',
].join(' ');

const PaletteButton = ({ ...props }) => (
  <Button
    className="palette-button"
    color="black"
    fluid
    size="mini"
    {...props}
  />
);

export default ({
  activeCellState,
  canRedo,
  canUndo,
  colors,
  loadState,
  palette,
  redo,
  saveState,
  setActiveCellState,
  startTime,
  undo,
}) => (
  <div className="palette-container">
    <div className="timer-container">
      <Timer startTime={startTime} />
    </div>
    <div className="palette-colors-container">
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
    </div>
    <div style={{ marginTop: '20px' }}>
      <PaletteButton
        content="undo (Q)"
        disabled={!canUndo}
        onClick={undo}
      />
      <PaletteButton
        content="redo (⇧Q)"
        disabled={!canRedo}
        onClick={redo}
      />
      <PaletteButton
        content="save state (⇧S)"
        onClick={saveState}
      />
      <PaletteButton
        content="load state (⇧L)"
        onClick={loadState}
      />
    </div>
  </div>
);
