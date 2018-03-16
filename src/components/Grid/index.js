import React, { Component } from 'react';
import { compose, range, splitEvery, zipWith } from 'ramda';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import './Grid.css';
import connect from '../../state/connect';
import Cell from '../Cell';
import BaseGrid from './Grid';
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
    'fullHeight',
    'fullWidth',
    'normalizedConstraints',
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

  renderCell = cellClassNames => index => {
    const { cellState } = this.props;

    return (
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
    );
  }

  renderGridData() {
    const { gridHeight, gridWidth, normalizedConstraints } = this.props;
    const { h, v } = normalizedConstraints;

    const cellIndices = range(0, gridHeight * gridWidth);
    const cellClassNames = this.getCellClassNames();
    const cells = cellIndices.map(this.renderCell(cellClassNames));
    const cellGrid = splitEvery(gridWidth, cells);

    const renderConstraints = row => row.map(c => (
      c === null ? null : <div className="constraint">{c}</div>
    ));

    const constraintsH = h.map(renderConstraints);
    const constraintsV = v.map(renderConstraints);

    return constraintsV.concat(zipWith((a, b) => a.concat(b), constraintsH, cellGrid));
  }

  render() {
    const {
      fullHeight,
      gridHeight,
      fullWidth,
    } = this.props;

    return (
      <BaseGrid
        data={this.renderGridData()}
        height={fullHeight}
        width={fullWidth}
      />
    );
  }
}

const connected = connect(connections);
const draggable = DragDropContext(HTML5Backend);

export default compose(
  connected,
  draggable,
)(Grid);
