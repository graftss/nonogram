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
    'gridHeight',
    'gridWidth',
  ],
}

class Grid extends Component {
  getStyle() {
    const { gridHeight, gridWidth } = this.props;

    return {
      gridTemplateRows: `repeat(${gridHeight}, 1fr)`,
      gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
    };
  }

  // returns an object mapping cell indices to class names
  getCellClassNames() {
    const {
      gridDragging,
      gridDragSource,
      gridDropTarget,
      gridHeight,
      gridWidth
    } = this.props;
    const result = {};

    if (!gridDragging) return result;

    for (let i = 0; i < gridHeight * gridWidth; i++) {
      result[i] = '';
    }

    const {
      xRange: [xMin, xMax],
      yRange: [yMin, yMax],
    } = rectCoordRanges(gridWidth, gridDragSource, gridDropTarget);

    result[coordsToIndex(gridWidth, [xMin, yMin])] += 'cell-drag-top-left ';
    result[coordsToIndex(gridWidth, [xMin, yMax])] += 'cell-drag-bottom-left ';
    result[coordsToIndex(gridWidth, [xMax, yMin])] += 'cell-drag-top-right ';
    result[coordsToIndex(gridWidth, [xMax, yMax])] += 'cell-drag-bottom-right ';

    for (let x = xMin + 1; x < xMax; x++) {
      result[coordsToIndex(gridWidth, [x, yMin])] += 'cell-drag-top ';
      result[coordsToIndex(gridWidth, [x, yMax])] += 'cell-drag-bottom ';
    }

    for (let y = yMin + 1; y < yMax; y++) {
      result[coordsToIndex(gridWidth, [xMin, y])] += 'cell-drag-left ';
      result[coordsToIndex(gridWidth, [xMax, y])] += 'cell-drag-right ';
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
      gridHeight,
      gridWidth,
    } = this.props;

    const cellIndices = range(0, gridHeight * gridWidth);
    const cellClassNames = this.getCellClassNames();

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
