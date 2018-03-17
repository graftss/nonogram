import React, { Component } from 'react';
import { compose } from 'ramda';
import { DragSource, DropTarget } from 'react-dnd';

import { CELL_STATES } from '../../state/constants';

const cellSource = {
  beginDrag(props) {
    return { index: props.index };
  },

  endDrag(props) {
    props.onCancelDrag();
  }
};

const dragCollect = (connect, monitor) => {
  return {
    connectDragPreview: connect.dragPreview(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
};

const cellTarget = {
  canDrop(props) {
    return true;
  },
};

const dropCollect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
};

class Cell extends Component {
  componentDidMount() {
    // minimal (transparent) empty image
    const img = new Image();
    img.onload = () => this.props.connectDragPreview(img);
    img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  }

  componentDidUpdate(prevProps) {
    const {
      index,
      isDragging,
      isOver,
      onBeginDrag,
      onDragOver,
    } = this.props;

    if (!prevProps.isDragging && isDragging) {
      onBeginDrag(index);
    }

    if (!prevProps.isOver && isOver) {
      onDragOver(index);
    }
  }

  onMouseOver = () => {
    const { focusCell, index } = this.props;

    focusCell(index);
  }

  onMouseLeave = () => {
    this.props.unfocusCell();
  }

  innerCellClass() {
    switch (this.props.cellState) {
      case CELL_STATES.UNFILLED: return 'unfilled';
      default: return '';
    }
  }

  render() {
    const {
      cellClassName,
      color,
      connectDragSource,
      connectDropTarget,
      index,
      onClick,
    } = this.props;

    return connectDropTarget(connectDragSource(
      <div
        className={`cell ${cellClassName}`}
        onClick={() => onClick(index)}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
        style={{ backgroundColor: color }}
      >
        <div className={this.innerCellClass()}>
        </div>
      </div>
    ));
  }
}

const asDragSource = DragSource('cell', cellSource, dragCollect);
const asDropTarget = DropTarget('cell', cellTarget, dropCollect);

export default compose(
  asDropTarget,
  asDragSource,
)(Cell);
