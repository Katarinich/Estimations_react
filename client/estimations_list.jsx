EstimationList = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      estimations: Estimations.find({}).fetch()
    }
  },

  renderEstimations() {
    return this.data.estimations.map((estimation) => {
      return <Estimation key={estimation._id} estimation={estimation} />;
    });
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
        <div className="create-new-list-div"><button className="btn btn-default create-new-list" onClick={this.createNewList}>Create new list</button></div>
        <ul>
          {this.renderEstimations()}
        </ul>
    </div>
    );
  }
});
