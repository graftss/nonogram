import React from 'react';
import { Button } from 'semantic-ui-react';

import Timer from './Timer';
import { CELL_STATES } from '../../state/constants';

const getClassName = (activeCellState, data) => [
  'palette-color',
  data.className,
  activeCellState === data.cellState ? 'palette-active' : '',
].join(' ');

const PaletteButton = ({ ...props }) => (
  <Button
    className="palette-button"
    color="black"
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
    {palette.map((data, index) => (
      <span
        className={getClassName(activeCellState, data)}
        key={index}
        onClick={() => setActiveCellState(data.cellState)}
        style={{
          backgroundColor: data.color,
          color: data.cellState === CELL_STATES.UNFILLED ? 'white' : data.color
        }}
      >
        <span className="palette-hotkey">{index + 1}</span>
      </span>
    ))}
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
);
