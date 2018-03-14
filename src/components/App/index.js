import React, { Component } from 'react';

import ConstraintsV from '../ConstraintsV';
import ConstraintsH from '../ConstraintsH';
import Grid from '../Grid';
import Palette from '../Palette';
import connect from '../../state/connect';

const connections = {
  actions: ['setActiveCellState'],
  selectors: [
    'activeCellState',
    'constraintsH',
    'constraintsV',
    'gridSize',
  ],
};

class App extends Component {
  render() {
    const {
      activeCellState,
      gridSize,
      constraintsH,
      constraintsV,
      setActiveCellState,
    } = this.props;

    return (
      <div className="App">
        <ConstraintsV
          gridSize={gridSize}
          constraintsV={constraintsV}
        />
        <ConstraintsH
          gridSize={gridSize}
          constraintsH={constraintsH}
        />
        <Grid />
        <Palette
          activeCellState={activeCellState}
          setActiveCellState={setActiveCellState}
        />
      </div>
    );
  }
}

export default connect(connections)(App);
