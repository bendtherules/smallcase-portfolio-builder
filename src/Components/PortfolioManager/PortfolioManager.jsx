/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import './PortfolioManager.css';
import { SectionTitle } from '../SectionTitle';

class PortfolioManager extends Component {
  constructor() {
    super();
  }

  render() {
    const portfolioScripPrices = this.props.portfolioScripPrices;

    return (
      <div
        className="portfolio-manager"
        onDragOver={(ev) => { ev.preventDefault(); }}
        onDrop={(ev) => {
          const scripName = ev.dataTransfer.getData('text/plain');
          this.props.addScripToPortfolio(scripName);
        }}
      >
        <SectionTitle titleText="Manage Portfolio" />

        <div className="drop-block" style={{ width: '100%', height: '500px', border: '1px solid black' }} />
        Please drop here
        <ul>
          {
            Object.keys(portfolioScripPrices).map((scripName) => {
              return (
                <li
                  key={scripName}
                >
                  {scripName} | {portfolioScripPrices[scripName]}
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
}

export { PortfolioManager };
