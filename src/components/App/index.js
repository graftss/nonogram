import React, { Component } from 'react';

import Grid from '../Grid';
import ConstraintsV from '../ConstraintsV';
import ConstraintsH from '../ConstraintsH';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ConstraintsV />
        <ConstraintsH />
        <Grid />
      </div>
    );
  }
}

export default App;
