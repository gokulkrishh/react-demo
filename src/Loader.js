import React, { Component } from 'react';
import './App.css';

class Loader extends Component {
  render() {
    const {show} = this.props;  
    if (!show) return <div></div>
    return (
      <div className="spinner">Loading...</div>
    );
  }
}

export default Loader;
