import React, { Component } from 'react';
import { keys } from 'ramda';

import PaletteComponent from './PaletteComponent';
import { CELL_STATES } from '../../state/constants';

const basePalette = [
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
      colors,
      loadState,
      redo,
      saveState,
      setActiveCellState,
      undo,
    } = this.props;

    const lowerBound = 49; // the 1 key
    const upperBound = lowerBound + keys(colors).length;

    if (keyCode >= lowerBound && keyCode <= upperBound) {
      // digit corresponding to palette colors
      const index = keyCode - lowerBound;
      setActiveCellState(index);
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

  getPalette() {
    const { colors } = this.props;

    const colorPalette = keys(colors).map(cellState => ({
      color: colors[cellState],
      cellState: Number(cellState),
    }));

    return basePalette.concat(colorPalette);
  }

  render() {
    return <PaletteComponent palette={this.getPalette()} {...this.props} />;
  }
}
