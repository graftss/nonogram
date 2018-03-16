import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

import CompleteModal from './CompleteModal';
import Grid from '../Grid';
import Palette from '../Palette';
import connect from '../../state/connect';

const connections = {
  actions: [
    'loadState',
    'push',
    'redo',
    'saveState',
    'setActiveCellState',
    'undo',
  ],
  selectors: [
    'activeCellState',
    'canRedo',
    'canUndo',
    'constraintsH',
    'constraintsV',
    'gridColors',
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
      gridColors,
      loadState,
      redo,
      saveState,
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
            colors={gridColors}
            loadState={loadState}
            redo={redo}
            saveState={saveState}
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
