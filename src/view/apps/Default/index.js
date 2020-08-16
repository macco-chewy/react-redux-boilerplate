import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

import { store, history } from 'store';

import StandardLayout from 'layouts/StandardLayout';
import Home from 'pages/Home';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <StandardLayout>
            <Switch>
              <Route exact path="/home" component={Home} />
              <Redirect to="/home" />
            </Switch>
          </StandardLayout>
        </ConnectedRouter>
      </Provider>
    );
  }
}
