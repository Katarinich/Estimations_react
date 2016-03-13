Block = React.createClass({
  propTypes: {
    block: React.PropTypes.object.isRequired
  },

  renderInput(event) {
    if(document.getElementsByClassName("record-value").length != 0) return;

    React.render(<TypeaheadInput value={event.target.innerHTML} id={this.props.block._id} />, event.target);
  },

  render() {
    var sum = this.props.block.hours * this.props.block.rate;
    return (
      <li className="record-line">
        <div className="record-value-div" onClick={this.renderInput}>{this.props.block.value}</div>
        <div className="record-hours-div">{this.props.block.hours}</div>
        <div className="record-rate-div">{this.props.block.rate}</div>
	      <div className="record-sum-div">{sum}</div>
    </li>
    );
  }
});
