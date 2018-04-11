/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import './PortfolioBuilderApp.css';
import { data } from './data';
import { deepCloneNaive } from '../Utils';
import { StockPicker } from '../StockPicker';
import { PortfolioManager } from '../PortfolioManager';

class PortfolioBuilderApp extends Component {
  constructor(props) {
    super(props);

    this.allScripPrices = data.price;
    this.state = {
      portfolioScripPrices: {
        // scrip name : current price
      },
      portfolioScripCounts: {
        // scrip name : units in portfolio
      },
    };

    this.addScripToPortfolio = this.addScripToPortfolio.bind(this);
  }

  addScripToPortfolio(scripName) {
    if (scripName in this.allScripPrices) {
      this.setState((oldState) => {
        const oldPortfolioScripPrices = oldState.portfolioScripPrices;
        const newPortfolioScripPrices = deepCloneNaive(oldPortfolioScripPrices);
        newPortfolioScripPrices[scripName] = this.allScripPrices[scripName];

        const oldPortfolioScripCounts = oldState.portfolioScripCounts;
        const newPortfolioScripCounts = deepCloneNaive(oldPortfolioScripCounts);
        newPortfolioScripCounts[scripName] = newPortfolioScripCounts[scripName] || 0;

        return {
          portfolioScripPrices: newPortfolioScripPrices,
          portfolioScripCounts: newPortfolioScripCounts,
        };
      });
    }
  }

  removeScripFromPortfolio(scripName) {
    if ((scripName in this.allScripPrices) && (scripName in this.state.portfolioScripPrices)) {
      this.setState((oldState) => {
        const oldPortfolioScripPrices = oldState.portfolioScripPrices;
        const newPortfolioScripPrices = deepCloneNaive(oldPortfolioScripPrices);
        delete newPortfolioScripPrices[scripName];

        const oldPortfolioScripCounts = oldState.portfolioScripCounts;
        const newPortfolioScripCounts = deepCloneNaive(oldPortfolioScripCounts);
        delete newPortfolioScripCounts[scripName];

        return {
          portfolioScripPrices: newPortfolioScripPrices,
          portfolioScripCounts: newPortfolioScripCounts,
        };
      });
    }
  }

  calcRemainingScripPrices() {
    const remainingScripPrices = {};
    Object.keys(this.allScripPrices).forEach((scripName) => {
      if (!(scripName in this.state.portfolioScripPrices)) {
        remainingScripPrices[scripName] = this.allScripPrices[scripName];
      }
    });

    return remainingScripPrices;
  }

  render() {
    return (
      <div className="portfolio-builder-app">
        <div className="header-bar" />
        <div className="body">
          <div className="title">
            smallcase Portfolio Builder
          </div>
          <StockPicker
            remainingScripPrices={this.calcRemainingScripPrices()}
            addScripToPortfolio={this.addScripToPortfolio}
          />
          <PortfolioManager
            portfolioScripPrices={this.state.portfolioScripPrices}
            addScripToPortfolio={this.addScripToPortfolio}
          />
        </div>
      </div>
    );
  }
}

export { PortfolioBuilderApp };
