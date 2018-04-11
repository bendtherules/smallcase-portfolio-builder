import React, { Component } from 'react';
import './SectionTitle.css';

function SectionTitle(props) {
  return (
    <div className="section-title">
      <div className="title-box">
        {props.titleText.toUpperCase()}
      </div>
      <div className="title-tail" />
    </div>
  );
}

export { SectionTitle };