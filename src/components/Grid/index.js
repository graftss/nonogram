import React, { Component } from 'react';
import { compose, range } from 'ramda';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import './Grid.css';
import connect from '../../state/connect';
import Cell from '../Cell';

const connections = {
  actions: [
    'beginDrag',
    'cancelDrag',
    'dragOver',
    'endDrag',
    'toggleCell',
  ],
  selectors: [
    'cellState',
    'gridSize',
  ],
}

class PuzzleGrid extends Component {
  getStyle() {
    const { gridSize } = this.props;

    return {
      gridTemplateRows: `repeat(${gridSize}, 1fr)`,
      gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    };
  }

  onBeginDrag = index => this.props.beginDrag(index);

  onCellClick = index => this.props.toggleCell(index);

  onCellDragOver = index => this.props.dragOver(index);

  onCellEndDrag = index => this.props.endDrag(index);

  onCellCancelDrag = () => this.props.cancelDrag();

  render() {
    const {
      cellState,
      gridSize,
    } = this.props;

    const cells = range(0, gridSize * gridSize);

    return (
      <div className="grid" style={this.getStyle()}>
        {cells.map(index => (
          <Cell
            cellState={cellState(index)}
            index={index}
            key={index}
            onBeginDrag={this.onBeginDrag}
            onCancelDrag={this.onCellCancelDrag}
            onClick={this.onCellClick}
            onDragOver={this.onCellDragOver}
            onEndDrag={this.onCellEndDrag}
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
