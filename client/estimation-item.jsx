EstimationItem = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      children: Blocks.find({parentId: this.props.block._id}).fetch()
    }
  },

  propTypes: {
    block: React.PropTypes.object.isRequired
  },

  renderInput(event) {
    if(document.getElementsByClassName("record-value").length != 0) return;

    var currentValue = event.target.innerHTML;
    event.target.innerHTML = "";
    ReactDOM.render(<TypeaheadInput value={currentValue} id={this.props.block._id} parentNode={event.target}/>, event.target);
  },

  depth() {
    var depth = 0;
    var currentBlock = this.props.block;
    var parentBlock = Blocks.findOne({
      _id: this.props.block.parentId
    });
    while (parentBlock) {
      depth++;
      currentBlock = parentBlock;
      parentBlock = Blocks.findOne({
        _id: currentBlock.parentId
      });
    }
    return depth;
  },

  renderChilds(){
    if(!this.props.block.isParent) return;

    return this.data.children.map((block) => {
      return <EstimationItem key={block._id} block={block} />;
    });
  },

  render() {
    var sum = this.props.block.isParent ? "" : this.props.block.hours * this.props.block.rate;
    var depth = "record-hours-div nt-lvl-" + this.depth();
    var valueClass = "record-value-div";
    if(this.props.block.isParent) valueClass += " parent-text";
    if(this.props.block.value == "") valueClass += " empty"

    return (
      <li className="record-line">
        <div className={valueClass} onClick={this.renderInput}>{this.props.block.value}</div>
        <div className={depth}>{this.props.block.hours}</div>
        <div className="record-rate-div">{this.props.block.rate}</div>
	      <div className="record-sum-div">{sum}</div>
        <div className="record-delete-div"><button className="delete">&times;</button></div>

        <ul className="child-records" id={this.props.block._id}>
          {this.renderChilds()}
        </ul>
      </li>
    );
  }
});
