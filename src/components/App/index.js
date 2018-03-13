import React, { Component } from 'react';

import './App.css';
import Grid from '../Grid';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div>
          <Grid size={4}/>
        </div>
      </div>
    );
  }
}

export default App;
