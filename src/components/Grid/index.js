import React, { Component } from 'react';
import { compose, range, splitEvery, zipWith } from 'ramda';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import './Grid.css';
import connect from '../../state/connect';
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
    const {
      cellColor,
      gridWidth,
    } = this.props;

    const [col, row] = indexToCoords(gridWidth, index);
    let cellClassName = '';

    if (col % 5 === 4) cellClassName += 'puzzle-cell-boundary-right ';
    else if (col % 5 === 0) cellClassName += 'puzzle-cell-boundary-left ';

    if (row % 5 === 4) cellClassName += 'puzzle-cell-boundary-bottom ';
    else if (row % 5 === 0) cellClassName += 'puzzle-cell-boundary-top ';

    return (
      <td
        className={`${cellClassName} cell`}
        key={index}
        onMouseDown={() => this.onCellClick(index)}
        style={{ backgroundColor: cellColor(index) || 'white' }}
      />
    );
  }

  renderCellGrid() {
    const { gridHeight, gridWidth } = this.props;

    const dragAreaClassNames = this.getDragAreaClassNames();
    const renderCell = this.renderCell(dragAreaClassNames);
    const cells = range(0, gridHeight * gridWidth).map(renderCell);

    return splitEvery(gridWidth, cells);
  }

  renderGridData() {
    const {
      gridColor,
      normalizedConstraints: { h, v },
    } = this.props;

    const cellGrid = this.renderCellGrid();

    const renderConstraints = (row, rowIndex) => row.map((c, colIndex) => ((
      <td
        className={c ? 'constraint-cell ' : 'constraint-cell-empty '}
        key={[rowIndex, colIndex]}
        style={c && {
          backgroundColor: gridColor(c[1]),
          color: gridColor(c[1]),
        }}
      >
        {c ? <span className="constraint noselect">{c[0]}</span> : null}
    </td>
    )));

    const constraintsH = h.map(renderConstraints);
    const constraintsV = v.map(renderConstraints);

    return constraintsV.concat(zipWith((a, b) => a.concat(b), constraintsH, cellGrid));
  }

  render() {
    const data = this.renderGridData();

    return (
      <table className="puzzle-table">
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

const connected = connect(connections);
const draggable = DragDropContext(HTML5Backend);

export default compose(
  connected,
  draggable,
)(Grid);
