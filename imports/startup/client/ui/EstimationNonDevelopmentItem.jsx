import React, { Component, PropTypes } from 'react';

import { Estimations } from '../../../api/estimations.js';

export default class EstimationNonDevelopmentItem extends Component {

  handleChange (event) {
    var valueToEdit = event.target.className.split(' ')[0].split('-')[1];
    var value;
    valueToEdit == 'checked' ? value = !this.props.block.checked : value = event.target.value;
    Meteor.call('blockUpdate', this.props.block._id, {[valueToEdit]: value});
  }

  render () {
    var currentEstimation = Estimations.findOne({_id: this.props.block.estimationId});
    var sum = Math.round(currentEstimation.developmentTotalHours * (parseInt(this.props.block.percent) / 100)) * this.props.block.rate;
    var hours = Math.round(currentEstimation.developmentTotalHours * (parseInt(this.props.block.percent) / 100));
    return (
      <div className="record-line">
  	    <div className="record-value-div nt-lvl-0-2">{this.props.block.text}</div>
  	    <div className="non-development-input-div">
          {this.props.block.userId == Meteor.userId() ? <input className="record-percent form-control" type="text" defaultValue={this.props.block.percent} onChange={this.handleChange.bind(this)}/> : ""}
  	    </div>
  	    <div className="record-hours-div">{hours}h</div>
  	    <div className="record-rate-div">
          {this.props.block.userId == Meteor.userId() ? <input className="record-rate form-control" type="text" defaultValue={this.props.block.rate} onChange={this.handleChange.bind(this)}/> : this.props.block.rate}
  	    </div>
  	    <div className="record-sum-div">{sum}</div>
  	    <input className="record-checked" type="checkbox" defaultChecked={this.props.block.checked} onChange={this.handleChange.bind(this)}/>
      </div>
    );
  }
}
