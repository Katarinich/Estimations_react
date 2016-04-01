import React, { Component, PropTypes } from 'react';

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
