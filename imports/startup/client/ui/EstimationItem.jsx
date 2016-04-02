import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';

import { Blocks } from '../../../api/blocks.js';

import RecordInput from './RecordInput.jsx';

class EstimationItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isInput: false,
    };
  }

  componentDidMount() {
    sortableOptions = {
      group: "child-records",
      handle: '.glyphicon-move',
      animation: 150,
      onStart(evt) {
        // Session.set("sortableChosen", Array.prototype.indexOf.call(this.el.children,
        //   document.getElementsByClassName("sortable-chosen")[0]));
      },
      onAdd(evt) {
        Session.set("onAddTrue", true);
        console.log("onAdd");
        var currentBlock = Session.get("draggedBlock");

        //индексы
        Blocks.find({
          parentId: evt.from.id
        }).forEach(function(element) {
          if (element.index > currentBlock.index) {
            var newIndex = element.index - 1;
            Meteor.call('blockUpdate', element._id, {
              index: newIndex
            });
          }
        });

        Blocks.find({
          parentId: evt.to.id
        }).forEach(function(element) {
          if (element.index >= evt.newIndex) {
            Meteor.call('blockUpdate', element._id, {
              index: element.index + 1
            });
          }
        });

        Meteor.call('blockUpdate', currentBlock._id, {
          parentId: evt.to.id,
          index: evt.newIndex
        });
      },
      onEnd(evt) {
        // if(Session.get("onAddTrue")) {
        //   Session.set("onAddTrue", false);
        //   return;
        // }

        console.log("onEnd");
        //evt.oldIndex = Session.get("sortableChosen");
        Blocks.find({
          parentId: this.el.id
        }).forEach(function(element) {
          if (evt.oldIndex < evt.newIndex) {
            if (element.index >= evt.oldIndex && element.index <= evt.newIndex) {
              if (element.index == evt.oldIndex) Meteor.call('blockUpdate', element._id, {
                index: evt.newIndex
              });
              else Meteor.call('blockUpdate', element._id, {
                index: element.index - 1
              });
            }
          } else {
            if (element.index >= evt.newIndex && element.index <= evt.oldIndex) {
              var newIndex = element.index + 1;
              if (element.index == evt.oldIndex) newIndex = evt.newIndex;
              Meteor.call('blockUpdate', element._id, {
                index: newIndex
              });
            }
          }
        });

      }
    }

    if (this.props.block.isParent) {
      Sortable.create(document.getElementById(this.props.block._id), sortableOptions);
    }
  }

  deleteBlock() {
    Meteor.call('blockRemove', this.props.block._id);
  }

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
  }

  renderInput(event) {
    //if(Meteor.userId() != this.props.block.userId || document.getElementsByClassName("record-" + event.target.className.split('-')[1]).length != 0) return;

    ReactDOM.render(<RecordInput
      block={this.props.block}
      parentNode={event.target}
      valueToEdit={event.target.className.split('-')[1]} />, event.target);
  }


  renderChilds(){
    if(!this.props.block.isParent || !this.props.childrenBlocks) return;

    return(
      <ul className="child-records" id={this.props.block._id}>
        {this.props.childrenBlocks.map((block) => {
          return <EstimationItem key={block._id} block={block} childrenBlocks={Blocks.find({parentId: block._id}, {sort: {index: 1}}).fetch()}/>;
        })}
      </ul>
    );
  }

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
  }

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
  }

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
  }

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
        <div className={valueClass} onClick={this.renderInput.bind(this)}>{innerValue}</div>
        <div className={depth} onClick={this.renderInput.bind(this)}>{this.props.block.isParent ? "" : this.props.block.hours}</div>
        <div className="record-rate-div" onClick={this.renderInput.bind(this)}>{this.props.block.isParent ? "" : this.props.block.rate}</div>
	      <div className="record-sum-div">{sum}</div>
          <div className="user-controls">
            <span className="glyphicon glyphicon-move" aria-hidden="true"></span>
            <div className="record-delete-div"><button className="delete" onClick={this.deleteBlock.bind(this)}>&times;</button></div>
          </div>

        {this.renderChilds()}

        {this.renderTotal()}
      </li>
    );
  }
}

EstimationItem.propTypes = {
  block: PropTypes.object.isRequired,
};

export default createContainer((params) => {
  return {
    childrenBlocks: Blocks.find({parentId: params.block._id}, {sort: {index: 1}}).fetch(),
  };
}, EstimationItem);
