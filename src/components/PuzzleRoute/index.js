import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

import CompleteModal from './CompleteModal';
import Grid from '../Grid';
import Palette from '../Palette';
import connect from '../../state/connect';
import { getTime } from '../../utils';
import puzzles from '../../state/grid/puzzles';

const connections = {
  actions: [
    'loadPuzzle',
    'loadState',
    'push',
    'redo',
    'saveState',
    'setActiveCellState',
    'setStartTime',
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
    'startTime',
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

  componentWillMount() {
    this.props.setStartTime(getTime());
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
      startTime,
      undo,
    } = this.props;

    return (
      <div className="App">
        <Container textAlign="center">
          <button onClick={() => this.props.loadPuzzle(puzzles[0])}> hi </button>
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
            startTime={startTime}
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
