RecordInput = React.createClass({
  handleBlur: function(event) {
    if(this.props.block[this.props.valueToEdit] != event.target.value) Meteor.call("blockUpdate", this.props.block._id, {[this.props.valueToEdit]: event.target.value});
    if(this.props.parentNode) {
      this.props.parentNode.innerHTML = event.target.value;
    }
    else {
      Session.set("newBlock", null);
      let parentNode = document.getElementById(this.props.block.parentId).children[this.props.block.index].children[0];
      parentNode.innerHTML = event.target.value;
    }
  },

  componentDidMount: function() {
    var block = this.props.block;

    Mousetrap.bind('ctrl+right', function(e, combo) {
      e.stopImmediatePropagation();

      e.target.blur();
      Meteor.call('blockDepose', block._id, 1);
      Session.set("newBlock", block._id);
    });

    Mousetrap.bind('ctrl+left', function(e, combo) {
      e.stopImmediatePropagation();

      e.target.blur();
      Meteor.call('blockDepose', block._id, -1);
      Session.set("newBlock", block._id);
    });

    var input = document.getElementsByClassName("record-" + this.props.valueToEdit)[0];

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
      else parentNode = event.target.parentNode.nextSibling;

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
