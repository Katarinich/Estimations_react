EstimationItem = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      children: Blocks.find({parentId: this.props.block._id}, {sort: {index: 1}}).fetch()
    }
  },

  propTypes: {
    block: React.PropTypes.object.isRequired
  },

  renderInput(event) {
    if(document.getElementsByClassName("record-" + event.target.className.split('-')[1]).length != 0) return;

    ReactDOM.render(<RecordInput
      block={this.props.block}
      parentNode={event.target}
      valueToEdit={event.target.className.split('-')[1]}
      callback={this.renderChilds} />, event.target);
  },

  deleteBlock() {
    Meteor.call('blockRemove', this.props.block._id);
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
        <div className={depth} onClick={this.renderInput}>{this.props.block.hours}</div>
        <div className="record-rate-div" onClick={this.renderInput}>{this.props.block.rate}</div>
	      <div className="record-sum-div">{sum}</div>
        <div className="record-delete-div"><button className="delete" onClick={this.deleteBlock}>&times;</button></div>

        <ul className="child-records" id={this.props.block._id}>
          {this.renderChilds()}
        </ul>
      </li>
    );
  }
});
