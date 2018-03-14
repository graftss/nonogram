import React, { Component } from 'react';

import connect from '../../state/connect';

const connections = {
  selectors: ['gridSize', 'constraintsV'],
};

const longestEltLength = lists => lists.reduce(
  (acc, next) => Math.max(acc, next.length),
  0,
);

class Constraints extends Component {
  getStyle() {
    const { gridSize } = this.props;

    return {
      gridTemplateRows: `1fr`,
      gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    };
  }

  renderConstraintsV() {
    const { constraintsV } = this.props;
    const result = [];

    const maxY = longestEltLength(constraintsV);

    for (let y = maxY - 1; y >= 0; y--) {
      for (let x = 0; x < constraintsV.length; x++) {
        result.push(
          <div key={`${x},${y}`}>{constraintsV[x][y]}</div>
        );
      }
    }

    return result;
  }

  render() {

    return (
      <div className="constraints" style={this.getStyle()}>
        {this.renderConstraintsV()}
      </div>
    );
  }
}

export default connect(connections)(Constraints);
