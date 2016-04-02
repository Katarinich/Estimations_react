import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Estimations } from '../../../api/estimations.js';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

class EstimationsList extends Component {
  componentDidUpdate() {
    var deleteButtons = document.getElementsByClassName('delete');
    for(let i = 0; i < deleteButtons.length; i++)
      deleteButtons[i].addEventListener('click', this.deleteEstimation);
  }

  deleteEstimation(e) {
    Meteor.call('estimationRemove', e.target.id);
  }

  handleCreateNew(event) {
    Meteor.call('estimationInsert', function(error) {
      if (error){
        throwError(error.reason);
      }
    });
  }

  clearFilter(event, template) {
    this.filter.set("");
    document.getElementById("client-filter").value = "";
  }

  renderTable() {
    const ReactiveTableTemplate = BlazeToReact('reactiveTable');
    this.filter = new ReactiveTable.Filter('client-filter', ['clientName', 'name']);
    var settings = {
      filters: ['client-filter'],
      collection: this.props.estimations,
      fields: [
          { key: 'name', label: 'Title', fn: function (value, object) {
              return new Spacebars.SafeString("<a href='/estimations/" + object._id + "'>" + value + "</a>");
          }},
          { key: 'clientName', label: 'Client' },
          { key: '', label: 'Hours', fn: function(value, object) {
              return object.developmentTotalHours + object.nonDevelopmentTotalHours;
          } },
          { key: '', label: 'Sum', fn: function(value, object) {
              return object.developmentTotalSum + object.nonDevelopmentTotalSum;
          }},
          { key: 'dateCreated', label: 'Date Created', fn: function(value, object) {
              var dateCreated = moment(object.dateCreated);
              return dateCreated.format("DD.MM.YYYY hh:mm:ss");
          }
          },
          { key: 'dateUpdated', label: 'Date Updated', fn: function(value, object) {
              var dateUpdated = moment(object.dateUpdated);
              return dateUpdated.format("DD.MM.YYYY hh:mm:ss");}
          },
          { key: '', label: '', fn: function (value, object) {
              return new Spacebars.SafeString("<button class='delete' id='" + object._id + "'>&times;</button>");
          }}
      ],
      filterOperator: '$or'
    };
    return <ReactiveTableTemplate settings={settings} showNavigation='never' />
  }

  render() {
    return (
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

        <div className="search-label"><b>Search:</b> </div>
          <input className="client-filter-input form-control" id="client-filter" type="text"/>
          <button className='clear-filter'>&times;</button>
        <div className="create-new-list-div"><button className="btn btn-default create-new-list" onClick={this.handleCreateNew.bind(this)}>Create new list</button></div>

        <div className="estimations">
          {this.renderTable()}
        </div>
      </div>
    );
  }
}

EstimationsList.propTypes = {
  estimations: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('estimations');

  return {
    estimations: Estimations.find({}).fetch(),
  };
}, EstimationsList);
