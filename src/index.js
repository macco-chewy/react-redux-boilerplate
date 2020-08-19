import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';

import config from 'config';

import 'normalize.css';
import 'styles/base.css';

import Authenticator from 'containers/Authenticator';
import App from 'apps/Default';

// configure Amplify
Amplify.configure(config.amplify);

ReactDOM.render(
  <Authenticator>
    <App />
  </Authenticator>,
  document.getElementById('root')
);

require('zs-common/dist/index.js');




