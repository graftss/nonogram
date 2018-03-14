import React, { Component } from 'react';

import connect from '../../state/connect';

const connections = {
  selectors: ['gridSize', 'constraintsH'],
};

class ConstraintsH extends Component {
  getStyle() {
    const { gridSize } = this.props;

    return {
      gridTemplateRows: `repeat(${gridSize}, 1fr)`,
      gridTemplateColumns: '1fr',
    };
  }

  renderConstraints() {
    const { constraintsH } = this.props;
    const result = [];

    for (let y = 0; y < constraintsH.length; y++) {
      result.push(
        <div key={y} className="constraints-h-cell">
          {constraintsH[y].map((num, index) => (
            <span key={index} className="constraints-h-number"> {num} </span>
          ))}
        </div>
      )
    }

    return result;
  }

  render() {

    return (
      <div className="constraints-h" style={this.getStyle()}>
        {this.renderConstraints()}
      </div>
    );
  }
}

export default connect(connections)(ConstraintsH);
