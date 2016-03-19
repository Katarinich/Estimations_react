EstimationPage = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      blocks: Blocks.find({parentId: this.props.id}).fetch(),
      nonDepelopmentBlocks: Blocks.find({nonDevelopment: true}).fetch(),
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

  renderNonDevelopment(){
    return this.data.nonDepelopmentBlocks.map((block) => {
      return <EstimationNonDevelopmentItem key={block._id} block={block}/>;
    });
  },

  render() {
    var projectTotalSum = this.data.estimation.nonDevelopmentTotalSum + this.data.estimation.developmentTotalSum;
    var projectTotalHours = this.data.estimation.nonDevelopmentTotalHours + this.data.estimation.developmentTotalHours;
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

        <div className="non-development-label nt-lvl-0-1"><b>Non-development Activities</b></div>
        {this.renderNonDevelopment()}

         <div className="record-line">
            <div className="total-text-div"><b>Non-development Activities Total</b></div>
            <div className="total-hours-div nt-lvl-0"><b>{this.data.estimation.nonDevelopmentTotalHours}h</b></div>
            <div className="total-rate-div"></div>
            <div className="total-sum-div"><b>{this.data.estimation.nonDevelopmentTotalSum}</b></div>
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
});
