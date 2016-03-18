RecordInput = React.createClass({
  handleBlur: function(event) {
    Meteor.call("blockUpdate", this.props.block._id, {[this.props.valueToEdit]: event.target.value});
    if(this.props.parentNode) this.props.parentNode.innerHTML = event.target.value;
    else {
      Session.set("newBlock", null);
      document.getElementById(this.props.block.parentId).children[this.props.block.index].children[0].innerHTML = event.target.value;
    }
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

    if(this.props.block.isParent || this.props.valueToEdit == "rate") {
      let newIndex = this.props.block.isParent ? 0 : this.props.block.index + 1;
      let newParent = this.props.block.isParent ? this.props.block._id : this.props.block.parentId;
      Meteor.call("blockInsert", this.props.block.estimationId, newParent, newIndex);
      let newBlock = Blocks.findOne({parentId: newParent, index: newIndex});
      Session.set("newBlock", newBlock._id);
    }
    else {
      let block = this.props.block;
      let parentNode;
      if(this.props.parentNode) parentNode = this.props.parentNode.nextSibling;
      else parentNode = document.getElementById(this.props.block.parentId).children[this.props.block.index].children[0].nextSibling;

      ReactDOM.render(<RecordInput
        block={block}
        parentNode={parentNode}
        valueToEdit={parentNode.className.split('-')[1]} />, parentNode);
    }
  },

  render() {
    var classType = "record-" + this.props.valueToEdit + " form-control" ;
    if(this.props.valueToEdit == "value") classType += " typeahead mousetrap";

    return(
      <input className={classType}
        type="text"
        data-source="blocks"
        defaultValue={this.props.block[this.props.valueToEdit]} />
   );
  }
});
