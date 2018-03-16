import React, { Component } from 'react';

export default class BaseGrid extends Component {
  getStyle() {
    const { height, width } = this.props;

    return {
      gridTemplateRows: `repeat(${height}, 30px)`,
      gridTemplateColumns: `repeat(${width}, 30px)`,
    };
  }

  renderData() {
    const { data, height, width } = this.props;
    const result = [];

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        result.push(<div key={`${i},${j}`}>{data[i][j]}</div>);
      }
    }

    return result;
  }

  render() {
    return (
      <div className="grid" style={this.getStyle()}>
        {this.renderData()}
      </div>
    )
  }
}
