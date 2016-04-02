import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';

import { Blocks } from '../../../api/blocks.js';
import { Estimations } from '../../../api/estimations.js';

import EstimationItem from './EstimationItem.jsx';
import EstimationNonDevelopmentItem from './EstimationNonDevelopmentItem.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

export default class EstimationsPage extends Component {

  handleBlur(event) {
    //if(Meteor.userId() != this.props.estimation.userId) return;
    if(event.target.value == this.props.estimation.name) event.target.parentNode.innerHTML = event.target.value;
    Meteor.call("estimationUpdate", this.props._id, {name: event.target.value});
  }

  renderInput(event) {
    //if(Meteor.userId() != this.props.estimation.userId || document.getElementsByClassName("list-name-input").length != 0) return;

    ReactDOM.render(<input type='text' className='list-name-input form-control' defaultValue={this.props.estimation.name} />, event.target);
    document.getElementsByClassName("list-name-input")[0].addEventListener('blur', this.handleBlur.bind(this));
    document.getElementsByClassName("list-name-input")[0].focus();
  }

  renderBlocks() {
    return this.props.blocks.map((block) => {
      return <EstimationItem key={block._id} block={block} />;
    });
  }

  renderNonDevelopment(){
    return this.props.nonDepelopmentBlocks.map((block) => {
      return <EstimationNonDevelopmentItem key={block._id} block={block}/>;
    });
  }

  render() {
    var projectTotalSum = this.props.estimation.nonDevelopmentTotalSum + this.props.estimation.developmentTotalSum;
    var projectTotalHours = this.props.estimation.nonDevelopmentTotalHours + this.props.estimation.developmentTotalHours;

    return (
      <div className="container">
        <ol className="breadcrumb">
          <li><AccountsUIWrapper /></li>
          <li><a href="/estimations/">Estimations</a></li>
          <li className="active">{this.props.estimation.name}</li>
        </ol>

        <div className="names">
            <div className="list-name-div">
                <div className="list-name-label"><b>Project name: </b> </div>
                <div className="list-name" onClick={this.renderInput.bind(this)}>{this.props.estimation.name}</div>
            </div>

            <div className="client-name-div">
                <div className="client-name-label"><b>Client: </b> </div>
                <div className="client-name">{this.props.estimation.clientName}</div>
            </div>
        </div>

        <div className="columnsNames">
            <div className="column-name efforts">Efforts</div>
            <div className="column-name">Hourly Rate</div>
            <div className="column-name">Cost</div>
        </div>

        <ul id="records">
          {this.renderBlocks()}
        </ul>

        <div className="non-development-label nt-lvl-0-1"><b>Non-development Activities</b></div>
        {this.renderNonDevelopment()}

         <div className="record-line">
            <div className="total-text-div"><b>Non-development Activities Total</b></div>
            <div className="total-hours-div nt-lvl-0"><b>{this.props.estimation.nonDevelopmentTotalHours}h</b></div>
            <div className="total-rate-div"></div>
            <div className="total-sum-div"><b>{this.props.estimation.nonDevelopmentTotalSum}</b></div>
        </div>
        <div className="record-line">
            <div className="total-text-div"><b>Project Total</b></div>
            <div className="total-hours-div nt-lvl-0"><b>{projectTotalHours}h</b></div>
            <div className="total-rate-div"></div>
            <div className="total-sum-div"><b>{projectTotalSum}</b></div>
        </div>

      </div>
    );
  }
}
