/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import './StockPicker.css';

class StockPicker extends Component {
  constructor() {
    super();

    // TODO: Make this class variable
    this.pageSize = 8;
    this.state = {
      pageNumber: 1,
    };
  }

  componentDidUpdate() {
    this.normalizePageNumber();
  }

  getAllowedMinMaxPageNumber() {
    const minPageNumber = 1;
    const maxPageNumber = Math.ceil(this.getRemainingScripCount() / this.pageSize);
    return [minPageNumber, maxPageNumber];
  }

  normalizePageNumber() {
    const [minPageNumber, maxPageNumber] = this.getAllowedMinMaxPageNumber();

    if (this.state.pageNumber < minPageNumber) {
      this.setState({
        pageNumber: minPageNumber,
      });
    } else if (this.state.pageNumber > maxPageNumber) {
      this.setState({
        pageNumber: maxPageNumber,
      });
    }
  }

  gotoNextPage() {
    this.setState((oldState) => {
      return {
        pageNumber: oldState.pageNumber + 1,
      };
    });
  }

  gotoPrevPage() {
    this.setState((oldState) => {
      return {
        pageNumber: oldState.pageNumber - 1,
      };
    });
  }

  getRemainingScripCount() {
    return Object.keys(this.props.remainingScripPrices).length;
  }

  getPageStartEndIndex() {
    return [((this.state.pageNumber - 1) * this.pageSize), (this.state.pageNumber * this.pageSize)];
  }

  getCurrentPageScripPrices() {
    const pageStartEnd = this.getPageStartEndIndex();
    const filteredScripNames = Object.keys(this.props.remainingScripPrices)
      .sort()
      .slice(...pageStartEnd);

    const currentPageScripPrices = {};
    filteredScripNames.forEach((scripName) => {
      currentPageScripPrices[scripName] = this.props.remainingScripPrices[scripName];
    });

    return currentPageScripPrices;
  }

  static renderTitle() {
    return (
      <div className="title">
        <div className="title-box">
          PICK STOCKS
        </div>
        <div className="title-tail" />
      </div>
    );
  }

  renderScripBoxes() {
    const currentPageScripPrices = this.getCurrentPageScripPrices();

    return (
      <React.Fragment>
        {
          Object.keys(currentPageScripPrices).map((scripName) => {
            return (
              <div
                className="scrip-box"
                key={scripName}
                draggable={true}
                onDragStart={(ev) => {
                  ev.dataTransfer.setData('text/plain', scripName);
                  // eslint-disable-next-line no-param-reassign
                  ev.dataTransfer.dropEffect = 'copy';
                }}
              >
                <div className="scrip-name">
                  {scripName}
                </div>
                <div className="scrip-details">
                  <div className="scrip-price">
                    <span className="rupee-sign">₹ </span>
                    {Math.round(currentPageScripPrices[scripName])}
                  </div>
                  <button
                    className="scrip-add"
                    onClick={() => { this.props.addScripToPortfolio(scripName); }}
                  >
                    <div className="scrip-add-text">+</div>
                  </button>
                </div>
                <div className="clearfix" />
              </div>
            );
          })
        }
        <div className="clearfix" />
      </React.Fragment>
    );
  }

  renderPageNav() {
    const [minPageNumber, maxPageNumber] = this.getAllowedMinMaxPageNumber();
    const isPrevEnabled = (this.state.pageNumber - 1) >= minPageNumber;
    const isNextEnabled = (this.state.pageNumber + 1) <= maxPageNumber;

    return (
      <div className="page-nav">
        <button
          className="nav-prev-page"
          disabled={!isPrevEnabled}
          onClick={() => { if (isPrevEnabled) { this.gotoPrevPage(); } }}
        >
          Prev
        </button>
        <button
          className="nav-next-page"
          disabled={!isNextEnabled}
          onClick={() => { if (isNextEnabled) { this.gotoNextPage(); } }}
        >
          Next
        </button>
        <div className="clearfix" />
      </div>
    );
  }

  render() {
    const countTotal = this.getRemainingScripCount();
    const startEnd = this.getPageStartEndIndex();

    return (
      <div className="stock-picker">
        {StockPicker.renderTitle()}
        <div className="body">
          <div className="page-description">
            {
              // eslint-disable-next-line max-len
            } Showing {startEnd[0]} - {Math.min(startEnd[1], countTotal)} of {countTotal} matching stocks
          </div>
          <div className="filter">
            APPLY FILTERS
          </div>
          <div className="clearfix" />
          <div className="page">
            <div className="page-content">
              {this.renderScripBoxes()}
            </div>
            {this.renderPageNav()}
          </div>
        </div>
      </div>
    );
  }
}

export { StockPicker };
