import React from 'react';
import ReactDOM from 'react-dom';
import PortfolioBuilderApp from './PortfolioBuilderApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PortfolioBuilderApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
