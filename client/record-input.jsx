RecordInput = React.createClass({

  handleBlur: function(event) {
    Meteor.call("blockUpdate", this.props.block._id, {[this.props.valueToEdit]: event.target.value});
    this.props.parentNode.innerHTML = event.target.value;
  },

  componentDidMount: function() {
    var input = document.getElementsByClassName("record-" + this.props.valueToEdit)[0];
    if(this.props.valueToEdit == "value") {
      if(document.getElementsByClassName("record-value")[1] != undefined) document.getElementsByClassName("record-value")[1].blur();
      Meteor.typeahead.inject();
      input = document.getElementsByClassName("record-value")[1];
    }
    input.addEventListener('blur', this.handleBlur);
    input.addEventListener('keypress', this.renderNext);
    input.focus();
  },

  renderNext(event) {
    if(event.keyCode != 13) return;

    var block = this.props.block;
    var parentNode = this.props.parentNode.nextSibling;

    if(this.props.block.isParent || this.props.valueToEdit == "rate") {
      let newIndex = this.props.block.isParent ? 0 : this.props.block.index + 1;
      let newParent = this.props.block.isParent ? this.props.block._id : this.props.block.parentId;
      Meteor.call("blockInsert", this.props.block.estimationId, newParent, newIndex);
      var newBlock = Blocks.findOne({parentId: newParent, index: newIndex});
      block = newBlock;
      parentNode = document.getElementById(newParent).children[newIndex].children[0];
    }

    ReactDOM.render(<RecordInput
      block={block}
      parentNode={parentNode}
      valueToEdit={parentNode.className.split('-')[1]} />, parentNode);
  },

  render() {
    var classType = "record-" + this.props.valueToEdit + " form control" ;
    if(this.props.valueToEdit == "value") classType += " typeahead mousetrap";

    return(
      <input className={classType}
        type="text"
        data-source="blocks"
        defaultValue={this.props.block[this.props.valueToEdit]} />
   );
  }
});
