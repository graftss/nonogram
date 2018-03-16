import React, { Component } from 'react';
import { compose, range } from 'ramda';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import './Grid.css';
import connect from '../../state/connect';
import Cell from '../Cell';
import { coordsToIndex, rectCoordRanges } from '../../utils';

const connections = {
  actions: [
    'beginDrag',
    'cancelDrag',
    'dragOver',
    'toggleCell',
  ],
  selectors: [
    'cellState',
    'gridDragging',
    'gridDragSource',
    'gridDropTarget',
    'gridSize',
  ],
}

class Grid extends Component {
  getStyle() {
    const { gridSize } = this.props;

    return {
      gridTemplateRows: `repeat(${gridSize}, 1fr)`,
      gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    };
  }

  // returns an object mapping cell indices to class names
  getCellClassNames() {
    const {
      gridDragging,
      gridDragSource,
      gridDropTarget,
      gridSize,
    } = this.props;
    const result = {};

    if (!gridDragging) return result;

    for (let i = 0; i < gridSize * gridSize; i++) {
      result[i] = '';
    }

    const {
      xRange: [xMin, xMax],
      yRange: [yMin, yMax],
    } = rectCoordRanges(gridSize, gridDragSource, gridDropTarget);

    result[coordsToIndex(gridSize, [xMin, yMin])] += 'cell-drag-top-left ';
    result[coordsToIndex(gridSize, [xMin, yMax])] += 'cell-drag-bottom-left ';
    result[coordsToIndex(gridSize, [xMax, yMin])] += 'cell-drag-top-right ';
    result[coordsToIndex(gridSize, [xMax, yMax])] += 'cell-drag-bottom-right ';

    for (let x = xMin + 1; x < xMax; x++) {
      result[coordsToIndex(gridSize, [x, yMin])] += 'cell-drag-top ';
      result[coordsToIndex(gridSize, [x, yMax])] += 'cell-drag-bottom ';
    }

    for (let y = yMin + 1; y < yMax; y++) {
      result[coordsToIndex(gridSize, [xMin, y])] += 'cell-drag-left ';
      result[coordsToIndex(gridSize, [xMax, y])] += 'cell-drag-right ';
    }

    return result;
  }

  onBeginDrag = index => this.props.beginDrag(index);

  onCellClick = index => this.props.toggleCell(index);

  onCellDragOver = index => this.props.dragOver(index);

  onCellCancelDrag = () => this.props.cancelDrag();

  render() {
    const {
      cellState,
      gridSize,
    } = this.props;

    const cellIndices = range(0, gridSize * gridSize);
    const cellClassNames = this.getCellClassNames();

    console.log('cellclass names', cellClassNames);

    return (
      <div className="grid" style={this.getStyle()}>
        {cellIndices.map(index => (
          <Cell
            cellClassName={cellClassNames[index] || ''}
            cellState={cellState(index)}
            index={index}
            key={index}
            onBeginDrag={this.onBeginDrag}
            onCancelDrag={this.onCellCancelDrag}
            onClick={this.onCellClick}
            onDragOver={this.onCellDragOver}
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
)(Grid);
