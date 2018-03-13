import React from 'react';
import createBrowserHistory from 'history/createBrowserHistory';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import './index.css';
import App from './components/App';
import createStore from './state/store';

const history = createBrowserHistory();
const store = createStore({ history });

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
