import React, { Component } from 'react';

import PaletteComponent from './PaletteComponent';
import { CELL_STATES } from '../../state/constants';

const palette = [
  { className: 'palette-filled', cellState: CELL_STATES.FILLED },
  { className: 'palette-unfilled', cellState: CELL_STATES.UNFILLED },
];

export default class Palette extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown);
  }

  onKeydown = e => {
    const { keyCode, shiftKey } = e;
    const {
      loadState,
      redo,
      saveState,
      setActiveCellState,
      undo,
    } = this.props;

    const lowerBound = 49; // the 1 key
    const upperBound = lowerBound + palette.length - 1;

    if (keyCode >= lowerBound && keyCode <= upperBound) {
      // digit corresponding to palette colors
      const index = keyCode - lowerBound;
      setActiveCellState(palette[index].cellState);
    } else if (keyCode === 81 && shiftKey) {
      // shift + q
      redo();
    } else if (keyCode === 81) {
      // q
      undo();
    } else if (shiftKey && keyCode === 83) {
      // shift + s
      saveState(1);
    } else if (shiftKey && keyCode === 76) {
      // shift + l
      loadState(1);
    }
  }

  render() {
    return <PaletteComponent palette={palette} {...this.props} />;
  }
}
