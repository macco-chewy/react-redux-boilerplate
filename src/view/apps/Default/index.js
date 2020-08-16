import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

import { store, history } from 'store';

import StandardLayout from 'layouts/StandardLayout';
import Home from 'pages/Home';
import Page1 from 'pages/Page1';
import Page2 from 'pages/Page2';
import Page3 from 'pages/Page3';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <StandardLayout>
            <Switch>
              <Route exact path="/home" component={Home} />
              <Route exact path="/page1" component={Page1} />
              <Route exact path="/page2" component={Page2} />
              <Route exact path="/page3" component={Page3} />
              <Redirect to="/home" />
            </Switch>
          </StandardLayout>
        </ConnectedRouter>
      </Provider>
    );
  }
}
