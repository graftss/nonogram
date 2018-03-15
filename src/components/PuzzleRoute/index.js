import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';

import CompleteModal from './CompleteModal';
import ConstraintsV from '../ConstraintsV';
import ConstraintsH from '../ConstraintsH';
import Grid from '../Grid';
import Palette from '../Palette';
import connect from '../../state/connect';

const connections = {
  actions: [
    'push',
    'redo',
    'setActiveCellState',
    'undo',
  ],
  selectors: [
    'activeCellState',
    'canRedo',
    'canUndo',
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
      canRedo,
      canUndo,
      constraintsH,
      constraintsV,
      redo,
      setActiveCellState,
      undo,
    } = this.props;

    return (
      <div className="App">
        <button onClick={undo}>hi</button>
        <button onClick={redo}>hi</button>
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
          canRedo={canRedo}
          canUndo={canUndo}
          redo={redo}
          setActiveCellState={setActiveCellState}
          undo={undo}
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
