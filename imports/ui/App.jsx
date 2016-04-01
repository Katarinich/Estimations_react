import React, { Component } from 'react';

import Estimation from './Estimation.jsx';

export default class App extends Component {
  getEstimations() {
    return [
      { _id: 1, name: 'This is estimation 1' },
      { _id: 2, name: 'This is estimation 2' },
      { _id: 3, name: 'This is estimation 3' },
    ];
  }

  renderEstimations() {
    return this.getEstimations().map((estimation) => (
      <Estimation key={estimation._id} estimation={estimation} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Estimation</h1>
        </header>

        <ul>
          {this.renderEstimations()}
        </ul>
      </div>
    );
  }
}
