EstimationItem = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      childrenBlocks: Blocks.find({parentId: this.props.block._id}, {sort: {index: 1}}).fetch(),
      currentUserId: Meteor.userId()
    }
  },

  propTypes: {
    block: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    if(Session.get("newBlock") == this.props.block._id && this.props.block._id) return {isInput: true};
    return {isInput: false};
  },

  renderInput(event) {
    if(Meteor.userId() != this.props.block.userId || document.getElementsByClassName("record-" + event.target.className.split('-')[1]).length != 0) return;

    ReactDOM.render(<RecordInput
      block={this.props.block}
      parentNode={event.target}
      valueToEdit={event.target.className.split('-')[1]} />, event.target);
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

    return(
      <ul className="child-records" id={this.props.block._id}>
        {this.data.childrenBlocks.map((block) => {
          return <EstimationItem key={block._id} block={block} />;
        })}
      </ul>
    );
  },

  renderTotal() {
    if(!this.props.block.isParent) return;
    var depth = "total-hours-div nt-lvl-" + this.depth();

    return(
      <div className="record-line">
        <div className="total-text-div"><b>{this.props.block.value} Total</b></div>
		    <div className={depth}><b>{this.totalHours()}</b></div>
		    <div className="total-rate-div"></div>
		    <div className="total-sum-div"><b>{this.totalSum()}</b></div>
		  </div>
    );
  },

  totalHours() {
    var result = 0;

    function sumOfBlock(blockId) {
      Blocks.find({
        parentId: blockId
      }).forEach(function(element) {
        if (element.isParent == false || element.isParent == undefined) {
          result = result + parseInt(element.hours);
        } else {
          sumOfBlock(element._id);
        }
      });
    }

    sumOfBlock(this.props.block._id)
    return result + "h";
  },

  totalSum() {
    var result = 0;

    function sumOfBlock(blockId) {
      Blocks.find({
        parentId: blockId
      }).forEach(function(element) {
        if (element.isParent == false || element.isParent == undefined) {
          result = result + (Number(element.rate) * parseInt(element.hours));
        } else {
          sumOfBlock(element._id);
        }
      });
    }

    sumOfBlock(this.props.block._id);
    return result;
  },

  render() {
    var sum = this.props.block.isParent ? "" : parseInt(this.props.block.hours) * this.props.block.rate;
    var depth = "record-hours-div nt-lvl-" + this.depth();
    var valueClass = "record-value-div";
    if(this.props.block.isParent) valueClass += " parent-text";
    if(this.props.block.value == "") valueClass += " empty";

    var innerValue;
    if (this.state.isInput) innerValue = <RecordInput block={this.props.block} valueToEdit="value"/>;
    else innerValue = this.props.block.value;

    return (
      <li className="record-line">
        <div className={valueClass} onClick={this.renderInput}>{innerValue}</div>
        <div className={depth} onClick={this.renderInput}>{this.props.block.hours}</div>
        <div className="record-rate-div" onClick={this.renderInput}>{this.props.block.isParent ? "" : this.props.block.rate}</div>
	      <div className="record-sum-div">{sum}</div>
        {this.props.block.userId == Meteor.userId() ? <div className="record-delete-div"><button className="delete" onClick={this.deleteBlock}>&times;</button></div> : ""}

        {this.renderChilds()}

        {this.renderTotal()}
      </li>
    );
  }
});
