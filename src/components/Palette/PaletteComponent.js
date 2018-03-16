import React from 'react';
import { Button } from 'semantic-ui-react';

import Timer from './Timer';

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
  loadState,
  palette,
  redo,
  saveState,
  setActiveCellState,
  undo,
}) => (
  <div className="palette-container">
    <div className="timer-container"><Timer /></div>
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
      <Button
        className="palette-button"
        content="undo (Q)"
        disabled={!canUndo}
        fluid
        onClick={undo}
        size="mini"
      />
      <Button
        className="palette-button"
        content="redo (⇧Q)"
        disabled={!canRedo}
        fluid
        onClick={redo}
        size="mini"
      />
      <Button
        className="palette-button"
        content="save state (⇧S)"
        fluid
        onClick={saveState}
        size="mini"
      />
      <Button
        className="palette-button"
        content="load state (⇧L)"
        fluid
        onClick={loadState}
        size="mini"
      />
    </div>
  </div>
);

