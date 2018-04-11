/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { PortfolioBuilderApp } from './Components/PortfolioBuilderApp';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<PortfolioBuilderApp />, document.getElementById('root'));
registerServiceWorker();
