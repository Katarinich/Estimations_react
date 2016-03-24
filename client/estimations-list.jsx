EstimationList = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      estimations: Estimations.find({}).fetch()
    }
  },

  componentDidUpdate() {
    var deleteButtons = document.getElementsByClassName('delete');
    for(let i = 0; i < deleteButtons.length; i++)
      deleteButtons[i].addEventListener('click', this.deleteEstimation);
  },

  handleSignOut() {
    Meteor.logout(function(){
      FlowRouter.go('/');
    });
  },

  deleteEstimation(e) {
    Meteor.call('estimationRemove', e.target.id);
  },

  clearFilter(event, template) {
    this.filter.set("");
    document.getElementById("client-filter").value = "";
  },

  renderEstimations() {
    return this.data.estimations.map((estimation) => {
      return <Estimation key={estimation._id} estimation={estimation} />;
    });
  },

  renderFilter() {
    const ReactiveTableFilter = BlazeToReact('reactiveTableFilter');
    return <ReactiveTableFilter id="client-filter" fields={['clientName', 'name']} label="Search:"/>
    document.getElementsByClassName("reactive-table-input")[0].addEventListener("input", this.handleFilterInput);
  },

  handleFilterInput(event) {
    var input = event.target.value;
    if (!_.isNaN(input)) {
        this.filter.set(input);
    } else {
        this.filter.set("");
    }
  },

  renderLoginButtons() {
    if(Meteor.user()) {
      let userEmail = Meteor.user().emails[0].address;
      return(
        <ul className="nav navbar-nav navbar-right">
          <li>
            <a
              href="#"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={this.handleSignOut}> {userEmail} | Log Out </a>
          </li>
        </ul>
      );
    }
    return(
      <ul className="nav navbar-nav navbar-right">
        <li id="fat-menu" className="dropdown">
          <a id="drop3" href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
            Sign Up / Sign In
            <span className="caret"></span>
          </a>
          <ul className="dropdown-menu" aria-labelledby="drop3">
            <li><LoginButtons/></li>
          </ul>
        </li>
      </ul>
    );
  },

  renderTable() {
    const ReactiveTableTemplate = BlazeToReact('reactiveTable');
    this.filter = new ReactiveTable.Filter('client-filter', ['clientName', 'name']);
    var settings = {
      filters: ['client-filter'],
      collection: this.data.estimations,
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
  },

  createNewList() {
    Meteor.call('estimationInsert', function(error) {
      if (error){
        throwError(error.reason);
      }
    });
  },

  render() {
    return (
      <div className="container">
        <div className="navbar navbar-default" role="navigation">
            <div className="navbar-header">
                <a className="navbar-brand">Estimations</a>
            </div>
            {this.renderLoginButtons()}
        </div>

        <div className="search-label"><b>Search:</b> </div>
        <input className="client-filter-input form-control" id="client-filter" type="text" onInput={this.handleFilterInput}/>
        <button className='clear-filter' onClick={this.clearFilter}>&times;</button>
        <div className="create-new-list-div"><button className="btn btn-default create-new-list" onClick={this.createNewList}>Create new list</button></div>
        <div className="estimations">
          {this.renderTable()}
        </div>
    </div>
    );
  }
});
