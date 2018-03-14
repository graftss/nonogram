import React, { Component } from 'react';

import ConstraintsV from '../ConstraintsV';
import ConstraintsH from '../ConstraintsH';
import Grid from '../Grid';
import Palette from '../Palette';
import connect from '../../state/connect';

const connections = {
  actions: ['setActiveCellState'],
  selectors: ['activeCellState'],
};

class App extends Component {
  render() {
    const {
      activeCellState,
      setActiveCellState,
    } = this.props;

    return (
      <div className="App">
        <ConstraintsV />
        <ConstraintsH />
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
