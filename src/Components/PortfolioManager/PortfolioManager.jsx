/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import './PortfolioManager.css';
import { SectionTitle } from '../SectionTitle';

class PortfolioManager extends Component {
  constructor() {
    super();
  }

  calcNetWorth() {
    let netWorth = 0;
    Object.keys(this.props.portfolioScripCounts).forEach((scripName) => {
      const count = this.props.portfolioScripCounts[scripName];
      const price = this.props.portfolioScripPrices[scripName];
      netWorth += (price * count);
    });

    return netWorth;
  }

  weightInPortfolio(scripName) {
    const count = this.props.portfolioScripCounts[scripName];
    const price = this.props.portfolioScripPrices[scripName];
    const weight = ((count * price) / this.calcNetWorth()) * 100;

    if (Number.isNaN(weight)) {
      return 0;
    }

    return weight;
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

        <div className="body">
          <div className="portfolio-editor">
            <div className="editor-header">
              <div className="section-stock">
                STOCK
              </div>
              <div className="section-price">
                PRICE
              </div>
              <div className="section-shares">
                SHARES
              </div>
              <div className="section-weight">
                WEIGHT
              </div>
              <div className="section-remove-btn">

              </div>
              <div className="clearfix" />
            </div>
            <div className="editor-body">
              {
                Object.keys(portfolioScripPrices).map((scripName) => {
                  return (
                    <div
                      className="scrip-line-item"
                      key={scripName}
                    >
                      <div className="section-stock">
                        {scripName}
                      </div>
                      <div className="section-price">
                        <span className="rupee-sign">₹</span>
                        {Math.round(this.props.portfolioScripPrices[scripName])}
                      </div>
                      <div className="section-shares">
                        <button
                          className="shares-decrement-btn"
                          disabled={
                            this.props.portfolioScripCounts[scripName] <= 1
                          }
                          onClick={() => { this.props.addPortfolioScripCount(scripName, -1); }}
                        >
                          <span className="btn-text">-</span>
                        </button>
                        <span className="shares-value">
                          {this.props.portfolioScripCounts[scripName]}
                        </span>
                        <button
                          className="shares-increment-btn"
                          onClick={() => { this.props.addPortfolioScripCount(scripName, +1); }}
                        >
                          <span className="btn-text">+</span>
                        </button>
                      </div>
                      <div className="section-weight">
                        {
                          Math.round(this.weightInPortfolio(scripName))
                        }
                        %
                      </div>
                      <div className="section-remove-btn">
                        <button onClick={() => { this.props.removeScripFromPortfolio(scripName); }}>
                          <span className="btn-text">-</span>
                        </button>
                      </div>
                      <div className="clearfix" />
                    </div>
                  );
                })
              }

            </div>
          </div>
          <div className="portfolio-overview">

          </div>
          <div className="clearfix"></div>
        </div>

      </div>
    );
  }
}

export { PortfolioManager };
