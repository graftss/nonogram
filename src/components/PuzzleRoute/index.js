import React, { Component } from 'react';

import CompleteModal from './CompleteModal';
import ConstraintsV from '../ConstraintsV';
import ConstraintsH from '../ConstraintsH';
import Grid from '../Grid';
import Palette from '../Palette';
import connect from '../../state/connect';

const connections = {
  actions: [
    'push',
    'setActiveCellState',
  ],
  selectors: [
    'activeCellState',
    'constraintsH',
    'constraintsV',
    'gridSize',
    'isValid',
  ],
};

class App extends Component {
  constructor() {
    super();

    this.state = {
      completeModalOpen: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.isValid && !prevProps.isValid) {
      this.setState({ completeModalOpen: true });
    }
  }

  onModalClose = () => {
    this.props.push('/puzzles');
  }

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
        <CompleteModal
          onClose={this.onModalClose}
          open={this.state.completeModalOpen}
        />
      </div>
    );
  }
}

export default connect(connections)(App);
