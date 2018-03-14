import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

import Grid from '../Grid';
import Constraints from '../Constraints';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Constraints />
        <Grid />
      </div>
    );
  }
}

export default App;
