EstimationNonDevelopmentItem = React.createClass({
  render() {
    var currentEstimation = Estimations.findOne({_id: this.props.block.estimationId});
    var sum = Math.round(currentEstimation.developmentTotalHours * (parseInt(this.props.block.percent) / 100)) * this.props.block.rate;
    var hours = Math.round(currentEstimation.developmentTotalHours * (parseInt(this.props.block.percent) / 100));
    return (
      <div className="record-line">
  	    <div className="record-value-div nt-lvl-0-2">{this.props.block.text}</div>
  	    <div className="non-development-input-div">
          <input className="non-development-input form-control" type="text" defaultValue={this.props.block.percent} />
  	    </div>
  	    <div className="record-hours-div">{hours}h</div>
  	    <div className="record-rate-div">
          <input className="record-rate form-control" type="text" defaultValue={this.props.block.rate} />
  	    </div>
  	    <div className="record-sum-div">{sum}</div>
  	    <input className="non-development-checked" type="checkbox" defaultChecked={this.props.block.checked} />
      </div>
    );
  }
});
