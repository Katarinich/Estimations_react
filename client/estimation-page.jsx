EstimationPage = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      blocks: Blocks.find({parentId: this.props.id}).fetch(),
      estimation: Estimations.findOne({_id: this.props.id})
    }
  },

  handleBlur(event) {
    Meteor.call("estimationUpdate", this.props.id, {name: event.target.value});
    event.target.parentNode.innerHTML = event.target.value;
  },

  renderInput(event) {
    if(document.getElementsByClassName("list-name-input").length != 0) return;

    ReactDOM.render(<input type='text' className='list-name-input form-control' defaultValue={this.data.estimation.name} />, event.target);
    document.getElementsByClassName("list-name-input")[0].addEventListener('blur', this.handleBlur);
    document.getElementsByClassName("list-name-input")[0].focus();
  },

  renderBlocks() {
    return this.data.blocks.map((block) => {
      return <EstimationItem key={block._id} block={block} />;
    });
  },

  render() {
    return (
      <div className="container">

        <ol className="breadcrumb">
            <li><a href="/estimations/">Estimations</a></li>
            <li className="active">{this.data.estimation.name}</li>
        </ol>

        <div className="names">
            <div className="list-name-div">
                <div className="list-name-label"><b>Project name: </b> </div>
                <div className="list-name" onClick={this.renderInput}>{this.data.estimation.name}</div>
            </div>

            <div className="client-name-div">
                <div className="client-name-label"><b>Client: </b> </div>
                <div className="client-name">{this.data.estimation.clientName}</div>
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
      </div>
    );
  }
});
