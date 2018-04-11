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
    this.removeScripFromPortfolio = this.removeScripFromPortfolio.bind(this);
    this.addPortfolioScripCount = this.addPortfolioScripCount.bind(this);
  }

  addScripToPortfolio(scripName) {
    if (scripName in this.allScripPrices) {
      this.setState((oldState) => {
        const oldPortfolioScripPrices = oldState.portfolioScripPrices;
        const newPortfolioScripPrices = deepCloneNaive(oldPortfolioScripPrices);
        newPortfolioScripPrices[scripName] = this.allScripPrices[scripName];

        const oldPortfolioScripCounts = oldState.portfolioScripCounts;
        const newPortfolioScripCounts = deepCloneNaive(oldPortfolioScripCounts);
        newPortfolioScripCounts[scripName] = newPortfolioScripCounts[scripName] || 1;

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

  addPortfolioScripCount(scripName, incrementBy) {
    this.setState((oldState) => {
      if (scripName in this.state.portfolioScripPrices) {
        const oldPortfolioScripCounts = oldState.portfolioScripCounts;
        const newPortfolioScripCounts = deepCloneNaive(oldPortfolioScripCounts);
        newPortfolioScripCounts[scripName] += incrementBy;

        return {
          portfolioScripCounts: newPortfolioScripCounts,
        };
      }
      return {};
    });
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
            portfolioScripCounts={this.state.portfolioScripCounts}
            addScripToPortfolio={this.addScripToPortfolio}
            removeScripFromPortfolio={this.removeScripFromPortfolio}
            addPortfolioScripCount={this.addPortfolioScripCount}
          />
        </div>
      </div>
    );
  }
}

export { PortfolioBuilderApp };
