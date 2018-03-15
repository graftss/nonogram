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
    const { redo, setActiveCellState, undo } = this.props;

    const lowerBound = 49;
    const upperBound = lowerBound + palette.length - 1;

    if (keyCode >= lowerBound && keyCode <= upperBound) {
      const index = keyCode - lowerBound;
      this.props.setActiveCellState(palette[index].cellState);
    } else if (keyCode === 81 && shiftKey) {
      // shift + q
      redo();
    } else if (keyCode === 81) {
      // q
      undo();
    }
  }

  render() {
    return <PaletteComponent palette={palette} {...this.props} />;
  }
}
