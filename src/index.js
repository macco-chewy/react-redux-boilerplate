import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Default from './components/entries/Default';
import Admin from "./components/entries/Admin";

ReactDOM.render(
  <React.StrictMode>
    <Default />
  </React.StrictMode>,
  document.getElementById("root")
);