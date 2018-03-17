import React, { Component } from 'react';
import { compose, range, splitEvery, zipWith } from 'ramda';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import './Grid.css';
import connect from '../../state/connect';
import Cell from '../Cell';
import BaseGrid from './BaseGrid';
import { coordsToIndex, indexToCoords, rectCoordRanges } from '../../utils';

const connections = {
  actions: [
    'beginDrag',
    'cancelDrag',
    'dragOver',
    'focusCell',
    'toggleCell',
    'unfocusCell',
  ],
  selectors: [
    'cellColor',
    'cellState',
    'focusedCell',
    'fullHeight',
    'fullWidth',
    'normalizedConstraints',
    'gridColor',
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
  getDragAreaClassNames() {
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

  renderCell = dragAreaClassNames => index => {
    const { cellState, cellColor, focusCell, unfocusCell } = this.props;
    const color = cellColor(index);

    return (
      <Cell
        cellClassName={dragAreaClassNames[index] || ''}
        cellState={cellState(index)}
        color={color}
        focusCell={focusCell}
        index={index}
        key={index}
        onBeginDrag={this.onBeginDrag}
        onCancelDrag={this.onCellCancelDrag}
        onClick={this.onCellClick}
        onDragOver={this.onCellDragOver}
        unfocusCell={unfocusCell}
      />
    );
  }

  renderCellGrid() {
    const { gridHeight, gridWidth } = this.props;

    const cellIndices = range(0, gridHeight * gridWidth);
    const dragAreaClassNames = this.getDragAreaClassNames();
    const cells = cellIndices
      .map(this.renderCell(dragAreaClassNames))
      .map((node, index) => {
        const [col, row] = indexToCoords(gridWidth, index);
        let cellClassName = '';

        if (col % 5 === 4) cellClassName += 'puzzle-cell-boundary-right ';
        else if (col % 5 === 0) cellClassName += 'puzzle-cell-boundary-left ';

        if (row % 5 === 4) cellClassName += 'puzzle-cell-boundary-bottom ';
        else if (row % 5 === 0) cellClassName += 'puzzle-cell-boundary-top ';

        return {
          node,
          cellProps: { className: cellClassName },
        };
      });

    return splitEvery(gridWidth, cells);
  }

  renderGridData() {
    const {
      gridColor,
      normalizedConstraints: { h, v },
    } = this.props;

    const cellGrid = this.renderCellGrid();

    const renderConstraints = row => row.map(c => ({
      node: c ? <span className="constraint noselect">{c[0]}</span> : null,
      cellProps: {
        className: (c ? 'constraint-cell ' : 'constraint-cell-empty ') +
          ((c && c[2]) ? 'constraint-cell-focused ' : ''),

        // the font color is set as the same as the background color here, then
        // inverted via css
        style: c && {
          backgroundColor: gridColor(c[1]),
          color: gridColor(c[1]),
        },
      },
    }));

    const constraintsH = h.map(renderConstraints);
    const constraintsV = v.map(renderConstraints);

    console.log({ constraintsH, constraintsV });

    return constraintsV.concat(zipWith((a, b) => a.concat(b), constraintsH, cellGrid));
  }

  render() {
    const {
      fullHeight,
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
