import React from 'react';
import ReactDOM from 'react-dom';

import 'normalize.css';
import './styles/base.css';

import App from './view/apps/Default';

require('zs-common/dist/index.js');

ReactDOM.render(<App />, document.getElementById('root'));
