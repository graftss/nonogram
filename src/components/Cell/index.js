import React, { Component } from 'react';
import { compose } from 'ramda';
import { DragSource, DropTarget } from 'react-dnd';

const cellSource = {
  beginDrag(props) {
    return { index: props.index };
  },
};

const dragCollect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
};

const cellTarget = {
  canDrop(props) {
    return (props.index === 15);
  },

  drop(props, monitor) {
    console.log('drop top', { props });
  },
};

const dropCollect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
};

class Cell extends Component {
  render() {
    const {
      connectDragSource,
      connectDropTarget,
      filled,
      index,
      isDragging,
      isOver,
      onClick,
    } = this.props;

    if (isDragging) {
      console.log('dragging', index);
    }

    if (isOver) {
      console.log('isOver', index);
    }

    return connectDropTarget(connectDragSource(
      <div
        className={filled ? 'filled' : ''}
        onClick={() => onClick(index)}
      >
        .
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
