import React, { Component, PropTypes } from 'react';

// Task component - represents a single todo item
export default class Estimation extends Component {
  render() {
    return (
      <li>{this.props.estimation.name}</li>
    );
  }
}

Estimation.propTypes = {
  estimation: PropTypes.object.isRequired,
};
