/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import Ocean from 'fusioncharts/themes/fusioncharts.theme.ocean';
import './PortfolioManager.css';
import { SectionTitle } from '../SectionTitle';

// Pass fusioncharts as a dependency of charts
Charts(FusionCharts);
Ocean(FusionCharts);

class PortfolioManager extends Component {

  calcNetWorth() {
    let netWorth = 0;

    Object.keys(this.props.portfolioScripCounts).forEach((scripName) => {
      const count = this.props.portfolioScripCounts[scripName];
      const price = this.props.portfolioScripPrices[scripName];
      netWorth += (price * count);
    });

    return netWorth;
  }

  calcTotalEarnings() {
    let totalEarnings = 0;
    Object.keys(this.props.portfolioScripCounts).forEach((scripName) => {
      const count = this.props.portfolioScripCounts[scripName];
      const eps = this.props.allScripEPS[scripName];
      totalEarnings += (eps * count);
    });

    return totalEarnings;
  }

  calcPortfolioPE() {
    const portfolioPE = (this.calcNetWorth() / this.calcTotalEarnings());

    if (Number.isNaN(portfolioPE)) {
      return 0;
    }

    return portfolioPE;
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

  calcPriceChartData() {
    const portfolioScripCounts = this.props.portfolioScripCounts;
    const allScripHistorical = this.props.allScripHistorical;

    const portfolioScripNames = Object.keys(portfolioScripCounts);

    const chartData = [];

    if (portfolioScripNames.length > 0) {
      const dateCount = allScripHistorical[portfolioScripNames[0]].point.length;


      for (let dateIndex = 0; dateIndex < dateCount; dateIndex++) {
        let datePriceSum = 0;

        portfolioScripNames.forEach((scripName) => {
          const tmpPrice = allScripHistorical[scripName].point[dateIndex].price;
          const count = portfolioScripCounts[scripName];
          datePriceSum += (tmpPrice * count);
        });

        chartData.push({
          label: dateIndex.toString(),
          value: datePriceSum,
        });
      }
    }

    return chartData;
  }

  calcHistoricalChartConfig() {
    const tmpDataSource = {
      chart: {
        numberPrefix: '₹',
        chartLeftMargin: 0,
        chartRightMargin: 0,
        showValues: 0,
        setAdaptiveYMin: 1,
        theme: 'ocean',
      },
      data: this.calcPriceChartData(),
    };

    const chartConfigs = {
      type: 'area2d',
      width: '100%',
      height: 300,
      dataFormat: 'json',
      dataSource: tmpDataSource,
    };

    return chartConfigs;
  }

  renderPortfolioEditor() {
    const portfolioScripPrices = this.props.portfolioScripPrices;
    const portfolioScripCounts = this.props.portfolioScripCounts;

    return (
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
          <div className="section-remove-btn" />
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
                    {Math.round(portfolioScripPrices[scripName])}
                  </div>
                  <div className="section-shares">
                    <button
                      className="shares-decrement-btn"
                      disabled={
                        portfolioScripCounts[scripName] <= 1
                      }
                      onClick={() => { this.props.addPortfolioScripCount(scripName, -1); }}
                    >
                      <span className="btn-text">-</span>
                    </button>
                    <span className="shares-value">
                      {portfolioScripCounts[scripName]}
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
    );
  }

  renderPortfolioOverview() {
    const portfolioScripPrices = this.props.portfolioScripPrices;

    return (
      <div className="portfolio-overview">
        <div className="overview-header">
          Portfolio Overview
        </div>
        <div className="overview-body">
          <div className="overview-chart">
            <ReactFC {...this.calcHistoricalChartConfig()} />
          </div>
          <div className="overview-details">
            <div className="overview-card card-stocks">
              <div className="card-title">Stocks</div>
              <div className="card-details">
                {Object.keys(portfolioScripPrices).length}
              </div>
            </div>
            <div className="overview-card card-net-worth">
              <div className="card-title">Net Worth</div>
              <div className="card-details">
                <span className="rupee-sign">₹</span>
                {
                  Math.round(this.calcNetWorth())
                }
              </div>
            </div>
            <div className="overview-card card-pe-ratio">
              <div className="card-title">P/E Ratio</div>
              <div className="card-details">
                {
                  Math.round(this.calcPortfolioPE())
                }
              </div>
            </div>
            <div className="clearfix" />
            <button className="build-portfolio">
              BUILD PORTFOLIO
            </button>
          </div>
          <div className="clearfix" />
        </div>

      </div>
    );
  }

  render() {
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
          {this.renderPortfolioEditor()}
          {this.renderPortfolioOverview()}
          <div className="clearfix" />
        </div>

      </div>
    );
  }
}

export { PortfolioManager };
