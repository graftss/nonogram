import React, { Component } from 'react';
import { Container, Icon } from 'semantic-ui-react';

import CompleteModal from './CompleteModal';
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
    'gridHeight',
    'gridWidth',
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
      canRedo,
      canUndo,
      constraintsH,
      constraintsV,
      gridHeight,
      gridWidth,
      redo,
      setActiveCellState,
      undo,
    } = this.props;

    return (
      <div className="App">
        <Container textAlign="center">
          <Grid />
          <Palette
            activeCellState={activeCellState}
            canRedo={canRedo}
            canUndo={canUndo}
            redo={redo}
            setActiveCellState={setActiveCellState}
            undo={undo}
          />
        </Container>
        <CompleteModal
          onClose={this.onModalClose}
          open={this.state.completeModalOpen}
        />
      </div>
    );
  }
}

export default connect(connections)(App);
