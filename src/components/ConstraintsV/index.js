import React, { Component } from 'react';

import connect from '../../state/connect';
import { longestEltLength } from '../../utils';

const connections = {
  selectors: ['gridSize', 'constraintsV'],
};

class ConstraintsV extends Component {
  getStyle() {
    const { gridSize } = this.props;

    return {
      gridTemplateRows: `1fr`,
      gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    };
  }

  renderConstraints() {
    const { constraintsV, gridSize } = this.props;
    const result = [];

    const maxY = longestEltLength(constraintsV);

    for (let y = maxY - 1; y >= 0; y--) {
      for (let x = 0; x < gridSize; x++) {
        result.push(
          <div key={`${x},${y}`}>{constraintsV[x][y]}</div>
        );
      }
    }

    return result;
  }

  render() {

    return (
      <div className="constraints-v" style={this.getStyle()}>
        {this.renderConstraints()}
      </div>
    );
  }
}

export default connect(connections)(ConstraintsV);
