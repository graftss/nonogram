import React, { Component } from 'react';
import { compose, range, splitEvery, zipWith } from 'ramda';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import './Grid.css';
import connect from '../../state/connect';
import { coordsToIndex, indexToCoords, rectCoordRanges } from '../../utils';
import { CELL_STATES } from '../../state/constants';

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
  constructor() {
    super();

    this.state = {
      mouseDown: false,
      mouseDownIndex: undefined,
    };
  }

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

  onCellClick = index => {
    if (!this.props.gridDragging) {
      this.props.toggleCell(index);
    }
  }

  onCellMouseDown = index => {
    this.setState({ mouseDown: true, mouseDownIndex: index });
  }

  onCellMouseUp = index => {
    this.setState({ mouseDown: false });
    if (this.props.gridDragging) {
      this.props.cancelDrag();
    }
  }

  onCellMouseOver = index => {
    const { mouseDown, mouseDownIndex } = this.state;
    const { gridDragging } = this.props;

    if (mouseDown && mouseDownIndex !== index) {
      if (!gridDragging) {
        this.props.beginDrag(mouseDownIndex);
      }
      this.onCellDragOver(index);
    }
  }

  onCellDragOver = index => this.props.dragOver(index);

  onCellCancelDrag = () => this.props.cancelDrag();

  renderCell = dragAreaClassNames => index => {
    const {
      cellColor,
      cellState,
      gridWidth,
    } = this.props;

    const state = cellState(index);
    const [col, row] = indexToCoords(gridWidth, index);
    const dragAreaClassName = dragAreaClassNames[index];
    let cellClassName = '';

    if (state === CELL_STATES.UNFILLED) cellClassName += 'unfilled ';

    if (col % 5 === 4) cellClassName += 'puzzle-cell-boundary-right ';
    else if (col % 5 === 0) cellClassName += 'puzzle-cell-boundary-left ';

    if (row % 5 === 4) cellClassName += 'puzzle-cell-boundary-bottom ';
    else if (row % 5 === 0) cellClassName += 'puzzle-cell-boundary-top ';

    return (
      <td
        className={`${cellClassName} ${dragAreaClassName} cell`}
        key={index}
        onClick={() => this.onCellClick(index)}
        onMouseDown={() => this.onCellMouseDown(index)}
        onMouseUp={this.onCellMouseUp}
        onMouseOver={() => this.onCellMouseOver(index)}
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

  renderNormalizedConstraint = (row, rowIndex) => row.map((c, colIndex) => {
    const { gridColor  } = this.props;

    return (
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
    );
  })

  renderGridData() {
    const { normalizedConstraints: { h, v } } = this.props;

    const cellGrid = this.renderCellGrid();
    const constraintsH = h.map(this.renderNormalizedConstraint);
    const constraintsV = v.map(this.renderNormalizedConstraint);

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
