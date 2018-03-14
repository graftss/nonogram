import React from 'react';
import { Route, Switch } from 'react-router';

import PuzzleRoute from '../PuzzleRoute';

export default () => (
  <div>
    <Switch>
      <Route path="/puzzle/:id" component={PuzzleRoute} />
    </Switch>
  </div>
);
