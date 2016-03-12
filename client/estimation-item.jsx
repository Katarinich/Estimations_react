Block = React.createClass({
  propTypes: {
    block: React.PropTypes.object.isRequired
  },
  sum() {
    return this.props.block.hours * this.props.block.rate;
  },
  render() {
    return (
      <li className="record-line">
        <div className="record-value-div">{this.props.block.value}</div>
        <div className="record-hours-div">{this.props.block.hours}</div>
        <div className="record-rate-div">{this.props.block.rate}</div>
	      <div className="record-sum-div">{this.sum()}</div>
    </li>
    );
  }
});
