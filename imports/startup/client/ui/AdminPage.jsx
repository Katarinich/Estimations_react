import React, { Component, PropTypes } from 'react';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

export default class AdminPage extends Component {
  render() {
    return(
      <div className="container">
        <div className="navbar navbar-default" role="navigation">
            <div className="navbar-header">
                <span className="navbar-brand">Estimations</span>
            </div>
            <div className="navbar-collapse collapse">
                <ul className="nav navbar-nav navbar-right">
                    <AccountsUIWrapper />
                </ul>
            </div>
        </div>

        {this.props.users.map((user) => {
          return <span>{user.username}</span>;
        })}
      </div>
    );
  }
}
