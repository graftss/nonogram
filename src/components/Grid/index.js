import React, { Component } from 'react';
import { compose, range } from 'ramda';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import './Grid.css';
import connect from '../../state/connect';
import Cell from '../Cell';

const connections = {
  actions: ['toggleCell'],
  selectors: ['isCellFilled'],
}

class PuzzleGrid extends Component {
  getStyle() {
    const { size } = this.props;

    return {
      gridTemplateRows: `repeat(${size}, 1fr)`,
      gridTemplateColumns: `repeat(${size}, 1fr)`,
    };
  }

  onCellClick = index => {
    this.props.toggleCell(index);
  }

  render() {
    const {
      isCellFilled,
      size,
    } = this.props;

    const cells = range(0, size * size);

    return (
      <div className="grid" style={this.getStyle()}>
        {cells.map(index => (
          <Cell
            filled={isCellFilled(index)}
            index={index}
            key={index}
            onClick={this.onCellClick}
          />
        ))}
      </div>
    );
  }
}

const connected = connect(connections);
const draggable = DragDropContext(HTML5Backend);

export default compose(
  connected,
  draggable,
)(PuzzleGrid);
