import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Session} from 'meteor/meteor';

import { Blocks } from '../../../api/blocks.js';

export default class RecordInput extends Component {
  handleBlur(event) {
    if(this.props.block[this.props.valueToEdit] != event.target.value) Meteor.call("blockUpdate", this.props.block._id, {[this.props.valueToEdit]: event.target.value});
    else this.props.parentNode.innerHTML = event.target.value;
    // if(this.props.parentNode) {
    //   this.props.parentNode.innerHTML = event.target.value;
    // }
  }

  componentDidMount() {
    var block = this.props.block;

    Mousetrap.bind('ctrl+right', function(e, combo) {
      e.stopImmediatePropagation();
      e.target.blur();
      Meteor.call('blockDepose', block._id, 1, function() {
        var updatedBlock = Blocks.findOne({_id: block._id});
        var parentNode = document.getElementById(updatedBlock.parentId).children[updatedBlock.index].children[0];
        ReactDOM.render(<RecordInput
          block={updatedBlock}
          parentNode={parentNode}
          valueToEdit={parentNode.className.split('-')[1]} />, parentNode);
      });
    });

    Mousetrap.bind('ctrl+left', function(e, combo) {
      e.stopImmediatePropagation();

      e.target.blur();
      Meteor.call('blockDepose', block._id, -1, function() {
        var updatedBlock = Blocks.findOne({_id: block._id});
        var parentNode = document.getElementById(updatedBlock.parentId).children[updatedBlock.index].children[0];
        ReactDOM.render(<RecordInput
          block={updatedBlock}
          parentNode={parentNode}
          valueToEdit={parentNode.className.split('-')[1]} />, parentNode);
      });
    });

    var input = document.getElementsByClassName("record-" + this.props.valueToEdit)[0];

    input.addEventListener('blur', this.handleBlur.bind(this));
    input.addEventListener('keypress', this.renderNext.bind(this));
    input.focus();
  }

  renderNext(event) {
    if(event.keyCode != 13) return;
    var parentNode;
    var block = this.props.block;

    if(this.props.block.isParent || this.props.valueToEdit == "rate") {
      let newIndex = this.props.block.isParent ? 0 : this.props.block.index + 1;
      let newParent = this.props.block.isParent ? this.props.block._id : this.props.block.parentId;
      Meteor.call("blockInsert", this.props.block.estimationId, newParent, newIndex, function() {
        parentNode = block.isParent ? event.target.parentNode.parentNode.children[5].children[0].children[0] : event.target.parentNode.parentNode.nextSibling.children[0];
        event.target.blur();
        let newBlock = Blocks.findOne({parentId: newParent, index: newIndex});
        ReactDOM.render(<RecordInput
          block={newBlock}
          parentNode={parentNode}
          valueToEdit={parentNode.className.split('-')[1]} />, parentNode);
      });
    }
    else {
      parentNode = this.props.parentNode.nextSibling;

      ReactDOM.render(<RecordInput
        block={block}
        parentNode={parentNode}
        valueToEdit={parentNode.className.split('-')[1]} />, parentNode);
    }
  }

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
}
