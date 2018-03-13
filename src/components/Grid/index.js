import React, { Component } from 'react';
import { range } from 'ramda';

import './Grid.css';
import Cell from '../Cell';

export default class PuzzleGrid extends Component {
  getStyle() {
    const size = 15;

    return {
      gridTemplateRows: `repeat(${size}, 1fr)`,
      gridTemplateColumns: `repeat(${size}, 1fr)`,
    };
  }

  onCellClick = index => {
    console.log('clicked', index);
  }

  render() {
    const size = 15;
    const cells = range(0, size * size);

    return (
      <div className="grid" style={this.getStyle()}>
        {cells.map(index => (
          <Cell
            index={index}
            key={index}
            onClick={this.onCellClick}
          />
        ))}
      </div>
    );
  }
}
