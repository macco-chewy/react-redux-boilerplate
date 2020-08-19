import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';

import { config } from 'store';

import 'normalize.css';
import 'styles/base.css';

import Authenticator from 'containers/Authenticator';
import App from 'apps/Default';

// configure Amplify
async function loadApp() {
  Amplify.configure(await config.get('amplify'));

  ReactDOM.render(
    <Authenticator>
      <App />
    </Authenticator>,
    document.getElementById('root')
  );
};
loadApp();

require('zs-common/dist/index.js');




